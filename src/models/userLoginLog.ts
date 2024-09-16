import mongoose from 'mongoose';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
const { ObjectId } = mongoose.Schema.Types;
const UserLoginLogSchema = new mongoose.Schema(
	{
		userId: {
			type: ObjectId,
			ref: MODEL_NAME.USER,
			index: true
		},
		deviceDetails: {
			type: String
		},
		ipAddress: {
			type: String
		}
	},
	{ collection: MODEL_NAME.USER_LOGIN_LOG, id: true, versionKey: false, timestamps: true }
);

UserLoginLogSchema.set('toJSON', transformHook);
UserLoginLogSchema.set('toObject', transformHook);

export default mongoose.model(MODEL_NAME.USER_LOGIN_LOG, UserLoginLogSchema);
