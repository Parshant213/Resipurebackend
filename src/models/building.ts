import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types;

const BuildingSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		customerId: {
			type: ObjectId,
			ref: MODEL_NAME.CUSTOMER,
			index: true,
			required: true
		},
		timezone: { 
			type: String 
		},
		timezoneOffset: { 
			type: Number 
		},
		costPerSqFt: {
			type: Number,
			default: 0
		},
		costOfEnergy: {
			type: Number,
			default: 0
		},
		imageLink: {
			type: String
		},
		locationName: {
			type: String
		}
	},
	{ collection: MODEL_NAME.BUILDING, id: true, versionKey: false, timestamps: true }
);

BuildingSchema.set('toJSON', transformHook);
BuildingSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.BUILDING, BuildingSchema);
