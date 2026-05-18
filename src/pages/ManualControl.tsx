import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import PageLayout from '../components/PageLayout';
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
    <motion.div whileHover={{ y: -3 }} className="control-panel rounded-2xl p-6">
      <h3 className="text-lg font-black text-white mb-4">{title}</h3>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-cyan-50/70">Current Status:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          currentState === 1 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {currentState === 1 ? 'Open' : 'Closed'}
        </span>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onOpen}
          disabled={loadingAction === `${title.toLowerCase().split(' ')[0]} valve open` || currentState === 1}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-bold text-white transition-colors hover:bg-green-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {loadingAction === `${title.toLowerCase().split(' ')[0]} valve open` ? 'Opening...' : 'Open Valve'}
        </button>
        <button
          onClick={onClose}
          disabled={loadingAction === `${title.toLowerCase().split(' ')[0]} valve close` || currentState === 0}
          className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition-colors hover:bg-red-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {loadingAction === `${title.toLowerCase().split(' ')[0]} valve close` ? 'Closing...' : 'Close Valve'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onMenuClick={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      title="Manual Control"
      subtitle="Take manual control of your safety system valves"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mode Control */}
        <div className="control-panel mb-6 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-4">System Mode</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-cyan-50/70">Current Mode:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              deviceState?.mode === 'auto' ? 'bg-slate-100 text-slate-700' : 'bg-orange-50 text-orange-700'
            }`}>
              {deviceState?.mode || 'Unknown'}
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleModeChange('auto')}
              disabled={loading === 'switch to auto mode' || deviceState?.mode === 'auto'}
              className="flex-1 rounded-lg bg-slate-950 px-4 py-2 font-bold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading === 'switch to auto mode' ? 'Switching...' : 'Auto Mode'}
            </button>
            <button
              onClick={() => handleModeChange('manual')}
              disabled={loading === 'switch to manual mode' || deviceState?.mode === 'manual'}
              className="flex-1 rounded-lg bg-orange-500 px-4 py-2 font-bold text-white transition-colors hover:bg-orange-400 disabled:bg-slate-300 disabled:cursor-not-allowed"
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
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-lg shadow-red-900/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-red-950 mb-2 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Emergency Stop
              </h3>
              <p className="text-red-700 text-sm">
                Immediately close all valves and activate emergency protocols
              </p>
            </div>
            <button
              onClick={() => setShowConfirm('emergency')}
              disabled={loading === 'emergency stop'}
              className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
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
            className="control-panel max-w-md rounded-2xl p-6 mx-4"
            >
              <h3 className="text-xl font-black text-white mb-4">Confirm Action</h3>
              <p className="text-cyan-50/70 mb-6">
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
    </PageLayout>
  );
};

export default ManualControl;
