import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { AuthForm } from './components/AuthForm';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          <Route
            path="/auth"
            element={!user ? <AuthForm /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/"
            element={user ? <Layout /> : <Navigate to="/auth" replace />}
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<div className="p-8 text-center text-gray-500">Courses page coming soon...</div>} />
            <Route path="lectures" element={<div className="p-8 text-center text-gray-500">Lectures page coming soon...</div>} />
            <Route path="users" element={<div className="p-8 text-center text-gray-500">Users page coming soon...</div>} />
            <Route path="admin" element={<div className="p-8 text-center text-gray-500">Admin panel coming soon...</div>} />
            <Route path="my-courses" element={<div className="p-8 text-center text-gray-500">My courses page coming soon...</div>} />
            <Route path="enrollments" element={<div className="p-8 text-center text-gray-500">Enrollments page coming soon...</div>} />
            <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings page coming soon...</div>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;