import mongoose from "mongoose";
import { MODEL_NAME } from "../constants";
import { transformHook } from "../utils/models";
const { ObjectId, Decimal128 } = mongoose.Schema.Types;

const ahuRawDataSchema = new mongoose.Schema({
    Sensor:{
        type: String,
        required: true,
    },
    "Epoch time":{
        type: Decimal128,
    },
    data:{
        type: mongoose.Schema.Types.Mixed,
    },
},{collection: MODEL_NAME.AHU_RAW_DATA, id:true, versionKey: false, timestamps: true})

ahuRawDataSchema.set('toJSON',transformHook);
ahuRawDataSchema.set('toObject',transformHook);

export default mongoose.model(MODEL_NAME.AHU_RAW_DATA, ahuRawDataSchema);
