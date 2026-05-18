import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Activity,
  History,
  Sliders,
  Settings,
} from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onMenuClick: () => void;
  onCloseSidebar: () => void;
  title: string;
  subtitle: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  sidebarOpen,
  onMenuClick,
  onCloseSidebar,
  title,
  subtitle,
}) => {
  const navigationItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/alerts', icon: Activity, label: 'Alerts' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/control', icon: Sliders, label: 'Control' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="app-surface relative min-h-screen overflow-hidden">
      <div className="water-orbit pointer-events-none" />
      <div className="water-waves pointer-events-none" />
      <div className="app-grid pointer-events-none absolute inset-0" />
      <div className="relative flex h-screen w-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={onCloseSidebar} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={onMenuClick} />

          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border-b border-cyan-100/20 bg-cyan-950/20 px-4 py-3 backdrop-blur-xl sm:px-6"
          >
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 whitespace-nowrap rounded-lg border px-4 py-2.5 transition-all duration-300 ${
                        isActive
                          ? 'border-cyan-200/60 bg-cyan-300/20 text-white shadow-lg shadow-cyan-400/10'
                          : 'border-cyan-100/20 bg-white/10 text-cyan-50/75 hover:border-cyan-100/40 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </motion.nav>

          {/* Page Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="px-4 pb-4 pt-6 sm:px-6"
          >
            <h2 className="mb-2 text-3xl font-black tracking-tight text-white drop-shadow-lg sm:text-4xl">
              {title}
            </h2>
            <p className="max-w-3xl text-base text-cyan-50/75 sm:text-lg">{subtitle}</p>
          </motion.div>

          <main className="flex-1 overflow-auto px-4 pb-6 sm:px-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
