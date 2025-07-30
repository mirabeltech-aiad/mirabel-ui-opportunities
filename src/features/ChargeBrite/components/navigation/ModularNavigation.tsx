
/**
 * Modular Navigation - Dynamic navigation based on registered modules
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigation } from '@/core/NavigationManager';
import { useModule } from '@/core/ModuleProvider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ModularNavigationProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'sidebar';
  showCategories?: boolean;
  showBadges?: boolean;
}

export const ModularNavigation: React.FC<ModularNavigationProps> = ({
  className,
  variant = 'horizontal',
  showCategories = true,
  showBadges = true
}) => {
  const { items, activeItem } = useNavigation();
  const { getModulesByCategory, isModuleLoaded } = useModule();
  const location = useLocation();

  const getCategoryItems = () => {
    if (!showCategories) {
      return { '': items };
    }

    const categories: Record<string, typeof items> = {};
    items.forEach(item => {
      const category = item.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });

    return categories;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'horizontal':
        return 'flex flex-row gap-2 items-center';
      case 'vertical':
        return 'flex flex-col gap-1';
      case 'sidebar':
        return 'flex flex-col gap-1 w-full';
      default:
        return 'flex flex-row gap-2 items-center';
    }
  };

  const getLinkClasses = (isActive: boolean) => {
    const baseClasses = 'flex items-center gap-2 px-3 py-2 rounded-sm transition-colors text-sm font-medium';
    
    if (variant === 'sidebar') {
      return cn(
        baseClasses,
        'w-full justify-start',
        isActive 
          ? 'bg-white/20 text-white' 
          : 'text-blue-100 hover:text-white hover:bg-white/10'
      );
    }

    return cn(
      baseClasses,
      isActive 
        ? 'bg-white/20 text-white' 
        : 'text-blue-100 hover:text-white hover:bg-white/10'
    );
  };

  const CategorySection: React.FC<{ category: string; categoryItems: typeof items }> = ({ 
    category, 
    categoryItems 
  }) => (
    <div className={variant === 'sidebar' ? 'mb-4' : ''}>
      {showCategories && category && variant === 'sidebar' && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
          {category}
        </h3>
      )}
      <div className={getVariantClasses()}>
        {categoryItems.map((item) => {
          const isActive = activeItem === item.id || location.pathname === item.route;
          const Icon = item.icon;
          const loaded = isModuleLoaded(item.id);

          return (
            <Link
              key={item.id}
              to={item.route}
              className={getLinkClasses(isActive)}
            >
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              <span className="truncate">{item.name}</span>
              {showBadges && !loaded && (
                <Badge variant="outline" className="text-xs ml-auto">
                  Loading
                </Badge>
              )}
              {item.badge && (
                <Badge variant="outline" className="text-xs ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  const categories = getCategoryItems();

  return (
    <nav className={cn('', className)}>
      {Object.entries(categories).map(([category, categoryItems]) => (
        <CategorySection
          key={category}
          category={category}
          categoryItems={categoryItems}
        />
      ))}
    </nav>
  );
};

export default ModularNavigation;
