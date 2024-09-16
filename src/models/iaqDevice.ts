import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types;

const IAQDeviceSchema = new mongoose.Schema(
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
        calibrationValues: {
            type: Object,
            required: true,
            default: {}
        },
        limits: {
            type: Object,
            required: true,
            default: {}
        },
        parameters: {
            type: Array,
            required: true,
            default: []
        },
        dataUpdatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { collection: MODEL_NAME.IAQ_DEVICE, id: true, versionKey: false, timestamps: true }
);

IAQDeviceSchema.set('toJSON', transformHook);
IAQDeviceSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.IAQ_DEVICE, IAQDeviceSchema);
