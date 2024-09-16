import { Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
	customerId: ObjectId;
	name: string;
	email: string;
	password: string;
	theme?: string;
	phone?: string;
	notification?: string;
	token?: string;
	isAdmin: boolean;
	isSuperAdmin: boolean;
}
