import { ref, onValue, update, get } from 'firebase/database';
import { database } from './firebase';

export interface SensorData {
  fire: boolean;
  leak: boolean;
  pressureAlert: boolean;
  pressureBar: number;
  pressureStatus: 'normal' | 'warning' | 'critical';
}

export interface ControlData {
  fireValveOverride: boolean;
  leakValveOverride: boolean;
}

export interface DeviceState {
  sensors: SensorData;
  controls: ControlData;
  updatedAt: number;
}

export interface CommandData {
  fireValveOverride?: boolean;
  leakValveOverride?: boolean;
  issuedBy: string;
  issuedAt: number;
}

class DeviceService {
  private sensorsRef = ref(database, 'sensors');
  private controlsRef = ref(database, 'controls');
  private combinedStateRef = ref(database, '');

  // Listen to combined device state changes (sensors + controls)
  onDeviceStateChange(callback: (state: DeviceState | null) => void) {
    return onValue(this.combinedStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const deviceState: DeviceState = {
          sensors: data.sensors || {
            fire: false,
            leak: false,
            pressureAlert: false,
            pressureBar: 0,
            pressureStatus: 'normal',
          },
          controls: data.controls || {
            fireValveOverride: false,
            leakValveOverride: false,
          },
          updatedAt: Date.now(),
        };
        callback(deviceState);
      } else {
        callback(null);
      }
    });
  }

  // Get current device state
  async getDeviceState(): Promise<DeviceState | null> {
    const snapshot = await get(this.combinedStateRef);
    const data = snapshot.val();
    if (data) {
      return {
        sensors: data.sensors || {
          fire: false,
          leak: false,
          pressureAlert: false,
          pressureBar: 0,
          pressureStatus: 'normal',
        },
        controls: data.controls || {
          fireValveOverride: false,
          leakValveOverride: false,
        },
        updatedAt: Date.now(),
      };
    }
    return null;
  }

  // Send control command to device
  async sendCommand(command: CommandData): Promise<void> {
    const updates: any = {};
    if (command.fireValveOverride !== undefined) {
      updates['controls/fireValveOverride'] = command.fireValveOverride;
    }
    if (command.leakValveOverride !== undefined) {
      updates['controls/leakValveOverride'] = command.leakValveOverride;
    }
    await update(ref(database), updates);
  }

  // Update sensor data (typically this comes from IoT device)
  async updateSensorData(sensorUpdates: Partial<SensorData>): Promise<void> {
    await update(this.sensorsRef, sensorUpdates);
  }

  // Update controls
  async updateControls(controlUpdates: Partial<ControlData>): Promise<void> {
    await update(this.controlsRef, controlUpdates);
  }

  // Check if device is online (based on pressure data updates)
  isDeviceOnline(lastUpdate: number): boolean {
    const now = Date.now();
    return (now - lastUpdate) < 60000; // 60 seconds
  }
}

export const deviceService = new DeviceService();