import { Card } from '../components/ui/Card.jsx';
import { useAuthStore } from '../stores/auth.store.js';
import { useOrganizationStore } from '../stores/organization.store.js';
import { Building2, Users, FolderKanban, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { organization, isLoading } = useOrganizationStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.email}. Here's what's happening today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {isLoading ? 'Loading...' : (organization?.name || 'Not Assigned')}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Role</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 opacity-75">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Directory</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              <Link to="/employees" className="text-primary-600 hover:underline">View All</Link>
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 opacity-50">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <FolderKanban size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects</p>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">Phase 2C</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
