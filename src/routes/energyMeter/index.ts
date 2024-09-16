import express from "express";
import * as energyMeterHandler from "../../handlers/energyMeter";
import { get } from "http";

const router: express.Router = express.Router();

router
  .post("/", energyMeterHandler.createEnergyMeter)
  .patch("/:energyMeterId", energyMeterHandler.updateEnergyMeter)
  .get("/:energyMeterId", energyMeterHandler.getEnergyMeterById)
  .delete("/:energyMeterId", energyMeterHandler.deleteEnergyMeter)
  .get("/all", energyMeterHandler.getAllEnergyMetersHandler)
  .get("/display/total-consumption",energyMeterHandler.handleGetEnergyConsumption,);

export { router };
