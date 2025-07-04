
import React from 'react';
import { Input } from "@/components/ui/input";

/**
 * ColorControls provides an interface for customizing color scheme settings.
 * Allows users to modify primary, secondary, and semantic colors through
 * color pickers and hex input fields.
 * 
 * @component
 * @example
 * ```jsx
 * const [colors, setColors] = useState({
 *   primary: '#1a4d80',
 *   secondary: '#4fb3ff'
 * });
 * 
 * <ColorControls 
 *   colors={colors}
 *   onChange={(updates) => setColors(prev => ({...prev, ...updates}))}
 * />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {Object} props.colors - Current color configuration object
 * @param {string} props.colors.primary - Primary brand color (hex)
 * @param {string} props.colors.secondary - Secondary accent color (hex)
 * @param {string} props.colors.success - Success state color (hex)
 * @param {string} props.colors.warning - Warning state color (hex)
 * @param {string} props.colors.danger - Error/danger state color (hex)
 * @param {string} props.colors.background - Page background color (hex)
 * @param {string} props.colors.text - Primary text color (hex)
 * @param {string} props.colors.accent - UI accent elements color (hex)
 * @param {Function} props.onChange - Callback function called when colors change
 * @param {Object} props.onChange.updates - Object containing updated color values
 */
const ColorControls = ({ colors, onChange }) => {
  /**
   * Color configuration options with labels and descriptions
   * @type {Array<{key: string, label: string, description: string}>}
   */
  const colorOptions = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary Color', description: 'Accent brand color' },
    { key: 'success', label: 'Success Color', description: 'Success states' },
    { key: 'warning', label: 'Warning Color', description: 'Warning states' },
    { key: 'danger', label: 'Danger Color', description: 'Error states' },
    { key: 'background', label: 'Background Color', description: 'Page background' },
    { key: 'text', label: 'Text Color', description: 'Primary text color' },
    { key: 'accent', label: 'Accent Color', description: 'UI accent elements' }
  ];

  /**
   * Handles color value changes and triggers the onChange callback
   * @param {string} key - The color key being modified
   * @param {string} value - The new hex color value
   */
  const handleColorChange = (key, value) => {
    onChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Color Configuration</h3>
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
    </div>
  );
};

export default ColorControls;
