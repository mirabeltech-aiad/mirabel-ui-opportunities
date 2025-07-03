
import React from 'react';
import { Input } from "@OpportunityComponents/ui/input";
import { Label } from "@OpportunityComponents/ui/label";
import { Button } from "@OpportunityComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";

const ComponentControls = ({ components, onChange }) => {
  const componentOptions = [
    { key: 'buttonRadius', label: 'Button Border Radius', description: 'Roundness of buttons' },
    { key: 'cardRadius', label: 'Card Border Radius', description: 'Roundness of cards' },
    { key: 'inputHeight', label: 'Input Height', description: 'Height of form inputs' },
    { key: 'cardShadow', label: 'Card Shadow', description: 'Box shadow for cards' }
  ];

  const handleChange = (key, value) => {
    onChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Component Configuration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {componentOptions.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <Input
              type="text"
              value={components[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={key === 'cardShadow' ? '0 1px 3px rgba(0,0,0,0.1)' : '0.75rem'}
            />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border rounded-md">
        <h4 className="font-medium mb-4">Component Preview</h4>
        <div className="space-y-4">
          <Button 
            style={{ 
              borderRadius: components.buttonRadius 
            }}
            className="mr-2"
          >
            Sample Button
          </Button>
          
          <Card 
            style={{ 
              borderRadius: components.cardRadius,
              boxShadow: components.cardShadow 
            }}
            className="max-w-xs"
          >
            <CardHeader>
              <CardTitle>Sample Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This shows how cards will look with your settings.</p>
            </CardContent>
          </Card>

          <Input 
            placeholder="Sample input field"
            style={{ 
              height: components.inputHeight,
              borderRadius: components.buttonRadius 
            }}
            className="max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentControls;
