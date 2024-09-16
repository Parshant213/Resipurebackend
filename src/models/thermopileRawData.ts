import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types; 

const ThermopileRawDataSchema = new mongoose.Schema(
	{
		deviceId: {
			type: String,
			required: true
		},
		metaData: {
			type: mongoose.Schema.Types.Mixed
		},
		"Epoch time": { 
            type: Number
        }
	},
	{ collection: MODEL_NAME.THERMOPILE_RAW_DATA, id: true, versionKey: false, timestamps: true }
);
ThermopileRawDataSchema.set('toJSON', transformHook);
ThermopileRawDataSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.THERMOPILE_RAW_DATA, ThermopileRawDataSchema);
