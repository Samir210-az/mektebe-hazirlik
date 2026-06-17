import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CurriculumPage from './pages/CurriculumPage';
import StudentsPage from './pages/StudentsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import DailyRecordPage from './pages/DailyRecordPage';
import ReportPage from './pages/ReportPage';
import AdminPage from './pages/AdminPage';
import TeachersPage from './pages/TeachersPage';
import LessonsPage from './pages/LessonsPage';
import Layout from './components/Layout/Layout';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      <Route path="/" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
      <Route path="/curriculum" element={<PrivateRoute><Layout><CurriculumPage /></Layout></PrivateRoute>} />
      <Route path="/students" element={<PrivateRoute roles={['admin','teacher']}><Layout><StudentsPage /></Layout></PrivateRoute>} />
      <Route path="/students/:id" element={<PrivateRoute><Layout><StudentProfilePage /></Layout></PrivateRoute>} />
      <Route path="/students/:id/record" element={<PrivateRoute roles={['admin','teacher']}><Layout><DailyRecordPage /></Layout></PrivateRoute>} />
      <Route path="/students/:id/report" element={<PrivateRoute><Layout><ReportPage /></Layout></PrivateRoute>} />
      <Route path="/lessons" element={<PrivateRoute><Layout><LessonsPage /></Layout></PrivateRoute>} />
      <Route path="/teachers" element={<PrivateRoute roles={['admin']}><Layout><TeachersPage /></Layout></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><Layout><AdminPage /></Layout></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}
