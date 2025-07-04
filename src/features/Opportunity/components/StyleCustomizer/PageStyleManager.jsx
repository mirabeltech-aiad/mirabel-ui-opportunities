import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

const PageStyleManager = ({ pageOverrides, onChange }) => {
  const [newPagePath, setNewPagePath] = useState('');
  const [selectedPage, setSelectedPage] = useState('');

  const pages = [
    { path: '/', name: 'Home' },
    { path: '/admin', name: 'Admin Panel' },
    { path: '/edit-opportunity/*', name: 'Edit Opportunity' },
    { path: '/pipeline', name: 'Pipeline' },
    { path: '/advanced-search', name: 'Advanced Search' },
    { path: '/custom-fields', name: 'Custom Fields' }
  ];

  const addPageOverride = () => {
    if (newPagePath && !pageOverrides[newPagePath]) {
      onChange({
        ...pageOverrides,
        [newPagePath]: {
          css: '',
          selectors: {},
          description: ''
        }
      });
      setNewPagePath('');
    }
  };

  const removePageOverride = (path) => {
    const updated = { ...pageOverrides };
    delete updated[path];
    onChange(updated);
  };

  const updatePageOverride = (path, field, value) => {
    onChange({
      ...pageOverrides,
      [path]: {
        ...pageOverrides[path],
        [field]: value
      }
    });
  };

  const addSelector = (path) => {
    const selectorName = prompt('Enter CSS selector (e.g., .accordion-trigger, #header):');
    if (selectorName) {
      updatePageOverride(path, 'selectors', {
        ...pageOverrides[path].selectors,
        [selectorName]: {
          styles: 'color: blue;\nfont-weight: bold;'
        }
      });
    }
  };

  const updateSelector = (path, selector, styles) => {
    updatePageOverride(path, 'selectors', {
      ...pageOverrides[path].selectors,
      [selector]: { styles }
    });
  };

  const removeSelector = (path, selector) => {
    const updated = { ...pageOverrides[path].selectors };
    delete updated[selector];
    updatePageOverride(path, 'selectors', updated);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Page-Specific Style Overrides</h3>
      <p className="text-sm text-gray-600">
        Create custom styles that apply only to specific pages. You can target specific elements using CSS selectors.
      </p>

      {/* Add New Page Override */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Page Override</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Select value={newPagePath} onValueChange={setNewPagePath}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a page or enter custom path" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.path} value={page.path}>
                    {page.name} ({page.path})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or enter custom path"
              value={newPagePath}
              onChange={(e) => setNewPagePath(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addPageOverride} disabled={!newPagePath}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Page Overrides */}
      {Object.entries(pageOverrides).map(([path, override]) => (
        <Card key={path}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {pages.find(p => p.path === path)?.name || 'Custom Page'} 
              <span className="text-sm font-normal text-gray-500 ml-2">({path})</span>
            </CardTitle>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => removePageOverride(path)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Description (optional)</Label>
              <Input
                placeholder="Describe these style changes..."
                value={override.description || ''}
                onChange={(e) => updatePageOverride(path, 'description', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Element-Specific Styles</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addSelector(path)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Selector
                </Button>
              </div>
              
              {Object.entries(override.selectors || {}).map(([selector, config]) => (
                <div key={selector} className="border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {selector}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeSelector(path, selector)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="CSS styles (e.g., color: blue; font-size: 16px;)"
                    value={config.styles}
                    onChange={(e) => updateSelector(path, selector, e.target.value)}
                    rows={3}
                  />
                </div>
              ))}
            </div>

            <div>
              <Label>Global Page CSS</Label>
              <Textarea
                placeholder="Add any additional CSS that applies to this entire page..."
                value={override.css || ''}
                onChange={(e) => updatePageOverride(path, 'css', e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {Object.keys(pageOverrides).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No page-specific overrides configured yet. Add one above to get started.
        </div>
      )}
    </div>
  );
};

export default PageStyleManager;
