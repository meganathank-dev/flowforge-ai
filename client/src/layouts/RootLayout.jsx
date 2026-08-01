import { Outlet } from 'react-router-dom';

/**
 * Root layout wrapper.
 * Renders child routes via <Outlet />.
 * Future: Add global navigation, sidebar, etc.
 */
const RootLayout = () => {
  return (
    <div className="min-h-screen bg-surface-950">
      <Outlet />
    </div>
  );
};

export default RootLayout;
