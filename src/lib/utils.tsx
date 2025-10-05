import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { RawData } from './weatherApi';
import Papa from 'papaparse';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadCsv = (rawData: RawData, cityName: string) => {
  if (!rawData || !rawData.data) return;

  const dataForCsv: any[] = [];
  const headers = ['datetime'];
  const parameters: {[key: string]: number[]} = {};

  rawData.data.forEach(param => {
      headers.push(param.parameter);
      parameters[param.parameter] = param.coordinates[0].dates.map(d => d.value);
  });

  const dates = rawData.data[0].coordinates[0].dates.map(d => d.date);

  for (let i = 0; i < dates.length; i++) {
      const row: any = { datetime: dates[i] };
      for (const paramName in parameters) {
          row[paramName] = parameters[paramName][i];
      }
      dataForCsv.push(row);
  }

  const csv = Papa.unparse(dataForCsv);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${cityName}_weather_data.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
