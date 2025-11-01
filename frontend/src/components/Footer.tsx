export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} HOS Planner. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a className="hover:text-gray-900" href="#privacy">Privacy</a>
          <a className="hover:text-gray-900" href="#terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}
