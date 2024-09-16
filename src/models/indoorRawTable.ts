import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId, Decimal128 } = mongoose.Schema.Types;

const IndoorRawDataSchema = new mongoose.Schema({
    deviceId: {
        type: ObjectId,
        required: true,
    },
    status: {
        type:Boolean
    },
    fanSpeed: {
        type:String
    },
    tempSet: {
        type:Decimal128
    },
    tempAmbient: {
        type:Decimal128
    },
    mode: {
        type:String
    },
    "Epoch time": {
        type: Number,
      },
}, { collection: MODEL_NAME.INDOOR_RAW_DATA, id: true, versionKey: false, timestamps: true })

IndoorRawDataSchema.set('toJSON', transformHook);
IndoorRawDataSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.INDOOR_RAW_DATA, IndoorRawDataSchema);
