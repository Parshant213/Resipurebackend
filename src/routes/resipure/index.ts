import { Router } from "express";
import {
  getDeviceData,
  getWeeklyDeviceData,
} from "../../handlers/resipureApp/index";
import { resipureCustomerInfo } from "../../handlers/customer";
import { updateControls } from "../../handlers/iaqDevice";
import { permissionCheck, } from '../../middleware/permission-middleware';

const router: Router = Router();
router
  .get("/hourlyData",getDeviceData)
  .get("/dailyData",getDeviceData)
  .get("/weeklyData", getWeeklyDeviceData)
  .post("/updateControls",updateControls)
  .get("/:customerId",resipureCustomerInfo);

export { router };
