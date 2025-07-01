import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Clock, CheckCircle, XCircle, Play, History } from "lucide-react";

const SyncManagementTab = () => {
  const [syncHistory, setSyncHistory] = useState([]);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  useEffect(() => {
    // Load sync history
    const savedHistory = localStorage.getItem("sync_history");
    if (savedHistory) {
      setSyncHistory(JSON.parse(savedHistory));
    }

    const lastSync = localStorage.getItem("last_sync_time");
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }

    const autoSync = localStorage.getItem("auto_sync_enabled");
    setAutoSyncEnabled(autoSync === "true");
  }, []);

  const addSyncRecord = (status, recordsProcessed = 0, error = null) => {
    const newRecord = {
      id: Date.now(),
      timestamp: new Date(),
      status,
      recordsProcessed,
      error,
      type: "manual"
    };

    const updatedHistory = [newRecord, ...syncHistory].slice(0, 10); // Keep last 10 records
    setSyncHistory(updatedHistory);
    localStorage.setItem("sync_history", JSON.stringify(updatedHistory));
    
    if (status === "success") {
      setLastSyncTime(newRecord.timestamp);
      localStorage.setItem("last_sync_time", newRecord.timestamp.toISOString());
    }
  };

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const recordsProcessed = Math.floor(Math.random() * 50) + 10;
      addSyncRecord("success", recordsProcessed);
      
      toast({
        title: "Sync Complete",
        description: `Successfully processed ${recordsProcessed} records`,
      });
    } catch (error) {
      addSyncRecord("error", 0, "Connection timeout");
      
      toast({
        title: "Sync Failed",
        description: "Failed to sync with platform",
        variant: "destructive",
      });
    } finally {
      setIsManualSyncing(false);
    }
  };

  const toggleAutoSync = () => {
    const newAutoSync = !autoSyncEnabled;
    setAutoSyncEnabled(newAutoSync);
    localStorage.setItem("auto_sync_enabled", newAutoSync.toString());
    
    toast({
      title: newAutoSync ? "Auto-sync Enabled" : "Auto-sync Disabled",
      description: newAutoSync 
        ? "Data will sync automatically every hour" 
        : "Manual sync only",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return <Badge variant="green">Success</Badge>;
      case "error":
        return <Badge variant="red">Error</Badge>;
      case "in-progress":
        return <Badge variant="blue">In Progress</Badge>;
      default:
        return <Badge variant="gray">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Sync Management</h2>
        <p className="text-gray-500">Manage data synchronization with your platform</p>
      </div>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Sync Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {lastSyncTime ? "Connected" : "Never"}
              </div>
              <div className="text-sm text-gray-500">Last Sync</div>
              {lastSyncTime && (
                <div className="text-xs text-gray-400 mt-1">
                  {lastSyncTime.toLocaleString()}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {syncHistory.filter(s => s.status === "success").length}
              </div>
              <div className="text-sm text-gray-500">Successful Syncs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {syncHistory.filter(s => s.status === "error").length}
              </div>
              <div className="text-sm text-gray-500">Failed Syncs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Manual Sync</h4>
              <p className="text-sm text-gray-500">Trigger immediate data synchronization</p>
            </div>
            <Button 
              onClick={handleManualSync}
              disabled={isManualSyncing}
              className="min-w-[120px]"
            >
              {isManualSyncing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Sync
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto Sync</h4>
              <p className="text-sm text-gray-500">Automatically sync data every hour</p>
            </div>
            <Button 
              onClick={toggleAutoSync}
              variant={autoSyncEnabled ? "default" : "outline"}
            >
              <Clock className="h-4 w-4 mr-2" />
              {autoSyncEnabled ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Sync History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {syncHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(record.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell>
                      {record.recordsProcessed > 0 ? record.recordsProcessed : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {record.error && (
                        <span className="text-sm text-red-600">{record.error}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Sync History</h3>
              <p className="text-gray-500">
                Run your first sync to see history here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SyncManagementTab;
