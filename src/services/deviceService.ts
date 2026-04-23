import { ref, onValue, set, update, get } from 'firebase/database';
import { database } from './firebase';

export interface DeviceState {
  leakState: number;
  flameState: number;
  pressureRaw: number;
  pressureBar: number;
  relayLeakState: number;
  relayFireState: number;
  ledState: number;
  mode: 'auto' | 'manual';
  heartbeat: number;
  updatedAt: number;
}

export interface CommandData {
  relayLeakCommand?: 'open' | 'close';
  relayFireCommand?: 'open' | 'close';
  modeCommand?: 'auto' | 'manual';
  emergencyStop?: boolean;
  issuedBy: string;
  issuedAt: number;
}

class DeviceService {
  private deviceStateRef = ref(database, 'deviceState');
  private commandsRef = ref(database, 'commands/latest');

  // Listen to device state changes
  onDeviceStateChange(callback: (state: DeviceState | null) => void) {
    return onValue(this.deviceStateRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }

  // Get current device state
  async getDeviceState(): Promise<DeviceState | null> {
    const snapshot = await get(this.deviceStateRef);
    return snapshot.val();
  }

  // Send command to device
  async sendCommand(command: CommandData): Promise<void> {
    await set(this.commandsRef, {
      ...command,
      issuedAt: Date.now(),
    });
  }

  // Update device state (for testing or manual override)
  async updateDeviceState(updates: Partial<DeviceState>): Promise<void> {
    await update(this.deviceStateRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  // Check if device is online (heartbeat within last 30 seconds)
  isDeviceOnline(lastHeartbeat: number): boolean {
    const now = Date.now();
    return (now - lastHeartbeat) < 30000; // 30 seconds
  }
}

export const deviceService = new DeviceService();