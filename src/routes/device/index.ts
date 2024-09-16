import { Router } from 'express';
import { getRealtimeBTU, getBTUTrendHandler,getLatestEnergyMeterHandler,getThermopileRawTable,getLatestOccupancyHandler,updateDeviceHandler, getDeviceshandlerRealtime, getDeviceOccupancyHandler, getSensorDataByTimeFrameHandler, createDevicehandler, getSensorDataAveragesHandler, getDeviceshandler, getDeviceStats, sendThermopileRawTherm, deleteDeviceHandler, getAHUTrendHandler, getRealtimeAHU } from '../../handlers/devices';

const router: Router = Router();
const adminRouter: Router = Router({ mergeParams: true });

adminRouter
    .get('/sens-data', getSensorDataByTimeFrameHandler)
    .get('/energyMeter/realtime', getLatestEnergyMeterHandler)
    .get('/all', getDeviceshandler)
    .get('/indoor-realtime', getDeviceshandlerRealtime)
    .get("/sens-aggr", getSensorDataAveragesHandler)
    .get("/occupancy", getDeviceOccupancyHandler) 
    .post('/', createDevicehandler)
    .patch('/:id', updateDeviceHandler)
    .get("/fetchDeviceStats", getDeviceStats)
    .get("/getOccupancyNumber/:deviceId",getLatestOccupancyHandler)
    .get("/getRawDataTherm",getThermopileRawTable)
    .get("/BTU-Trends",getBTUTrendHandler)
    .get("/BTU-realtime",getRealtimeBTU)
    .post("/sendRawDataTherm",sendThermopileRawTherm)
    .delete("/:id", deleteDeviceHandler)
    .get("/AHU-Trends",getAHUTrendHandler)
    .get("/AHU-realtime",getRealtimeAHU);

export { router, adminRouter };