import { Request, Response, NextFunction } from 'express';
import * as SensorTypeService from '../../services/sensorType';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';

export const getSensorTypes = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const sensorTypes = await SensorTypeService.findSensorTypes();
		res.status(200).json(sensorTypes);
	} catch (error) {
		next(error);
	}
};

export const getSensorTypeById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const sensorType = await SensorTypeService.findSensorTypeById(id);

		if (!sensorType) {
			return res.status(404).json({ error: 'Sensor Type not found' });
		}

		res.status(200).json(sensorType);
	} catch (error) {
		next(error);
	}
};

export const createSensorType = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, key, description } = req.body;

		if (!name || !key) {
			return res.status(400).json({ error: 'Name and Key are required fields' });
		}

		const sensorType = await SensorTypeService.createSensorType({ name, key, description });
		res.status(201).json({"message":"Sensor Type created", sensorType});
	} catch (error) {
		next(error);
	}
};

export const updateSensorType = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { name, key, description } = req.body;

		if (!name && !key && !description) {
			return res.status(400).json({ error: 'At least one field (Name, Key, Description) is required for update' });
		}

		const updatedSensorType = await SensorTypeService.updateSensorTypeById(id, { name, key, description });
		if (!updatedSensorType) {
			throw new APIError('Sensor type not found', HttpStatusCode.NOT_FOUND);
		  }
		res.status(200).json({"message":"Sensor type updated successfully", updatedSensorType});
	} catch (error) {
		next(error);
	}
};

export const deleteSensorType = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ error: 'Sensor Type ID is required for deletion' });
		}

		const deletedSensorType = await SensorTypeService.deleteSensorTypeById(id);
		if(!deletedSensorType){
			throw new APIError('Sensor type not found', HttpStatusCode.NOT_FOUND);
		}

		res.status(200).json({"message": " Sensor type deleted successfully", deletedSensorType});
	} catch (error) {
		next(error);
	}
};
