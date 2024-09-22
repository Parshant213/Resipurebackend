import mongoose from "mongoose";
import { MODEL_NAME } from "../constants";
import { transformHook } from "../utils/models";
const { ObjectId } = mongoose.Schema.Types;
const outdoorIaqDeviceSchema = new mongoose.Schema(
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
            default: {}
        },
        limits: {
            type: Object,
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
    { collection: MODEL_NAME.OUTDOOR_IAQ_DEVICE, id: true, versionKey: false, timestamps: true }
);

outdoorIaqDeviceSchema.set('toJSON', transformHook);
outdoorIaqDeviceSchema.set('toObject', transformHook);
export default  mongoose.model(MODEL_NAME.OUTDOOR_IAQ_DEVICE, outdoorIaqDeviceSchema);