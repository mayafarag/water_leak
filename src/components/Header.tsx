import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header className="border-b border-cyan-100/20 bg-cyan-950/25 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg border border-cyan-100/20 bg-white/10 p-2 text-cyan-50 transition-colors hover:bg-white/20 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/20 text-cyan-100 ring-1 ring-cyan-200/25 shadow-lg shadow-cyan-950/20">
              <Waves className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white sm:text-xl">Smart Water Safety</h1>
              <p className="hidden text-xs font-medium text-cyan-50/70 sm:block">Leak detection, valves, and live pressure</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden items-center space-x-2 rounded-full border border-cyan-100/20 bg-white/10 px-3 py-2 text-cyan-50/100 md:flex">
            <User className="h-4 w-4" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 rounded-lg border border-red-200/30 bg-red-500/20 px-4 py-2 text-red-50 transition-colors hover:bg-red-500/25"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
