
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const ColorCustomizer = () => {
  const [colors, setColors] = useState({
    primary: '#1a4d80',
    secondary: '#4fb3ff',
    success: '#06d6a0',
    warning: '#ffbe0b',
    danger: '#fb5607'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved colors from localStorage
    const savedColors = localStorage.getItem('dashboard_colors');
    if (savedColors) {
      setColors(JSON.parse(savedColors));
    }
  }, []);

  const handleColorChange = (colorKey, value) => {
    setColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API call
      localStorage.setItem('dashboard_colors', JSON.stringify(colors));
      
      // Apply colors to CSS custom properties
      document.documentElement.style.setProperty('--color-primary', colors.primary);
      document.documentElement.style.setProperty('--color-secondary', colors.secondary);
      document.documentElement.style.setProperty('--color-success', colors.success);
      document.documentElement.style.setProperty('--color-warning', colors.warning);
      document.documentElement.style.setProperty('--color-danger', colors.danger);
      
      toast({
        title: "Success",
        description: "Dashboard colors have been updated",
      });
    } catch (error) {
      console.error("Error saving colors:", error);
      toast({
        title: "Error",
        description: "Failed to save colors",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultColors = {
      primary: '#1a4d80',
      secondary: '#4fb3ff',
      success: '#06d6a0',
      warning: '#ffbe0b',
      danger: '#fb5607'
    };
    setColors(defaultColors);
  };

  const colorOptions = [
    { key: 'primary', label: 'Primary Color', description: 'Main dashboard text color' },
    { key: 'secondary', label: 'Secondary Color', description: 'Accent text color' },
    { key: 'success', label: 'Success Color', description: 'Success states and won opportunities' },
    { key: 'warning', label: 'Warning Color', description: 'Warning states and pending items' },
    { key: 'danger', label: 'Danger Color', description: 'Error states and lost opportunities' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Color Customization</CardTitle>
        <p className="text-sm text-gray-500">Customize the text colors for dashboard tiles and components</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {colorOptions.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">{label}</label>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: colors[key] }}
                />
                <Input
                  type="color"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-16 h-8 p-1 border-gray-300"
                />
                <Input
                  type="text"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-24 text-xs"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSaving ? "Saving..." : "Save Colors"}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
          >
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorCustomizer;
