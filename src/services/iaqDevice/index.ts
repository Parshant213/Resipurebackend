import { IIiaqDevice } from "../../interfaces/IIaqDevice";
import { iaqDevice, IaqRawData, resipureDeviceControl } from "../../models";
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
    const iaqList = await iaqDevice.find({ customerId: id });
    const latestData = await IaqRawData.find({ MQTTID: iaqList[0].name })
      .sort({ timestamp: -1 })
      .limit(1);
    return { iaqList, latestData };
  } catch (error:any) {
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