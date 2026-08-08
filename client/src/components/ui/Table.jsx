import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full text-left text-sm whitespace-nowrap", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-gray-50 dark:bg-surface-800/50 text-gray-600 dark:text-gray-400 font-medium", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-200 dark:divide-gray-800", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "hover:bg-gray-50 dark:hover:bg-surface-800/50 transition-colors",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("px-6 py-3 font-medium", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-6 py-4", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
