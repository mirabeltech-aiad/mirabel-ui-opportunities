import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DatabaseSetup: React.FC = () => {
  const [setupState, setSetupState] = useState<'idle' | 'setting-up' | 'populating' | 'complete' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const setupDatabase = async () => {
    try {
      setSetupState('setting-up');
      setErrorMessage('');

      // First, create the database tables
      const setupResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!setupResponse.ok) {
        throw new Error('Failed to create database tables');
      }

      setSetupState('populating');

      // Then, populate with sample data
      const populateResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/populate-sample-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!populateResponse.ok) {
        throw new Error('Failed to populate sample data');
      }

      setSetupState('complete');
      toast({
        title: "Database Setup Complete!",
        description: "Your subscription database has been created and populated with sample data.",
      });

    } catch (error) {
      console.error('Database setup error:', error);
      setSetupState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: "Setup Failed",
        description: "There was an error setting up your database. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getButtonText = () => {
    switch (setupState) {
      case 'setting-up':
        return 'Creating Database Tables...';
      case 'populating':
        return 'Populating Sample Data...';
      case 'complete':
        return 'Setup Complete!';
      case 'error':
        return 'Retry Setup';
      default:
        return 'Setup Database & Sample Data';
    }
  };

  const getIcon = () => {
    switch (setupState) {
      case 'setting-up':
      case 'populating':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-ocean-800 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Setup Required
        </CardTitle>
        <CardDescription>
          Set up your subscription database with sample data to populate all charts and reports.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p className="mb-2">This will create:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Customer and subscription tables</li>
            <li>Revenue tracking and trial data</li>
            <li>Churn analysis and expansion events</li>
            <li>Sample data for testing all reports</li>
          </ul>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={setupDatabase}
            disabled={setupState === 'setting-up' || setupState === 'populating'}
            className="bg-ocean-500 text-white hover:bg-ocean-600"
          >
            {getIcon()}
            {getButtonText()}
          </Button>

          {setupState === 'complete' && (
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Ready to use real data in reports!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseSetup;