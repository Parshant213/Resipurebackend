import { Router } from "express";
import {
  getDeviceData,
  getWeeklyDeviceData,
} from "../../handlers/resipureApp/index";
import { resipureCustomerInfo } from "../../handlers/customer";
import { updateControls } from "../../handlers/iaqDevice";
import { permissionCheck, } from '../../middleware/permission-middleware';

const router: Router = Router();
router.get("/:customerId",resipureCustomerInfo)
  .get("/hourlyData",getDeviceData)
  .get("/dailyData",getDeviceData)
  .get("/weeklyData", getWeeklyDeviceData)
  .post("/updateControls",updateControls);

export { router };
