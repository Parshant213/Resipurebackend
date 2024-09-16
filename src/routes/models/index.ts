import express from 'express';
import * as modelHandler from '../../handlers/models';
const router: express.Router = express.Router();

router
    .post('/', modelHandler.createModel)
    .patch('/:modelId', modelHandler.updateModel)
    .get('/:modelId', modelHandler.getModelById)
    .delete('/:modelId', modelHandler.deleteModel);

export { router };
