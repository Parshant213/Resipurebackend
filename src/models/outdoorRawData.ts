import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId, Decimal128 } = mongoose.Schema.Types;

const OutdoorRawDataSchema = new mongoose.Schema({
    deviceId: {
        type: ObjectId,
        required: true,
    },
    status: {
        type:Boolean
    }
}, { collection: MODEL_NAME.OUTDOOR_RAW_DATA, id: true, versionKey: false, timestamps: true })

OutdoorRawDataSchema.set('toJSON', transformHook);
OutdoorRawDataSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.OUTDOOR_RAW_DATA, OutdoorRawDataSchema);