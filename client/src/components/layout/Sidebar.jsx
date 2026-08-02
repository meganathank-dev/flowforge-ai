import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/organization', label: 'Organization', icon: Building2 },
];

const futureItems = [
  { path: '#', label: 'Projects (Phase 2C)', icon: FolderKanban, disabled: true },
  { path: '#', label: 'Teams (Phase 2B)', icon: Users, disabled: true },
];

export const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 flex flex-col
        bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            FlowForge AI
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 -mr-2 text-gray-500 rounded-md hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }
              `}
            >
              <item.icon size={18} className="shrink-0" />
              {item.label}
            </NavLink>
          ))}

          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 mb-3">
              Upcoming Features
            </p>
            {futureItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60"
                title="Available in future phases"
              >
                <item.icon size={18} className="shrink-0" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
