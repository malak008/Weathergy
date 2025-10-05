// Mock weather prediction API for demonstration
// In production, this would connect to your Flask backend and hardware sensors

export interface WeatherCondition {
    type: 'hot' | 'cold' | 'windy' | 'wet' | 'uncomfortable';
    likelihood: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }
  
  export interface WeatherPrediction {
    location: string;
    date: string;
    conditions: WeatherCondition[];
    sensorData?: {
      temperature: number;
      humidity: number;
      pressure: number;
    };
  }
  
  // Mock sensor data (would come from Raspberry Pi/Arduino sensors)
  const getMockSensorData = () => ({
    temperature: Math.random() * 40 + 10, // 10-50°C
    humidity: Math.random() * 100, // 0-100%
    pressure: Math.random() * 100 + 950 // 950-1050 hPa
  });
  
  // Mock weather prediction logic
  export const predictWeather = async (
    location: string, 
    date: Date
  ): Promise<WeatherPrediction> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sensorData = getMockSensorData();
    const month = date.getMonth();
    const isWinter = month >= 11 || month <= 2;
    const isSummer = month >= 5 && month <= 8;
    
    const conditions: WeatherCondition[] = [];
    
    // Temperature predictions based on season and sensor data
    if (isSummer && sensorData.temperature > 30) {
      conditions.push({
        type: 'hot',
        likelihood: Math.min(90, sensorData.temperature * 2),
        severity: sensorData.temperature > 35 ? 'high' : 'medium',
        description: `High temperatures expected. Current sensor reading: ${sensorData.temperature.toFixed(1)}°C`
      });
    }
    
    if (isWinter && sensorData.temperature < 15) {
      conditions.push({
        type: 'cold',
        likelihood: Math.min(85, (20 - sensorData.temperature) * 4),
        severity: sensorData.temperature < 5 ? 'high' : 'medium',
        description: `Cold conditions likely. Current sensor reading: ${sensorData.temperature.toFixed(1)}°C`
      });
    }
    
    // Humidity-based predictions
    if (sensorData.humidity > 80) {
      conditions.push({
        type: 'wet',
        likelihood: Math.min(95, sensorData.humidity),
        severity: sensorData.humidity > 90 ? 'high' : 'medium',
        description: `High humidity detected. Rain likely. Humidity: ${sensorData.humidity.toFixed(1)}%`
      });
    }
    
    // Wind predictions (mock based on pressure changes)
    if (sensorData.pressure < 980) {
      conditions.push({
        type: 'windy',
        likelihood: Math.min(80, (1000 - sensorData.pressure) * 2),
        severity: sensorData.pressure < 970 ? 'high' : 'medium',
        description: `Low pressure system detected. Strong winds possible. Pressure: ${sensorData.pressure.toFixed(1)} hPa`
      });
    }
    
    // Uncomfortable conditions (combination of factors)
    const discomfortIndex = (sensorData.temperature * 0.4) + (sensorData.humidity * 0.6);
    if (discomfortIndex > 60) {
      conditions.push({
        type: 'uncomfortable',
        likelihood: Math.min(85, discomfortIndex),
        severity: discomfortIndex > 75 ? 'high' : 'medium',
        description: `High discomfort index due to temperature and humidity combination`
      });
    }
    
    // If no adverse conditions, add a positive note
    if (conditions.length === 0) {
      conditions.push({
        type: 'uncomfortable',
        likelihood: 15,
        severity: 'low',
        description: 'Conditions appear favorable for outdoor activities!'
      });
    }
    
    return {
      location,
      date: date.toLocaleDateString(),
      conditions,
      sensorData
    };
  };
  
  // Function to simulate hardware sensor readings
  export const getSensorReadings = async () => {
    // In production, this would communicate with your Raspberry Pi/Arduino setup
    return getMockSensorData();
  };
