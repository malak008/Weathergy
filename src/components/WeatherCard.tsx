import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain,
  AlertTriangle 
} from 'lucide-react';

interface WeatherCondition {
  type: 'hot' | 'cold' | 'windy' | 'wet' | 'uncomfortable';
  likelihood: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface WeatherCardProps {
  location: string;
  date: string;
  conditions: WeatherCondition[];
}

const conditionIcons = {
  hot: Thermometer,
  cold: Thermometer,
  windy: Wind,
  wet: CloudRain,
  uncomfortable: AlertTriangle
};

const conditionColors = {
  hot: 'bg-red-500/20 text-red-400 border-red-500/30',
  cold: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  windy: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  wet: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  uncomfortable: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
};

const severityColors = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400'
};

export default function WeatherCard({ location, date, conditions }: WeatherCardProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Weather Prediction for {location}
        </CardTitle>
        <p className="text-slate-400 text-sm">{date}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditions.map((condition, index) => {
          const Icon = conditionIcons[condition.type];
          return (
            <div key={index} className={`p-4 rounded-lg border ${conditionColors[condition.type]}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium capitalize">
                    Very {condition.type}
                  </span>
                </div>
                <Badge className={severityColors[condition.severity]}>
                  {condition.likelihood}% chance
                </Badge>
              </div>
              <p className="text-sm opacity-80">{condition.description}</p>
              
              {/* Likelihood bar */}
              <div className="mt-3 w-full bg-slate-800 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    condition.severity === 'high' ? 'bg-red-500' :
                    condition.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${condition.likelihood}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}