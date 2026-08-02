import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/auth.store.js';

// Layouts
import { AuthLayout } from './layouts/AuthLayout.jsx';
import { ProtectedLayout } from './layouts/ProtectedLayout.jsx';

// Public Auth Pages
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';

// Protected / Generic Pages
import FoundationPage from './pages/FoundationPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';

/**
 * Root application component.
 * Sets up routing with React Router and initializes authentication state.
 */
const App = () => {
  const { initializeAuth } = useAuthStore();

  // Initialize authentication on app startup
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Application Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<FoundationPage />} />
          {/* Add more protected business module routes here in Phase 2 */}
        </Route>

        {/* Unrestricted Pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
