import { Request, Response, NextFunction } from 'express';
import * as TemperatureLogsService from '../../services/temperatureLogs';

export const getTemperatureLogsByTimeRange = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'Start time and end time are required parameters' });
    }

    const logs = await TemperatureLogsService.findTemperatureLogsByTimeRange(Number(startTime), Number(endTime));
    
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
