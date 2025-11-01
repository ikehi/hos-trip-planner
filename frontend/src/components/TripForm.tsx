import { useState } from 'react';
import api from '../services/apiClient';
import type { TripPlanResponse } from '../types/api.types';

type Props = { onResult: (data: TripPlanResponse) => void };

export default function TripForm({ onResult }: Props) {
  const [currentLocation, setCurrentLocation] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [currentCycleUsed, setCurrentCycleUsed] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/plan/', {
        current_location: currentLocation,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        current_cycle_used: currentCycleUsed,
      });
      onResult(res.data as TripPlanResponse);
    } catch (err: any) {
      setError(err?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">📍 Current Location</label>
          <input className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all shadow-sm hover:shadow-md" placeholder="e.g., New York, NY" value={currentLocation} onChange={e => setCurrentLocation(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">📦 Pickup Location</label>
          <input className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all shadow-sm hover:shadow-md" placeholder="e.g., Columbus, OH" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">🏁 Dropoff Location</label>
          <input className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all shadow-sm hover:shadow-md" placeholder="e.g., Chicago, IL" value={dropoffLocation} onChange={e => setDropoffLocation(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">⏱️ Current Cycle Used (Hours)</label>
          <input className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all shadow-sm hover:shadow-md" placeholder="0.0" type="number" step="0.1" min="0" max="70" value={currentCycleUsed} onChange={e => setCurrentCycleUsed(parseFloat(e.target.value))} />
        </div>
      </div>
      <button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold py-6 rounded-2xl shadow-2xl hover:shadow-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-lg uppercase tracking-wider" disabled={loading}>
        {loading ? <span className="flex items-center justify-center gap-3"><span className="animate-spin">⚙️</span> Generating Trip Plan...</span> : '🚛 Plan My Trip'}
      </button>
      {error && <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-md font-semibold">❌ {error}</div>}
    </form>
  );
}
