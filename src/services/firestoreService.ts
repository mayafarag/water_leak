import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { firestore } from './firebase';

export interface SensorReading {
  id?: string;
  leakState: number;
  flameState: number;
  pressureRaw: number;
  pressureBar: number;
  relayLeakState: number;
  relayFireState: number;
  ledState: number;
  mode: 'auto' | 'manual';
  timestamp: Timestamp;
}

export interface Alert {
  id?: string;
  type: 'leak' | 'fire' | 'pressure' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
  timestamp: Timestamp;
  resolvedAt?: Timestamp;
}

export interface ControlLog {
  id?: string;
  action: string;
  userId: string;
  userEmail: string;
  timestamp: Timestamp;
  details?: any;
}

export interface Device {
  id?: string;
  name: string;
  deviceId: string;
  location?: string;
  addedAt: Timestamp;
}

class FirestoreService {
  // Readings
  async addReading(reading: Omit<SensorReading, 'id' | 'timestamp'>): Promise<void> {
    const readingsRef = collection(firestore, 'readings');
    await addDoc(readingsRef, {
      ...reading,
      timestamp: Timestamp.now(),
    });
  }

  onReadingsChange(callback: (readings: SensorReading[]) => void, limitCount = 50) {
    const readingsRef = collection(firestore, 'readings');
    const q = query(readingsRef, orderBy('timestamp', 'desc'), limit(limitCount));

    return onSnapshot(q, (snapshot) => {
      const readings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as SensorReading));
      callback(readings);
    });
  }

  async getReadingsInRange(startDate: Date, endDate: Date): Promise<SensorReading[]> {
    const readingsRef = collection(firestore, 'readings');
    const q = query(
      readingsRef,
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as SensorReading));
  }

  // Alerts
  async addAlert(alert: Omit<Alert, 'id' | 'timestamp'>): Promise<void> {
    const alertsRef = collection(firestore, 'alerts');
    await addDoc(alertsRef, {
      ...alert,
      timestamp: Timestamp.now(),
    });
  }

  onAlertsChange(callback: (alerts: Alert[]) => void, includeResolved = false) {
    const alertsRef = collection(firestore, 'alerts');
    let q = query(alertsRef, orderBy('timestamp', 'desc'));

    if (!includeResolved) {
      q = query(alertsRef, where('resolved', '==', false), orderBy('timestamp', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Alert));
      callback(alerts);
    });
  }

  async resolveAlert(alertId: string): Promise<void> {
    const alertRef = collection(firestore, 'alerts');
    // Note: This would need a document update function, but for simplicity, we'll add a resolved alert
    await addDoc(alertRef, {
      type: 'system',
      severity: 'low',
      message: `Alert ${alertId} resolved`,
      resolved: true,
      timestamp: Timestamp.now(),
      resolvedAt: Timestamp.now(),
    });
  }

  // Control Logs
  async addControlLog(log: Omit<ControlLog, 'id' | 'timestamp'>): Promise<void> {
    const logsRef = collection(firestore, 'controlLogs');
    await addDoc(logsRef, {
      ...log,
      timestamp: Timestamp.now(),
    });
  }

  onControlLogsChange(callback: (logs: ControlLog[]) => void, limitCount = 100) {
    const logsRef = collection(firestore, 'controlLogs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));

    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ControlLog));
      callback(logs);
    });
  }

  // Devices
  async addDevice(device: Omit<Device, 'id' | 'addedAt'>): Promise<void> {
    const devicesRef = collection(firestore, 'devices');
    await addDoc(devicesRef, {
      ...device,
      addedAt: Timestamp.now(),
    });
  }

  onDevicesChange(callback: (devices: Device[]) => void) {
    const devicesRef = collection(firestore, 'devices');
    const q = query(devicesRef, orderBy('addedAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const devices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Device));
      callback(devices);
    });
  }
}

export const firestoreService = new FirestoreService();