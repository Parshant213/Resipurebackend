import express from 'express';
import * as buildingHandler from '../../handlers/building';

const buildingRouter: express.Router = express.Router();

buildingRouter
    .post('/', buildingHandler.createBuilding)
    .delete('/:buildingId', buildingHandler.deleteBuilding)
    .put('/:buildingId', buildingHandler.updateBuilding)
    .get('/customer/:customerId', buildingHandler.getBuildingsByCustomerId)
    .get('/:buildingId', buildingHandler.getBuildingById);

export { buildingRouter };