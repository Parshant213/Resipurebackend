import { ObjectId } from "mongoose";

export interface IIiaqDevice {
  _id?: ObjectId | string;
  name: string;
  customerId: ObjectId | string;
  buildingId: ObjectId | string;
  floorId: ObjectId | string;
  zoneId: ObjectId | string;
  calibrationValues: Record<string, any>;
  limits: Record<string, any>;
  parameters: any[];
  dataUpdatedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
