import { Card } from '../../components/ui/Card.jsx';
import { useOrganizationStore } from '../../stores/organization.store.js';
import { Building2, Globe } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View your organization details. Configuration options are limited based on your role.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Information</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Building2 className="text-gray-400" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Name</p>
              <p className="text-base text-gray-900 dark:text-white">{organization.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Globe className="text-gray-400" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Domain</p>
              <p className="text-base text-gray-900 dark:text-white">{organization.domain || 'Not configured'}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
