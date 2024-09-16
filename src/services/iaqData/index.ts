import { IIiaqRawData } from '../../interfaces/IIaqRawData';
import { iaqDevice } from '../../models';

export const findIaqRawDataById = async (customerId: string, buildingId: string, iaqDataId: string) => {
    return iaqDevice.findOne({ _id: iaqDataId, buildingId, customerId });
};

export const createIaqRawData = async (iaqDataData: IIiaqRawData) => {
    return iaqDevice.create(iaqDataData);
};

export const updateIaqRawDataById = async (customerId: string, buildingId: string, iaqDataId: string, iaqDataData: Partial<IIiaqRawData>) => {
    return iaqDevice.findOneAndUpdate({ _id: iaqDataId, buildingId, customerId }, iaqDataData, { new: true });
};

export const deleteIaqRawDataById = async (customerId: string, buildingId: string, iaqDataId: string): Promise<void> => {
    await iaqDevice.deleteOne({ _id: iaqDataId, buildingId, customerId });
};
