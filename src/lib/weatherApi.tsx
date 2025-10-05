export interface RawData {
  data: {
    parameter: string;
    coordinates: {
      dates: {
        date: string;
        value: number;
      }[];
    }[];
  }[];
}

export interface WeatherPrediction {
  prediction: string;
  fun_fact: string;
  raw_data: RawData;
}

export const predictWeather = async (
  location: string
): Promise<WeatherPrediction> => {
  const response = await fetch(
    `https://plopy.pythonanywhere.com/predict?city=${location}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  const data = await response.json();

  const predictionData = JSON.parse(data.output);

  return {
    prediction: predictionData.prediction,
    fun_fact: predictionData.fun_fact,
    raw_data: data.raw_data,
  };
};
