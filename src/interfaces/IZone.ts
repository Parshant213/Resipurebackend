import { ObjectId } from 'mongoose';

export interface IZone {
    _id?: ObjectId | string;
    name: string;
    customerId: ObjectId | string;
    buildingId: ObjectId | string;
    floorId: ObjectId | string;
    alias: string;
    createdAt?: Date;
    updatedAt?: Date;
}
