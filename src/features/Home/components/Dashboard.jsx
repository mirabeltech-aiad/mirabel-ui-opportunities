import React, { useMemo } from 'react';
import { useHome } from '../contexts/HomeContext';
import IframeContainer from './IframeContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Plus,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';

const Dashboard = () => {
  const { actions, selectedDashboard, dashboardsLoading } = useHome();

  // Memoize the iframe content to prevent unnecessary re-renders
  const iframeContent = useMemo(() => {
    if (selectedDashboard && selectedDashboard.URL) {
      return (
        <IframeContainer 
          url={selectedDashboard.URL}
          title={selectedDashboard.DashBoardName}
          name={`${selectedDashboard.ID}`} 
          className="h-full"
          key={selectedDashboard.ID} // Use dashboard ID as key to preserve state
        />
      );
    }
    return null;
  }, [selectedDashboard?.ID, selectedDashboard?.URL, selectedDashboard?.DashBoardName]);

  // Show loading state while dashboards are being fetched
  if (dashboardsLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600"></div>
      </div>
    );
  }

  // If a dashboard is selected and has a URL, show it in iframe
  if (iframeContent) {
    return iframeContent;
  }

  const quickActions = [
    {
      title: 'New Opportunity',
      description: 'Create a new sales opportunity',
      icon: Plus,
      action: () => actions.addTab({ title: 'New Opportunity', component: 'OpportunityForm', icon: '💼' }),
      color: 'bg-blue-500'
    },
    {
      title: 'View Reports',
      description: 'Access analytics and reports',
      icon: BarChart3,
      action: () => actions.addTab({ title: 'Reports', component: 'Reports', icon: '📊' }),
      color: 'bg-green-500'
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: Settings,
      action: () => actions.addTab({ title: 'Settings', component: 'Settings', icon: '⚙️' }),
      color: 'bg-purple-500'
    },
    {
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: HelpCircle,
      action: () => actions.toggleHelp(),
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    {
      title: 'Active Opportunities',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Total Contacts',
      value: '1,234',
      change: '+5%',
      changeType: 'positive',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Pipeline Value',
      value: '$2.4M',
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Meetings This Week',
      value: '8',
      change: '-2',
      changeType: 'negative',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  // Default dashboard content (shown when no specific dashboard is selected)
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-ocean-600 to-ocean-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-ocean-100">
          Here's what's happening with your opportunities today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-ocean-300"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Acme Corp Deal', value: '$500K', stage: 'Proposal', date: '2 hours ago' },
                { name: 'TechStart Inc', value: '$250K', stage: 'Negotiation', date: '1 day ago' },
                { name: 'Global Solutions', value: '$750K', stage: 'Discovery', date: '2 days ago' }
              ].map((opp, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{opp.name}</p>
                    <p className="text-sm text-gray-600">{opp.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{opp.value}</p>
                    <p className="text-sm text-gray-500">{opp.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: 'Follow up with Acme Corp', due: 'Today', priority: 'High' },
                { task: 'Prepare proposal for TechStart', due: 'Tomorrow', priority: 'Medium' },
                { task: 'Schedule demo with Global Solutions', due: 'Next Week', priority: 'Low' }
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{task.task}</p>
                    <p className="text-sm text-gray-600">Due: {task.due}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 