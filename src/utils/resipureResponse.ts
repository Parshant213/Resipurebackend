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
      Temp.push({ value: item.TEMP, timestamp:item.timestamp});
      HUM.push({ value: item.HUM, timestamp:item.timestamp});
      PM25.push({ value: item.PM25, timestamp: item.timestamp });
      PM10.push({ value: item.PM10, timestamp:item.timestamp});
      CO2.push({ value: item.CO2, timestamp: item.timestamp });
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

  