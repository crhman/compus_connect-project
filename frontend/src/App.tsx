import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import GroupsPage from "./pages/GroupsPage";
import BookingPage from "./pages/BookingPage";
import TeacherBookingsPage from "./pages/TeacherBookingsPage";
import TeacherAvailabilityPage from "./pages/TeacherAvailabilityPage";
import TeacherStudentsPage from "./pages/TeacherStudentsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminFacultiesPage from "./pages/AdminFacultiesPage";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminBusesPage from "./pages/AdminBusesPage";
import LandingPage from "./pages/LandingPage";
import BusesPage from "./pages/BusesPage";
import LostFoundPage from "./pages/LostFoundPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const RequireRole: React.FC<{ role: string; children: React.ReactNode }> = ({ role, children }) => {
  const { user, isReady } = useAuth();
  if (!isReady) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { user, isReady } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/"
        element={
          isReady ? (user ? <Navigate to="/dashboard" replace /> : <LandingPage />) : null
        }
      />
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/events"
        element={
          <DashboardLayout>
            <EventsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/groups"
        element={
          <DashboardLayout>
            <GroupsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/lost-found"
        element={
          <DashboardLayout>
            <LostFoundPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/booking"
        element={
          <DashboardLayout>
            <BookingPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/buses"
        element={
          <RequireRole role="student">
            <DashboardLayout>
              <BusesPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/teacher/bookings"
        element={
          <RequireRole role="teacher">
            <DashboardLayout>
              <TeacherBookingsPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/teacher/availability"
        element={
          <RequireRole role="teacher">
            <DashboardLayout>
              <TeacherAvailabilityPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <RequireRole role="teacher">
            <DashboardLayout>
              <TeacherStudentsPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/admin/overview"
        element={
          <RequireRole role="admin">
            <DashboardLayout>
              <AdminDashboardPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireRole role="admin">
            <DashboardLayout>
              <AdminUsersPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/admin/faculties"
        element={
          <RequireRole role="admin">
            <DashboardLayout>
              <AdminFacultiesPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/admin/events"
        element={
          <RequireRole role="admin">
            <DashboardLayout>
              <AdminEventsPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/admin/buses"
        element={
          <RequireRole role="admin">
            <DashboardLayout>
              <AdminBusesPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
