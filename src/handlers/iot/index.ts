import { NextFunction, Request, Response } from 'express';
import { saveSensorData } from '../../services/iot';
import { ISensorDataGateway } from '../../interfaces/ISensorData';

export const addSensorData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const sensorData: ISensorDataGateway[] = req.body;
		await saveSensorData(sensorData);
		return res.json({ message: 'Saved sensor data!' });
	} catch (error) {
		next(error);
	}
};
