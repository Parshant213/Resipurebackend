import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId, Decimal128 } = mongoose.Schema.Types;
const SensorDataSchema = new mongoose.Schema(
	{
		sensorId: {
			type: ObjectId,
			ref: MODEL_NAME.SENSOR,
			index: true
		},
		occupied: { type: Boolean },
		temperature: { type: Decimal128 },
		humidity: { type: Decimal128 },
		voc: { type: Decimal128 },
		co2: { type: Decimal128 },
		pm25: { type: Decimal128 },
		pm4: { type: Decimal128 },
		pm10: { type: Decimal128 },
		iaq: { type: Decimal128 },
		proximity: { type: Decimal128 },
		count: {
			type: Number
		},
		time: {
			type: Date,
			index: true
		}
	},
	{ collection: MODEL_NAME.SENSOR_DATA, id: true, versionKey: false, timestamps: true }
);

SensorDataSchema.set('toJSON', transformHook);
SensorDataSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.SENSOR_DATA, SensorDataSchema);
