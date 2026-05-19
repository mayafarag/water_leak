import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  History,
  Settings,
  Sliders,
  X,
  Radio,
  Waves
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/control', icon: Sliders, label: 'Manual Control' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 shrink-0 border-r border-cyan-200/20 bg-slate-950/70 text-white shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative overflow-hidden border-b border-cyan-100/10 p-6">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />
          <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/20 text-cyan-100 ring-1 ring-cyan-200/20">
              <Waves className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-black text-white">HomeGuard</h2>
            <p className="text-xs text-cyan-50/60 mt-0.5">Smart Water And Fire System</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              <Radio className="h-3.5 w-3.5" />
              Monitoring live
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? 'border border-cyan-200/40 bg-cyan-300/20 text-cyan-50 shadow-lg shadow-cyan-400/10'
                        : 'text-cyan-100/70 hover:bg-cyan-50/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
