import express from 'express';
import * as SensorTypeHandlers from '../../handlers/sensorType';

const router = express.Router();

router.route('/').get(SensorTypeHandlers.getSensorTypes).post(SensorTypeHandlers.createSensorType);

router.route('/:sensorTypeId').get(SensorTypeHandlers.getSensorTypeById).put(SensorTypeHandlers.updateSensorType).delete(SensorTypeHandlers.deleteSensorType);

export default router;
