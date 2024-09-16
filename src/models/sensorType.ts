import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';

const SensorTypeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		key: {
			type: String,
			required: true,
			index: true,
			unique: true
		},
		description: {
			type: String
		}
	},
	{ collection: MODEL_NAME.SENSOR_TYPE, id: true, versionKey: false, timestamps: true }
);

SensorTypeSchema.set('toJSON', transformHook);
SensorTypeSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.SENSOR_TYPE, SensorTypeSchema);
