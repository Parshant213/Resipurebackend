import { Request, Response, NextFunction } from "express";
import * as IAQDeviceService from "../../services/iaqDevice";
import APIError from "../../classes/APIError";
import HttpStatusCode from "../../enums/HttpStatusCode";
import { IIiaqDevice } from "../../interfaces/IIaqDevice";

export const getIAQDeviceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId, buildingId, iaqDeviceId } = req.params;
    const iaqDevice = await IAQDeviceService.findIAQDeviceById(
      customerId,
      buildingId,
      iaqDeviceId
    );

    if (!iaqDevice) {
      throw new APIError("IAQ Device not found", HttpStatusCode.NOT_FOUND);
    }

    res.json(iaqDevice);
  } catch (error) {
    next(error);
  }
};

export const createIAQDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      throw new APIError(
        "Name, Customer ID, Building ID, zoneId and Floor ID are required fields",
        HttpStatusCode.BAD_REQUEST
      );
    }

    const iaqDeviceData: IIiaqDevice = {
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

    const createdIAQDevice = await IAQDeviceService.createIAQDevice(
      iaqDeviceData
    );
    res.status(201).json(createdIAQDevice);
  } catch (error) {
    next(error);
  }
};

export const updateIAQDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId, buildingId, iaqDeviceId } = req.params;
    const { name, calibrationValues, limits, parameters } = req.body;

    if (!name && !calibrationValues && !limits && !parameters) {
      throw new APIError(
        "At least one field (Name, Calibration Values, Limits, Parameters) is required for update",
        HttpStatusCode.BAD_REQUEST
      );
    }

    const updatedIAQDevice = await IAQDeviceService.updateIAQDeviceById(
      customerId,
      buildingId,
      iaqDeviceId,
      { name, calibrationValues, limits, parameters }
    );

    if (!updatedIAQDevice) {
      throw new APIError("IAQ Device not found", HttpStatusCode.NOT_FOUND);
    }

    res.json(updatedIAQDevice);
  } catch (error) {
    next(error);
  }
};

export const deleteIAQDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId, buildingId, iaqDeviceId } = req.params;

    if (!iaqDeviceId) {
      throw new APIError(
        "IAQ Device ID is required for deletion",
        HttpStatusCode.BAD_REQUEST
      );
    }

    await IAQDeviceService.deleteIAQDeviceById(
      customerId,
      buildingId,
      iaqDeviceId
    );
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const updateControls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { deviceId, controls } = req.body;
    if (!deviceId || !controls) {
      throw new APIError("Incomplete Parameters", HttpStatusCode.BAD_REQUEST);
    }

    const updatedControls = await IAQDeviceService.updateResipureDeviceControl(
      deviceId,
      controls
    );
    if(updatedControls){
          res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};
