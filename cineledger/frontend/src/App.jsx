import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import CinemaholicLayout from './layouts/CinemaholicLayout';

// Public Landing & Auth Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Cinemaholic Public Cinema & 3D Booking Pages
import CinemaholicLandingPage from './pages/CinemaholicLandingPage';
import CinemaholicLoginPage from './pages/CinemaholicLoginPage';
import CinemaholicSignupPage from './pages/CinemaholicSignupPage';
import MovieDiscoveryPage from './pages/MovieDiscoveryPage';
import MovieDetailPage from './pages/MovieDetailPage';
import Live3DBookingPage from './pages/Live3DBookingPage';
import TheatreDiscoveryPage from './pages/TheatreDiscoveryPage';
import CommunityReviewsPage from './pages/CommunityReviewsPage';
import AudienceDashboardPage from './pages/AudienceDashboardPage';

// Authenticated Industry Platform Workbench Pages
import DashboardPage from './pages/DashboardPage';
import FilmsPage from './pages/FilmsPage';
import FilmDetailPage from './pages/FilmDetailPage';
import CinemasPage from './pages/CinemasPage';
import ReconciliationsPage from './pages/ReconciliationsPage';
import NewReconciliationPage from './pages/NewReconciliationPage';
import ReconciliationDetailPage from './pages/ReconciliationDetailPage';
import ImportsPage from './pages/ImportsPage';
import SettlementsPage from './pages/SettlementsPage';
import SettlementDetailPage from './pages/SettlementDetailPage';
import DisputesPage from './pages/DisputesPage';
import ReportsPage from './pages/ReportsPage';
import AuditLogPage from './pages/AuditLogPage';
import TeamPage from './pages/TeamPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Master Dual Gateway Landing */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          {/* 2. Cinemaholic Portal (Audience & 3D Booking) - Dedicated Auth & Layout */}
          <Route path="/cinemaholic/login" element={<CinemaholicLoginPage />} />
          <Route path="/cinemaholic/signup" element={<CinemaholicSignupPage />} />
          <Route path="/cinemaholic" element={<CinemaholicLayout />}>
            <Route index element={<CinemaholicLandingPage />} />
            <Route path="movies" element={<MovieDiscoveryPage />} />
            <Route path="movies/:id" element={<MovieDetailPage />} />
            <Route path="book/:showtimeId" element={<Live3DBookingPage />} />
            <Route path="theatres" element={<TheatreDiscoveryPage />} />
            <Route path="community" element={<CommunityReviewsPage />} />
            <Route path="dashboard" element={<AudienceDashboardPage />} />
          </Route>

          {/* 3. Industry Portal (B2B Clearinghouse) - Dedicated Auth & Gateway */}
          <Route path="/industry/login" element={<LoginPage />} />
          <Route path="/industry/signup" element={<SignupPage />} />
          <Route path="/industry" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* 4. Authenticated Industry Workbench */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="films" element={<FilmsPage />} />
            <Route path="films/:id" element={<FilmDetailPage />} />
            <Route path="cinemas" element={<CinemasPage />} />
            <Route path="reconciliations" element={<ReconciliationsPage />} />
            <Route path="reconciliations/new" element={<NewReconciliationPage />} />
            <Route path="reconciliations/:id" element={<ReconciliationDetailPage />} />
            <Route path="imports" element={<ImportsPage />} />
            <Route path="settlements" element={<SettlementsPage />} />
            <Route path="settlements/:id" element={<SettlementDetailPage />} />
            <Route path="disputes" element={<DisputesPage />} />
            <Route path="disputes/:id" element={<DisputesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit-log" element={<AuditLogPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
