import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types;

const ModelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        manufacturer: {
            type: String,
            required: true
        },
        registers: {
            type: Object,
            required: true,
            default: {}
        },
        params: {
            type: Object,
            required: true,
            default: {}
        }
    },
    { collection: MODEL_NAME.MODELS, id: true, versionKey: false, timestamps: true }
);

ModelSchema.set('toJSON', transformHook);
ModelSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.MODELS, ModelSchema);
