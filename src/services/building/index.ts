import Building from '../../models/building';
import { IBuilding } from '../../interfaces/IBuilding';

export const createBuilding = async (buildingData: IBuilding) => {
    return Building.create(buildingData);
};

export const deleteBuilding = async (buildingId: string) => {
    await Building.deleteOne({ _id: buildingId });
};

export const getBuildingById = async (buildingId: string) => {
    return Building.findById(buildingId);
};

export const getBuildingsByCustomerId = async (customerId: string) => {
    return Building.find({ customerId });
};

export const updateBuilding = async (buildingId: string, updateData: Partial<IBuilding>) => {
    return Building.findByIdAndUpdate(buildingId, updateData, { new: true });
};