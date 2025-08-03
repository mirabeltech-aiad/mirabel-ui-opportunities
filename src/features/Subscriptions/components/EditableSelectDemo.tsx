
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableSelect } from '../components';

const EditableSelectDemo: React.FC = () => {
  const [serviceType, setServiceType] = useState('');
  const [serviceTypeOptions, setServiceTypeOptions] = useState([
    { value: 'api', label: 'API Service' },
    { value: 'database', label: 'Database Service' },
    { value: 'cache', label: 'Cache Service' },
    { value: 'queue', label: 'Message Queue' }
  ]);

  const [environment, setEnvironment] = useState('');
  const [environmentOptions, setEnvironmentOptions] = useState([
    { value: 'dev', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'prod', label: 'Production' }
  ]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Editable Select Fields Demo</CardTitle>
        <CardDescription>
          When Edit Mode is enabled, you'll see edit icons next to these select fields
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <EditableSelect
            value={serviceType}
            onValueChange={setServiceType}
            options={serviceTypeOptions}
            onOptionsChange={setServiceTypeOptions}
            placeholder="Select a service type..."
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Environment
          </label>
          <EditableSelect
            value={environment}
            onValueChange={setEnvironment}
            options={environmentOptions}
            onOptionsChange={setEnvironmentOptions}
            placeholder="Select an environment..."
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableSelectDemo;
