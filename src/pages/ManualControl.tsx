import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Power, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useDeviceState } from '../hooks/useDeviceState';
import { deviceService } from '../services/deviceService';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';

const ManualControl: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { deviceState } = useDeviceState();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const sendCommand = async (command: any, actionName: string) => {
    if (!user) return;

    setLoading(actionName);
    try {
      await deviceService.sendCommand({
        ...command,
        issuedBy: user.email!,
      });

      // Log the action
      await firestoreService.addControlLog({
        action: actionName,
        userId: user.uid,
        userEmail: user.email!,
        details: command,
      });

      setShowConfirm(null);
    } catch (error) {
      console.error('Failed to send command:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleValveControl = (valve: 'leak' | 'fire', action: 'open' | 'close') => {
    const command = valve === 'leak'
      ? { relayLeakCommand: action }
      : { relayFireCommand: action };

    sendCommand(command, `${valve} valve ${action}`);
  };

  const handleModeChange = (mode: 'auto' | 'manual') => {
    sendCommand({ modeCommand: mode }, `switch to ${mode} mode`);
  };

  const handleEmergencyStop = () => {
    sendCommand({
      emergencyStop: true,
      relayLeakCommand: 'close',
      relayFireCommand: 'close'
    }, 'emergency stop');
  };

  const ValveControlCard: React.FC<{
    title: string;
    currentState: number;
    onOpen: () => void;
    onClose: () => void;
    loadingAction: string | null;
  }> = ({ title, currentState, onOpen, onClose, loadingAction }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="flex items-center justify-between mb-4">
        <span className="text-cyan-200">Current Status:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          currentState === 1 ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
        }`}>
          {currentState === 1 ? 'Open' : 'Closed'}
        </span>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onOpen}
          disabled={loadingAction === `${title.toLowerCase().split(' ')[0]} valve open` || currentState === 1}
          className="flex-1 bg-green-500 hover:bg-green-400 disabled:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {loadingAction === `${title.toLowerCase().split(' ')[0]} valve open` ? 'Opening...' : 'Open Valve'}
        </button>
        <button
          onClick={onClose}
          disabled={loadingAction === `${title.toLowerCase().split(' ')[0]} valve close` || currentState === 0}
          className="flex-1 bg-red-500 hover:bg-red-400 disabled:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {loadingAction === `${title.toLowerCase().split(' ')[0]} valve close` ? 'Closing...' : 'Close Valve'}
        </button>
      </div>
    </div>
  );

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
                <h2 className="text-3xl font-bold text-white mb-2">Manual Control</h2>
                <p className="text-cyan-200">Take manual control of your safety system valves</p>
              </div>

              {/* Mode Control */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">System Mode</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-cyan-200">Current Mode:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    deviceState?.mode === 'auto' ? 'bg-blue-500/20 text-blue-100' : 'bg-orange-500/20 text-orange-100'
                  }`}>
                    {deviceState?.mode || 'Unknown'}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleModeChange('auto')}
                    disabled={loading === 'switch to auto mode' || deviceState?.mode === 'auto'}
                    className="flex-1 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {loading === 'switch to auto mode' ? 'Switching...' : 'Auto Mode'}
                  </button>
                  <button
                    onClick={() => handleModeChange('manual')}
                    disabled={loading === 'switch to manual mode' || deviceState?.mode === 'manual'}
                    className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {loading === 'switch to manual mode' ? 'Switching...' : 'Manual Mode'}
                  </button>
                </div>
              </div>

              {/* Valve Controls */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <ValveControlCard
                  title="Leak Valve Control"
                  currentState={deviceState?.relayLeakState || 0}
                  onOpen={() => handleValveControl('leak', 'open')}
                  onClose={() => handleValveControl('leak', 'close')}
                  loadingAction={loading}
                />

                <ValveControlCard
                  title="Fire Valve Control"
                  currentState={deviceState?.relayFireState || 0}
                  onOpen={() => handleValveControl('fire', 'open')}
                  onClose={() => handleValveControl('fire', 'close')}
                  loadingAction={loading}
                />
              </div>

              {/* Emergency Stop */}
              <div className="bg-red-500/10 backdrop-blur-lg rounded-xl p-6 border border-red-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                      Emergency Stop
                    </h3>
                    <p className="text-red-100 text-sm">
                      Immediately close all valves and activate emergency protocols
                    </p>
                  </div>
                  <button
                    onClick={() => setShowConfirm('emergency')}
                    disabled={loading === 'emergency stop'}
                    className="bg-red-600 hover:bg-red-500 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                  >
                    {loading === 'emergency stop' ? 'Activating...' : 'EMERGENCY STOP'}
                  </button>
                </div>
              </div>

              {/* Confirmation Modal */}
              {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-md mx-4"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Confirm Action</h3>
                    <p className="text-cyan-200 mb-6">
                      {showConfirm === 'emergency'
                        ? 'This will immediately close all valves and may affect system operation. Are you sure?'
                        : 'Are you sure you want to proceed with this action?'
                      }
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          if (showConfirm === 'emergency') {
                            handleEmergencyStop();
                          }
                          setShowConfirm(null);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setShowConfirm(null)}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ManualControl;