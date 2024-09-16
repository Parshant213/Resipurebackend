import { Request, Response, NextFunction } from 'express';
import * as ZoneService from '../../services/zone';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { IZone } from '../../interfaces/IZone';

export const getAllZones = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { zoneId, customerId, buildingId, floorId } = req.query;

        const filters: any = {};
        
        if (zoneId) filters._id = zoneId;
        if (customerId) filters.customerId = customerId;
        if (buildingId) filters.buildingId = buildingId;
        if (floorId) filters.floorId = floorId;

        const zones = await ZoneService.getAllZones(filters);

        res.status(200).json({ message: 'Zones retrieved successfully', zones });
    } catch (error) {
        next(error);
    }
};


export const createZone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, customerId, buildingId, floorId, alias } = req.body;

        if (!name || !customerId || !buildingId || !floorId || !alias) {
            throw new APIError('Name, Customer ID, Building ID, Floor ID, and Alias are required fields', HttpStatusCode.BAD_REQUEST);
        }

        const zoneData: IZone = {
            name,
            customerId,
            buildingId,
            floorId,
            alias
        };

        const createdZone = await ZoneService.createZone(zoneData);
        res.status(201).json({ 'message': 'Zone created successfully' , createdZone} );
    } catch (error) {
        next(error);
    }
};

export const updateZone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { zoneId } = req.params;
        const { name, alias } = req.body;

        if (!name && !alias) {
            throw new APIError('At least one field(name, alias) is required for update', HttpStatusCode.BAD_REQUEST);
        }

        if (!zoneId) {
            throw new APIError('Zone ID is required', HttpStatusCode.BAD_REQUEST);
        }

        const zoneData: Partial<IZone> = { name, alias };
        const updatedZone = await ZoneService.updateZoneById(zoneId, zoneData);

        if (!updatedZone) {
            throw new APIError('Zone not found', HttpStatusCode.NOT_FOUND);
        }

        res.status(200).json({ message: 'Zone updated successfully', updatedZone });
    } catch (error) {
        next(error);
    }
};




export const deleteZone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { zoneId } = req.params;

        if (!zoneId) {
            throw new APIError('Zone ID is required for deletion', HttpStatusCode.BAD_REQUEST);
        }

        const deletedZone = await ZoneService.deleteZoneById(zoneId);

        if (!deletedZone) {
            throw new APIError('Zone not found', HttpStatusCode.NOT_FOUND);
        }

        res.status(200).json({ message: 'Zone deleted successfully', deletedZone });
    } catch (error) {
        next(error);
    }
};



