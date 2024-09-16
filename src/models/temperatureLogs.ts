import mongoose from "mongoose";
import { MODEL_NAME } from "../constants";
import { transformHook } from "../utils/models";
const { ObjectId, Decimal128} = mongoose.Schema.Types;

const TemperatureLogsSchema = new mongoose.Schema({
    deviceId:{
        type: ObjectId,
    },
    data: {
        type: {}
    },
    "epochTime":{
        type: Number,
    },
    type: {
        type: String,
    },
},{ collection: MODEL_NAME.TEMPERATURE_LOGS, id: true, versionKey: false, timestamps: true})

TemperatureLogsSchema.set('toJSON', transformHook);
TemperatureLogsSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.TEMPERATURE_LOGS, TemperatureLogsSchema);