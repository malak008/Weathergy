import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Thermometer, 
  CloudRain, 
  Wind,
  ArrowRight,
  Satellite,
  Activity,
  Search,
  X,
  Loader2,
} from 'lucide-react';
import Globe from '@/components/Globe';
import { predictWeather, WeatherPrediction } from '@/lib/weatherApi';
import WeatherChart from '@/components/WeatherChart';
import { downloadCsv } from '@/lib/utils';

export default function Index() {
  const [quickLocation, setQuickLocation] = useState('');
  const [quickDate, setQuickDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prediction, setPrediction] = useState<WeatherPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetPrediction = async () => {
    if (!quickLocation) return;
    setLoading(true);
    try {
      const result = await predictWeather(quickLocation);
      setPrediction(result);
    } catch (error) {
      console.error('Error predicting weather:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
        <div className="stars-animation"></div>
        <div className="nebula-effect"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                <Satellite className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Weathergy</h1>
                <p className="text-sm text-slate-400">AI-Powered Weather Prediction</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm bg-slate-900/50 px-3 py-2 rounded-full border border-green-500/20">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Live Sensors Active</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 p-6">
          {/* Left Side - Interactive Globe */}
          <div className="flex flex-col justify-center">
            <div className="h-96 lg:h-[500px] relative bg-gradient-to-b from-transparent via-blue-950/20 to-transparent rounded-2xl overflow-hidden">
              <Globe />
              
              {/* Globe Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <Card className="bg-slate-900/90 border-slate-700/50 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Real-time Earth monitoring</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Drag to rotate • Scroll to zoom
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Side - Content & Quick Form */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Predict Weather
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 animate-pulse">
                    Before You Go
                  </span>
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Plan your outdoor adventures with confidence. Our AI-powered system analyzes 
                  real-time sensor data to predict adverse weather conditions.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                onClick={() => setIsModalOpen(true)}
              >
                <Search className="w-5 h-5 mr-2" />
                Get Weather Prediction
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="bg-slate-900/80 border-green-500/30 w-full max-w-4xl m-4">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-green-400" />
                  Quick Weather Check
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                  </div>
                ) : prediction ? (
                  <div className="space-y-4">
                    <p className="text-lg text-white">{prediction.prediction}</p>
                    <p className="text-md text-slate-300">{prediction.fun_fact}</p>
                    <WeatherChart data={prediction.raw_data} />
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                      onClick={() => downloadCsv(prediction.raw_data, quickLocation)}
                    >
                      Download CSV
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="quick-location"
                        className="text-slate-300 flex items-center gap-1"
                      >
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="quick-location"
                        type="text"
                        placeholder="Enter city name"
                        value={quickLocation}
                        onChange={(e) => setQuickLocation(e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                    <div className="space-y-2 border-b border-slate-700 pb-4">
                      <Label
                        htmlFor="quick-date"
                        className="text-slate-300 flex items-center gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        Date
                      </Label>
                      <Input
                        id="quick-date"
                        type="date"
                        value={quickDate}
                        onChange={(e) => setQuickDate(e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                  </>
                )}

                <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 border-b border-slate-700 pb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Hardware Status</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-400">DHT11: Temp & Humidity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-400">LDR: Sun & Light</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-400">Wind Direction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-400">Wind Meter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-400">ESP32</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-400">Flask API Backend</span>
                    </div>
                  </div>
                </div>

                {!prediction && <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                  onClick={handleGetPrediction}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Get Weather Prediction
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-orange-500/30 transition-all duration-300 group">
                  <CardContent className="p-4 text-center">
                    <Thermometer className="w-8 h-8 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-white mb-1">Temperature</h3>
                    <p className="text-xs text-slate-400">Very hot & cold alerts</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all duration-300 group">
                  <CardContent className="p-4 text-center">
                    <CloudRain className="w-8 h-8 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-white mb-1">Precipitation</h3>
                    <p className="text-xs text-slate-400">Very wet conditions</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-gray-500/30 transition-all duration-300 group">
                  <CardContent className="p-4 text-center">
                    <Wind className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-white mb-1">Wind Speed</h3>
                    <p className="text-xs text-slate-400">Very windy alerts</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-yellow-500/30 transition-all duration-300 group">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-white mb-1">Comfort Index</h3>
                    <p className="text-xs text-slate-400">Very uncomfortable</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Hardware Info */}
            <Card className="bg-gradient-to-r from-slate-900/70 to-blue-900/40 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  IoT Hardware Integration
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">DHT11: Temp & Humidity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">LDR: Sun & Light</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">Wind Direction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">Wind Meter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">ESP32</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">Flask API Backend</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stars-animation {
          position: absolute;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(2px 2px at 20px 30px, #10b981, transparent),
            radial-gradient(2px 2px at 40px 70px, #3b82f6, transparent),
            radial-gradient(1px 1px at 90px 40px, #10b981, transparent),
            radial-gradient(1px 1px at 130px 80px, #3b82f6, transparent),
            radial-gradient(2px 2px at 160px 30px, #10b981, transparent),
            radial-gradient(1px 1px at 200px 50px, #8b5cf6, transparent),
            radial-gradient(2px 2px at 250px 90px, #10b981, transparent),
            radial-gradient(1px 1px at 300px 20px, #3b82f6, transparent);
          background-repeat: repeat;
          background-size: 350px 200px;
          animation: sparkle 25s linear infinite;
          opacity: 0.6;
        }

        .nebula-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(ellipse 800px 400px at 400px 300px, rgba(16, 185, 129, 0.1), transparent),
            radial-gradient(ellipse 600px 300px at 800px 100px, rgba(59, 130, 246, 0.08), transparent),
            radial-gradient(ellipse 400px 200px at 200px 500px, rgba(139, 92, 246, 0.06), transparent);
          animation: nebula-drift 30s ease-in-out infinite alternate;
        }

        @keyframes sparkle {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-350px) translateY(-200px); }
        }

        @keyframes nebula-drift {
          0% { transform: translateX(-20px) translateY(-10px) scale(1); }
          100% { transform: translateX(20px) translateY(10px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
