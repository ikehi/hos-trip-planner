import type { DailyLog } from '../types/api.types';

type Props = { dailyLogs: DailyLog[] };

export default function LogSheetViewer({ dailyLogs }: Props) {
  return (
    <div className="space-y-8">
      {dailyLogs.map((log) => (
        <div key={log.day_number} className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-8 py-6">
            <h3 className="text-3xl font-black text-white mb-1">Day {log.day_number}</h3>
            <p className="text-indigo-100 font-medium">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 grid grid-cols-3 gap-6">
            <div className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 mb-2 text-4xl">📏</div>
              <div className="text-gray-600 font-bold text-xs uppercase tracking-wider mb-2">Total Miles</div>
              <div className="text-3xl font-black text-blue-700">{log.total_miles_driven.toFixed(0)}</div>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-indigo-600 mb-2 text-4xl">🛣️</div>
              <div className="text-gray-600 font-bold text-xs uppercase tracking-wider mb-2">Driving Time</div>
              <div className="text-3xl font-black text-indigo-700">{log.total_driving_time.toFixed(1)}h</div>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-purple-600 mb-2 text-4xl">⏰</div>
              <div className="text-gray-600 font-bold text-xs uppercase tracking-wider mb-2">On-Duty Time</div>
              <div className="text-3xl font-black text-purple-700">{log.total_on_duty_time.toFixed(1)}h</div>
            </div>
          </div>
          <div className="p-8 bg-white">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-2xl border-2 border-gray-100">
              <img src={log.log_image_url} alt={`Generated log for day ${log.day_number}`} className="w-full border-2 border-gray-200 rounded-xl shadow-inner" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
