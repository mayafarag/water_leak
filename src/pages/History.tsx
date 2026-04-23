import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { firestoreService, SensorReading, ControlLog } from '../services/firestoreService';

const History: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [controlLogs, setControlLogs] = useState<ControlLog[]>([]);
  const [activeTab, setActiveTab] = useState<'readings' | 'controls'>('readings');
  const [filterDays, setFilterDays] = useState(7);

  useEffect(() => {
    const unsubscribeReadings = firestoreService.onReadingsChange((data) => {
      setReadings(data);
    }, 1000);

    const unsubscribeLogs = firestoreService.onControlLogsChange((data) => {
      setControlLogs(data);
    }, 1000);

    return () => {
      unsubscribeReadings();
      unsubscribeLogs();
    };
  }, []);

  const filteredReadings = readings.filter(reading => {
    const daysDiff = (Date.now() - reading.timestamp.toDate().getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= filterDays;
  });

  const filteredLogs = controlLogs.filter(log => {
    const daysDiff = (Date.now() - log.timestamp.toDate().getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= filterDays;
  });

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (value && typeof value.toDate === 'function') {
          return value.toDate().toISOString();
        }
        return JSON.stringify(value);
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
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
                  <h2 className="text-3xl font-bold text-white mb-2">History</h2>
                  <p className="text-cyan-200">View historical data and control logs</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-cyan-200" />
                    <select
                      value={filterDays}
                      onChange={(e) => setFilterDays(Number(e.target.value))}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <option value={1}>Last 24 hours</option>
                      <option value={7}>Last 7 days</option>
                      <option value={30}>Last 30 days</option>
                      <option value={90}>Last 90 days</option>
                    </select>
                  </div>

                  <button
                    onClick={() => exportToCSV(
                      activeTab === 'readings' ? filteredReadings : filteredLogs,
                      `${activeTab}-history-${new Date().toISOString().split('T')[0]}.csv`
                    )}
                    className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('readings')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    activeTab === 'readings'
                      ? 'bg-cyan-500 text-white'
                      : 'text-cyan-200 hover:text-white'
                  }`}
                >
                  Sensor Readings
                </button>
                <button
                  onClick={() => setActiveTab('controls')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    activeTab === 'controls'
                      ? 'bg-cyan-500 text-white'
                      : 'text-cyan-200 hover:text-white'
                  }`}
                >
                  Control Logs
                </button>
              </div>

              {/* Content */}
              {activeTab === 'readings' ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Leak</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Fire</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Pressure</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Leak Valve</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Fire Valve</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">LED</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Mode</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredReadings.map((reading) => (
                          <tr key={reading.id} className="hover:bg-white/5">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {reading.timestamp.toDate().toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {reading.leakState === 0 ? 'No' : 'Yes'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {reading.flameState === 0 ? 'No' : 'Yes'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {reading.pressureBar.toFixed(2)} bar
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {reading.relayLeakState === 1 ? 'Open' : 'Closed'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {reading.relayFireState === 1 ? 'Open' : 'Closed'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {reading.ledState === 1 ? 'On' : 'Off'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white capitalize">
                              {reading.mode}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Action</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-white/5">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {log.timestamp.toDate().toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {log.userEmail}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {log.action}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-200">
                              {log.details ? JSON.stringify(log.details) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default History;