import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar } from 'lucide-react';
import PageLayout from '../components/PageLayout';
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

  const exportToCSV = (data: object[], filename: string) => {
    const rows = data.map(row => row as Record<string, unknown>);
    const headers = Object.keys(rows[0] || {});
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(header => {
        const value = row[header];
        if (
          value &&
          typeof value === 'object' &&
          'toDate' in value &&
          typeof value.toDate === 'function'
        ) {
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
    <PageLayout
      sidebarOpen={sidebarOpen}
      onMenuClick={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      title="History"
      subtitle="View historical data and control logs"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-slate-500" />
              <select
                value={filterDays}
                onChange={(e) => setFilterDays(Number(e.target.value))}
                className="field w-auto"
              >
                <option value={1}>Last 24 hours</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => exportToCSV(
              activeTab === 'readings' ? filteredReadings : filteredLogs,
              `${activeTab}-history-${new Date().toISOString().split('T')[0]}.csv`
            )}
            className="accent-button px-4 py-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-1 rounded-xl border border-cyan-100/20 bg-cyan-950/25 p-1">
          <button
            onClick={() => setActiveTab('readings')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'readings'
                ? 'bg-slate-950 text-white'
                : 'text-cyan-50/70 hover:text-white'
            }`}
          >
            Sensor Readings
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'controls'
                ? 'bg-slate-950 text-white'
                : 'text-cyan-50/70 hover:text-white'
            }`}
          >
            Control Logs
          </button>
        </div>

        {/* Content */}
        {activeTab === 'readings' ? (
          <div className="control-panel overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cyan-950/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Leak</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Fire</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Pressure</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Leak Valve</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Fire Valve</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">LED</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100/10">
                  {filteredReadings.map((reading) => (
                    <tr key={reading.id} className="hover:bg-cyan-50/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {reading.timestamp.toDate().toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {reading.leakState === 0 ? 'No' : 'Yes'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {reading.flameState === 0 ? 'No' : 'Yes'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {reading.pressureBar.toFixed(2)} bar
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {reading.relayLeakState === 1 ? 'Open' : 'Closed'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {reading.relayFireState === 1 ? 'Open' : 'Closed'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {reading.ledState === 1 ? 'On' : 'Off'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100 capitalize">
                        {reading.mode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="control-panel overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cyan-950/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-cyan-50/60 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100/10">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-cyan-50/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {log.timestamp.toDate().toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {log.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/100">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-50/60">
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
    </PageLayout>
  );
};

export default History;
