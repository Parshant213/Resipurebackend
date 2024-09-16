import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId, Decimal128 } = mongoose.Schema.Types;

const IaqRawDataSchema = new mongoose.Schema({
    MQTTID: {
        type: String,
        required: true,
    },
    TEMP: {
        type: Number
    },
    HUM: {
        type: Number
    },
    CO2: {
        type: Number
    },
    VOC: {
        type: Number
    },
    PM1: {
        type: Number
    },
    PM25: {
        type: Number,
    },
    PM10: {
        type: Number,
    },
    AQI: {
        type: Number,
    },
    INDEX: {
        type: Number,
    },
    RSSI: {
        type: Number,
    },
    timestamp: {
        type: Number,
    },
}, { collection: MODEL_NAME.IAQ_RAW_DATA, id: true, versionKey: false, timestamps: true })

IaqRawDataSchema.set('toJSON', transformHook);
IaqRawDataSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.IAQ_RAW_DATA, IaqRawDataSchema);


