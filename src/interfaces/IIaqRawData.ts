import { ObjectId } from 'mongoose';

export interface IIiaqRawData {
    MQTTID?: String;
    TEMP?: Number;
    HUM?: Number;
    CO2?: Number;
    VOC?: Number;
    PM1?: Number;
    PM2_5?: Number;
    PM10?: Number;
    AQI?: Number;
    INDEX?: Number;
    RSSI?: Number;
    timestamp?: Number;
}

