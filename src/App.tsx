import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

  if (error) {
    return (
      <div className="app-surface relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="panel relative mx-4 w-full max-w-sm rounded-3xl p-8 text-center">
          <h2 className="mb-4 text-2xl font-black text-red-50">Error</h2>
          <p className="text-red-50/70 mb-4">{error}</p>
          <p className="text-xs text-red-50/50">Please check your internet connection and try again</p>
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