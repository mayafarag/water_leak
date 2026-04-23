import { useState, useEffect } from 'react';
import { deviceService, DeviceState } from '../services/deviceService';

export const useDeviceState = () => {
  const [deviceState, setDeviceState] = useState<DeviceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = deviceService.onDeviceStateChange((state) => {
      setDeviceState(state);
      setLoading(false);
      setError(null);
    });

    // Set a timeout for initial load
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Failed to connect to device');
      }
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [loading]);

  const isOnline = deviceState ? deviceService.isDeviceOnline(deviceState.heartbeat) : false;

  return {
    deviceState,
    loading,
    error,
    isOnline,
  };
};