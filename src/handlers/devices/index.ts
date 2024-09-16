import { Request, Response, NextFunction } from 'express';
import * as deviceService from '../../services/devices';
import { deleteDevice } from '../../services/devices';



export const getDeviceshandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parentFilterId, deviceTypeId, customerId, buildingId } = req.query as { [key: string]: string };
        const customers = await deviceService.getTotalDevices();
        res.json(customers);
    } catch (error) {
        next(error);
    }
};
export const getDeviceOccupancyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const devices = await deviceService.getOccupancyOfDevices();
        res.json(devices);
    } catch (error) {
        next(error);
    }
};
export const getRealtimeBTU = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sensorName } = req.query as { [key: string]: string };
        const devices = await deviceService.getLatestBTUData(sensorName);
        res.json(devices);
    } catch (error) {
        next(error);
    }
};
export const getBTUTrendHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sensorName, startEpoch, endEpoch } = req.query as { [key: string]: string };
        const devices = await deviceService.getLatestBTUTrendData(sensorName, Number(startEpoch), Number(endEpoch));
        res.json(devices);
    } catch (error) {
        next(error);
    }
};

export const getLatestOccupancyHandler = async (req: Request, res: Response): Promise<void> => {
    const { deviceId } = req.params;
  
    try {
      const occupancyNumber = await deviceService.getLatestOccupancyNumberByDeviceId(deviceId);
  
      if (occupancyNumber !== null) {
        res.status(200).json({ occupancyNumber });
      } else {
        res.status(404).json({ message: 'No data found for the specified deviceId.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
};

export const getDeviceshandlerRealtime = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parentFilterId, deviceTypeId, customerId, buildingId, iaqDeviceId} = req.query as { [key: string]: string };
        const customers = await deviceService.getIaqDevicesData({ parentFilterId, deviceTypeId, customerId, buildingId, iaqDeviceId});
        res.json(customers);
    } catch (error) {
        next(error);
    }
};


export const getSensorDataByTimeFrameHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { deviceTypeId, sensorName, timeFrameInHours } = req.query as {
            [key: string]: string;
        };

        const timeFrame = parseInt(timeFrameInHours, 10);

        if (!sensorName || isNaN(timeFrame) || !deviceTypeId) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        const sensorData = await deviceService.getSensorDataByTimeFrame({
            deviceTypeId,
            sensorName,
            timeFrameInHours: timeFrame,
        });
        
        res.json(sensorData);
    } catch (error) {
        next(error);
    }
};

export const createDevicehandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, deviceType, customerId, parentDeviceId, locationId, buildingId, floorId, dataUpdatedTime, zoneId , alias, gatewayId} = req.body;
        const newDevice = await deviceService.createDevice({ name, deviceType, parentDeviceId, customerId, locationId, buildingId, floorId, dataUpdatedTime, zoneId, alias, gatewayId });
        return res.json(newDevice);
    } catch (error) {
        next(error);
    }
};

export const updateDeviceHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, deviceType, customerId, parentDeviceId, locationId, buildingId, floorId, dataUpdatedTime, zoneId, alias, gatewayId } = req.body;

        const updatedDevice = await deviceService.updateDevice(id, { name, deviceType, customerId, parentDeviceId, locationId, buildingId, floorId, dataUpdatedTime, zoneId, alias, gatewayId });

        return res.json(updatedDevice);
    } catch (error) {
        next(error);
    }
};


export const getSensorDataAveragesHandler = async (req: Request, res: Response, next: NextFunction,) => {
    try {
        const { sensorName, timeFrameInHours } = req.query as {
            sensorName: string;
            timeFrameInHours: string;
        };
        const sensorDataAverages = await deviceService.getSensorDataAverages(
            sensorName,
            parseInt(timeFrameInHours),
        );
        res.json(sensorDataAverages);
    } catch (error) {
        next(error);
    }
};

export const getDeviceStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { deviceTypeId, onlineThresholdMinutes } = req.query;

  if (!deviceTypeId || !onlineThresholdMinutes) {
    res.status(400).json({
      message: "deviceTypeId and onlineThresholdMinutes are required",
    });
    return;
  }

  try {
    const onlineThreshold = parseInt(onlineThresholdMinutes as string, 10);

    if (isNaN(onlineThreshold)) {
      res.status(400).json({ message: "Invalid onlineThresholdMinutes value" });
      return;
    }

    const stats = await deviceService.fetchDeviceStats(
      deviceTypeId as string,
      onlineThreshold,
    );
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getLatestEnergyMeterHandler = async (req: Request, res: Response, next: NextFunction,) => {
    try {
        const { sensorName, } = req.query as {
            sensorName: string;
        };
        const sensorDataAverages = await deviceService.getLatestEneryMeterData(
            sensorName,
        );
        res.json(sensorDataAverages);

    } catch (error) {
        next(error);
    }
}
export const getThermopileRawTable = async (req: Request, res: Response) => {
    try {   
        const { startTime, endTime, deviceId } = req.query;  
        const resp = await deviceService.getThermoPileRawData(Number(startTime), Number(endTime), deviceId as string);
        res.status(200).json(resp);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const sendThermopileRawTherm = async (req:Request, res: Response) =>{
    try {
        const data = req.body;
        if (!data){
            res.status(400).json({Msg:"No payload sent"});
            return;
        }
        await deviceService.postRawThermData(data);
        res.status(200).json({Msg:"Ok"});
    }catch(error){
        res.status(400).json({Msg:"Error"})
    }
};

export const deleteDeviceHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { deviceTypeId } = req.body; 

        if (!deviceTypeId) {
            throw new Error("Device Type ID is required");
        }

        const deletedDevice = await deleteDevice(id, deviceTypeId);

        return res.json(deletedDevice);
    } catch (error) {
        next(error);
    }
};

export const getRealtimeAHU = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sensorName } = req.query as { [key: string]: string };
        const devices = await deviceService.getLatestAHUData(sensorName);
        res.json(devices);
    } catch (error) {
        next(error);
    }
};
export const getAHUTrendHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sensorName, startEpoch, endEpoch } = req.query as { [key: string]: string };
        const devices = await deviceService.getLatestAHUTrendData(sensorName, Number(startEpoch), Number(endEpoch));
        res.json(devices);
    } catch (error) {
        next(error);
    }
};