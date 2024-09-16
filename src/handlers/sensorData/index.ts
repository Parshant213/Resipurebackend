import { Request, Response, NextFunction } from 'express';
import * as SensorDataService from '../../services/sensorData';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { ISensorData } from '../../interfaces/ISensorData';

export const createSensorData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const sensorData: ISensorData = req.body;

		if (!sensorData.sensorId || !sensorData.time) {
			throw new APIError('Sensor ID and time are required fields for creating sensor data', HttpStatusCode.BAD_REQUEST);
		}

		const createdSensorData = await SensorDataService.createSensorData(sensorData);
		res.status(201).json({"message":"Sensor data successfully created", createdSensorData});
	} catch (error) {
		next(error);
	}
};

export const updateSensorData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const sensorData: Partial<ISensorData> = req.body;

		if (!Object.keys(sensorData).length) {
			throw new APIError('At least one field is required for updating sensor data', HttpStatusCode.BAD_REQUEST);
		}

		const updatedSensorData: ISensorData | null = await SensorDataService.updateSensorDataById(id, sensorData);

		if (!updatedSensorData) {
			throw new APIError('Sensor data not found', HttpStatusCode.NOT_FOUND);
		}

		res.status(200).json({"message":"Sensor data updated successfully", updatedSensorData});
	} catch (error) {
		next(error);
	}
};
