export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 backdrop-blur-lg bg-gradient-to-r from-white/90 via-blue-50/90 to-indigo-50/90 border-b-2 border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black shadow-xl transform hover:rotate-12 transition-transform">
            🚛
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">HOS Planner</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
          <a className="text-gray-700 hover:text-blue-600 transition-colors uppercase tracking-wide" href="#features">Features</a>
          <a className="text-gray-700 hover:text-blue-600 transition-colors uppercase tracking-wide" href="#logs">Logs</a>
          <a className="text-gray-700 hover:text-blue-600 transition-colors uppercase tracking-wide" href="#about">About</a>
        </div>
      </div>
    </nav>
  );
}
