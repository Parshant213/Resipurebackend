import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types;

const FloorSchema = new mongoose.Schema(
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
		buildingId: {
			type: ObjectId,
			ref: MODEL_NAME.BUILDING,
			index: true
		},
		layout: { type: String, default: null }
	},
	{ collection: MODEL_NAME.FLOOR, id: true, versionKey: false, timestamps: true }
);
FloorSchema.set('toJSON', transformHook);
FloorSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.FLOOR, FloorSchema);
