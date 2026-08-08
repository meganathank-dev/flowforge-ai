import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store.js';
import { Button } from '../components/ui/Button.jsx';
import { Building2, Users, ShieldCheck, Zap } from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-950 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                FlowForge AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
              The Next-Generation <br className="hidden lg:block" />
              <span className="text-primary-600 dark:text-primary-400">Enterprise AI OS</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Unify your workforce, streamline project management, and accelerate productivity with our secure, multi-tenant AI platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                  Sign In to Workspace
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-white dark:bg-surface-900 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-surface-950 border border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-xl flex items-center justify-center mb-6">
                  <Building2 size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multi-Tenant OS</h3>
                <p className="text-gray-600 dark:text-gray-400">Secure, isolated environments for every organization and department.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-surface-950 border border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Workforce Hub</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage employees, roles, and teams with enterprise-grade access control.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-surface-950 border border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Enterprise Security</h3>
                <p className="text-gray-600 dark:text-gray-400">Built-in RBAC, JWT authentication, and secure HTTP-only cookies.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-surface-950 border border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
                <p className="text-gray-600 dark:text-gray-400">Automate tasks and gain insights with embedded intelligent assistants.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} FlowForge AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
