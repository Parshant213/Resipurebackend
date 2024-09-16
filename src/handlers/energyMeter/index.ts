import { Request, Response, NextFunction } from "express";
import * as EnergyMeterService from "../../services/energyMeter";
import APIError from "../../classes/APIError";
import HttpStatusCode from "../../enums/HttpStatusCode";
import { IEnergyMeter } from "../../interfaces/IEnergyMeter";
import { getEnergyConsumption } from "../../services/energyMeter";
import { QueryParams } from "../../interfaces/IEnergyMeter";

export const getAllEnergyMetersHandler = async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    const filters = req.query as { [key: string]: any };
    const energyMeters = await EnergyMeterService.getAllEnergyMeters(filters);

    res.status(HttpStatusCode.OK).json(energyMeters);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const getEnergyMeterById = async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    const { customerId, buildingId, energyMeterId } = req.params;
    const energyMeter = await EnergyMeterService.findEnergyMeterById(
      customerId,
      buildingId,
      energyMeterId,
    );

    if (!energyMeter) {
      throw new APIError("Energy Meter not found", HttpStatusCode.NOT_FOUND);
    }

    res.status(HttpStatusCode.OK).json(energyMeter);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const createEnergyMeter = async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    const {
      name,
      customerId,
      buildingId,
      floorId,
      zoneId,
      calibrationValues,
      limits,
      parameters,
    } = req.body;

    if (!name || !customerId || !buildingId || !zoneId || !floorId) {
      throw new APIError("Name, Customer ID, Building ID, Zone ID, and Floor ID are required fields",HttpStatusCode.BAD_REQUEST,);
    }

    const energyMeterData: IEnergyMeter = {
      name,
      customerId,
      buildingId,
      floorId,
      zoneId,
      calibrationValues: calibrationValues || {},
      limits: limits || {},
      parameters: parameters || [],
      dataUpdatedAt: new Date(),
    };

    const createdEnergyMeter =
      await EnergyMeterService.createEnergyMeter(energyMeterData);
    res.status(HttpStatusCode.CREATED).json(createdEnergyMeter);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const updateEnergyMeter = async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    const { customerId, buildingId, energyMeterId } = req.params;
    const { name, calibrationValues, limits, parameters } = req.body;

    if (!name && !calibrationValues && !limits && !parameters) {
      throw new APIError("At least one field (Name, Calibration Values, Limits, Parameters) is required for update",HttpStatusCode.BAD_REQUEST,);
    }

    const updatedEnergyMeter = await EnergyMeterService.updateEnergyMeterById(
      customerId,
      buildingId,
      energyMeterId,
      { name, calibrationValues, limits, parameters },
    );

    if (!updatedEnergyMeter) {
      throw new APIError("Energy Meter not found", HttpStatusCode.NOT_FOUND);
    }

    res.status(HttpStatusCode.OK).json(updatedEnergyMeter);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const deleteEnergyMeter = async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    const { customerId, buildingId, energyMeterId } = req.params;

    if (!energyMeterId) {
      throw new APIError("Energy Meter ID is required for deletion",HttpStatusCode.BAD_REQUEST,);
    }

    await EnergyMeterService.deleteEnergyMeterById(
      customerId,
      buildingId,
      energyMeterId,
    );
    res.sendStatus(HttpStatusCode.NO_CONTENT);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const handleGetEnergyConsumption = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response,
): Promise<void> => {
  const sensorName =
    typeof req.query.sensorName === "string" ? req.query.sensorName : "";
  const timeframe =
    typeof req.query.timeframe === "string" ? req.query.timeframe : "";
  const timeframe2 =
    typeof req.query.timeframe2 === "string" ? req.query.timeframe2 : "";

  if (!sensorName || !timeframe || !timeframe2) {
    res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ message: "sensorName, timeframe and timeframe2 are required" });
    return;
  }

  try {
    if (timeframe !== "week" && timeframe !== "month" && timeframe !== "day") {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Invalid timeframe. Must be day, week or month" });
      return;
    }

    const data = await getEnergyConsumption(sensorName, timeframe, timeframe2);
    res.status(HttpStatusCode.OK).json(data); 
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: (error as Error).message });
  }
};