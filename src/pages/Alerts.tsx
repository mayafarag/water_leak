import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Droplets, Flame, Gauge, Filter } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { firestoreService, Alert } from '../services/firestoreService';

type AlertFilter = 'all' | 'active' | 'resolved';

const Alerts: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<AlertFilter>('active');

  const handleFilterChange = (value: string) => {
    if (value === 'all' || value === 'active' || value === 'resolved') {
      setFilter(value);
    }
  };

  useEffect(() => {
    const includeResolved = filter === 'all';
    const unsubscribe = firestoreService.onAlertsChange((alertData) => {
      let filteredAlerts = alertData;
      if (filter === 'active') {
        filteredAlerts = alertData.filter(alert => !alert.resolved);
      } else if (filter === 'resolved') {
        filteredAlerts = alertData.filter(alert => alert.resolved);
      }
      setAlerts(filteredAlerts);
    }, includeResolved);

    return unsubscribe;
  }, [filter]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'low':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leak':
        return Droplets;
      case 'fire':
        return Flame;
      case 'pressure':
        return Gauge;
      default:
        return AlertTriangle;
    }
  };

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onMenuClick={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      title="Alerts"
      subtitle="Monitor system alerts and notifications"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <Filter className="mr-2 inline h-5 w-5 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="field w-auto"
            >
              <option value="active">Active Alerts</option>
              <option value="resolved">Resolved</option>
              <option value="all">All Alerts</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="control-panel rounded-2xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">No Alerts</h3>
              <p className="text-cyan-50/70">
                {filter === 'active' ? 'All systems are operating normally.' : 'No alerts found.'}
              </p>
            </div>
          ) : (
            alerts.map((alert) => {
              const TypeIcon = getTypeIcon(alert.type);
              return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ x: 4 }}
                className="control-panel rounded-2xl p-6 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-cyan-50/65 capitalize">{alert.type} Alert</span>
                        {alert.resolved && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-100">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <p className="text-white font-bold mb-2">{alert.message}</p>
                      <div className="flex items-center text-sm text-cyan-50/65">
                        <Clock className="w-4 h-4 mr-1" />
                        {alert.timestamp.toDate().toLocaleString()}
                        {alert.resolvedAt && (
                          <span className="ml-4">
                            Resolved: {alert.resolvedAt.toDate().toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
            })
          )}
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Alerts;
