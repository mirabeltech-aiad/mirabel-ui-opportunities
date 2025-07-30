
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-ocean-800">
          <Key className="w-5 h-5 mr-2" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="ocean" className="h-12">
            Deploy New Service
          </Button>
          <Button variant="ocean-secondary" className="h-12">
            View Logs
          </Button>
          <Button variant="ocean-secondary" className="h-12">
            System Health Check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
