import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Settings as SettingsIcon, Plus, Cpu, MapPin, Router, CheckCircle2 } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../contexts/AuthContext';
import { Device, firestoreService } from '../services/firestoreService';

const Settings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, resetPassword } = useAuth();
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [deviceLocation, setDeviceLocation] = useState('');
  const [deviceAdded, setDeviceAdded] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const unsubscribe = firestoreService.onDevicesChange(setDevices);
    return unsubscribe;
  }, []);

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      await resetPassword(user.email);
      setResetEmailSent(true);
    } catch (error) {
      console.error('Failed to send reset email:', error);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim() || !deviceId.trim()) return;

    try {
      await firestoreService.addDevice({
        name: deviceName.trim(),
        deviceId: deviceId.trim(),
        location: deviceLocation.trim() || undefined,
      });
      setDeviceAdded(true);
      setDeviceName('');
      setDeviceId('');
      setDeviceLocation('');
      setTimeout(() => setDeviceAdded(false), 3000);
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onMenuClick={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      title="Settings"
      subtitle="Manage your account and system preferences"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="control-panel rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-black text-white">Profile</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-cyan-50/70 mb-2">
                  Email Address
                </label>
                <div className="rounded-xl border border-cyan-100/20 bg-cyan-950/25 px-4 py-3 text-white">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cyan-50/70 mb-2">
                  Account Created
                </label>
                <div className="rounded-xl border border-cyan-100/20 bg-cyan-950/25 px-4 py-3 text-white">
                  {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="control-panel rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-black text-white">Security</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Password</h4>
                <p className="text-cyan-50/70 text-sm mb-4">
                  Change your password by requesting a reset link.
                </p>
                <button
                  onClick={handlePasswordReset}
                  className="primary-button px-4 py-2"
                >
                  Send Password Reset Email
                </button>
                {resetEmailSent && (
                  <p className="text-green-400 text-sm mt-2">
                    Password reset email sent successfully!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="control-panel rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-black text-white">Notifications</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">Leak Alerts</h4>
                  <p className="text-cyan-50/70 text-sm">Get notified when leak is detected</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">Fire Alerts</h4>
                  <p className="text-cyan-50/70 text-sm">Get notified when fire is detected</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">Pressure Warnings</h4>
                  <p className="text-cyan-50/70 text-sm">Get notified of pressure anomalies</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="control-panel rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <SettingsIcon className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-black text-white">System Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-2">Default Mode</h4>
                <select className="field">
                  <option value="auto">Auto Mode</option>
                  <option value="manual">Manual Mode</option>
                </select>
              </div>

              <div>
                <h4 className="text-white font-bold mb-2">Device Connection Timeout</h4>
                <select className="field">
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Device Management Section */}
          <div className="control-panel rounded-2xl p-6">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center space-x-3">
                <Cpu className="w-6 h-6 text-orange-500" />
                <div>
                  <h3 className="text-xl font-black text-white">Device Management</h3>
                  <p className="text-sm text-cyan-50/70">Register each controller before it appears in the dashboard.</p>
                </div>
              </div>
              <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800">
                {devices.length} registered {devices.length === 1 ? 'device' : 'devices'}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <form onSubmit={handleAddDevice} className="space-y-4 rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-5">
                <div>
                  <label className="block text-sm font-semibold text-cyan-50/70 mb-2">
                    Device Name
                  </label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="field"
                    placeholder="e.g., Kitchen Sensor"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cyan-50/70 mb-2">
                    Device ID
                  </label>
                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="field"
                    placeholder="e.g., ESP32-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cyan-50/70 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={deviceLocation}
                    onChange={(e) => setDeviceLocation(e.target.value)}
                    className="field"
                    placeholder="e.g., Ground Floor"
                  />
                </div>

                <button
                  type="submit"
                  className="accent-button w-full px-6 py-3 sm:w-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Device</span>
                </button>

                {deviceAdded && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-sm font-semibold text-emerald-600"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Device added successfully!
                  </motion.p>
                )}
              </form>

              <div className="space-y-4">
                <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-5">
                  <h4 className="mb-3 text-base font-black text-white">How to add a device</h4>
                  <div className="space-y-3 text-sm text-cyan-50/70">
                    <p><span className="font-bold text-cyan-100">1.</span> Give it a clear name, like Kitchen Sensor.</p>
                    <p><span className="font-bold text-cyan-100">2.</span> Enter the exact Device ID printed in the firmware or on the ESP32 label.</p>
                    <p><span className="font-bold text-cyan-100">3.</span> Add a location so alerts are easier to understand.</p>
                    <p><span className="font-bold text-cyan-100">4.</span> Click Add Device, then make sure the physical device is configured to send data with that same ID.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/25 p-5">
                  <h4 className="mb-3 text-base font-black text-white">Registered devices</h4>
                  <div className="space-y-3">
                    {devices.length === 0 ? (
                      <p className="text-sm text-slate-500">No devices registered yet.</p>
                    ) : (
                      devices.map((device) => (
                        <div key={device.id} className="rounded-xl border border-cyan-100/20 bg-cyan-950/30 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-bold text-white">{device.name}</div>
                              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                <Router className="h-3.5 w-3.5" />
                                {device.deviceId}
                              </div>
                            </div>
                            {device.location && (
                              <div className="inline-flex items-center gap-1 rounded-full bg-cyan-100/10 px-2 py-1 text-xs font-semibold text-cyan-50/70">
                                <MapPin className="h-3 w-3" />
                                {device.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Settings;
