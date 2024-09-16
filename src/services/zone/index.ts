import { zone } from '../../models';
import { IZone } from '../../interfaces/IZone';
import { ObjectId} from 'mongoose';

export const getAllZones = async (filters: any) => {
    return zone.find(filters);
};

export const createZone = async (zoneData: IZone) => {
    return zone.create(zoneData);
};

export const updateZoneById = async (zoneId: string, zoneData: Partial<IZone>) => {
    return zone.findByIdAndUpdate(zoneId, zoneData, { new: true });
};


export const deleteZoneById = async (zoneId: string) => {
    return zone.findByIdAndDelete(zoneId);
};

export function deleteZone(zoneId: string) {
    throw new Error('Function not implemented.');
}
