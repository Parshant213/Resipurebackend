import { Document, ObjectId } from 'mongoose';

export interface ISensorData extends Document {
	sensorId?: ObjectId;
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
	time: Date;
}

export interface ISensorDataGateway {
	a: string;
	o?: boolean;
	t?: number;
	h?: number;
	voc?: number;
	co2?: number;
	pm25?: number;
	pm4?: number;
	pm10?: number;
	iaq?: number;
	p?: number;
	count?: number;
	time: number;
}
