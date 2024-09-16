import express from 'express';
import * as iaqDataHandler from '../../handlers/iaqRawData';
const router: express.Router = express.Router();

router
    .post('/', iaqDataHandler.createIaqRawData)
export { router };
