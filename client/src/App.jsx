import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import JobSeekerDashboard from './components/dashboard/JobSeekerDashboard';
import CompanyDashboard from './components/dashboard/CompanyDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Job Seeker Components
import JobSeekerProfile from './components/jobseeker/JobSeekerProfile';
import JobSeekerMatches from './components/jobseeker/JobSeekerMatches';
import JobSeekerDocuments from './components/jobseeker/JobSeekerDocuments';

// Company Components
import CompanyProfile from './components/company/CompanyProfile';
import CompanyJobs from './components/company/CompanyJobs';
import CompanyMatches from './components/company/CompanyMatches';

// Admin Components
import AdminUsers from './components/admin/AdminUsers';
import AdminJobs from './components/admin/AdminJobs';
import AdminMatches from './components/admin/AdminMatches';
import AdminDocuments from './components/admin/AdminDocuments';

// Public Components
import Landing from './components/public/Landing';
import NotFound from './components/public/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';

// Route Protection
import PrivateRoute from './components/routing/PrivateRoute';
import ProfileCheck from './components/routing/ProfileCheck';

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <Alert />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Job Seeker Routes */}
                <Route path="/jobseeker" element={
                  <PrivateRoute role="jobseeker">
                    <ProfileCheck>
                      <JobSeekerDashboard />
                    </ProfileCheck>
                  </PrivateRoute>
                } />
                <Route path="/jobseeker/profile" element={
                  <PrivateRoute role="jobseeker">
                    <ProfileCheck>
                      <JobSeekerProfile />
                    </ProfileCheck>
                  </PrivateRoute>
                } />
                <Route path="/jobseeker/matches" element={
                  <PrivateRoute role="jobseeker">
                    <ProfileCheck>
                      <JobSeekerMatches />
                    </ProfileCheck>
                  </PrivateRoute>
                } />
                <Route path="/jobseeker/documents" element={
                  <PrivateRoute role="jobseeker">
                    <ProfileCheck>
                      <JobSeekerDocuments />
                    </ProfileCheck>
                  </PrivateRoute>
                } />

                {/* Company Routes */}
                <Route path="/company" element={
                  <PrivateRoute role="company">
                    <ProfileCheck>
                      <CompanyDashboard />
                    </ProfileCheck>
                  </PrivateRoute>
                } />
                <Route path="/company/profile" element={
                  <PrivateRoute role="company">
                    <ProfileCheck>
                      <CompanyProfile />
                    </ProfileCheck>
                  </PrivateRoute>
                } />
                <Route path="/company/jobs" element={
                  <PrivateRoute role="company">
                    <ProfileCheck>
                      <CompanyJobs />
                    </ProfileCheck>
                  </PrivateRoute>
                } />
                <Route path="/company/matches" element={
                  <PrivateRoute role="company">
                    <ProfileCheck>
                      <CompanyMatches />
                    </ProfileCheck>
                  </PrivateRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                  <PrivateRoute role="admin">
                    <AdminUsers />
                  </PrivateRoute>
                } />
                <Route path="/admin/jobs" element={
                  <PrivateRoute role="admin">
                    <AdminJobs />
                  </PrivateRoute>
                } />
                <Route path="/admin/matches" element={
                  <PrivateRoute role="admin">
                    <AdminMatches />
                  </PrivateRoute>
                } />
                <Route path="/admin/documents" element={
                  <PrivateRoute role="admin">
                    <AdminDocuments />
                  </PrivateRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
