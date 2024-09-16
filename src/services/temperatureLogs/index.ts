import { temperatureLogs } from '../../models';

export const findTemperatureLogsByTimeRange = async (startTime: number, endTime: number) => {
  return temperatureLogs.find({
    epochTime: { $gte: startTime, $lte: endTime }
  }).sort({ epochTime: 1 });
};
