import mongoose from "mongoose";
import { MODEL_NAME } from "../constants";
import { transformHook } from "../utils/models";
const { ObjectId } = mongoose.Schema.Types;

const ResipureDeviceControlSchema = new mongoose.Schema({
  deviceId: {
    type: ObjectId,
    ref: MODEL_NAME.IAQ_DEVICE,
    index: true,
    required: true,
  },
  controls: {
    type: mongoose.Schema.Types.Mixed,
    require: true,
  },
},{id:true, versionKey: false, timestamps: true});


ResipureDeviceControlSchema.set('toJSON', transformHook);
ResipureDeviceControlSchema.set('toObject', transformHook);

export default mongoose.model('resipureDeviceControl' , ResipureDeviceControlSchema);