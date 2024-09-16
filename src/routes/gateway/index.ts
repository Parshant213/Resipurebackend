import express from 'express';
import * as gatewayHandler from '../../handlers/gateway';
const router: express.Router = express.Router();

router.post('/', gatewayHandler.createGateway);
router.delete('/:gatewayId', gatewayHandler.deleteGateway);
router.patch('/:gatewayId', gatewayHandler.updateGateway);
router.get('/all', gatewayHandler.getAllGateways);
router.get('/:gatewayId', gatewayHandler.getGatewayById);

export { router };