import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { CUSTOMER_TYPE, Customer } from '../../models';
import { User } from '../../models';
import { indoorDevices } from '../../models';
import { outdoorDevices } from '../../models';
import { ThermopileDevice } from '../../models';
import { energyMeter } from '../../models';
import { iaqDevice, deviceType } from '../../models';
import { MODEL_NAME } from "../../constants";
import {
  fetchLatestDataForResipure,
  getResipureDeviceControl,
} from "../iaqDevice";

export const findCustomers = async () => {
  return Customer.find();
};

export const findCustomerForDistributor = async (distributorId: string) => {
  const distributor = Customer.findOne({
    _id: distributorId,
    type: CUSTOMER_TYPE.DISTRIBUTOR,
  });
  if (!distributor) {
    throw new APIError(
      "You are not a distributor!",
      HttpStatusCode.BAD_REQUEST
    );
  }
  return Customer.find({ distributorId });
};

export const findCustomerById = async (id: string) => {
  return Customer.findById(id);
};

export const findDistributorForCustomer = async (
  customerId: string,
  distributorId: string
) => {
  return Customer.findOne({
    _id: customerId,
    distributorId,
    type: CUSTOMER_TYPE.DISTRIBUTOR,
  });
};

export const createCustomer = async ({
  name,
  type,
  distributorId,
  locationId,
  logo,
}: {
  name: string;
  type: string;
  distributorId?: string;
  locationId?: string;
  logo?: string;
}) => {
  return Customer.create({ name, type, distributorId, locationId, logo });
};

export const updateCustomerById = async (
  id: string,
  {
    name,
    type,
    distributorId,
    locationId,
    logo,
  }: {
    name?: string;
    type?: string;
    distributorId?: string;
    locationId?: string;
    logo?: string;
  }
) => {
  return Customer.findByIdAndUpdate(
    id,
    { name, type, distributorId, locationId, logo },
    { new: true }
  );
};

export const deleteCustomerById = async (id: string) => {
  return Customer.findByIdAndDelete(id);
};

export const getCustomerCounts = async () => {
  const [
    totalCustomers,
    totalVrvVrfIndoorDevices,
    totalVrvVrfOutdoorDevices,
    totalThermopileDevices,
    totalEnergyMeters,
    totalIaqDevices,
    totalUsers,
  ] = await Promise.all([
    Customer.countDocuments(),
    indoorDevices.countDocuments(),
    outdoorDevices.countDocuments(),
    ThermopileDevice.countDocuments(),
    energyMeter.countDocuments(),
    iaqDevice.countDocuments(),
    User.countDocuments(),
  ]);

  return {
    totalCustomers,
    totalDevices:
      totalVrvVrfIndoorDevices +
      totalVrvVrfOutdoorDevices +
      totalThermopileDevices +
      totalEnergyMeters +
      totalIaqDevices,
    totalUsers,
  };
};

export const getTotalCustomersByDeviceType = async (deviceTypeId?: string) => {
  try {
    if (deviceTypeId) {
      const deviceTypeData = await deviceType.findById(deviceTypeId, {
        deviceTypeName: 1,
      });
      if (!deviceTypeData) {
        throw new Error("Device Type Not Found");
      }

            const deviceTypename = deviceTypeData.deviceTypeName;
            const deviceMap = {
                "VRV/VRF Indoor": indoorDevices,
                "VRV/VRF Outdoor": outdoorDevices,
                "IAQ": iaqDevice,
                "Occupancy": ThermopileDevice,
                "Energy Meter": energyMeter,
            };

      const DeviceModel = deviceMap[deviceTypename as keyof typeof deviceMap];
      if (!DeviceModel) {
        throw new Error(
          `Device Type ${deviceTypeData.deviceTypeName} not supported`
        );
      }

      const customers = await Customer.find({
        "devices.deviceType": deviceTypename,
      }).distinct("_id");

      return customers.length;
    } else {
      const customers = await Customer.find().distinct("_id");
      return customers.length;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchCustomerListInfo = async () => {
  return await Customer.aggregate([
    {
      $lookup: {
        from: MODEL_NAME.USER,
        localField: "_id",
        foreignField: "customerId",
        as: "users",
      },
    },
    {
      $lookup: {
        from: MODEL_NAME.INDOOR_DEVICES,
        localField: "_id",
        foreignField: "customerId",
        as: "indoorDevices",
      },
    },
    {
      $lookup: {
        from: MODEL_NAME.OUTDOOR_DEVICES,
        localField: "_id",
        foreignField: "customerId",
        as: "outdoorDevices",
      },
    },
    {
      $lookup: {
        from: MODEL_NAME.THERMOPILE_DEVICE,
        localField: "_id",
        foreignField: "customerId",
        as: "thermoPileDevice",
      },
    },
    {
      $lookup: {
        from: MODEL_NAME.ENERGY_METER,
        localField: "_id",
        foreignField: "customerId",
        as: "energyMeter",
      },
    },
    {
      $lookup: {
        from: MODEL_NAME.IAQ_DEVICE,
        localField: "_id",
        foreignField: "customerId",
        as: "iaqDevice",
      },
    },
    {
      $project: {
        name: 1,
        type: 1,
        createdAt: 1,
        updatedAt: 1,
        userCount: { $size: "$users" },
        totalDeviceCount: {
          $add: [
            { $size: "$indoorDevices" },
            { $size: "$outdoorDevices" },
            { $size: "$thermoPileDevice" },
            { $size: "$energyMeter" },
            { $size: "$iaqDevice" },
          ],
        },
      },
    },
  ]);
};

export const resipureCustomerSummary = async (customerId: string) => {
  const [customerData, deviceData] = await Promise.all([
    Customer.findById(customerId),
    fetchLatestDataForResipure(customerId),
  ]);
  const deviceId = deviceData?.iaqList?.[0]?.name;
  const deviceControls = deviceId
    ? await getResipureDeviceControl(deviceId)
    : null;
  return { customerData, deviceData, deviceControls };
};
