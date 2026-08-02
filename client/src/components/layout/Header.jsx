import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store.js';
import { useOrganizationStore } from '../../stores/organization.store.js';

export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { organization } = useOrganizationStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-4 bg-white/80 backdrop-blur-md border-b border-gray-200 sm:px-6 lg:px-8 dark:bg-gray-900/80 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-500 rounded-md hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <Menu size={24} />
        </button>

        {organization && (
          <div className="hidden sm:flex items-center">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {organization.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.email}</p>
            <p className="text-xs text-gray-500 capitalize dark:text-gray-400">{user?.role?.replace('_', ' ')}</p>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
            <UserIcon size={16} />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 ml-2 text-gray-500 transition-colors rounded-full hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/20"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
