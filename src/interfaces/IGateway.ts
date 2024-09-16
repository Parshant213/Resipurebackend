import { ObjectId } from 'mongoose';

export interface IGateway {
    _id?: ObjectId | string;
    name: string;
    customerId: ObjectId | string;
    buildingId: ObjectId | string;
    floorId: ObjectId | string;
    zoneId: ObjectId | string;
    ssid: string;
    pwd: string;
    dataUpdatedAt?: Date;
    deviceIdArray?: Array<{
        id: ObjectId | string;
        model: string;
      }>;
    createdAt?: Date;
    updatedAt?: Date;
}
