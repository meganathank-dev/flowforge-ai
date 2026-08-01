import { useHealthCheck } from '../hooks/useHealthCheck.js';

/**
 * StatusIndicator — renders a colored dot with label and value.
 */
const StatusIndicator = ({ label, status, detail }) => {
  const isConnected = status === 'connected';
  const dotColor = isConnected ? 'bg-success' : 'bg-error';
  const glowColor = isConnected
    ? 'shadow-[0_0_8px_rgba(16,185,129,0.6)]'
    : 'shadow-[0_0_8px_rgba(239,68,68,0.6)]';

  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-800/50 px-5 py-4 border border-surface-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${dotColor} ${glowColor} animate-pulse`} />
        <span className="text-sm font-medium text-surface-300">{label}</span>
      </div>
      <span
        className={`text-sm font-semibold ${isConnected ? 'text-success' : 'text-error'}`}
      >
        {detail}
      </span>
    </div>
  );
};

/**
 * Foundation verification page.
 *
 * Displays:
 * - FlowForge AI branding
 * - Foundation Environment label
 * - Backend connection status
 * - Database connection status
 *
 * This is a TECHNICAL VERIFICATION page only.
 */
const FoundationPage = () => {
  const { status, data, error, isLoading, refetch } = useHealthCheck();

  const backendStatus = isLoading ? 'checking' : status === 'connected' ? 'connected' : 'disconnected';
  const dbStatus = data?.database === 'connected' ? 'connected' : 'disconnected';

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            FlowForge AI
          </h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-widest text-primary-400">
            Foundation Environment
          </p>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl border border-surface-700/50 bg-surface-900/80 p-6 shadow-2xl backdrop-blur-md">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-surface-400">
            System Status
          </h2>

          <div className="space-y-3">
            <StatusIndicator
              label="Backend Server"
              status={backendStatus}
              detail={isLoading ? 'Checking...' : backendStatus === 'connected' ? 'Online' : 'Offline'}
            />
            <StatusIndicator
              label="Database"
              status={status === 'connected' ? dbStatus : 'disconnected'}
              detail={
                isLoading
                  ? 'Checking...'
                  : status !== 'connected'
                    ? 'Unreachable'
                    : dbStatus === 'connected'
                      ? 'Connected'
                      : 'Disconnected'
              }
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error border border-error/20">
              {error}
            </div>
          )}

          {/* Uptime & Timestamp */}
          {data && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-surface-800/40 px-4 py-3 text-center">
                <p className="text-xs text-surface-400">Uptime</p>
                <p className="mt-1 text-lg font-semibold text-white">{data.uptime}s</p>
              </div>
              <div className="rounded-lg bg-surface-800/40 px-4 py-3 text-center">
                <p className="text-xs text-surface-400">Timestamp</p>
                <p className="mt-1 text-xs font-medium text-surface-200 leading-relaxed">
                  {new Date(data.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Refresh button */}
          <button
            onClick={refetch}
            disabled={isLoading}
            className="mt-5 w-full cursor-pointer rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Refresh Status'}
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-surface-500">
          Phase 0 — Technical Foundation Verification
        </p>
      </div>
    </div>
  );
};

export default FoundationPage;
