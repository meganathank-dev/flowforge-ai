import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { Header } from '../components/layout/Header.jsx';
import { useOrganizationStore } from '../stores/organization.store.js';
import { useAuthStore } from '../stores/auth.store.js';
import { ROLES } from '../constants/roles.js';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { fetchCurrentOrganization } = useOrganizationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Only fetch org if the user is expected to have one.
    // super_admin might not have an org by default, but let's try fetching anyway.
    // If it fails, the store sets error but layout won't crash.
    if (user?.role !== ROLES.SUPER_ADMIN) {
      fetchCurrentOrganization();
    }
  }, [fetchCurrentOrganization, user?.role]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 font-sans">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
