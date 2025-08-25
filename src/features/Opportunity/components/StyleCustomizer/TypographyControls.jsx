
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TypographyControls = ({ typography, onChange }) => {
  const fontFamilies = [
    'system-ui',
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Open Sans, sans-serif',
    'Lato, sans-serif',
    'Poppins, sans-serif',
    'Montserrat, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Playfair Display, serif'
  ];

  const handleChange = (key, value) => {
    onChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Typography Configuration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select 
            value={typography.fontFamily} 
            onValueChange={(value) => handleChange('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Base Font Size</Label>
          <Input
            type="text"
            value={typography.baseFontSize}
            onChange={(e) => handleChange('baseFontSize', e.target.value)}
            placeholder="16px"
          />
        </div>

        <div className="space-y-2">
          <Label>Heading Weight</Label>
          <Select 
            value={typography.headingWeight} 
            onValueChange={(value) => handleChange('headingWeight', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">Light (300)</SelectItem>
              <SelectItem value="400">Normal (400)</SelectItem>
              <SelectItem value="500">Medium (500)</SelectItem>
              <SelectItem value="600">Semi-bold (600)</SelectItem>
              <SelectItem value="700">Bold (700)</SelectItem>
              <SelectItem value="800">Extra-bold (800)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Body Weight</Label>
          <Select 
            value={typography.bodyWeight} 
            onValueChange={(value) => handleChange('bodyWeight', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">Light (300)</SelectItem>
              <SelectItem value="400">Normal (400)</SelectItem>
              <SelectItem value="500">Medium (500)</SelectItem>
              <SelectItem value="600">Semi-bold (600)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Line Height</Label>
          <Input
            type="text"
            value={typography.lineHeight}
            onChange={(e) => handleChange('lineHeight', e.target.value)}
            placeholder="1.5"
          />
        </div>
      </div>

      <div className="mt-6 p-4 border rounded-md">
        <h4 className="font-medium mb-2">Preview</h4>
        <div style={{ 
          fontFamily: typography.fontFamily,
          fontSize: typography.baseFontSize,
          lineHeight: typography.lineHeight 
        }}>
          <h1 style={{ fontWeight: typography.headingWeight, fontSize: '2rem' }}>
            Heading Example
          </h1>
          <p style={{ fontWeight: typography.bodyWeight }}>
            This is sample body text to show how the typography settings will look across your site.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypographyControls;
