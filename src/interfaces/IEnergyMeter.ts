import { ObjectId } from "mongoose";

export interface IEnergyMeter {
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

export interface EnergyData {
  WhR: string;
  WhY: string;
  WhB: string;
  whAvg: string;
  [key: string]: any; 
}

export interface ConsumptionData {
  date: string;
  epochTime: number;
  consumption: {
    WhR: number;
    WhY: number;
    WhB: number;
    WhAvg: number;
  };
}

export interface QueryParams {
  sensorName: string;
  timeframe: "week" | "month"| "day";
  timeframe2: "hourly" | "daily";
}
