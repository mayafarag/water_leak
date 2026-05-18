import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import History from './pages/History';
import ManualControl from './pages/ManualControl';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { loading, error } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Loading timeout - taking too long');
        setLoadingTimeout(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loadingTimeout && loading) {
    return (
      <div className="app-surface relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="panel relative mx-4 w-full max-w-sm rounded-3xl p-8 text-center">
          <h2 className="mb-4 text-2xl font-black text-yellow-50">Connection Timeout</h2>
          <p className="text-yellow-50/70 mb-4">Taking longer than expected to connect</p>
          <button
            onClick={() => window.location.reload()}
            className="accent-button px-6 py-2 mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-surface relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="panel relative mx-4 w-full max-w-sm rounded-3xl p-8 text-center">
          <h2 className="mb-4 text-2xl font-black text-red-50">Error Connecting</h2>
          <p className="text-red-50/70 mb-4 text-sm">{error}</p>
          <p className="text-xs text-red-50/50 mb-4">Check your internet connection</p>
          <button
            onClick={() => window.location.reload()}
            className="accent-button px-6 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/control" element={<ProtectedRoute><ManualControl /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;