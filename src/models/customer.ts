import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types;

export enum CUSTOMER_TYPE {
	DISTRIBUTOR = 'DISTRIBUTOR',
	CUSTOMER = 'CUSTOMER'
}

const CustomerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		type: {
			type: String,
			enum: [CUSTOMER_TYPE.DISTRIBUTOR, CUSTOMER_TYPE.CUSTOMER],
			required: true
		},
		distributorId: {
			type: ObjectId,
			ref: MODEL_NAME.CUSTOMER,
			index: true
		},
		logo: {
			type: String,
			required: true
		} 
	},
	{ collection: MODEL_NAME.CUSTOMER, id: true, versionKey: false, timestamps: true }
);

CustomerSchema.set('toJSON', transformHook);
CustomerSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.CUSTOMER, CustomerSchema);
