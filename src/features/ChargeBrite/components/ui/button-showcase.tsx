
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Save, Settings, Trash2, Edit, Plus } from 'lucide-react';

const ButtonShowcase: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800">Primary & Secondary Button System</CardTitle>
          <CardDescription>Ocean-themed primary and secondary button variants for consistent UX</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Primary Ocean Buttons */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ocean-800">Primary Ocean Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="ocean" size="sm">Small Primary</Button>
              <Button variant="ocean">Default Primary</Button>
              <Button variant="ocean" size="lg">Large Primary</Button>
              <Button variant="ocean" size="icon"><Save className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Secondary Ocean Buttons */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ocean-800">Secondary Ocean Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="ocean-secondary" size="sm">Small Secondary</Button>
              <Button variant="ocean-secondary">Default Secondary</Button>
              <Button variant="ocean-secondary" size="lg">Large Secondary</Button>
              <Button variant="ocean-secondary" size="icon"><Settings className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Outline & Ghost Variants */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ocean-800">Outline & Ghost Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="ocean-outline">Outline Button</Button>
              <Button variant="ocean-ghost">Ghost Button</Button>
            </div>
          </div>

          {/* Semantic Button Pairs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ocean-800">Semantic Button Pairs</h3>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Success Actions</h4>
              <div className="flex gap-3">
                <Button variant="success"><Plus className="h-4 w-4" />Create New</Button>
                <Button variant="success-secondary">View Details</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Warning Actions</h4>
              <div className="flex gap-3">
                <Button variant="warning"><Edit className="h-4 w-4" />Edit Item</Button>
                <Button variant="warning-secondary">Preview Changes</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Error/Destructive Actions</h4>
              <div className="flex gap-3">
                <Button variant="error"><Trash2 className="h-4 w-4" />Delete</Button>
                <Button variant="error-secondary">Cancel</Button>
              </div>
            </div>
          </div>

          {/* Multi-Action Examples */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ocean-800">Multi-Action Interface Examples</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Form Actions</h4>
                <div className="flex gap-3">
                  <Button variant="ocean">Save Changes</Button>
                  <Button variant="ocean-secondary">Save as Draft</Button>
                  <Button variant="ocean-outline">Preview</Button>
                  <Button variant="ocean-ghost">Cancel</Button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Data Export Actions</h4>
                <div className="flex gap-3">
                  <Button variant="ocean"><Download className="h-4 w-4" />Export All</Button>
                  <Button variant="ocean-secondary">Export Selected</Button>
                  <Button variant="ocean-outline">Export Custom</Button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Table Actions</h4>
                <div className="flex gap-3">
                  <Button variant="success" size="sm">Add New</Button>
                  <Button variant="ocean-secondary" size="sm">Bulk Edit</Button>
                  <Button variant="warning-secondary" size="sm">Archive</Button>
                  <Button variant="error-secondary" size="sm">Delete Selected</Button>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ButtonShowcase;
