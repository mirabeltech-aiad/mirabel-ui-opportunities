
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import { HelpTooltip } from '../../components';

const DatabaseStatus: React.FC = () => {
  // Static database connection data - extracted for clarity
  const databaseConnections = [
    {
      name: 'Primary Database',
      host: 'sql-primary-01.internal',
      status: 'Active'
    },
    {
      name: 'Read Replica 1',
      host: 'sql-replica-01.internal',
      status: 'Active'
    },
    {
      name: 'Read Replica 2',
      host: 'sql-replica-02.internal',
      status: 'Active'
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Database Connections
          </CardTitle>
          <HelpTooltip helpId="database-status" />
        </div>
        <CardDescription>MSSQL database cluster status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {databaseConnections.map((db, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <h4 className="font-medium text-green-900">{db.name}</h4>
                <p className="text-sm text-green-700">{db.host}</p>
              </div>
              <Badge className="bg-green-500">{db.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseStatus;
