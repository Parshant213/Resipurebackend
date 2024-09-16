import mongoose, { Document, Schema } from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types;

const ThermopileDeviceSchema = new mongoose.Schema(
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
            index: true,
            required: true
        },
        floorId: {
            type: ObjectId,
            ref: MODEL_NAME.FLOOR,
            index: true,
            required: true
        },
        zoneId: {
            type: ObjectId,
            ref: MODEL_NAME.ZONE,
            index: true,
            required: true
        },
        modelId: {
            type: ObjectId,
            ref: MODEL_NAME.MODELS,
            index: true,
            required: true
        },
        dataUpdatedAt: {
            type: Date,
            default: Date.now
        },
        parentDeviceId: {
            type: ObjectId,
            ref: MODEL_NAME.INDOOR_DEVICES,
            index: true,
            required: true
        },
    },
    { collection: MODEL_NAME.THERMOPILE_DEVICE, id: true, versionKey: false, timestamps: true }
);

ThermopileDeviceSchema.set('toJSON', transformHook);
ThermopileDeviceSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.THERMOPILE_DEVICE, ThermopileDeviceSchema);