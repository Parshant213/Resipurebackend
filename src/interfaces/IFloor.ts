import { ObjectId } from 'mongoose';

export interface IFloor {
	_id?: ObjectId | string;
	name: string;
	customerId: ObjectId | string;
	buildingId: ObjectId | string;
	layout?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}
