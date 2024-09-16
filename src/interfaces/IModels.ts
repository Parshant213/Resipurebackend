import { ObjectId } from 'mongoose';

export interface IModels {
    _id?: ObjectId | string;
    name: string;
    manufacturer: string;
    registers: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
