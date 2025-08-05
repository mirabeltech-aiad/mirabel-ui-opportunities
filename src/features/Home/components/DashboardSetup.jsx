import React from 'react';
import { useHome } from '../contexts/HomeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Settings } from 'lucide-react';

/**
 * DashboardSetup Component
 * Provides dashboard setup functionality similar to C# SetupDashboard method
 */
const DashboardSetup = ({ source = "", isReload = false, showControls = true }) => {
  const { 
    actions: { setupDashboard }, 
    dashboards, 
    selectedDashboard, 
    dashboardsLoading,
    sessionData 
  } = useHome();

  const handleSetupDashboard = async () => {
    try {
      await setupDashboard(source, isReload);
    } catch (error) {
      console.error('Failed to setup dashboard:', error);
    }
  };

  const handleReloadDashboard = async () => {
    try {
      await setupDashboard(source, true);
    } catch (error) {
      console.error('Failed to reload dashboard:', error);
    }
  };

  // Auto-setup dashboard on component mount (similar to C# if (!X.IsAjaxRequest) { SetupDashboard(); })
  React.useEffect(() => {
    if (!source || source.toUpperCase() !== 'AD') {
      handleSetupDashboard();
    }
  }, []);

  if (!showControls) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Dashboard Setup
        </CardTitle>
        <CardDescription>
          Manage dashboard configuration and settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Session Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Package Type:</span>
              <Badge variant="outline" className="ml-2">
                {sessionData?.PackageTypeID || 'Unknown'}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Admin:</span>
              <Badge variant={sessionData?.IsAdmin ? "default" : "secondary"} className="ml-2">
                {sessionData?.IsAdmin ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Dashboard Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Dashboard Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Dashboards:</span>
              <Badge variant="outline">{dashboards.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Selected Dashboard:</span>
              <Badge variant="default">
                {selectedDashboard?.DashBoardName || 'None'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Loading:</span>
              <Badge variant={dashboardsLoading ? "destructive" : "default"}>
                {dashboardsLoading ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleSetupDashboard}
            disabled={dashboardsLoading}
            className="flex-1"
          >
            {dashboardsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Setup Dashboard
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleReloadDashboard}
            disabled={dashboardsLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload
          </Button>
        </div>

        {/* Dashboard List */}
        {dashboards.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Available Dashboards</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {dashboards.map((dashboard) => (
                <div 
                  key={dashboard.ID}
                  className={`p-2 rounded border text-sm ${
                    selectedDashboard?.ID === dashboard.ID 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dashboard.DashBoardName}</span>
                    <div className="flex gap-1">
                      {dashboard.IsDefault && (
                        <Badge variant="default" className="text-xs">Default</Badge>
                      )}
                      {dashboard.URL?.toUpperCase().includes('ISMKM=1') && (
                        <Badge variant="secondary" className="text-xs">MKM</Badge>
                      )}
                    </div>
                  </div>
                  {dashboard.URL && (
                    <div className="text-xs text-muted-foreground truncate mt-1">
                      {dashboard.URL}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardSetup; 