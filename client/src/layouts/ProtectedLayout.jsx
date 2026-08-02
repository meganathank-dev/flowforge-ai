import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store.js';

/**
 * Layout wrapper for protected application pages.
 * Ensures the user is authenticated before rendering children.
 */
export const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show a full-screen loading state while checking the session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected application shell/content
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">FlowForge AI</h1>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
