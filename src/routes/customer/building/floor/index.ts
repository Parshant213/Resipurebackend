import express from 'express';
import * as FloorHandlers from '../../../../handlers/floor';

const router = express.Router({ mergeParams: true });

router.route('/').get(FloorHandlers.getFloorsByBuildingId).post(FloorHandlers.createFloor);

router.route('/:floorId').get(FloorHandlers.getFloorById).put(FloorHandlers.updateFloor).delete(FloorHandlers.deleteFloor);

export default router;
