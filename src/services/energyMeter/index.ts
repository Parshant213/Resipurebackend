import {
  IEnergyMeter,
  ConsumptionData,
  QueryParams,
  EnergyData,
} from "../../interfaces/IEnergyMeter";
import { energyMeter } from "../../models";
import { energyMeterRawData } from "../../models";

export const findEnergyMeterById = async (
  customerId: string,
  buildingId: string,
  energyMeterId: string,
) => {
  return energyMeter.findOne({ energyMeterId });
};

export const createEnergyMeter = async (energyMeterData: IEnergyMeter) => {
  return energyMeter.create(energyMeterData);
};

export const updateEnergyMeterById = async (
  customerId: string,
  buildingId: string,
  energyMeterId: string,
  energyMeterData: Partial<IEnergyMeter>,
) => {
  return energyMeter.findOneAndUpdate(
    { _id: energyMeterId, buildingId, customerId },
    energyMeterData,
    { new: true },
  );
};

export const deleteEnergyMeterById = async (
  customerId: string,
  buildingId: string,
  energyMeterId: string,
): Promise<void> => {
  await energyMeter.deleteOne({ _id: energyMeterId, buildingId, customerId });
};

export const getAllEnergyMeters = async (
  filters: { [key: string]: any } = {},
): Promise<IEnergyMeter[]> => {
  return energyMeter.find(filters);
};

export const getEnergyConsumption = async (
  sensorName: string,
  timeframe: "week" | "month" | "day",
  timeframe2: "hourly" | "daily"
): Promise<ConsumptionData[]> => {
  try {
    let startDate = new Date();
    let groupByFormat: string;

    if (timeframe === "month") {
      startDate.setDate(startDate.getDate() - 30);
      groupByFormat = "%Y-%m-%d"; 
    } else if (timeframe === "week") {
      startDate.setDate(startDate.getDate() - 7);
      if (timeframe2 === "hourly") {
        groupByFormat = "%Y-%m-%d %H:00"; 
      } else {
        groupByFormat = "%Y-%m-%d"; 
      }
    } else {
      startDate.setHours(startDate.getHours() - 24);
      groupByFormat = "%Y-%m-%d %H:00"; 
    } 

    const rawData = await energyMeterRawData.aggregate([
      {
        $match: {
          Sensor: sensorName,
          "Epoch time": { $gte: Math.floor(startDate.getTime() / 1000) },
        },
      },
      {
        $project: {
          date: {
            $toDate: { $multiply: ["$Epoch time", 1000] },
          },
          data: 1,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupByFormat, date: "$date" },
          },
          entries: { $push: "$data" },
        },
      },
      {
        $sort: { _id: -1 }, 
      },
    ]);

    const consumptionData: ConsumptionData[] = rawData.map((timeData: any) => {
      const firstEntry = timeData.entries.find((entry: any) => entry.WhR != null && entry.WhY != null && entry.WhB != null);
      const lastEntry = [...timeData.entries].reverse().find((entry: any) => entry.WhR != null && entry.WhY != null && entry.WhB != null);

      const diffWhR = firstEntry && lastEntry ? parseFloat(lastEntry.WhR) - parseFloat(firstEntry.WhR) : 0;
      const diffWhY = firstEntry && lastEntry ? parseFloat(lastEntry.WhY) - parseFloat(firstEntry.WhY) : 0;
      const diffWhB = firstEntry && lastEntry ? parseFloat(lastEntry.WhB) - parseFloat(firstEntry.WhB) : 0;
      const diffWhAvg = (diffWhR + diffWhY + diffWhB) / 3;

      // Convert _id (date string) to epoch time
      const epochTime = new Date(timeData._id).getTime() / 1000;

      return {
        date: timeData._id,
        epochTime: epochTime,
        consumption: {
          WhR: diffWhR,
          WhY: diffWhY,
          WhB: diffWhB,
          WhAvg: diffWhAvg,
        },
      };
    });

    return consumptionData;
  } catch (error) {
    console.error("Error fetching energy consumption:", error);
    throw new Error("Error fetching energy consumption");
  }
};