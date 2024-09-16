import mongoose from "mongoose";
import { MODEL_NAME } from "../constants";
import { transformHook } from "../utils/models";

const switchRawDataSchema = new mongoose.Schema(
  {
    data: {
      type: String,
    },
    timeStamp: {
      type: Number,
      required: true,
    },
  },
  {
    collection: MODEL_NAME.SWITCH_RAW_DATA,
    id: true,
    versionKey: false,
    timestamps: true,
  },
);

switchRawDataSchema.set("toJSON", transformHook);
switchRawDataSchema.set("toObject", transformHook);

export default mongoose.model(MODEL_NAME.SWITCH_RAW_DATA, switchRawDataSchema);
