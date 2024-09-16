import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as GatewayService from '../../services/gateway';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { IGateway } from '../../interfaces/IGateway';

interface GatewayQueryParams {
    customerId?: string;
    buildingId?: string;
    floorId?: string;
    zoneId?: string;
}

export const createGateway = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, customerId, buildingId, floorId, zoneId, ssid, pwd, deviceIdArray } = req.body;
  
      if (!name || !customerId || !buildingId || !floorId || !zoneId || !ssid || !pwd || !deviceIdArray) {
        throw new APIError( 'Name, Customer ID, Building ID, Floor ID, Zone ID, SSID, and Password and deviceIDArray are required fields',HttpStatusCode.BAD_REQUEST);
      }
  
      const gatewayData: IGateway = {
        name,
        customerId,
        buildingId,
        floorId,
        zoneId,
        ssid,
        pwd,
        deviceIdArray
      };
  
      const createdGateway = await GatewayService.createGateway(gatewayData);
      res.status(201).json({ 'message': 'Gateway created successfully', createdGateway});
    } catch (error) {
      next(error);
    }
  };

  export const deleteGateway = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gatewayId } = req.params;
  
      if (!gatewayId) {
        throw new APIError('Gateway ID is required', HttpStatusCode.BAD_REQUEST);
      }
  
      const deletedGateway = await GatewayService.deleteGatewayById(gatewayId);
  
      if (!deletedGateway) {
        throw new APIError('Gateway not found', HttpStatusCode.NOT_FOUND);
      }
  
      res.status(200).json({ 'message': 'Gateway deleted successfully', deletedGateway });
    } catch (error) {
      next(error);
    }
  };
  

export const updateGateway = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gatewayId } = req.params;
    const {name, customerId, buildingId, floorId, zoneId, ssid, pwd, deviceIdArray}= req.body;

    if(!name && !customerId && !buildingId && !floorId && !zoneId && !ssid && !pwd && !deviceIdArray){
      throw new APIError('At least one field (name, customerId, buildingId, floorId, zoneId, ssid, pwd, deviceIdArray) is required for update', HttpStatusCode.BAD_REQUEST);
    }
    
    const gatewayData: Partial<IGateway> = {
      name,
      customerId,
      buildingId,
      floorId,
      zoneId,
      ssid,
      pwd,
      deviceIdArray
    };

    if (!gatewayId) {
      throw new APIError('Gateway ID is required', HttpStatusCode.BAD_REQUEST);
    }

    const updatedGateway = await GatewayService.updateGatewayById(gatewayId, gatewayData);

    if (!updatedGateway) {
      throw new APIError('Gateway not found', HttpStatusCode.NOT_FOUND);
    }

    res.status(200).json({ 'message': 'Gateway updated successfully', updatedGateway });
  } catch (error) {
    next(error);
  }
};

export const getAllGateways = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, buildingId, floorId, zoneId } = req.query;

    const filters: Partial<IGateway> = {};
    
    if (customerId) filters.customerId = customerId as string;
    if (buildingId) filters.buildingId = buildingId as string;
    if (floorId) filters.floorId = floorId as string;
    if (zoneId) filters.zoneId = zoneId as string;

    const gateways = await GatewayService.getAllGateways(filters);

    if (!gateways || gateways.length === 0) {
      throw new APIError('No gateways found', HttpStatusCode.NOT_FOUND);
    }

    res.status(200).json(gateways);
  } catch (error) {
    next(error);
  }
};

export const getGatewayById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gatewayId } = req.params;

    if (!gatewayId) {
      throw new APIError('Gateway ID is required', HttpStatusCode.BAD_REQUEST);
    }

    const gateway = await GatewayService.getGatewayById(gatewayId);

    if (!gateway) {
      throw new APIError('Gateway not found', HttpStatusCode.NOT_FOUND);
    }

    res.status(200).json(gateway);
  } catch (error) {
    next(error);
  }
};
