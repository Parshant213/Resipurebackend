import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId, Decimal128 } = mongoose.Schema.Types;

const EnergyMeterRawDataSchema = new mongoose.Schema({
    Sensor: {
        type: String,
        required: true,
    },
    data: {
        type: {}
    },
    "Epoch time": {
        type: Number,
    },
}, { collection: MODEL_NAME.ENERGY_METER_RAW_DATA, id: true, versionKey: false, timestamps: true })

EnergyMeterRawDataSchema.set('toJSON', transformHook);
EnergyMeterRawDataSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.ENERGY_METER_RAW_DATA, EnergyMeterRawDataSchema);
