import express from 'express';
import * as BuildingHandlers from '../../../handlers/building';
import floorAdminRouter from './floor';

const router = express.Router({ mergeParams: true });

router.route('/').get(BuildingHandlers.getBuildingsByCustomerId).post(BuildingHandlers.createBuilding);

router.route('/:buildingId').get(BuildingHandlers.getBuildingById).put(BuildingHandlers.updateBuilding).delete(BuildingHandlers.deleteBuilding);

router.use('/:buildingId/floors', floorAdminRouter);

export default router;
