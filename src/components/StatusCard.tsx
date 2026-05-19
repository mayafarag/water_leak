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
  iconColor?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  status,
  icon: Icon,
  unit,
  isLoading = false,
  iconColor,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'safe':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5 }}
      className="control-panel group relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:border-cyan-100/45 hover:shadow-xl hover:shadow-cyan-950/20"
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${getStatusColor()}`} />
      <div className="mb-5 flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconColor ?? getStatusColor()} text-white shadow-lg shadow-slate-900/10`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
          status === 'safe' ? 'bg-emerald-300/20 text-emerald-100' :
          status === 'warning' ? 'bg-amber-300/20 text-amber-100' :
          status === 'danger' ? 'bg-red-300/20 text-red-100' :
          'bg-cyan-100/10 text-cyan-100'
        }`}>
          {getStatusText()}
        </span>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-cyan-50/70">{title}</h3>
        <div className="flex items-baseline">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-cyan-100/20"></div>
          ) : (
            <span className="text-2xl font-black tracking-tight text-white">
              {value}{unit && <span className="ml-1 text-sm font-semibold text-cyan-50/60">{unit}</span>}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;
