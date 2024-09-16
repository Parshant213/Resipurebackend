import { Request, Response, NextFunction } from 'express';
import * as FloorService from '../../services/floor';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { IFloor } from '../../interfaces/IFloor';

export const getFloorsByBuildingId = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, buildingId } = req.params;
    const floors = await FloorService.findFloorsByBuildingId(customerId, buildingId);

    res.status(HttpStatusCode.OK).json(floors);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const getFloorById = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, buildingId, floorId } = req.params;
    const floor = await FloorService.findFloorById(customerId, buildingId, floorId);

    if (!floor) {
      throw new APIError('Floor not found', HttpStatusCode.NOT_FOUND);
    }

    res.status(HttpStatusCode.OK).json(floor);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const createFloor = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const { buildingId, customerId } = req.params;
    const { name, layout } = req.body;

    if (!name || !customerId) {
      throw new APIError('Name and Customer ID are required fields', HttpStatusCode.BAD_REQUEST);
    }

    const floorData: IFloor = { name, customerId, buildingId, layout };
    const createdFloor = await FloorService.createFloor(floorData);
    res.status(HttpStatusCode.CREATED).json(createdFloor);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const updateFloor = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, buildingId, floorId } = req.params;
    const { name, layout } = req.body;

    if (!name && !layout) {
      throw new APIError('At least one field (Name, Layout) is required for update', HttpStatusCode.BAD_REQUEST);
    }

    const updatedFloor = await FloorService.updateFloorById(customerId, buildingId, floorId, { name, layout });

    if (!updatedFloor) {
      throw new APIError('Floor not found', HttpStatusCode.NOT_FOUND);
    }

    res.status(HttpStatusCode.OK).json(updatedFloor);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const deleteFloor = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, buildingId, floorId } = req.params;

    if (!floorId) {
      throw new APIError('Floor ID is required for deletion', HttpStatusCode.BAD_REQUEST);
    }

    await FloorService.deleteFloorById(customerId, buildingId, floorId);
    res.sendStatus(HttpStatusCode.NO_CONTENT);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};

export const getFloorsByCustomerId = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId } = req.params;
    const floors = await FloorService.findFloorsByCustomerId(customerId);

    res.status(HttpStatusCode.OK).json(floors);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    next(error);
  }
};