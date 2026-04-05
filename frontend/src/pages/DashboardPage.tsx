import React from "react";
import { useAuth } from "../context/AuthContext";
import StudentDashboardPage from "./StudentDashboardPage";
import TeacherDashboardPage from "./TeacherDashboardPage";
import AdminDashboardPage from "./AdminDashboardPage";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "admin") {
    return <AdminDashboardPage />;
  }

  if (user.role === "teacher") {
    return <TeacherDashboardPage />;
  }

  return <StudentDashboardPage />;
};

export default DashboardPage;
