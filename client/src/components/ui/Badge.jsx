import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

const badgeVariants = {
  default: "bg-gray-100 text-gray-800 dark:bg-surface-800 dark:text-gray-200",
  primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400",
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const Badge = forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
      badgeVariants[variant],
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
