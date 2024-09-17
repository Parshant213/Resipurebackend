import { Request, Response, NextFunction } from "express";
import * as deviceService from "../../services/devices";
import { CustomResponse } from "../../utils/resipureResponse";
export const fetchLatestDevicData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const getDeviceData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { deviceTypeId, sensorName, timeFrameInHours } = req.query as {
      [key: string]: string;
    };

    const timeFrame = parseInt(timeFrameInHours, 10);

    if (!sensorName || isNaN(timeFrame) || !deviceTypeId) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    const sensorData = await deviceService.getSensorDataByTimeFrame({
      deviceTypeId,
      sensorName,
      timeFrameInHours: timeFrame,
    });
    const modifiedData = CustomResponse(sensorData);
    const result = [{date:new Date() , data:modifiedData}];
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const getWeeklyDeviceData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { date, deviceTypeId, sensorName } = req.query as {
    [key: string]: string;
  };
  if (!sensorName || !date || !deviceTypeId) {
    return res.status(400).json({ message: "Invalid query parameters" });
  }
  let currentDate = new Date(date);
  let nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);
  let weekDayEpoches = [];
  for (let i = 0; i < 7; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - i);
    weekDayEpoches.push(prevDate.getTime() + 19800000);
    console.log(weekDayEpoches[i]);
  }

  const sensorData = await Promise.all([
    deviceService.getSensorDataByEpoch(
      deviceTypeId,
      sensorName,
      weekDayEpoches[0],
      nextDate.getTime()
    ),
    deviceService.getSensorDataByEpoch(
      deviceTypeId,
      sensorName,
      weekDayEpoches[1],
      weekDayEpoches[0]
    ),
    deviceService.getSensorDataByEpoch(
      deviceTypeId,
      sensorName,
      weekDayEpoches[2],
      weekDayEpoches[1]
    ),
    deviceService.getSensorDataByEpoch(
      deviceTypeId,
      sensorName,
      weekDayEpoches[3],
      weekDayEpoches[2]
    ),
    deviceService.getSensorDataByEpoch(
      deviceTypeId,
      sensorName,
      weekDayEpoches[4],
      weekDayEpoches[3]
    ),
    deviceService.getSensorDataByEpoch(
      deviceTypeId,
      sensorName,
      weekDayEpoches[5],
      weekDayEpoches[4]
    ),
    deviceService.getSensorDataByEpoch(
      deviceTypeId,
      sensorName,
      weekDayEpoches[6],
      weekDayEpoches[5]
    ),
  ]);
  const result = [
    {
      date: new Date(weekDayEpoches[0]).toLocaleDateString(),
      data: CustomResponse(sensorData[0]),
    },
    {
      date: new Date(weekDayEpoches[1]).toLocaleDateString(),
      data: CustomResponse(sensorData[1]),
    },
    {
      date: new Date(weekDayEpoches[2]).toLocaleDateString(),
      data: CustomResponse(sensorData[2]),
    },
    {
      date: new Date(weekDayEpoches[3]).toLocaleDateString(),
      data: CustomResponse(sensorData[3]),
    },
    {
      date: new Date(weekDayEpoches[4]).toLocaleDateString(),
      data: CustomResponse(sensorData[4]),
    },
    {
      date: new Date(weekDayEpoches[5]).toLocaleDateString(),
      data: CustomResponse(sensorData[5]),
    },
    {
      date: new Date(weekDayEpoches[6]).toLocaleDateString(),
      data: CustomResponse(sensorData[6]),
    },
  ];

  res.json(result);
};
