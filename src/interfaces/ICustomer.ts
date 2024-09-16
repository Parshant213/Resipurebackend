import { Document } from 'mongoose';

export interface ICustomer extends Document {
	name: string;
	logo?: string;
	address?: string;
	gst?: string;
}
