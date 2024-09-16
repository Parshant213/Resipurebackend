import { Request, Response, NextFunction } from 'express';
import * as deviceTypeService from '../../services/deviceType';
import HttpStatusCode from '../../enums/HttpStatusCode';

export const getDeviceTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customers = await deviceTypeService.getTotalDevices();
        res.status(HttpStatusCode.OK).json(customers);
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    }
};

export const createDeviceType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { feilds, deviceTypeName } = req.body;

        if (!feilds || !deviceTypeName) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'feilds and deviceTypeName are required fields'});
        }

        const customer = await deviceTypeService.createDeviceType({ feilds, deviceTypeName });
        res.status(HttpStatusCode.CREATED).json(customer);
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    }
};

export const updateDeviceType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { deviceTypeId } = req.params;
        const { feilds, deviceTypeName } = req.body;

        if (!deviceTypeId) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'deviceTypeId is required for update' });
        }

        const updatedDeviceType = await deviceTypeService.updateDeviceTypeById(deviceTypeId, { feilds, deviceTypeName });
        res.status(HttpStatusCode.OK).json(updatedDeviceType);
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
    }
};