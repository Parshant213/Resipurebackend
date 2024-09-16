import mongoose from "mongoose";
import { MODEL_NAME } from "../constants";
import { transformHook } from "../utils/models";
const { ObjectId } = mongoose.Schema.Types;

const GatewaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    customerId: {
      type: ObjectId,
      ref: MODEL_NAME.CUSTOMER,
      index: true,
      required: true,
    },
    buildingId: {
      type: ObjectId,
      ref: MODEL_NAME.BUILDING,
      index: true,
      required: true,
    },
    floorId: {
      type: ObjectId,
      ref: MODEL_NAME.FLOOR,
      index: true,
      required: true,
    },
    zoneId: {
      type: ObjectId,
      ref: MODEL_NAME.ZONE,
      index: true,
      required: true,
    },
    ssid: {
      type: String,
      required: true,
    },
    pwd: {
      type: String,
      required: true,
    },
    dataUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    deviceIdArray: [
      {
        id: {
          type: ObjectId,
          required: true,
        },
        model: {
          type: String,
          enum: [
            MODEL_NAME.IAQ_DEVICE,
            MODEL_NAME.INDOOR_DEVICES,
            MODEL_NAME.OUTDOOR_DEVICES,
          ],
          required: true,
        },
      },
    ],
  },
  {
    collection: MODEL_NAME.GATEWAY,
    id: true,
    versionKey: false,
    timestamps: true,
  },
);

GatewaySchema.set("toJSON", transformHook);
GatewaySchema.set("toObject", transformHook);

export default mongoose.model(MODEL_NAME.GATEWAY, GatewaySchema);
