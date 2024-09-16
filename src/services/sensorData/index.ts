import { SensorData } from '../../models';
import { ISensorData } from '../../interfaces/ISensorData';

export const createSensorData = async (sensorData: ISensorData) => {
	return SensorData.create(sensorData);
};

export const updateSensorDataById = async (id: string, sensorData: Partial<ISensorData>): Promise<ISensorData | null> => {
	return SensorData.findByIdAndUpdate(id, sensorData, { new: true });
};
