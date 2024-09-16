import express from 'express';
import * as iaqDeviceHandler from '../../handlers/iaqDevice';
const router: express.Router = express.Router();

router
    .post('/', iaqDeviceHandler.createIAQDevice)
    .patch('/:iaqDeviceId', iaqDeviceHandler.updateIAQDevice)
    .get('/:iaqDeviceId', iaqDeviceHandler.getIAQDeviceById)
    .delete('/:iaqDeviceId', iaqDeviceHandler.deleteIAQDevice)
    .get('/all', iaqDeviceHandler.getIAQDeviceById)
export { router };
