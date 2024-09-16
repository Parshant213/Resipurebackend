import { ObjectId } from 'mongoose';

export interface IBuilding {
    _id?: ObjectId | string;
    name: string;
    customerId: ObjectId | string;
    timezone?: string;
    timezoneOffset?: number;
    costPerSqFt?: number;
    costOfEnergy?: number;
    imageLink?: string;
    locationName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
