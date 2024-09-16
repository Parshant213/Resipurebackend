import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types;

const outdoorDevicesSchema = new mongoose.Schema(
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
        dataIntervalTime: {
            type: Number,
            required: true
        },
        gatewayId: {
            type: ObjectId,
            ref: MODEL_NAME.GATEWAY,
            index: true,
            required: true
        },
        modelId: {
            type: ObjectId,
            ref: MODEL_NAME.MODELS,
            index: true,
            required: true
        },
        slaveId: {
            type: String,
            required: true
        },
        aliasName: {
            type: String,
            required: true
        },
        dataUpdatedTime: {
            type: Date,
            default: Date.now
        }
    },
    { collection: MODEL_NAME.OUTDOOR_DEVICES, id: true, versionKey: false, timestamps: true }
);

outdoorDevicesSchema.set('toJSON', transformHook);
outdoorDevicesSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.OUTDOOR_DEVICES, outdoorDevicesSchema);
