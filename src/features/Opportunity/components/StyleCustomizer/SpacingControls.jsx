
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SpacingControls = ({ spacing, onChange }) => {
  const spacingOptions = [
    { key: 'baseUnit', label: 'Base Unit', description: 'Fundamental spacing unit' },
    { key: 'containerPadding', label: 'Container Padding', description: 'Main container padding' },
    { key: 'sectionGap', label: 'Section Gap', description: 'Space between sections' },
    { key: 'elementGap', label: 'Element Gap', description: 'Space between elements' }
  ];

  const handleChange = (key, value) => {
    onChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Spacing Configuration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {spacingOptions.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <Input
              type="text"
              value={spacing[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder="16px"
            />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border rounded-md">
        <h4 className="font-medium mb-2">Preview</h4>
        <div className="space-y-2">
          <div 
            className="bg-blue-100 border border-blue-300 rounded"
            style={{ padding: spacing.containerPadding }}
          >
            Container (padding: {spacing.containerPadding})
            <div 
              className="mt-2 space-y-1"
              style={{ gap: spacing.sectionGap }}
            >
              <div 
                className="bg-green-100 border border-green-300 rounded p-2"
                style={{ marginBottom: spacing.sectionGap }}
              >
                Section 1 (gap: {spacing.sectionGap})
              </div>
              <div 
                className="bg-green-100 border border-green-300 rounded p-2 space-y-1"
                style={{ gap: spacing.elementGap }}
              >
                Section 2
                <div 
                  className="bg-yellow-100 border border-yellow-300 rounded p-1"
                  style={{ marginTop: spacing.elementGap }}
                >
                  Element (gap: {spacing.elementGap})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacingControls;
