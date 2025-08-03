import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Activity, Database, Cpu, HardDrive, Wifi } from 'lucide-react';

interface ServiceDetails {
  id: string;
  name: string;
  type: 'api' | 'database' | 'gateway' | 'worker';
  status: 'healthy' | 'warning' | 'error' | 'maintenance';
  instances: number;
  cpu: number;
  memory: number;
  requests: number;
  uptime: string;
  version: string;
  endpoints: string[];
  dependencies: string[];
}

const ServicesMonitor: React.FC = () => {
  const [services] = useState<ServiceDetails[]>([
    {
      id: '1',
      name: 'User Management Service',
      type: 'api',
      status: 'healthy',
      instances: 3,
      cpu: 45,
      memory: 62,
      requests: 1247,
      uptime: '15d 4h 23m',
      version: 'v2.1.3',
      endpoints: ['/api/users', '/api/profiles', '/api/preferences'],
      dependencies: ['Auth Service', 'MSSQL Primary']
    },
    {
      id: '2',
      name: 'Authentication Service',
      type: 'api',
      status: 'healthy',
      instances: 2,
      cpu: 23,
      memory: 41,
      requests: 892,
      uptime: '15d 4h 23m',
      version: 'v1.8.2',
      endpoints: ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'],
      dependencies: ['MSSQL Primary', 'Redis Cache']
    },
    {
      id: '3',
      name: 'Payment Processing Service',
      type: 'api',
      status: 'warning',
      instances: 2,
      cpu: 78,
      memory: 85,
      requests: 456,
      uptime: '12d 18h 45m',
      version: 'v3.2.1',
      endpoints: ['/api/payments', '/api/subscriptions', '/api/billing'],
      dependencies: ['User Service', 'MSSQL Primary', 'Stripe API']
    },
    {
      id: '4',
      name: 'MSSQL Primary Database',
      type: 'database',
      status: 'healthy',
      instances: 1,
      cpu: 34,
      memory: 67,
      requests: 2845,
      uptime: '45d 12h 8m',
      version: 'MSSQL 2022',
      endpoints: ['sql-primary-01.internal:1433'],
      dependencies: []
    },
    {
      id: '5',
      name: 'API Gateway',
      type: 'gateway',
      status: 'healthy',
      instances: 2,
      cpu: 12,
      memory: 28,
      requests: 3892,
      uptime: '15d 4h 23m',
      version: 'v1.5.0',
      endpoints: ['/gateway/*'],
      dependencies: ['All API Services']
    },
    {
      id: '6',
      name: 'Background Worker',
      type: 'worker',
      status: 'healthy',
      instances: 1,
      cpu: 8,
      memory: 15,
      requests: 234,
      uptime: '15d 4h 23m',
      version: 'v2.0.1',
      endpoints: ['Internal Queue Processing'],
      dependencies: ['Redis Queue', 'MSSQL Primary']
    }
  ]);

  const [selectedService, setSelectedService] = useState<ServiceDetails | null>(null);
  const [animatedBars, setAnimatedBars] = useState(false);

  // Trigger animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBars(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-700 bg-green-100 border-green-200';
      case 'warning': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'error': return 'text-red-700 bg-red-100 border-red-200';
      case 'maintenance': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Server className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'gateway': return <Wifi className="w-4 h-4" />;
      case 'worker': return <Cpu className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'bg-red-500';
    if (usage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-ocean-800">
            <Activity className="w-5 h-5 mr-2" />
            Microservices Monitor
          </CardTitle>
          <CardDescription>Real-time monitoring of all microservices and infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Service Overview</h3>
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedService?.id === service.id
                      ? 'border-ocean-500 bg-ocean-50'
                      : 'border-gray-200 bg-white hover:border-ocean-300'
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(service.type)}
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">CPU</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ease-out ${getUsageColor(service.cpu)}`}
                            style={{ 
                              width: animatedBars ? `${service.cpu}%` : '0%'
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{service.cpu}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Memory</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ease-out ${getUsageColor(service.memory)}`}
                            style={{ 
                              width: animatedBars ? `${service.memory}%` : '0%'
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{service.memory}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Instances</span>
                      <p className="text-lg font-semibold text-gray-900">{service.instances}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              {selectedService ? (
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getTypeIcon(selectedService.type)}
                        <span className="ml-2">{selectedService.name}</span>
                      </div>
                      <Badge className={getStatusColor(selectedService.status)}>
                        {selectedService.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Version {selectedService.version}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Activity className="w-4 h-4 text-ocean-600" />
                          <span className="text-sm font-medium text-gray-700">Requests/min</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{selectedService.requests}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <HardDrive className="w-4 h-4 text-ocean-600" />
                          <span className="text-sm font-medium text-gray-700">Uptime</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{selectedService.uptime}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Endpoints</h4>
                      <div className="space-y-1">
                        {selectedService.endpoints.map((endpoint, index) => (
                          <code key={index} className="block px-3 py-2 bg-gray-100 rounded text-sm font-mono">
                            {endpoint}
                          </code>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Dependencies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-ocean-gradient hover:opacity-90">
                        View Logs
                      </Button>
                      <Button variant="outline" size="sm">
                        Restart Service
                      </Button>
                      <Button variant="outline" size="sm">
                        Scale Instances
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Service</h3>
                    <p className="text-gray-600">Choose a service from the list to view detailed information</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesMonitor;
