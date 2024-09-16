    // Define the structure for the transformed objects
  interface TransformedData {
    value: number;
    timestamp: string;
  }
  
  // Define the structure for the response object
  interface ResponseData {
    Temp: TransformedData[];
    HUM: TransformedData[];
    PM25: TransformedData[];
    PM10: TransformedData[];
    CO2: TransformedData[];
  }
  
  // Function to generate the transformed response
  export function CustomResponse(data: any): ResponseData {
    const Temp: TransformedData[] = [];
    const HUM: TransformedData[] = [];
    const PM25: TransformedData[] = [];
    const PM10: TransformedData[] = [];
    const CO2: TransformedData[] = [];
  
    // Process the data
    data.forEach((item:any) => {
      Temp.push({ value: item.TEMP, timestamp: new Date (item.timestamp).toLocaleString()});
      HUM.push({ value: item.HUM, timestamp: new Date (item.timestamp).toLocaleString()});
      PM25.push({ value: item.PM25, timestamp: new Date (item.timestamp).toLocaleString() });
      PM10.push({ value: item.PM10, timestamp: new Date (item.timestamp).toLocaleString()});
      CO2.push({ value: item.CO2, timestamp: new Date (item.timestamp).toLocaleString() });
    });
  
    // Return the response
    return {
      Temp,
      HUM,
      PM25,
      PM10,
      CO2
    };
  }

  