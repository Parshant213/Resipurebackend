import { IIiaqDevice } from "../../interfaces/IIaqDevice";
import { iaqDevice, IaqRawData, outdoorIaqDevice, resipureDeviceControl } from "../../models";
import APIError from "../../classes/APIError";

export const findIAQDeviceById = async (
  customerId: string,
  buildingId: string,
  iaqDeviceId: string
) => {
  return iaqDevice.findOne({ _id: iaqDeviceId, buildingId, customerId });
};

export const createIAQDevice = async (iaqDeviceData: IIiaqDevice) => {
  return iaqDevice.create(iaqDeviceData);
};

export const updateIAQDeviceById = async (
  customerId: string,
  buildingId: string,
  iaqDeviceId: string,
  iaqDeviceData: Partial<IIiaqDevice>
) => {
  return iaqDevice.findOneAndUpdate(
    { _id: iaqDeviceId, buildingId, customerId },
    iaqDeviceData,
    { new: true }
  );
};

export const deleteIAQDeviceById = async (
  customerId: string,
  buildingId: string,
  iaqDeviceId: string
): Promise<void> => {
  await iaqDevice.deleteOne({ _id: iaqDeviceId, buildingId, customerId });
};

export const fetchLatestDataForResipure = async (id: string) => {
  try {
    const indoorIaqList = await iaqDevice.find({ customerId: id });
    if (!indoorIaqList.length) {
      return {
        indoorIaqList: [],
        indoorLatestData: null,
        outdoorIaqList: null,
        outdoorLatestData: null,
      };
    }

    const { name: indoorMQTTID, outdoorIaqDeviceId } = indoorIaqList[0];

    const indoorLatestDataPromise = IaqRawData.find({ MQTTID: indoorMQTTID })
      .sort({ timestamp: -1 })
      .limit(1);

    let outdoorIaqList = null;
    let outdoorLatestDataPromise = null;

    if (outdoorIaqDeviceId) {
      outdoorIaqList = await outdoorIaqDevice.find({id:outdoorIaqDeviceId});
      outdoorLatestDataPromise = IaqRawData.find({
        MQTTID: outdoorIaqList[0]?.name,
      })
        .sort({ timestamp: -1 })
        .limit(1);
    }

    const [indoorLatestData, outdoorLatestData] = await Promise.all([
      indoorLatestDataPromise,
      outdoorLatestDataPromise,
    ]);

    return {
      indoorIaqList,
      indoorLatestData,
      outdoorIaqList,
      outdoorLatestData,
    };
  } catch (error: any) {
    throw new APIError(error?.message, 500);
  }
};

export const getResipureDeviceControl = async (id: string) => {
  try {
    const result = await resipureDeviceControl.findOne({ deviceId: id });
    return result;
  } catch (error:any) {
    throw new APIError(error.message, 500);
  }
};

export const updateResipureDeviceControl = async (deviceId:string,controls:any)=>{
    try {
       const payload = {deviceId,controls}
       const device = await resipureDeviceControl.findOne({deviceId:deviceId});
       if(!device){
           const deviceControls = await resipureDeviceControl.create(payload);
           return deviceControls;
       }
       else{
                       
          const {name,nodeId,mode,fanStatus,fanSpeed,freshAir} = controls;
          device.controls[nodeId] = {name,mode,fanStatus,fanSpeed,freshAir}
          const updatedControls = await resipureDeviceControl.updateOne({deviceId:deviceId},device);
          return updatedControls;
       }
    } catch (error:any) {
       throw new APIError(error.message,500);
    }
}