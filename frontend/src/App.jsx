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
import MatchHistory from './pages/MatchHistory';
import MatchDetail from './pages/MatchDetail';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProblems from './pages/admin/AdminProblems';
import AdminActivity from './pages/admin/AdminActivity';

function App() {
  return (
    <AuthProvider> {/*this will wrap the etire application and provide the aut data to entire app*/}
      <BrowserRouter> {/*this enable the react router and all the routes will be managed in this*/}
        <Routes> {/*this will contains all the routes*/}
          <Route path="/" element={<Layout />}>{/*this is the absloute path of the page*/}
            {/* Public Routes */}
            <Route index element={<Landing />} />{/*due to index this page will render as default when absolute is called*/}
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
            <Route path="matches" element={
              <ProtectedRoute><MatchHistory /></ProtectedRoute>
            } />
            <Route path="matches/:matchId" element={
              <ProtectedRoute><MatchDetail /></ProtectedRoute>
            } />

            {/* Additional Features */}
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Admin Routes — separate layout, no main navbar */}
          <Route path="/admin" element={
            <AdminRoute><AdminLayout /></AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="problems" element={<AdminProblems />} />
            <Route path="activity" element={<AdminActivity />} />
          </Route>

          {/* Fallback path */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
