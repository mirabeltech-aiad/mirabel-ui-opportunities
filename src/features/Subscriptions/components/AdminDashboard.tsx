
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from './dashboard/DashboardOverview';
import ServicesMonitor from './ServicesMonitor';
import AuthKeysManager from './AuthKeysManager';
import HelpManagement from './HelpManagement';
import DocumentationViewer from './DocumentationViewer';
import HelpGuide from './HelpGuide';
import TestingChecklist from './admin/TestingChecklist';

const AdminDashboard: React.FC = () => {
  // Static metrics data - preserved existing behavior
  const [metrics] = useState({
    totalServices: 12,
    activeConnections: 847,
    apiRequests: 15420,
    uptime: '99.9%'
  });

  // Static services data - preserved existing behavior
  const services = [
    { name: 'User Service', status: 'healthy' as const, instances: 3, cpu: '45%', memory: '62%' },
    { name: 'Auth Service', status: 'healthy' as const, instances: 2, cpu: '23%', memory: '41%' },
    { name: 'Payment Service', status: 'warning' as const, instances: 2, cpu: '78%', memory: '85%' },
    { name: 'Notification Service', status: 'healthy' as const, instances: 1, cpu: '12%', memory: '28%' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-blue-50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Services</TabsTrigger>
          <TabsTrigger value="auth-keys" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Auth Keys</TabsTrigger>
          <TabsTrigger value="testing" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Testing</TabsTrigger>
          <TabsTrigger value="documentation" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Documentation</TabsTrigger>
          <TabsTrigger value="help-guide" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Help Guide</TabsTrigger>
          <TabsTrigger value="help-instructions" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Tooltips Controls</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <DashboardOverview metrics={metrics} services={services} />
        </TabsContent>
        
        <TabsContent value="services">
          <ServicesMonitor />
        </TabsContent>
        
        <TabsContent value="auth-keys">
          <AuthKeysManager />
        </TabsContent>
        
        <TabsContent value="testing">
          <TestingChecklist />
        </TabsContent>
        
        <TabsContent value="documentation">
          <DocumentationViewer />
        </TabsContent>
        
        <TabsContent value="help-guide">
          <HelpGuide />
        </TabsContent>
        
        <TabsContent value="help-instructions">
          <HelpManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
