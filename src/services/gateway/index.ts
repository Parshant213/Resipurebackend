import { gateway } from '../../models';
import { IGateway } from '../../interfaces/IGateway';
import mongoose from 'mongoose';

export const createGateway = async (gatewayData: IGateway) => {
    return gateway.create(gatewayData);
};

export const deleteGatewayById = async (gatewayId: string) => {
    return gateway.findByIdAndDelete(gatewayId);
};

export const updateGatewayById = async (gatewayId: string, gatewayData: Partial<IGateway>) => {
  return gateway.findByIdAndUpdate(gatewayId, gatewayData, { new: true });
};

export const getAllGateways = async (filters: Partial<IGateway>) => {
  return gateway.find(filters);
};

export const getGatewayById = async (gatewayId: string): Promise<IGateway | null> => {
  return gateway.findById(gatewayId);
};
