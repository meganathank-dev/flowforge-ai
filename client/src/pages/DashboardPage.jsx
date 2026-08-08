import { Card } from '../components/ui/Card.jsx';
import { useAuthStore } from '../stores/auth.store.js';
import { useOrganizationStore } from '../stores/organization.store.js';
import { useEmployeeStore } from '../stores/employee.store.js';
import { Building2, Users, FolderKanban, ShieldCheck, Plus, CheckSquare, Bot, ArrowRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { useEffect } from 'react';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { organization, isLoading: orgLoading } = useOrganizationStore();
  const { employees, fetchEmployees, isLoading: empLoading } = useEmployeeStore();

  useEffect(() => {
    // Fetch a minimal set of employees to get total count
    fetchEmployees({ page: 1, limit: 1 });
  }, [fetchEmployees]);

  const canCreateEmployee = user?.role === 'organization_admin' || user?.role === 'project_manager';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-surface-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            Welcome back, {user?.firstName || user?.email.split('@')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's what's happening in your workspace today.
          </p>
        </div>
        <div className="flex gap-3">
          {canCreateEmployee && (
            <Link to="/employees">
              <Button variant="primary" className="flex items-center gap-2">
                <UserPlus size={18} />
                Add Employee
              </Button>
            </Link>
          )}
          <Link to="/organization">
            <Button variant="outline" className="flex items-center gap-2">
              <Building2 size={18} />
              View Organization
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Building2 size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Organization</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
              {orgLoading ? 'Loading...' : (organization?.name || 'Not Assigned')}
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Role</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Users size={28} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Workforce</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {empLoading ? '...' : (employees?.length > 0 ? 'Active' : 'Empty')}
              </p>
              <Link to="/employees" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1">
                Directory <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Modules */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 opacity-60 bg-gray-50 dark:bg-surface-900/50 border-dashed border-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <FolderKanban size={24} />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-surface-800 dark:text-gray-300 uppercase">Phase 2C</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Projects</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage organizational projects, budgets, and timelines.</p>
          </Card>

          <Card className="p-6 opacity-60 bg-gray-50 dark:bg-surface-900/50 border-dashed border-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                <CheckSquare size={24} />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-surface-800 dark:text-gray-300 uppercase">Phase 2C</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Tasks</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Granular task assignment and progress tracking.</p>
          </Card>

          <Card className="p-6 opacity-60 bg-gray-50 dark:bg-surface-900/50 border-dashed border-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Bot size={24} />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-surface-800 dark:text-gray-300 uppercase">Phase 3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">AI Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Intelligent automation and insights engine.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
