import React from 'react';
import { useHome } from '../contexts/HomeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ChevronDown, Monitor, Settings } from 'lucide-react';

/**
 * DashboardMenu Component
 * Demonstrates how to use showDashboard function similar to C# menu items
 */
const DashboardMenu = () => {
  const { 
    actions: { showDashboard, toggleMKMWebsiteMenu, createAllPortals }, 
    dashboards, 
    selectedDashboard,
    isMKMMenuVisible,
    portals,
    portalsLoading,
    dashboardMenuItems
  } = useHome();

  const handleDashboardClick = async (menuItem) => {
    try {
      // Create item object similar to C# menu item
      const item = {
        id: menuItem.id,
        title: menuItem.text,
        DashBoardName: menuItem.text,
        ID: menuItem.id,
        URL: menuItem.url
      };

      // Call showDashboard function (mirrors C# showDashboard)
      await showDashboard(item, menuItem.url);
    } catch (error) {
      console.error('Failed to show dashboard/portal:', error);
    }
  };

  const handleMKMDashboardClick = async () => {
    try {
      // Create MKM dashboard item
      const mkmDashboardItem = {
        id: 'MKM_Dashboard',
        title: 'Settings',
        DashBoardName: 'MKM Settings',
        ID: 'mkm',
        URL: selectedDashboard?.URL || ''
      };

      // Call showDashboard for MKM
      await showDashboard(mkmDashboardItem, mkmDashboardItem.URL);
    } catch (error) {
      console.error('Failed to show MKM dashboard:', error);
    }
  };



  const handleCreatePortals = async () => {
    try {
      await createAllPortals();
    } catch (error) {
      console.error('Failed to create portals:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Dashboard Menu
        </CardTitle>
        <CardDescription>
          Dashboard selection menu (similar to C# menu items)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dashboard Menu Items (matching C# menuDashboard.Items) */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Dashboard Menu Items</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Select Dashboard/Portal</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[200px]">
              {dashboardMenuItems.map((menuItem) => {
                if (menuItem.type === 'separator') {
                  return <DropdownMenuSeparator key={menuItem.id} />;
                }
                
                return (
                  <DropdownMenuItem
                    key={menuItem.id}
                    onClick={() => handleDashboardClick(menuItem)}
                    className="flex items-center justify-between"
                  >
                    <span>{menuItem.text}</span>
                    <div className="flex gap-1">
                      {menuItem.type === 'dashboard' && menuItem.isDefault && (
                        <Badge variant="default" className="text-xs">Default</Badge>
                      )}
                      {menuItem.type === 'mkm' && (
                        <Badge variant="secondary" className="text-xs">MKM</Badge>
                      )}
                      {menuItem.type === 'portal' && (
                        <Badge variant="outline" className="text-xs">Portal</Badge>
                      )}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* MKM Dashboard Button */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">MKM Dashboard</h4>
          <Button
            variant="outline"
            onClick={handleMKMDashboardClick}
            className="w-full justify-start"
          >
            <Settings className="mr-2 h-4 w-4" />
            MKM Settings
          </Button>
        </div>

        {/* Portal Management */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Portal Management</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreatePortals}
              disabled={portalsLoading}
            >
              {portalsLoading ? 'Loading...' : 'Refresh Portals'}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground p-2 border rounded">
            Portals are now integrated into the Dashboard Menu Items above
          </div>
        </div>

        {/* Current Dashboard Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Current Dashboard</h4>
          <div className="p-3 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {selectedDashboard?.DashBoardName || 'No dashboard selected'}
              </span>
              {selectedDashboard?.URL?.toUpperCase().includes('ISMKM=1') && (
                <Badge variant="secondary">MKM</Badge>
              )}
            </div>
            {selectedDashboard?.URL && (
              <div className="text-xs text-muted-foreground truncate mt-1">
                {selectedDashboard.URL}
              </div>
            )}
          </div>
        </div>

        {/* MKM Menu Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">MKM Menu Status</h4>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm">MKM Website Menu:</span>
            <Badge variant={isMKMMenuVisible ? "default" : "secondary"}>
              {isMKMMenuVisible ? 'Visible' : 'Hidden'}
            </Badge>
          </div>
        </div>

        {/* Manual MKM Menu Toggle */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Manual MKM Menu Control</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleMKMWebsiteMenu('https://example.com/page?ismkm=1')}
            >
              Show MKM Menu
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleMKMWebsiteMenu('https://example.com/page')}
            >
              Hide MKM Menu
            </Button>
          </div>
        </div>

        {/* Dashboard List */}
        {dashboards.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">All Dashboards</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {dashboards.map((dashboard) => (
                <div 
                  key={dashboard.ID}
                  className={`p-2 rounded border text-sm cursor-pointer hover:bg-muted/50 ${
                    selectedDashboard?.ID === dashboard.ID 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-muted/50 border-border'
                  }`}
                  onClick={() => handleDashboardClick(dashboard)}
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

export default DashboardMenu; 