import express from 'express';
import { addSensorData } from '../../handlers/iot';
const router: express.Router = express.Router();

router.post('/add-sensor-data', addSensorData);

export default router;
