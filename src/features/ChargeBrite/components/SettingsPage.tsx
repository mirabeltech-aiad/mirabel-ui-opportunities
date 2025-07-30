
// JSX component - React import removed for React 18+
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useEditMode } from '../contexts/EditModeContext';
import { Settings, Edit, Info } from 'lucide-react';
import EditableSelectDemo from './EditableSelectDemo';
import BusinessModelSettings from './settings/BusinessModelSettings';
import ReportsByModel from './settings/ReportsByModel';

const SettingsPage: React.FC = () => {
  const { isEditMode, toggleEditMode } = useEditMode();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-ocean-600" />
        <div>
          <h1 className="text-3xl font-bold text-ocean-800">Settings</h1>
          <p className="text-lg text-gray-600">Configure your application preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Business Model Settings - First Priority */}
        <BusinessModelSettings />

        {/* Reports by Business Model */}
        <ReportsByModel />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-ocean-600" />
              Edit Mode Settings
            </CardTitle>
            <CardDescription>
              Control administrative editing capabilities across the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">Administrator Edit Mode</h3>
                  <Badge variant={isEditMode ? "default" : "secondary"} className={isEditMode ? "bg-green-500" : ""}>
                    {isEditMode ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  When enabled, edit icons will appear next to select fields throughout the application, 
                  allowing administrators to modify field options and configurations.
                </p>
              </div>
              <Switch
                checked={isEditMode}
                onCheckedChange={toggleEditMode}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">How Edit Mode Works</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Edit icons appear next to select fields when enabled</li>
                    <li>• Click edit icons to modify dropdown options</li>
                    <li>• Changes are saved automatically</li>
                    <li>• Only visible to users with administrator privileges</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <EditableSelectDemo />
      </div>
    </div>
  );
};

export default SettingsPage;
