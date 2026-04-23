import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { firestoreService, Alert } from '../services/firestoreService';

const Alerts: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

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
        return '💧';
      case 'fire':
        return '🔥';
      case 'pressure':
        return '📊';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:ml-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Alerts</h2>
                  <p className="text-cyan-200">Monitor system alerts and notifications</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-cyan-200" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="active">Active Alerts</option>
                    <option value="resolved">Resolved</option>
                    <option value="all">All Alerts</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Alerts</h3>
                    <p className="text-cyan-200">
                      {filter === 'active' ? 'All systems are operating normally.' : 'No alerts found.'}
                    </p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.toUpperCase()}
                              </span>
                              <span className="text-sm text-cyan-200 capitalize">{alert.type} Alert</span>
                              {alert.resolved && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-100">
                                  RESOLVED
                                </span>
                              )}
                            </div>
                            <p className="text-white font-medium mb-2">{alert.message}</p>
                            <div className="flex items-center text-sm text-cyan-200">
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
                  ))
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Alerts;