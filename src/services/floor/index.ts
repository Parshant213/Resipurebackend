import { IFloor } from '../../interfaces/IFloor';
import { Floor } from '../../models';

export const findFloorsByBuildingId = async (customerId: string, buildingId: string) => {
	return Floor.find({ customerId, buildingId });
};

export const findFloorById = async (customerId: string, buildingId: string, floorId: string) => {
	return Floor.findOne({ _id: floorId, buildingId, customerId });
};

export const createFloor = async (floorData: IFloor) => {
	return Floor.create(floorData);
};

export const updateFloorById = async (customerId: string, buildingId: string, floorId: string, floorData: Partial<IFloor>) => {
	return Floor.findOneAndUpdate({ _id: floorId, buildingId, customerId }, floorData, { new: true });
};

export const deleteFloorById = async (customerId: string, buildingId: string, floorId: string): Promise<void> => {
	await Floor.deleteOne({ _id: floorId, buildingId, customerId });
};

export const findFloorsByCustomerId = async (customerId: string) => {
	return Floor.find({ customerId });
};
