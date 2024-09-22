export const MODEL_NAME = {
  CUSTOMER: "Customer",
  BUILDING: "Building",
  FLOOR: "Floor",
  SENSOR: "Sensor",
  SENSOR_TYPE: "SensorType",
  SEAT: "Seat",
  ROOM: "Room",
  USER: "User",
  USER_LOGIN_LOG: "UserLoginLLog",
  SENSOR_DATA: "SensorData",
  DEVICE_TYPE: "DeviceType",
  INDOOR_RAW_DATA: "IndoorRawData",
  OUTDOOR_RAW_DATA: "OutdoorRawData",
  IAQ_RAW_DATA: "IaqRawData",
  OCCUPANCY: "occupancy",
  IAQ_DEVICE: "iaqDevice",
  OUTDOOR_IAQ_DEVICE : 'outdoorIaqDevice',
  ZONE: "zone",
  ENERGY_METER: "energyMeter",
  GATEWAY: "gateway",
  MODELS: "models",
  INDOOR_DEVICES:"indoorDevices",
  OUTDOOR_DEVICES: "outdoorDevices",
  THERMOPILE_RAW_DATA: "occupancy",//"ThermopileRawData",
  SWITCH_RAW_DATA: "switchRawData",
	OCCUPANCY_DEVICE: "OccupancyDevice", 
	THERMOPILE_DEVICE: "ThermopileDevice", 
  ENERGY_METER_RAW_DATA: "energyMeterRawData",
  AHU_DEVICE:"AhuDevice",
  AHU_RAW_DATA:"AhuRawData",
  BTU_RAW_DATA:"BtuRawData",
  BTU_DEVICE:"BtuDevice",
  TEMPERATURE_LOGS: "TemperatureLogs",
}
export const DEFAULT_PORT = 4444;

export const DB_OPTIONS = { MAX_POOL_SIZE: 5, MAX_IDLE_TIME_MS: 30000 };

export const API_TIMEOUT = 20000;

export const JWT_TOKEN_EXPIRY = "12h";
export const ALLOWED_URLS = [
  "/api/v1/login",
  "/api/v1/admin-login",
  "/api/v1/forgot-password",
  "/api/v1/reset-password",
];

export const USER_PERMISSION_KEY = "permission-$userId";
