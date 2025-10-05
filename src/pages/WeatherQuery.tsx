import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, MapPin, Calendar, Loader2, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import WeatherCard from '@/components/WeatherCard';
import { predictWeather, WeatherPrediction } from '@/lib/weatherApi';

export default function WeatherQuery() {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [prediction, setPrediction] = useState<{prediction: string, fun_fact: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !date) return;

    setLoading(true);
    try {
      const result = await predictWeather(location);
      setPrediction(result);
    } catch (error) {
      console.error('Error predicting weather:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars-bg animate-pulse"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Globe
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Weather Prediction</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Query Form */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Plan Your Outdoor Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter city or coordinates"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date & Time
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Conditions...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Predict Weather
                    </>
                  )}
                </Button>
              </form>

              {/* Sensor Status */}
              <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Hardware Status</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-400">Raspberry Pi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-400">Arduino Nano</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-400">LM35 Sensor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-400">DHT22 Sensor</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {loading && (
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Conditions...
                  </CardTitle>
                </CardHeader>
              </Card>
            )}
            {prediction && (
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Weather Prediction for {location}
                  </CardTitle>
                  <p className="text-slate-400 text-sm">{date}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-white">{prediction.prediction}</p>
                  <p className="text-md text-slate-300">{prediction.fun_fact}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .stars-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(2px 2px at 20px 30px, #10b981, transparent),
                      radial-gradient(2px 2px at 40px 70px, #3b82f6, transparent),
                      radial-gradient(1px 1px at 90px 40px, #10b981, transparent),
                      radial-gradient(1px 1px at 130px 80px, #3b82f6, transparent),
                      radial-gradient(2px 2px at 160px 30px, #10b981, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
