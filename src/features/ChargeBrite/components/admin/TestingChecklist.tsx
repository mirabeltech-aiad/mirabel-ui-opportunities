import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, RotateCcw, FileText, BarChart3 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { reportsConfig } from '../../data/reports';

interface TestItem {
  id: string;
  name: string;
  type: 'dashboard' | 'report';
  category: string;
  route?: string;
  tested: boolean;
}

const TestingChecklist: React.FC = () => {
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'dashboard' | 'report'>('all');

  // Initialize test items
  useEffect(() => {
    const items: TestItem[] = [
      // Dashboards
      { id: 'admin-overview', name: 'Admin Overview', type: 'dashboard', category: 'Admin', route: '/admin', tested: false },
      { id: 'services-monitor', name: 'Services Monitor', type: 'dashboard', category: 'Admin', route: '/admin', tested: false },
      { id: 'auth-keys', name: 'Auth Keys Manager', type: 'dashboard', category: 'Admin', route: '/admin', tested: false },
      { id: 'help-management', name: 'Help Management', type: 'dashboard', category: 'Admin', route: '/admin', tested: false },
      { id: 'settings-dashboard', name: 'Settings Dashboard', type: 'dashboard', category: 'Settings', route: '/settings', tested: false },
      { id: 'business-model-settings', name: 'Business Model Settings', type: 'dashboard', category: 'Settings', route: '/settings', tested: false },
      { id: 'reports-directory', name: 'Reports Directory', type: 'dashboard', category: 'Reports', route: '/reports', tested: false },
      
      // Reports from actual reports config
      ...reportsConfig.map(report => ({
        id: report.id,
        name: report.title,
        type: 'report' as const,
        category: report.category,
        tested: false
      }))
    ];

    // Load saved test status from localStorage
    const savedStatus = localStorage.getItem('admin-testing-checklist');
    if (savedStatus) {
      const parsed = JSON.parse(savedStatus);
      items.forEach(item => {
        const saved = parsed.find((s: any) => s.id === item.id);
        if (saved) {
          item.tested = saved.tested;
        }
      });
    }

    setTestItems(items);
  }, []);

  // Save test status to localStorage
  const saveTestStatus = (updatedItems: TestItem[]) => {
    const statusData = updatedItems.map(item => ({ id: item.id, tested: item.tested }));
    localStorage.setItem('admin-testing-checklist', JSON.stringify(statusData));
  };

  const toggleTested = (id: string) => {
    const updatedItems = testItems.map(item =>
      item.id === id ? { ...item, tested: !item.tested } : item
    );
    setTestItems(updatedItems);
    saveTestStatus(updatedItems);
  };

  const resetAll = () => {
    const resetItems = testItems.map(item => ({ ...item, tested: false }));
    setTestItems(resetItems);
    saveTestStatus(resetItems);
  };

  const markAllTested = () => {
    const testedItems = testItems.map(item => ({ ...item, tested: true }));
    setTestItems(testedItems);
    saveTestStatus(testedItems);
  };

  const filteredItems = testItems.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const testedCount = testItems.filter(item => item.tested).length;
  const totalCount = testItems.length;
  const progressPercentage = Math.round((testedCount / totalCount) * 100);

  const getTypeIcon = (type: 'dashboard' | 'report') => {
    return type === 'dashboard' ? (
      <BarChart3 className="h-4 w-4 text-blue-600" />
    ) : (
      <FileText className="h-4 w-4 text-purple-600" />
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-ocean-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Testing Checklist
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Track testing progress for all dashboards and reports
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-ocean-800">
                {testedCount}/{totalCount}
              </div>
              <div className="text-sm text-gray-600">
                {progressPercentage}% Complete
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-ocean-500 text-white hover:bg-ocean-600' : ''}
              >
                All ({testItems.length})
              </Button>
              <Button
                size="sm"
                variant={filter === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setFilter('dashboard')}
                className={filter === 'dashboard' ? 'bg-ocean-500 text-white hover:bg-ocean-600' : ''}
              >
                Dashboards ({testItems.filter(i => i.type === 'dashboard').length})
              </Button>
              <Button
                size="sm"
                variant={filter === 'report' ? 'default' : 'outline'}
                onClick={() => setFilter('report')}
                className={filter === 'report' ? 'bg-ocean-500 text-white hover:bg-ocean-600' : ''}
              >
                Reports ({testItems.filter(i => i.type === 'report').length})
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={markAllTested}
                className="hover:bg-green-50 hover:border-green-300"
              >
                Mark All Tested
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={resetAll}
                className="hover:bg-red-50 hover:border-red-300"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset All
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-ocean-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-11 bg-gray-50">Tested</TableHead>
                <TableHead className="h-11 bg-gray-50">Type</TableHead>
                <TableHead className="h-11 bg-gray-50">Name</TableHead>
                <TableHead className="h-11 bg-gray-50">Category</TableHead>
                <TableHead className="h-11 bg-gray-50">Route</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="py-2.5">
                    <Checkbox
                      checked={item.tested}
                      onCheckedChange={() => toggleTested(item.id)}
                      className="data-[state=checked]:bg-ocean-500 data-[state=checked]:border-ocean-500"
                    />
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <Badge
                        variant={item.type === 'dashboard' ? 'secondary' : 'outline'}
                        className={
                          item.type === 'dashboard'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-purple-100 text-purple-700 border-purple-200'
                        }
                      >
                        {item.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-2">
                      {item.tested ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={item.tested ? 'text-green-600 font-medium' : ''}>
                        {item.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge variant="outline" className="text-gray-600">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2.5">
                    {item.route && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {item.route}
                      </code>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingChecklist;