import { Card } from '../../components/ui/Card.jsx';
import { useOrganizationStore } from '../../stores/organization.store.js';
import { Building2, Globe, FileText, Settings } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';

export const OrganizationPage = () => {
  const { organization, isLoading, error } = useOrganizationStore();

  if (isLoading) {
    return <div className="text-center py-10">Loading organization details...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  if (!organization) {
    return <div className="text-center py-10">You are not assigned to any organization.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View your organization details. Configuration options are limited based on your role.
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings size={18} />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Information</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-surface-900 border border-gray-100 dark:border-gray-800">
                <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{organization.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-surface-900 border border-gray-100 dark:border-gray-800">
                <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Domain</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{organization.domain || 'Not configured'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 opacity-60 bg-gray-50 dark:bg-surface-900/50 border-dashed border-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gray-200 text-gray-600 dark:bg-surface-800 dark:text-gray-400">
                <FileText size={24} />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-surface-800 dark:text-gray-300 uppercase">Phase 2B</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Billing & Plans</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage subscriptions and billing details.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
