import { Request, Response, NextFunction } from 'express';
import * as IaqRawDataService from '../../services/iaqData';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { IIiaqRawData } from '../../interfaces/IIaqRawData';

export const createIaqRawData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { MQTTID, TEMP, HUM, CO2, VOC, PM1, PM2_5, PM10, AQI, INDEX, RSSI, timestamp } = req.body;
        if(!MQTTID){
            throw new APIError( "mqttid is a required field",HttpStatusCode.BAD_REQUEST);
        }

        const iaqDataData: IIiaqRawData = {
            MQTTID,
            TEMP,
            HUM,
            CO2,
            VOC,
            PM1,
            PM2_5,
            PM10,
            AQI,
            INDEX,
            RSSI,
            timestamp,
        };

        const createdIaqRawData = await IaqRawDataService.createIaqRawData(iaqDataData);
        res.status(201).json({"message":"IaqRawData created successfully", createdIaqRawData});
    } catch (error) {
        next(error);
    }
};
