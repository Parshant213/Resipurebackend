import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId, Decimal128 } = mongoose.Schema.Types;

const deviceTypeSchema = new mongoose.Schema({
    deviceTypeName: {
        type: String,
        required: true,
        unique: true
    },
    feilds: {
        type:mongoose.Schema.Types.Mixed
    }
}, { collection: MODEL_NAME.DEVICE_TYPE, id: true, versionKey: false, timestamps: true })

deviceTypeSchema.set('toJSON', transformHook);
deviceTypeSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.DEVICE_TYPE, deviceTypeSchema);
