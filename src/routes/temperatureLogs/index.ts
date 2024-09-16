import express from 'express';
import * as TemperatureLogsHandlers from '../../handlers/temperatureLogs';

const router = express.Router({ mergeParams: true});

router.route('/')
  .get(TemperatureLogsHandlers.getTemperatureLogsByTimeRange);

export default router;