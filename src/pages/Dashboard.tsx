import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Flame,
  Gauge,
  Zap,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatusCard from '../components/StatusCard';
import { useDeviceState } from '../hooks/useDeviceState';
import { firestoreService } from '../services/firestoreService';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { deviceState, loading, error, isOnline } = useDeviceState();

  useEffect(() => {
    const unsubscribe = firestoreService.onReadingsChange(() => {
      // Readings listener active for future features
    }, 10);

    return unsubscribe;
  }, []);

  const getLeakStatus = () => {
    if (!deviceState) return 'unknown';
    return deviceState.leakState === 0 ? 'safe' : 'danger';
  };

  const getFireStatus = () => {
    if (!deviceState) return 'unknown';
    return deviceState.flameState === 0 ? 'safe' : 'danger';
  };

  const getPressureStatus = () => {
    if (!deviceState) return 'unknown';
    // Assume safe if between 0-10 bar
    const pressure = deviceState.pressureBar;
    if (pressure < 0 || pressure > 10) return 'danger';
    if (pressure > 8) return 'warning';
    return 'safe';
  };

  const getValveStatus = (state: number) => {
    return state === 1 ? 'Open' : 'Closed';
  };

  const getLedStatus = () => {
    if (!deviceState) return 'unknown';
    return deviceState.ledState === 1 ? 'On' : 'Off';
  };

  const getConnectionStatus = () => {
    return isOnline ? 'safe' : 'danger';
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
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                <p className="text-cyan-200">Real-time monitoring of your smart safety system</p>
              </div>

              {/* Status Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <StatusCard
                  title="Leak Detection"
                  value={deviceState ? (deviceState.leakState === 0 ? 'No Leak' : 'Leak Detected') : 'Unknown'}
                  status={getLeakStatus()}
                  icon={Droplets}
                  isLoading={loading}
                />

                <StatusCard
                  title="Fire Detection"
                  value={deviceState ? (deviceState.flameState === 0 ? 'No Fire' : 'Fire Detected') : 'Unknown'}
                  status={getFireStatus()}
                  icon={Flame}
                  isLoading={loading}
                />

                <StatusCard
                  title="Pressure"
                  value={deviceState ? deviceState.pressureBar.toFixed(1) : '0.0'}
                  status={getPressureStatus()}
                  icon={Gauge}
                  unit="bar"
                  isLoading={loading}
                />

                <StatusCard
                  title="Leak Valve"
                  value={deviceState ? getValveStatus(deviceState.relayLeakState) : 'Unknown'}
                  status={deviceState?.relayLeakState === 0 ? 'safe' : 'warning'}
                  icon={Activity}
                  isLoading={loading}
                />

                <StatusCard
                  title="Fire Valve"
                  value={deviceState ? getValveStatus(deviceState.relayFireState) : 'Unknown'}
                  status={deviceState?.relayFireState === 1 ? 'warning' : 'safe'}
                  icon={Activity}
                  isLoading={loading}
                />

                <StatusCard
                  title="Warning LED"
                  value={deviceState ? getLedStatus() : 'Unknown'}
                  status={deviceState?.ledState === 1 ? 'warning' : 'safe'}
                  icon={Zap}
                  isLoading={loading}
                />

                <StatusCard
                  title="System Mode"
                  value={deviceState ? deviceState.mode : 'Unknown'}
                  status="safe"
                  icon={Activity}
                  isLoading={loading}
                />

                <StatusCard
                  title="Connection"
                  value={isOnline ? 'Online' : 'Offline'}
                  status={getConnectionStatus()}
                  icon={isOnline ? Wifi : WifiOff}
                  isLoading={loading}
                />
              </div>

              {/* Live Data Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Live Sensor Data</h3>

                {error && (
                  <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                {deviceState ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-cyan-200 mb-1">Leak Sensor</div>
                      <div className="text-lg font-semibold text-white">
                        {deviceState.leakState === 0 ? 'No Leak (LOW)' : 'Leak Detected (HIGH)'}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-cyan-200 mb-1">Flame Sensor</div>
                      <div className="text-lg font-semibold text-white">
                        {deviceState.flameState === 0 ? 'No Fire (0)' : 'Fire Detected (1)'}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-cyan-200 mb-1">Pressure Raw</div>
                      <div className="text-lg font-semibold text-white">
                        {deviceState.pressureRaw}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-cyan-200 mb-1">Pressure (Bar)</div>
                      <div className="text-lg font-semibold text-white">
                        {deviceState.pressureBar.toFixed(2)} bar
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-cyan-200 mb-1">Leak Valve</div>
                      <div className="text-lg font-semibold text-white">
                        {deviceState.relayLeakState === 1 ? 'Open (HIGH)' : 'Closed (LOW)'}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-cyan-200 mb-1">Fire Valve</div>
                      <div className="text-lg font-semibold text-white">
                        {deviceState.relayFireState === 1 ? 'Open (HIGH)' : 'Closed (LOW)'}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-cyan-200 mb-1">LED Status</div>
                      <div className="text-lg font-semibold text-white">
                        {deviceState.ledState === 1 ? 'ON' : 'OFF'}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-cyan-200 mb-1">Last Update</div>
                      <div className="text-lg font-semibold text-white">
                        {new Date(deviceState.updatedAt).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-cyan-200 mb-1">Device Status</div>
                      <div className="text-lg font-semibold text-white">
                        {isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-cyan-200">Waiting for device data...</div>
                  </div>
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;