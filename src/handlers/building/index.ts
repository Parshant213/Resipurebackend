import { Request, Response, NextFunction } from 'express';
import * as BuildingService from '../../services/building';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { IBuilding } from '../../interfaces/IBuilding'; 

export const createBuilding = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, customerId, timezone, timezoneOffset, costPerSqFt, costOfEnergy, imageLink, locationName } = req.body;

        if (!name || !customerId) {
            throw new APIError('Name and Customer ID are required fields', HttpStatusCode.BAD_REQUEST);
        }

        const buildingData: IBuilding = {
            name,
            customerId,
            timezone,
            timezoneOffset,
            costPerSqFt,
            costOfEnergy,
            imageLink,
            locationName
        };

        const createdBuilding = await BuildingService.createBuilding(buildingData);
        res.status(201).json(createdBuilding);
    } catch (error) {
        next(error);
    }
};

export const deleteBuilding = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { buildingId } = req.params;

        if (!buildingId) {
            throw new APIError('Building ID is required for deletion', HttpStatusCode.BAD_REQUEST);
        }

        const building =await BuildingService.getBuildingById(buildingId);
        if (!building) {
            throw new APIError('building ID not found', HttpStatusCode.NOT_FOUND);
        }

        await BuildingService.deleteBuilding(buildingId);
        res.status(200).json({ 'message': 'Building deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getBuildingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { buildingId } = req.params;
        const building = await BuildingService.getBuildingById(buildingId);

        if (!building) {
            throw new APIError('Building not found', HttpStatusCode.NOT_FOUND);
        }

        res.status(200).json(building);
    } catch (error) {
        next(error);
    }
};

export const getBuildingsByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customerId } = req.params;
        const buildings = await BuildingService.getBuildingsByCustomerId(customerId);
        if (!buildings || buildings.length === 0){
            throw new APIError('customer not found', HttpStatusCode.NOT_FOUND);
        }

        res.status(200).json(buildings);
    } catch (error) {
        next(error);
    }
};

export const updateBuilding = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { buildingId } = req.params;
        const { name, timezone, timezoneOffset, costPerSqFt, costOfEnergy, imageLink, locationName } = req.body;

        if (!name && !timezone && !timezoneOffset && !costPerSqFt && !costOfEnergy && !imageLink && !locationName) {
            throw new APIError('At least one field is required for update', HttpStatusCode.BAD_REQUEST);
        }

        const updateData: Partial<IBuilding> = {
            name,
            timezone,
            timezoneOffset,
            costPerSqFt,
            costOfEnergy,
            imageLink,
            locationName
        };

        const updatedBuilding = await BuildingService.updateBuilding(buildingId, updateData);

        if (!updatedBuilding) {
            throw new APIError('Building not found', HttpStatusCode.NOT_FOUND);
        }

        res.status(200).json(updatedBuilding);
    } catch (error) {
        next(error);
    }
};