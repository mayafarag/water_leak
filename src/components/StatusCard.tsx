import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  status: 'safe' | 'warning' | 'danger' | 'unknown';
  icon: LucideIcon;
  unit?: string;
  isLoading?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  status,
  icon: Icon,
  unit,
  isLoading = false
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'safe':
        return 'from-green-500 to-emerald-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'danger':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'safe':
        return 'Safe';
      case 'warning':
        return 'Warning';
      case 'danger':
        return 'Danger';
      default:
        return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 bg-gradient-to-r ${getStatusColor()} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'safe' ? 'bg-green-500/20 text-green-100' :
          status === 'warning' ? 'bg-yellow-500/20 text-yellow-100' :
          status === 'danger' ? 'bg-red-500/20 text-red-100' :
          'bg-gray-500/20 text-gray-100'
        }`}>
          {getStatusText()}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-medium text-cyan-200 mb-1">{title}</h3>
        <div className="flex items-baseline">
          {isLoading ? (
            <div className="h-8 w-16 bg-white/20 rounded animate-pulse"></div>
          ) : (
            <span className="text-2xl font-bold text-white">
              {value}{unit && <span className="text-sm text-cyan-200 ml-1">{unit}</span>}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;