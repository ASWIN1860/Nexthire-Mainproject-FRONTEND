import { Routes, Route, Navigate } from "react-router-dom"

import AuthPage from "./pages/auth/AuthPage"
import Dashboard from "./pages/user/Dashboard"
import Profile from "./pages/user/Profile"
import ResumeUpload from "./pages/user/ResumeUpload"
import ResumeResult from "./pages/user/ResumeResult"
import JobsPage from "./pages/jobs/JobsPage"

import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminJobs from "./pages/admin/AdminJobs"
import AdminApplications from "./pages/admin/AdminApplications"

import MainLayout from "./components/layout/MainLayout"
import AdminLayout from "./components/layout/AdminLayout"

import ProtectedRoute from "./pages/auth/ProtectedRoute"
import PublicRoute from "./pages/auth/PublicRoute"
import AdminProtectedRoute from "./pages/auth/AdminProtectedRoute"

import { ToastContainer } from "react-toastify"

function App() {
  return (
    <>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><AuthPage /></PublicRoute>} />

        <Route path="/register" element={<PublicRoute><AuthPage register /></PublicRoute>} />

        {/* User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume/upload" element={<ResumeUpload />} />
            <Route path="/resume/result" element={<ResumeResult />} />
            <Route path="/jobs" element={<JobsPage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="applications" element={<AdminApplications />} />

            <Route path="/admin/resume-result" element={<ResumeResult />} />
          </Route>
        </Route>

      </Routes>

      <ToastContainer position="top-center" />
    </>
  )
}

export default App