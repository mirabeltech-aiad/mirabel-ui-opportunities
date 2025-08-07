/**
 * Design System Components
 * Ready-to-use components that implement design tokens
 */

import React from 'react';
import { colorTokens, spacingTokens, designUtils } from '../../styles/designTokens';
import { cn } from '../../lib/utils';

// ===== OCEAN TITLE COMPONENT =====
interface OceanTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const OceanTitle: React.FC<OceanTitleProps> = ({ 
  level = 1, 
  className, 
  children, 
  ...props 
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const sizeClasses = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-bold', 
    3: 'text-xl font-semibold',
    4: 'text-lg font-semibold',
    5: 'text-base font-medium',
    6: 'text-sm font-medium'
  };

  return React.createElement(Tag, {
    className: cn('text-ocean-800', sizeClasses[level], className),
    ...props
  }, children);
};

// ===== OCEAN INTERACTIVE BUTTON =====
interface OceanButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const OceanButton: React.FC<OceanButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
    secondary: 'bg-ocean-100 text-ocean-800 hover:bg-ocean-200 border-ocean-200',
    outline: 'border-ocean-500 text-ocean-500 hover:bg-ocean-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-sm',
    md: 'px-4 py-2 text-sm rounded-md', 
    lg: 'px-6 py-3 text-base rounded-lg'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors border',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// ===== DESIGN SYSTEM CARD =====
interface DesignSystemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'pastel';
  pastelIndex?: number;
  children: React.ReactNode;
}

export const DesignSystemCard: React.FC<DesignSystemCardProps> = ({
  size = 'medium',
  variant = 'default', 
  pastelIndex = 0,
  className,
  children,
  style,
  ...props
}) => {
  const sizeStyles = {
    small: 'p-3 rounded-md shadow-sm',
    medium: 'p-4 rounded-md shadow-sm',
    large: 'p-6 rounded-lg shadow-sm hover:shadow-md'
  };

  const backgroundStyle = variant === 'pastel' 
    ? { backgroundColor: designUtils.getPastelColor(pastelIndex) }
    : { backgroundColor: size === 'large' ? colorTokens.backgrounds.white : colorTokens.backgrounds.cardBackground };

  return (
    <div
      className={cn(
        'border border-gray-200 transition-all duration-200',
        sizeStyles[size],
        className
      )}
      style={{ ...backgroundStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

// ===== SEMANTIC BADGE =====
interface SemanticBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'neutral' | 'success' | 'error' | 'active';
  children: React.ReactNode;
}

export const SemanticBadge: React.FC<SemanticBadgeProps> = ({
  variant,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        designUtils.getBadgeVariant(variant),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ===== DASHBOARD METRIC CARD =====
interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  type: 'service' | 'connection' | 'activity' | 'time';
  className?: string;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  subtitle,
  type,
  className
}) => {
  const metricColor = designUtils.getDashboardMetricColor(type);
  const pastelColor = designUtils.getDashboardMetricPastel(type);

  return (
    <DesignSystemCard size="medium" className={cn('text-center', className)}>
      <h3 className="text-black font-medium text-sm mb-2">{title}</h3>
      <div 
        className="text-2xl font-bold mb-1"
        style={{ color: metricColor }}
      >
        {value}
      </div>
      {subtitle && (
        <p 
          className="text-xs"
          style={{ color: pastelColor }}
        >
          {subtitle}
        </p>
      )}
    </DesignSystemCard>
  );
};

// ===== TABLE HEADER CELL =====
interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <th
      className={cn(
        'h-11 px-4 text-left align-middle font-medium text-muted-foreground',
        'bg-gray-50 text-sm',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

// ===== TABLE ROW =====
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <tr
      className={cn(
        'border-b transition-colors hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

// ===== TABLE CELL =====
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableCell: React.FC<TableCellProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <td
      className={cn(
        'py-2.5 px-4 align-middle text-sm',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};
