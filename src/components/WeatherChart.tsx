import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { RawData } from '@/lib/weatherApi';

interface WeatherChartProps {
  data: RawData;
}

const processDataForChart = (rawData: RawData) => {
  if (!rawData || !rawData.data) return [];

  const dataByDate: { [key: string]: any } = {};

  rawData.data.forEach((param) => {
    const paramName = param.parameter;
    param.coordinates[0].dates.forEach((d) => {
      const date = new Date(d.date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      if (!dataByDate[d.date]) {
        dataByDate[d.date] = { date };
      }
      dataByDate[d.date][paramName] = d.value;
    });
  });

  return Object.values(dataByDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(d => ({...d, date: new Date(d.date).toLocaleTimeString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric'})}));
};

const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
  const chartData = processDataForChart(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="w-full h-48">
        <h3 className="text-white text-center mb-2 text-sm">Temperature (°C)</h3>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fontSize: 10 }} />
            <YAxis stroke="#A0AEC0" tick={{ fontSize: 10 }}/>
            <Tooltip
              contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748' }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Line type="monotone" dataKey="t_2m:C" name="Temp (°C)" stroke="#F6AD55" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full h-48">
        <h3 className="text-white text-center mb-2 text-sm">Humidity (%)</h3>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fontSize: 10 }} />
            <YAxis stroke="#A0AEC0" tick={{ fontSize: 10 }}/>
            <Tooltip
              contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748' }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Line type="monotone" dataKey="relative_humidity_2m:p" name="Humidity (%)" stroke="#4299E1" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full h-48">
        <h3 className="text-white text-center mb-2 text-sm">Pressure (hPa)</h3>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fontSize: 10 }} />
            <YAxis stroke="#A0AEC0" domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10 }}/>
            <Tooltip
              contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748' }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Line type="monotone" dataKey="msl_pressure:hPa" name="Pressure (hPa)" stroke="#48BB78" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full h-48">
        <h3 className="text-white text-center mb-2 text-sm">Rain Probability (%)</h3>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fontSize: 10 }} />
            <YAxis stroke="#A0AEC0" tick={{ fontSize: 10 }}/>
            <Tooltip
              contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748' }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Line type="monotone" dataKey="prob_precip_1h:p" name="Rain Prob. (%)" stroke="#9F7AEA" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;
