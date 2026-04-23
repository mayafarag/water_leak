import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Key } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, resetPassword } = useAuth();
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      await resetPassword(user.email);
      setResetEmailSent(true);
    } catch (error) {
      console.error('Failed to send reset email:', error);
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
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
                <p className="text-cyan-200">Manage your account and system preferences</p>
              </div>

              <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">Profile</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-cyan-200 mb-2">
                        Email Address
                      </label>
                      <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                        {user?.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cyan-200 mb-2">
                        Account Created
                      </label>
                      <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                        {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">Security</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Password</h4>
                      <p className="text-cyan-200 text-sm mb-4">
                        Change your password by requesting a reset link.
                      </p>
                      <button
                        onClick={handlePasswordReset}
                        className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg transition-colors"
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
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Bell className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">Notifications</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Leak Alerts</h4>
                        <p className="text-cyan-200 text-sm">Get notified when leak is detected</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Fire Alerts</h4>
                        <p className="text-cyan-200 text-sm">Get notified when fire is detected</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Pressure Warnings</h4>
                        <p className="text-cyan-200 text-sm">Get notified of pressure anomalies</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* System Settings */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Settings className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">System Settings</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Default Mode</h4>
                      <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
                        <option value="auto">Auto Mode</option>
                        <option value="manual">Manual Mode</option>
                      </select>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Device Connection Timeout</h4>
                      <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
                        <option value="30">30 seconds</option>
                        <option value="60">1 minute</option>
                        <option value="300">5 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;