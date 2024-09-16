import { SensorType } from '../../models';

export const findSensorTypes = async () => {
	return SensorType.find();
};

export const findSensorTypeById = async (id: string) => {
	return SensorType.findById(id);
};

export const createSensorType = async ({ name, key, description }: { name: string; key: string; description?: string }) => {
	return SensorType.create({ name, key, description });
};

export const updateSensorTypeById = async (id: string, { name, key, description }: { name?: string; key?: string; description?: string }) => {
	return SensorType.findByIdAndUpdate(id, { name, key, description }, { new: true });
};

export const deleteSensorTypeById = async (id: string) => {
	return SensorType.findByIdAndDelete(id);
};
