import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server } from 'lucide-react';
import { HelpTooltip } from '../../components';

interface Service {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  instances: number;
  cpu: string;
  memory: string;
}

interface ServiceStatusListProps {
  services: Service[];
}

const ServiceStatusList: React.FC<ServiceStatusListProps> = ({ services }) => {
  const [animatedBars, setAnimatedBars] = useState(false);

  // Trigger animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBars(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Extracted for clarity - determines status indicator color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            Microservices Status
          </CardTitle>
          <HelpTooltip helpId="service-status-list" />
        </div>
        <CardDescription>Real-time status of all microservices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-500">{service.instances} instances</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>
                  {service.status}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">CPU: {service.cpu} | MEM: {service.memory}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceStatusList;
