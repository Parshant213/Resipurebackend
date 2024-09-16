import { Document, ObjectId } from 'mongoose';

export interface ISensor extends Document {
	name: string;
	sensorTypeId: ObjectId;
	address: string;
	seatId?: ObjectId;
	roomId?: ObjectId;
	hasOccupancy?: boolean;
	hasTemperature?: boolean;
	hasHumidity?: boolean;
	hasCo2?: boolean;
	hasVoc?: boolean;
	hasPm25?: boolean;
	hasPm10?: boolean;
	hasPm4?: boolean;
	hasIaq?: boolean;
	hasProximity?: boolean;
	status?: boolean;
	occupied?: boolean;
	temperature?: number;
	humidity?: number;
	voc?: number;
	co2?: number;
	pm25?: number;
	pm4?: number;
	pm10?: number;
	iaq?: number;
	proximity?: number;
	count?: number;
	lastUpdated?: Date;
}
