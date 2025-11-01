import { useState } from 'react';
import TripForm from '../components/TripForm';
import MapDisplay from '../components/MapDisplay';
import LogSheetViewer from '../components/LogSheetViewer';
import type { TripPlanResponse } from '../types/api.types';

export default function HomePage() {
  const [result, setResult] = useState<TripPlanResponse | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 mb-6 shadow-lg transform hover:scale-110 transition-transform">
            <span className="text-4xl">🚛</span>
          </div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 mb-4 tracking-tight">
            HOS Trip Planner
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Professional Hours of Service Compliance Planning for Property-Carrying Drivers
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="px-4 py-2 bg-white rounded-full shadow-md">
              <span className="text-blue-600 font-bold">✓</span> FMCSA Compliant
            </div>
            <div className="px-4 py-2 bg-white rounded-full shadow-md">
              <span className="text-indigo-600 font-bold">✓</span> Automatic Breaks
            </div>
            <div className="px-4 py-2 bg-white rounded-full shadow-md">
              <span className="text-purple-600 font-bold">✓</span> ELD Log Sheets
            </div>
          </div>
        </header>
        
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12 border border-gray-100 hover:shadow-3xl transition-shadow">
          <TripForm onResult={setResult} />
        </div>
        
        {result && (
          <>
            <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Route Map</h2>
              </div>
              <MapDisplay routeData={result?.route_data} />
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Generated Daily Logs</h2>
              </div>
              <LogSheetViewer dailyLogs={result.daily_logs} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
