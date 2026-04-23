# Smart Water and Fire Detection System

A professional IoT dashboard for monitoring water leaks and fire detection using ESP32, Firebase, and React.

## Features

- **Real-time Monitoring**: Live sensor data from ESP32 device
- **Firebase Integration**: Authentication, Realtime Database, and Firestore
- **Responsive Design**: Modern UI with water-themed design
- **Manual Control**: Remote valve control and emergency stop
- **Alert System**: Real-time notifications for safety events
- **Data History**: Comprehensive logging and analytics
- **User Authentication**: Secure login and user management

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with glassmorphism effects
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Realtime DB, Firestore)
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── StatusCard.tsx  # Status display cards
│   ├── LoadingScreen.tsx
│   └── ProtectedRoute.tsx
├── pages/              # Main application pages
│   ├── Landing.tsx     # Landing page
│   ├── Login.tsx       # Authentication
│   ├── Dashboard.tsx   # Main monitoring dashboard
│   ├── Alerts.tsx      # Alert management
│   ├── History.tsx     # Data history and logs
│   ├── ManualControl.tsx # Valve control interface
│   └── Settings.tsx    # User settings
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom React hooks
│   └── useDeviceState.ts # Device state management
├── services/           # Firebase and API services
│   ├── firebase.ts     # Firebase configuration
│   ├── deviceService.ts # Device state operations
│   └── firestoreService.ts # Firestore operations
└── utils/              # Utility functions
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-water-and-fire-detection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password)
   - Enable Realtime Database
   - Enable Firestore Database
   - Update `src/services/firebase.ts` with your Firebase config

4. **Environment Variables** (if needed)
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

7. **Deploy to Firebase Hosting**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## Firebase Data Structure

### Realtime Database
```
deviceState/
├── leakState: number (0 or 1)
├── flameState: number (0 or 1)
├── pressureRaw: number
├── pressureBar: number
├── relayLeakState: number (0 or 1)
├── relayFireState: number (0 or 1)
├── ledState: number (0 or 1)
├── mode: "auto" | "manual"
├── heartbeat: timestamp
└── updatedAt: timestamp

commands/
└── latest/
    ├── relayLeakCommand?: "open" | "close"
    ├── relayFireCommand?: "open" | "close"
    ├── modeCommand?: "auto" | "manual"
    ├── emergencyStop?: boolean
    ├── issuedBy: string
    └── issuedAt: timestamp
```

### Firestore Collections
- **readings**: Sensor data history
- **alerts**: System alerts and notifications
- **controlLogs**: Manual control actions
- **users**: User profiles (optional)

## ESP32 Integration

The ESP32 should send data to Firebase Realtime Database at `deviceState/` and listen for commands at `commands/latest/`.

### Sample ESP32 Code Structure
```cpp
// Firebase setup
// Send sensor data
Firebase.RTDB.setJSON(&fbdo, "deviceState", jsonData);

// Listen for commands
Firebase.RTDB.getJSON(&fbdo, "commands/latest");
```

### Data Format from ESP32
```json
{
  "leakState": 0,
  "flameState": 0,
  "pressureRaw": 512,
  "pressureBar": 2.5,
  "relayLeakState": 0,
  "relayFireState": 0,
  "ledState": 0,
  "mode": "auto",
  "heartbeat": 1640995200000,
  "updatedAt": 1640995200000
}
```

## Security Rules

### Realtime Database Rules
```json
{
  "rules": {
    "deviceState": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "commands": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## System Logic

- **Leak Detection**: leakState == 0 (LOW) = Leak detected
- **Fire Detection**: flameState == 1 = Fire detected
- **LED Control**: ON when leak or fire detected
- **Leak Valve**: Normally Open (NO) - HIGH = Close, LOW = Open
- **Fire Valve**: Normally Closed (NC) - HIGH = Open, LOW = Closed
- **Auto Mode**: Automatic valve control based on sensor readings
- **Manual Mode**: User manual control override

## Development Notes

- All components are fully functional with Firebase integration
- Real-time listeners are implemented for live data updates
- Error handling and loading states are included
- Responsive design works on desktop and mobile
- Animations use Framer Motion for smooth transitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.