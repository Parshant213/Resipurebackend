import { ObjectId } from 'mongodb';
import { energyMeter, IndoorRawData, deviceType, IaqRawData, ThermopileDevice, indoorDevices, outdoorDevices, iaqDevice, thermopileRawData, energyMeterRawData, ahuDevice, btuDevice, btuRawData, ahuRawData } from '../../models';
import { MODEL_NAME } from '../../constants';
import mongoose, { Model } from "mongoose";


export const getTotalDevices = async (deviceTypeId?: string) => {
    try {
      let devices: any[] = [];
  
      if (deviceTypeId) {
        const deviceTypeData = await deviceType.findById(deviceTypeId, { deviceTypeName: 1 });
        if (!deviceTypeData) {
          throw new Error('Device Type Not Found');
        }
  
        const deviceTypename = deviceTypeData.deviceTypeName;
        const deviceMap = {
          "VRV/VRF Indoor": indoorDevices,
          "VRV/VRF Outdoor": outdoorDevices,
          "IAQ": iaqDevice,
          "Occupancy": ThermopileDevice,
          "Energy Meter": energyMeter,
          "AHU": ahuDevice,
          "BTU": btuDevice
        };
  
        const DeviceModel = deviceMap[deviceTypename as keyof typeof deviceMap];
        if (!DeviceModel) {
          throw new Error(`Device Type ${deviceTypeData.deviceTypeName} not supported`);
        }
  
        devices = await (DeviceModel as typeof indoorDevices).find().lean().populate("customerId").populate("parentDeviceId").populate("zoneId").populate("floorId").populate("buildingId");
      } else {
        devices = await Promise.all([
          indoorDevices.find().lean().populate("customerId").populate("parentDeviceId").populate("zoneId").populate("floorId").populate("buildingId"),
          outdoorDevices.find().lean().populate("customerId").populate("zoneId").populate("floorId"),
          iaqDevice.find().lean().populate("customerId").populate("zoneId").populate("floorId"),
          ThermopileDevice.find().lean().populate("customerId").populate("parentDeviceId").populate("zoneId").populate("floorId"),
          ahuDevice.find().lean().populate("customerId").populate("gatewayId").populate("zoneId").populate("floorId").populate("buildingId"),
          btuDevice.find().lean().populate("customerId").populate("gatewayId").populate("zoneId").populate("floorId").populate("buildingId")
        ]);
        devices = devices.flat();
      }
  
      return devices;
    } catch (error) {
      console.log(error);
    }
  };

export const getIaqDevicesData = async ({ parentFilterId, deviceTypeId, customerId, buildingId, iaqDeviceId }: { parentFilterId?: string; deviceTypeId?: string; customerId?: string; buildingId?: string, iaqDeviceId?: string }) => {
    try {
        let filter: any = {};
        if (parentFilterId) {
            filter.parentDeviceId = new ObjectId(parentFilterId);
        }
        if (deviceTypeId) {
            filter.deviceType = new ObjectId(deviceTypeId);
        }
        if (customerId) {
            filter.customerId = new ObjectId(customerId);
        }
        if (buildingId) {
            filter.buildingId = new ObjectId(buildingId);
        }
        if (iaqDeviceId) {
            filter._id = new ObjectId(iaqDeviceId);
        }
        
        const devices: any[] = await indoorDevices.find(filter)
            .lean()
            .populate("customerId")
            .populate("floorId")
            .populate("buildingId")

        const deviceNames = devices.map((device: any) => device.name);
        const deviceDetails = devices.map((device: any) => ({
            id: device._id,
            name: device.name
        }));

        const latestDataMap: any = {};

        for (const deviceName of deviceNames) {
            const indoorRecord = await IndoorRawData.findOne({ Sensor: deviceName })
                .sort({ "Epoch time": -1 })
                .lean();

            const iaqRecord = await IaqRawData.findOne({ MQTTID: deviceName })
                .sort({ "timestamp": -1 })
                .lean();

            if (indoorRecord) {
                latestDataMap[deviceName] = {
                    parentid: deviceDetails.find((d: any) => d.name === deviceName)?.id || null,
                    indoor: indoorRecord
                };
            }

            if (iaqRecord) {
                const latestTimestamp = iaqRecord.timestamp;
                const oneHourAgo = (Math.floor(Date.now() / 1000) - 3600) * 1000;
                const status = latestTimestamp !== undefined && latestTimestamp < oneHourAgo ? "off" : "on";

                latestDataMap[deviceName] = {
                    parentid: deviceDetails.find((d: any) => d.name === deviceName)?.id || null,
                    status,
                    timestamp: latestTimestamp,
                    iaq: iaqRecord
                };
            }
        }

        for (const key in latestDataMap) {
            if (latestDataMap.hasOwnProperty(key)) {
                latestDataMap[key]['occupancyData'] = {};


                const childDevices = await ThermopileDevice.find({ parentDeviceId: latestDataMap[key]['parentid'] }).lean();

                for (const childDevice of childDevices) {
                    const occupancyData = await thermopileRawData.find({ deviceId: childDevice.name })
                        .sort({ "Epoch time": -1 })
                        .limit(1)
                        .lean();
                    if (occupancyData.length > 0) {
                        latestDataMap[key]['occupancyData'] = occupancyData[0];
                    }
                }
            }
        }

        devices.forEach((device: any) => {
            device.data = latestDataMap[device.name] || null;
        });

        return devices;
    } catch (error) {
        throw error;
    }
};

export const createDevice = async (DeviceData: any) => {
    const deviceTypeId = DeviceData.deviceType;
    const deviceTypeData = await deviceType.findById({_id: new ObjectId(deviceTypeId)}, { deviceTypeName: 1 });
    if (!deviceTypeData) {
        throw new Error('Device Type Not Found');
    }

    const deviceMap = {
        "VRV/VRF Indoor": indoorDevices,
        "VRV/VRF Outdoor": outdoorDevices,
        "IAQ": iaqDevice,
        "Occupancy": ThermopileDevice,
        "Energy Meter": energyMeter,
        "AHU":ahuDevice,
        "BTU":btuDevice
    };

    const deviceTypeName = deviceTypeData.deviceTypeName;

    if (!Object.keys(deviceMap).includes(deviceTypeName)) {
        throw new Error(`Unsupported device type: ${deviceTypeName}`);
    }

    const DeviceModel = deviceMap[deviceTypeName as keyof typeof deviceMap];

    if (!DeviceModel) {
        throw new Error(`Device Type ${deviceTypeData.deviceTypeName} not supported`);
    }

    return await (DeviceModel as typeof indoorDevices).create(DeviceData);
};

export const updateDevice = async (id: string, updatedData: any) => {
    if (!id) {
        throw new Error('Device ID is required');
    }

    const deviceTypeId = updatedData.deviceType;

    const deviceTypeData = await deviceType.findOne({ _id: new ObjectId(deviceTypeId) }, { deviceTypeName: 1 });
    if (!deviceTypeData) {
        throw new Error('Device Type Not Found');
    }

    const deviceMap: { [key: string]: Model<any> } = {
        "VRV/VRF Indoor": indoorDevices,
        "VRV/VRF Outdoor": outdoorDevices,
        "IAQ": iaqDevice,
        "Occupancy": ThermopileDevice,
        "Energy Meter": energyMeter,
        "AHU": ahuDevice,
        "BTU": btuDevice
    };

    const deviceTypeName = deviceTypeData.deviceTypeName;

    if (!Object.keys(deviceMap).includes(deviceTypeName)) {
        throw new Error(`Unsupported device type: ${deviceTypeName}`);
    }

    const DeviceModel = deviceMap[deviceTypeName];

    if (!DeviceModel) {
        throw new Error(`Device Type ${deviceTypeName} not supported`);
    }

    const result = await DeviceModel.findByIdAndUpdate(new ObjectId(id), updatedData, { new: true }).exec();

    if (!result) {
        throw new Error('Device not found or update failed');
    }

    return result;
};



export const getOccupancyOfDevices = async () => {
    try {
        const devices = await ThermopileDevice.aggregate([ 
            {
                $match: {}
            },
            {
                $lookup: {
                    from: MODEL_NAME.THERMOPILE_RAW_DATA,
                    let: { deviceId: "$name" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$deviceId", "$$deviceId"] } } },
                        { $sort: { "Epoch time": -1 } },
                        { $limit: 1 }
                    ],
                    as: "occupancy"
                }
            },
            {
                $addFields: {
                    occupancy: { $arrayElemAt: ["$occupancy", 0] }
                }
            },
            {
                $lookup: {
                    from: MODEL_NAME.INDOOR_DEVICES,
                    localField: "parentDeviceId",
                    foreignField: "_id",
                    as: "parentDevice"
                }
            },
            {
                $addFields: {
                    parentData: "$parentDevice"
                }
            },
            {
                $project: {
                    parentDevice: 0
                }
            }
        ]).exec();

        return devices;
    } catch (error) {
        throw error;
    }
};

export const getLatestOccupancyNumberByDeviceId = async (deviceId: string): Promise<number | null> => {
    try {
      const latestData = await thermopileRawData.findOne({ 'deviceId':deviceId })
        .sort({ 'Epoch time': -1 })
        .exec();
       console.log(latestData);
       if (latestData && latestData.metaData && latestData.metaData.occupancy_number !== undefined) {
       return latestData.metaData.occupancy_number;
      }
  
      return null;
    } catch (error) {
      console.error(`Error fetching data for deviceId ${deviceId}:`, error);
      throw error;
    }
};

export const getSensorDataByTimeFrame = async ({ deviceTypeId, sensorName, timeFrameInHours, }: { deviceTypeId: string; sensorName: string; timeFrameInHours: number; }) => {
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        const pastTime = (currentTime - timeFrameInHours * 3600);
        const timeFrameFilter = { $gte: pastTime };
        let deviceTypeData = await deviceType.findOne({ _id: new ObjectId(deviceTypeId) }, { deviceTypeName: 1 })
        if (!deviceTypeData) {
            return { error: "No devicetype found" }
        }
        const deviceTypename = deviceTypeData.deviceTypeName
        if (deviceTypename === "VRV/VRF") {
            const sensorData = await IndoorRawData.find({
                Sensor: sensorName,
                "Epoch time": timeFrameFilter
            }).sort({ "Epoch time": -1 });
            return sensorData;
        }
        else if (deviceTypename === "IAQ") {
            let sensorData = await IaqRawData.find({
                MQTTID: sensorName,
                "timestamp": { $gte: pastTime * 1000 }
            }).sort({ "Epoch time": -1 });
            
            return sensorData;

        }
        
    } catch (error) {
        throw error;
    }
};

export const getSensorDataAverages = async (sensorName: string, timeFrameInHours: number,) => {
    try {
        const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
        const currentTime = Date.now();
        const startTime = currentTime - oneWeekInMillis;
        const startTimeInSeconds = Math.floor(startTime / 1000);

        const timeFrameInMillis = timeFrameInHours * 60 * 60 * 1000;
        const timeFrameInSeconds = timeFrameInHours * 60 * 60;

        const sensorData = await IndoorRawData.find({
            Sensor: sensorName,
            "Epoch time": { $gte: startTimeInSeconds },
        })
            .sort({ "Epoch time": 1 })
            .lean();

        const result = [];

        const calculateAverages = (data: any[]) => {
            const setTempSum = data.reduce(
                (sum, record) => sum + record["Set Temp"],
                0,
            );
            const ambTempSum = data.reduce(
                (sum, record) => sum + record["Amb Temp"],
                0,
            );
            const epochTimeSum = data.reduce(
                (sum, record) => sum + record["Epoch time"],
                0,
            );
            const setTempAvg = setTempSum / data.length;
            const ambTempAvg = ambTempSum / data.length;
            const epochTimeAvg = epochTimeSum / data.length;

            const statusCounts = data.reduce((acc, record) => {
                acc[record.Status] = (acc[record.Status] || 0) + 1;
                return acc;
            }, {});
            const mostFrequentStatus = Object.keys(statusCounts).reduce((a, b) =>
                statusCounts[a] > statusCounts[b] ? a : b,
            );

            const modeCounts = data.reduce((acc, record) => {
                acc[record.Mode] = (acc[record.Mode] || 0) + 1;
                return acc;
            }, {});
            const mostFrequentMode = Object.keys(modeCounts).reduce((a, b) =>
                modeCounts[a] > modeCounts[b] ? a : b,
            );

            return {
                "Set Temp Avg": setTempAvg,
                "Amb Temp Avg": ambTempAvg,
                "Avg Epoch Time": epochTimeAvg,
                "Most Frequent Status": mostFrequentStatus,
                "Most Frequent Mode": mostFrequentMode,
            };
        };

        for (
            let start = startTimeInSeconds;
            start < currentTime / 1000;
            start += timeFrameInSeconds
        ) {
            const end = start + timeFrameInSeconds;
            const dataInInterval = sensorData.filter(
                (record) =>
                    record["Epoch time"] !== undefined &&
                    record["Epoch time"] >= start &&
                    record["Epoch time"] < end,
            );

            if (dataInInterval.length > 0) {
                const averages = calculateAverages(dataInInterval);
                result.push({ start, end, averages });
            }
        }

        return result;
    } catch (error) {
        throw error;
    }
};


export const fetchDeviceStats = async (
  deviceTypeId: string,
  onlineThresholdMinutes: number,
): Promise<{
  deviceCount: number;
  uniqueCustomerCount: number;
  onlineDeviceCount: number;
}> => {
  const deviceTypeDoc = await deviceType.findById(new ObjectId(deviceTypeId));

  if (!deviceTypeDoc) {
    throw new Error("Device type not found");
  }

  const deviceTypeName = deviceTypeDoc.deviceTypeName; 
  const getModel = (deviceTypeName: string): Model<any> | null => {
    switch (deviceTypeName) {
      case "IAQ":
        return iaqDevice;
      case "Energy Meter":
        return energyMeter;
      case "VRV/VRF Indoor":
        return indoorDevices;
      case "VRV/VRF Outdoor":
        return outdoorDevices;
      case "ThermoPile":
        return ThermopileDevice;
      default:
        return null;
    }
  };

  const model = getModel(deviceTypeName);

  if (!model) {
    throw new Error("Invalid device type name");
  }

  const now = new Date();
  const onlineThreshold = new Date(
    now.getTime() - onlineThresholdMinutes * 60000,
  );

  const devices = await model.find({});
  const deviceCount = devices.length;

  const uniqueCustomerIds = new Set<string>();
  let onlineDeviceCount = 0;

  for (const device of devices) {
    if (!(device.customerId === undefined)) {
      uniqueCustomerIds.add(device.customerId.toString());
    }
    if (device.updatedAt >= onlineThreshold) {
      onlineDeviceCount++;
    }
  }

  return {
    deviceCount,
    uniqueCustomerCount: uniqueCustomerIds.size,
    onlineDeviceCount,
  };
};

export const getLatestEneryMeterData = async (sensorName: string) => {
    try {
      return await energyMeterRawData.find({ Sensor: sensorName }).sort({ "Epoch time": -1 }).limit(1)
    } catch (error) {
      throw error;
    }
  };
export const getLatestBTUData = async (sensorName: string) => {
    try {
      return await btuRawData.find({ Sensor: sensorName }).sort({ "Epoch time": -1 }).limit(1)
    } catch (error) {
      throw error;
    }
  };
export const getLatestBTUTrendData = async (sensorName: string, startEpoch: number, endEpoch: number) => {
    try {
      return await btuRawData.find({ Sensor: sensorName, "Epoch time":{"$gte": startEpoch, "$lte": endEpoch} }).sort({ "Epoch time": -1 })
    } catch (error) {
      throw error;
    }
  };

  export const getThermoPileRawData = async (startEpochTime: number, endEpochTime: number, deviceId?: string) => {
    try {
        const query: any = {
            "Epoch time": {
                $gte: startEpochTime,
                $lte: endEpochTime
            }
        };

        if (deviceId) {
            query.deviceId = deviceId;
        }

        return await thermopileRawData.find(query);
    } catch (error) {
        throw error;
    }
};
export const postRawThermData = async (data:any)=>{
    try {
        return thermopileRawData.create(data);
    }catch(error){
        throw error;
    }
};

export const deleteDevice = async (id: string, deviceTypeId: string) => {
    if (!id || !ObjectId.isValid(id)) {
        throw new Error("Invalid or missing Device ID");
    }

    if (!deviceTypeId || !ObjectId.isValid(deviceTypeId)) {
        throw new Error("Invalid or missing Device Type ID");
    }

    const deviceTypeData = await deviceType.findById(new ObjectId(deviceTypeId), { deviceTypeName: 1 });

    if (!deviceTypeData) {
        throw new Error("Device Type Not Found");
    }

    const deviceMap: { [key: string]: mongoose.Model<any> } = {
        "VRV/VRF Indoor": indoorDevices,
        "VRV/VRF Outdoor": outdoorDevices,
        "IAQ": iaqDevice,
        "Occupancy": ThermopileDevice,
        "Energy Meter": energyMeter,
        "AHU": ahuDevice,
        "BTU": btuDevice,
    };

    const deviceTypeName = deviceTypeData.deviceTypeName;

    if (!Object.keys(deviceMap).includes(deviceTypeName)) {
        throw new Error(`Unsupported device type: ${deviceTypeName}`);
    }

    const DeviceModel = deviceMap[deviceTypeName];

    const result = await DeviceModel.findByIdAndDelete(new ObjectId(id)).exec();

    if (!result) {
        throw new Error("Device not found or deletion failed");
    }

    return result;
};

export const getLatestAHUData = async (sensorName: string) => {
    try {
          return await ahuRawData.find({ Sensor: sensorName }).sort({ "Epoch time": -1 }).limit(1)
    } catch (error) {
      throw error;
    }
  };

  export const getLatestAHUTrendData = async (sensorName: string, startEpoch: number, endEpoch: number) => {
    try {
      return await ahuRawData.find({ Sensor: sensorName, "Epoch time":{"$gte": startEpoch, "$lte": endEpoch} }).sort({ "Epoch time": -1 })
    } catch (error) {
      throw error;
    }
  };

export const getSensorDataByEpoch = async(deviceTypeId:string, sensorName:string,from:number , to:number)=>{
    let timeFrameFilter = {$gte:from ,$lt:to}
    let deviceTypeData = await deviceType.findOne({ _id: new ObjectId(deviceTypeId) }, { deviceTypeName: 1 })
    if (!deviceTypeData) {
        return { error: "No devicetype found" }
    }
    const deviceTypename = deviceTypeData.deviceTypeName
    if (deviceTypename === "VRV/VRF") {
        const sensorData = await IndoorRawData.find({
            Sensor: sensorName,
            "Epoch time": timeFrameFilter
        }).sort({ "Epoch time": -1 });
        return sensorData;
    }
    else if (deviceTypename === "IAQ") {
        let sensorData = await IaqRawData.find({
            MQTTID: sensorName,
            "timestamp":  timeFrameFilter
        }).sort({ "Epoch time": -1 });
        
        return sensorData;

    }
}
