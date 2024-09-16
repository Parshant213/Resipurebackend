import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import APIError from '../classes/APIError';
import HttpStatusCode from '../enums/HttpStatusCode';

const OBJECT_ID_REQUEST_PARAMS = [
	{ key: 'customerId', name: 'Customer' },
	{ key: 'buildingId', name: 'Building' },
	{ key: 'floorId', name: 'Floor' },
	{ key: 'seatId', name: 'Seat' },
	{ key: 'roomId', name: 'Room' },
	{ key: 'userId', name: 'User' },
	{ key: 'locationId', name: 'Location' },
	{ key: 'sensorId', name: 'Sensor' }
];

export const objectIdParamCheck = async (req: Request, res: Response, next: NextFunction) => {
	try {
		for (const param of OBJECT_ID_REQUEST_PARAMS) {
			if (req.params[param.key] && !isValidObjectId(req.params[param.key])) {
				throw new APIError(`${param.name} ID: ${req.params[param.key]} is Invalid`, HttpStatusCode.BAD_REQUEST);
			}
		}
		next();
	} catch (error) {
		next(error);
	}
};
