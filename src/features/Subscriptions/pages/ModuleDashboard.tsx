
/**
 * Module Dashboard - Central dashboard showing all available modules
 */

import React from 'react';
import { useModule } from '@/core/ModuleProvider';
import { useNavigation } from '@/core/NavigationManager';
import ModuleCard from '@/components/ui/module-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Settings,
  Activity,
  Clock
} from 'lucide-react';

const ModuleDashboard: React.FC = () => {
  const { modules, getModulesByCategory, isModuleLoaded } = useModule();
  const navigate = useNavigate();

  const getModuleMetrics = (moduleId: string) => {
    // Mock metrics - in real app, these would come from actual module data
    const mockMetrics: Record<string, Array<{ label: string; value: string | number; color?: string }>> = {
      'circulation-dashboard': [
        { label: 'Total Subscriptions', value: '12.5K', color: '#10b981' },
        { label: 'Active Rate', value: '94.2%', color: '#3b82f6' }
      ],
      'analytics-dashboard': [
        { label: 'Data Points', value: '2.3M', color: '#8b5cf6' },
        { label: 'Insights', value: '847', color: '#f43f5e' }
      ],
      'pricing-analysis': [
        { label: 'Revenue', value: '$1.2M', color: '#10b981' },
        { label: 'Optimization', value: '+15%', color: '#f59e0b' }
      ]
    };

    return mockMetrics[moduleId] || [];
  };

  const categories = {
    'analytics': {
      title: 'Analytics & Reporting',
      description: 'Data visualization and business intelligence modules',
      icon: BarChart3,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    'management': {
      title: 'Management Tools',
      description: 'Operational and administrative modules',
      icon: Settings,
      color: 'bg-gray-50 text-gray-700 border-gray-200'
    },
    'reporting': {
      title: 'Reporting Suite',
      description: 'Comprehensive reporting and documentation',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    'admin': {
      title: 'Administration',
      description: 'System administration and configuration',
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  };

  const handleModuleClick = (moduleRoute: string) => {
    navigate(moduleRoute);
  };

  const SystemOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{modules.length}</div>
              <div className="text-sm text-gray-600">Total Modules</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {modules.filter(m => isModuleLoaded(m.id)).length}
              </div>
              <div className="text-sm text-gray-600">Loaded Modules</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(categories).length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-lg">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">98.5%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ocean-800 mb-2">
          Analytics Platform Dashboard
        </h1>
        <p className="text-gray-600">
          Manage and access all your analytics modules from a single interface
        </p>
      </div>

      {/* System Overview */}
      <SystemOverview />

      {/* Module Categories */}
      {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
        const categoryModules = getModulesByCategory(categoryKey as any);
        
        if (categoryModules.length === 0) return null;

        const CategoryIcon = categoryInfo.icon;

        return (
          <div key={categoryKey} className="space-y-4">
            <Card className={`border-2 ${categoryInfo.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CategoryIcon className="h-6 w-6" />
                  {categoryInfo.title}
                  <Badge variant="outline">{categoryModules.length}</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {categoryInfo.description}
                </p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  title={module.name}
                  description={module.description || `${module.name} module for comprehensive data management`}
                  status={isModuleLoaded(module.id) ? 'active' : 'inactive'}
                  version={module.version}
                  category={module.category}
                  metrics={getModuleMetrics(module.id)}
                  onAction={() => handleModuleClick(module.route)}
                  actionLabel="Open Module"
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Quick Actions */}
      <Card className="bg-ocean-50 border-ocean-200">
        <CardHeader>
          <CardTitle className="text-ocean-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="ocean" onClick={() => navigate('/analytics')}>
              View Analytics
            </Button>
            <Button variant="ocean-secondary" onClick={() => navigate('/reports')}>
              Generate Report
            </Button>
            <Button variant="ocean-outline" onClick={() => navigate('/admin')}>
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleDashboard;
