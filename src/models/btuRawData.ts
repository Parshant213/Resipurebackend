import mongoose from "mongoose";
import { MODEL_NAME } from "../constants";
import { transformHook } from "../utils/models";
const { ObjectId, Decimal128 } = mongoose.Schema.Types;

const btuRawDataSchema = new mongoose.Schema({
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
},{collection: MODEL_NAME.BTU_RAW_DATA, id:true, versionKey: false, timestamps: true})

btuRawDataSchema.set('toJSON',transformHook);
btuRawDataSchema.set('toObject',transformHook);

export default mongoose.model(MODEL_NAME.BTU_RAW_DATA, btuRawDataSchema);