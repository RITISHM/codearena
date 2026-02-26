import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Lobby from './pages/Lobby';
import Arena from './pages/Arena';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Landing />} />
            <Route path="login" element={<Auth />} />
            <Route path="signup" element={<Auth />} />

            {/* Protected User Routes */}
            <Route path="dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="lobby/:roomId" element={
              <ProtectedRoute><Lobby /></ProtectedRoute>
            } />
            <Route path="arena/:roomId" element={
              <ProtectedRoute><Arena /></ProtectedRoute>
            } />
            <Route path="result" element={
              <ProtectedRoute><Result /></ProtectedRoute>
            } />
            <Route path="profile/:username" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            {/* Additional Features */}
            <Route path="leaderboard" element={<Leaderboard />} />

            {/* Fallback path */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
