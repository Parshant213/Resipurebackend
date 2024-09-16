import express from 'express';
import * as zoneHandler from '../../handlers/zone';
const router: express.Router = express.Router();

router
    .post('/', zoneHandler.createZone)
    .patch('/:zoneId', zoneHandler.updateZone)
    .get('/', zoneHandler.getAllZones)
    .delete('/:zoneId', zoneHandler.deleteZone);

export { router };
