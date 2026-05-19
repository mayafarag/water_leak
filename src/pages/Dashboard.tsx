import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Flame,
  Gauge,
  Zap,
  Activity,
  Wifi,
  WifiOff,
  ShieldCheck,
  TimerReset
} from 'lucide-react';
import PageLayout from '../components/PageLayout';
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
    return deviceState.sensors.leak ? 'danger' : 'safe';
  };

  const getFireStatus = () => {
    if (!deviceState) return 'unknown';
    return deviceState.sensors.fire ? 'danger' : 'safe';
  };

  const getPressureStatus = () => {
    if (!deviceState) return 'unknown';
    const status = deviceState.sensors.pressureStatus;
    if (status === 'critical') return 'danger';
    if (status === 'warning') return 'warning';
    return 'safe';
  };

  const getValveStatus = (isOverride: boolean) => {
    return isOverride ? 'Open (Override)' : 'Auto Mode';
  };

  const getConnectionStatus = () => {
    return isOnline ? 'safe' : 'danger';
  };

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onMenuClick={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      title="Dashboard"
      subtitle="Real-time monitoring of your smart safety system"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <motion.div
            whileHover={{ y: -3 }}
            className="panel relative overflow-hidden rounded-3xl p-6"
          >
            <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-300/20 px-3 py-1 text-xs font-bold text-cyan-50 ring-1 ring-cyan-100/20">
                  <ShieldCheck className="h-4 w-4 text-cyan-200" />
                  {isOnline ? 'Protected and listening' : 'Device connection needs attention'}
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">System overview</h3>
                <p className="mt-2 max-w-2xl text-sm text-cyan-50/70">
                  Sensors, pressure, valves, and command state update live from the device.
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-100/20 bg-white/10 p-4 text-left shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-50/70">
                  <TimerReset className="h-4 w-4" />
                  Last update
                </div>
                <div className="text-xl font-black text-white">
                  {deviceState ? new Date(deviceState.updatedAt).toLocaleTimeString() : 'Waiting'}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className={`rounded-2xl border p-6 shadow-lg ${
              isOnline
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'border-red-200 bg-red-50 text-red-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider opacity-70">Connection</p>
                <h3 className="mt-1 text-3xl font-black">{isOnline ? 'Online' : 'Offline'}</h3>
              </div>
              {isOnline ? <Wifi className="h-10 w-10" /> : <WifiOff className="h-10 w-10" />}
            </div>
          </motion.div>
        </div>

              <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <StatusCard
                  title="Leak Detection"
                  value={deviceState ? (deviceState.sensors.leak ? 'Leak Detected' : 'No Leak') : 'Unknown'}
                  status={getLeakStatus()}
                  icon={Droplets}
                  iconColor="bg-blue-500"
                  isLoading={loading}
                />

                <StatusCard
                  title="Fire Detection"
                  value={deviceState ? (deviceState.sensors.fire ? 'Fire Detected' : 'No Fire') : 'Unknown'}
                  status={getFireStatus()}
                  icon={Flame}
                  iconColor="bg-red-500"
                  isLoading={loading}
                />

                <StatusCard
                  title="Pressure"
                  value={deviceState ? deviceState.sensors.pressureBar.toFixed(1) : '0.0'}
                  status={getPressureStatus()}
                  icon={Gauge}
                  unit="bar"
                  isLoading={loading}
                />

                <StatusCard
                  title="Leak Valve Override"
                  value={deviceState ? getValveStatus(deviceState.controls.leakValveOverride) : 'Unknown'}
                  status={deviceState?.controls.leakValveOverride ? 'warning' : 'safe'}
                  icon={Activity}
                  isLoading={loading}
                />

                <StatusCard
                  title="Fire Valve Override"
                  value={deviceState ? getValveStatus(deviceState.controls.fireValveOverride) : 'Unknown'}
                  status={deviceState?.controls.fireValveOverride ? 'warning' : 'safe'}
                  icon={Activity}
                  isLoading={loading}
                />

                <StatusCard
                  title="Pressure Alert"
                  value={deviceState ? (deviceState.sensors.pressureAlert ? 'Alert Active' : 'Normal') : 'Unknown'}
                  status={deviceState?.sensors.pressureAlert ? 'warning' : 'safe'}
                  icon={Zap}
                  isLoading={loading}
                />

                <StatusCard
                  title="Pressure Status"
                  value={deviceState ? deviceState.sensors.pressureStatus : 'Unknown'}
                  status={getPressureStatus()}
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

              <div className="control-panel rounded-3xl p-6">
                <h3 className="mb-4 text-xl font-black text-white">Live Sensor Data</h3>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    {error}
                  </div>
                )}

                {deviceState ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-4 transition-colors hover:bg-cyan-900/30">
                      <div className="mb-1 text-sm font-semibold text-cyan-50/60">Leak Sensor</div>
                      <div className="text-lg font-bold text-white">
                        {deviceState.sensors.leak ? 'Leak Detected (HIGH)' : 'No Leak (LOW)'}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-4 transition-colors hover:bg-cyan-900/30">
                      <div className="mb-1 text-sm font-semibold text-cyan-50/60">Fire Sensor</div>
                      <div className="text-lg font-bold text-white">
                        {deviceState.sensors.fire ? 'Fire Detected (HIGH)' : 'No Fire (LOW)'}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-4 transition-colors hover:bg-cyan-900/30">
                      <div className="mb-1 text-sm font-semibold text-cyan-50/60">Pressure (Bar)</div>
                      <div className="text-lg font-bold text-white">
                        {deviceState.sensors.pressureBar.toFixed(2)} bar
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-4 transition-colors hover:bg-cyan-900/30">
                      <div className="mb-1 text-sm font-semibold text-cyan-50/60">Pressure Status</div>
                      <div className="text-lg font-bold text-white">
                        {deviceState.sensors.pressureStatus.charAt(0).toUpperCase() + deviceState.sensors.pressureStatus.slice(1)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-4 transition-colors hover:bg-cyan-900/30">
                      <div className="mb-1 text-sm font-semibold text-cyan-50/60">Pressure Alert</div>
                      <div className="text-lg font-bold text-white">
                        {deviceState.sensors.pressureAlert ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-4 transition-colors hover:bg-cyan-900/30">
                      <div className="mb-1 text-sm font-semibold text-cyan-50/60">Leak Valve Override</div>
                      <div className="text-lg font-bold text-white">
                        {deviceState.controls.leakValveOverride ? 'Enabled (HIGH)' : 'Disabled (LOW)'}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-4 transition-colors hover:bg-cyan-900/30">
                      <div className="mb-1 text-sm font-semibold text-cyan-50/60">Fire Valve Override</div>
                      <div className="text-lg font-bold text-white">
                        {deviceState.controls.fireValveOverride ? 'Enabled (HIGH)' : 'Disabled (LOW)'}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-4 transition-colors hover:bg-cyan-900/30">
                      <div className="mb-1 text-sm font-semibold text-cyan-50/60">Last Update</div>
                      <div className="text-lg font-bold text-white">
                        {new Date(deviceState.updatedAt).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-4 transition-colors hover:bg-cyan-900/30">
                      <div className="mb-1 text-sm font-semibold text-cyan-50/60">Device Status</div>
                      <div className="text-lg font-bold text-white">
                        {isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-cyan-50/70">Waiting for device data...</div>
                  </div>
                )}
              </div>
            </motion.div>
          </PageLayout>
        );
      };
      
      export default Dashboard;
