import mongoose, { CallbackWithoutResultAndOptionalError, Query, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { MODEL_NAME } from '../constants';
import { transformHook } from '../utils/models';
import { IUser } from '../interfaces/IUser';
const { ObjectId } = mongoose.Schema.Types;

const UserSchema: Schema = new mongoose.Schema(
	{
		customerId: {
			type: ObjectId,
			ref: MODEL_NAME.CUSTOMER,
			index: true
		},
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		theme: {
			type: String
		},
		phone: {
			type: String
		},
		notification: {
			type: Object
		},
		token: {
			type: String
		},
		type: {
			type: String
		},
		isAdmin: {
			type: Boolean,
			default: false
		}
	},
	{ collection: MODEL_NAME.USER, id: true, versionKey: false, timestamps: true }
);
const _preDelete = async function (this: Query<unknown, IUser, {}, unknown>, next: CallbackWithoutResultAndOptionalError) {
	const docs = await this.model.find(this.getFilter());
	const users = docs.map((item) => item._id);
	next();
};

UserSchema.pre('save', async function (next) {
	this.email = this.email.toLowerCase();
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

UserSchema.pre('deleteOne', { document: false, query: true }, _preDelete);
UserSchema.pre('deleteMany', { document: false, query: true }, _preDelete);

UserSchema.set('toJSON', transformHook);
UserSchema.set('toObject', transformHook);

export default mongoose.model<IUser>(MODEL_NAME.USER, UserSchema);
