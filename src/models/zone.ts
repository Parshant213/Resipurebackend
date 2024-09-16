import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types;

const ZoneSchema = new mongoose.Schema(
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
        alias: {
            type: String,
            required: true
        }
    },
    { collection: MODEL_NAME.ZONE, id: true, versionKey: false, timestamps: true }
);

ZoneSchema.set('toJSON', transformHook);
ZoneSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.ZONE, ZoneSchema);
