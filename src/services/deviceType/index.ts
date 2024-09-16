import { ConnectionPoolClosedEvent, ObjectId } from 'mongodb';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { deviceType } from '../../models';
import { MODEL_NAME } from '@/constants';

export const getTotalDevices = async () => {
    try {
        let filter: any = {};
        const deviceTypes = await deviceType.find(filter)

        return deviceTypes;
    } catch (error) {
        throw error;
    }
};


export const createDeviceType = async (DeviceData: any) => {
    try {
        const newDeviceType = await deviceType.create(DeviceData);
        return newDeviceType;
    } catch (error) {
        throw error;
    }
};

export const updateDeviceTypeById = async (id: string, { feilds, deviceTypeName }: { feilds?: string; deviceTypeName?: string; }) => {
    try {
        return deviceType.findByIdAndUpdate(id, { feilds, deviceTypeName }, { new: true });
    } catch (error) {
        throw error;
    }
};