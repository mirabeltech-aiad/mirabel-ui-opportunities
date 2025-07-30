import React from 'react';
import { Plus, FileText, Globe, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHome } from '../contexts/HomeContext';

const NewTab = () => {
  const { actions } = useHome();

  const tabTypes = [
    {
      title: 'Component Tab',
      description: 'Add a React component as tab content',
      icon: Code,
      action: () => {
        const componentName = prompt('Enter component name:');
        if (componentName) {
          actions.addTab({
            title: componentName,
            component: componentName,
            type: 'component',
            icon: '⚛️'
          });
        }
      },
      color: 'bg-blue-500'
    },
    {
      title: 'URL Tab',
      description: 'Add an external URL as tab content',
      icon: Globe,
      action: () => {
        const url = prompt('Enter URL:');
        const title = prompt('Enter tab title:');
        if (url && title) {
          actions.addTab({
            title: title,
            url: url,
            type: 'iframe',
            icon: '🌐'
          });
        }
      },
      color: 'bg-green-500'
    },
    {
      title: 'Content Tab',
      description: 'Add custom content as tab',
      icon: FileText,
      action: () => {
        const title = prompt('Enter tab title:');
        const content = prompt('Enter content:');
        if (title && content) {
          actions.addTab({
            title: title,
            content: content,
            type: 'content',
            icon: '📄'
          });
        }
      },
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-ocean-600 to-ocean-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Tab</h1>
          <p className="text-gray-600">
            Choose how you'd like to add content to this tab
          </p>
        </div>

        {/* Tab Type Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tabTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-ocean-300"
                onClick={type.action}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Dashboard', component: 'Dashboard', icon: '📊' },
                { title: 'Reports', component: 'Reports', icon: '📈' },
                { title: 'Settings', component: 'Settings', icon: '⚙️' },
                { title: 'Help', action: () => actions.toggleHelp(), icon: '❓' }
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={action.action || (() => actions.addTab({
                    title: action.title,
                    component: action.component,
                    icon: action.icon
                  }))}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Use Tabs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-ocean-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Drag to Reorder</h4>
                  <p className="text-sm text-gray-600">
                    Click and drag tabs to reorder them in the tab bar
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-ocean-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Close Tabs</h4>
                  <p className="text-sm text-gray-600">
                    Click the X button on any tab to close it (except Dashboard)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-ocean-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Persistent Storage</h4>
                  <p className="text-sm text-gray-600">
                    Your tabs are automatically saved and will persist across browser sessions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewTab; 