export interface WeatherPrediction {
  prediction: string;
  fun_fact: string;
}

export const predictWeather = async (
  location: string
): Promise<WeatherPrediction> => {
  const response = await fetch(
    `https://plopy.pythonanywhere.com/predict?city=${location}`
  );
  const data = await response.json();
  const output = JSON.parse(data.output.replace(/```json\n|\n```/g, ''));
  return output;
};
