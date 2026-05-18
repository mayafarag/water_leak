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

  const handleValveControl = (valve: 'leak' | 'fire', override: boolean) => {
    const command = valve === 'leak'
      ? { leakValveOverride: override }
      : { fireValveOverride: override };

    sendCommand(command, `${override ? 'activate' : 'disable'} ${valve} valve override`);
  };

  const handleEmergencyStop = () => {
    sendCommand({
      leakValveOverride: true,
      fireValveOverride: true
    }, 'emergency stop - activate both overrides');
  };

  const ValveControlCard: React.FC<{
    title: string;
    isOverride: boolean;
    onEnable: () => void;
    onDisable: () => void;
    loadingAction: string | null;
  }> = ({ title, isOverride, onEnable, onDisable, loadingAction }) => (
    <motion.div whileHover={{ y: -3 }} className="control-panel rounded-2xl p-6">
      <h3 className="text-lg font-black text-white mb-4">{title}</h3>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-cyan-50/70">Override Status:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isOverride ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'
        }`}>
          {isOverride ? 'Override Active' : 'Normal Operation'}
        </span>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onEnable}
          disabled={loadingAction?.includes('activate') || isOverride}
          className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-bold text-white transition-colors hover:bg-orange-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {loadingAction?.includes('activate') ? 'Enabling...' : 'Enable Override'}
        </button>
        <button
          onClick={onDisable}
          disabled={loadingAction?.includes('disable') || !isOverride}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-bold text-white transition-colors hover:bg-green-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {loadingAction?.includes('disable') ? 'Disabling...' : 'Disable Override'}
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
        {/* Valve Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <ValveControlCard
            title="Leak Valve Override"
            isOverride={deviceState?.controls.leakValveOverride || false}
            onEnable={() => handleValveControl('leak', true)}
            onDisable={() => handleValveControl('leak', false)}
            loadingAction={loading}
          />

          <ValveControlCard
            title="Fire Valve Override"
            isOverride={deviceState?.controls.fireValveOverride || false}
            onEnable={() => handleValveControl('fire', true)}
            onDisable={() => handleValveControl('fire', false)}
            loadingAction={loading}
          />
        </div>

        {/* Emergency Stop */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-lg shadow-red-900/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-red-950 mb-2 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Emergency Override
              </h3>
              <p className="text-red-700 text-sm">
                Activate both valve overrides to immediately respond to emergencies
              </p>
            </div>
            <button
              onClick={() => setShowConfirm('emergency')}
              disabled={loading === 'emergency stop - activate both overrides'}
              className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading === 'emergency stop - activate both overrides' ? 'Activating...' : 'ACTIVATE OVERRIDES'}
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
                  ? 'This will activate all valve overrides. Are you sure?'
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
