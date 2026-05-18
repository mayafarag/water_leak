import { useState, useEffect } from 'react';
import { deviceService, DeviceState } from '../services/deviceService';

export const useDeviceState = () => {
  const [deviceState, setDeviceState] = useState<DeviceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let didReceiveInitialState = false;

    const unsubscribe = deviceService.onDeviceStateChange((state) => {
      didReceiveInitialState = true;
      if (timeout) {
        clearTimeout(timeout);
      }
      setDeviceState(state);
      setLoading(false);
      setError(null);
    }, (error) => {
      didReceiveInitialState = true;
      if (timeout) {
        clearTimeout(timeout);
      }
      setDeviceState(null);
      setLoading(false);
      setError(error.message || 'Failed to connect to device');
    });

    // Set a timeout for initial load
    timeout = setTimeout(() => {
      if (!didReceiveInitialState) {
        setLoading(false);
        setError('Failed to connect to device');
      }
    }, 10000);

    return () => {
      unsubscribe();
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const isOnline = deviceState ? deviceService.isDeviceOnline(deviceState.updatedAt) : false;

  return {
    deviceState,
    loading,
    error,
    isOnline,
  };
};
