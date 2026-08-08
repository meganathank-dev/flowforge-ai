import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store.js';

/**
 * Layout wrapper for public authentication pages (Login, Register, etc.).
 * If the user is already authenticated, they are redirected to the main app.
 */
export const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // If we are still checking auth state on startup, we can just show a minimal loader,
  // or allow rendering (but might flash login screen).
  // It's safer to wait until loading is complete to avoid flashes.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to the protected application shell if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          FlowForge AI
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
