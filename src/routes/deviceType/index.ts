import express from 'express';
import * as deviceTyprHandler from '../../handlers/deviceType';
const router: express.Router = express.Router();

router
    .post('/', deviceTyprHandler.createDeviceType)
    .patch('/:deviceTypeId', deviceTyprHandler.updateDeviceType)
    .get('/all', deviceTyprHandler.getDeviceTypes)

export { router };
