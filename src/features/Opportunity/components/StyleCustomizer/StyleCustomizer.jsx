
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/features/Opportunity/hooks/use-toast";
import ColorControls from "./ColorControls";
import TypographyControls from "./TypographyControls";
import SpacingControls from "./SpacingControls";
import ComponentControls from "./ComponentControls";
import PageStyleManager from "./PageStyleManager";

const StyleCustomizer = () => {
  const [styleConfig, setStyleConfig] = useState({
    colors: {
      primary: '#1a4d80',
      secondary: '#4fb3ff',
      success: '#06d6a0',
      warning: '#ffbe0b',
      danger: '#fb5607',
      background: '#ffffff',
      text: '#333333',
      accent: '#e0e0e0'
    },
    typography: {
      fontFamily: 'system-ui',
      baseFontSize: '16px',
      headingWeight: '600',
      bodyWeight: '400',
      lineHeight: '1.5'
    },
    spacing: {
      baseUnit: '4px',
      containerPadding: '24px',
      sectionGap: '32px',
      elementGap: '16px'
    },
    components: {
      buttonRadius: '0.75rem',
      cardRadius: '0.75rem',
      inputHeight: '40px',
      cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
    },
    pageOverrides: {}
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved styles from localStorage
    const savedStyles = localStorage.getItem('site_style_config');
    if (savedStyles) {
      setStyleConfig(JSON.parse(savedStyles));
    }
    loadStylesFromConfig();
  }, []);

  const loadStylesFromConfig = () => {
    const savedStyles = localStorage.getItem('site_style_config');
    if (savedStyles) {
      const config = JSON.parse(savedStyles);
      applyStylesToDocument(config);
    }
  };

  const applyStylesToDocument = (config) => {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(config.colors || {}).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply typography
    if (config.typography) {
      root.style.setProperty('--font-family', config.typography.fontFamily);
      root.style.setProperty('--font-size-base', config.typography.baseFontSize);
      root.style.setProperty('--font-weight-heading', config.typography.headingWeight);
      root.style.setProperty('--font-weight-body', config.typography.bodyWeight);
      root.style.setProperty('--line-height', config.typography.lineHeight);
    }

    // Apply spacing
    if (config.spacing) {
      root.style.setProperty('--spacing-unit', config.spacing.baseUnit);
      root.style.setProperty('--container-padding', config.spacing.containerPadding);
      root.style.setProperty('--section-gap', config.spacing.sectionGap);
      root.style.setProperty('--element-gap', config.spacing.elementGap);
    }

    // Apply component styles
    if (config.components) {
      root.style.setProperty('--button-radius', config.components.buttonRadius);
      root.style.setProperty('--card-radius', config.components.cardRadius);
      root.style.setProperty('--input-height', config.components.inputHeight);
      root.style.setProperty('--card-shadow', config.components.cardShadow);
    }
  };

  const handleConfigChange = (category, updates) => {
    setStyleConfig(prev => ({
      ...prev,
      [category]: { ...prev[category], ...updates }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      localStorage.setItem('site_style_config', JSON.stringify(styleConfig));
      applyStylesToDocument(styleConfig);
      
      toast({
        title: "Success",
        description: "Style configuration has been saved and applied",
      });
    } catch (error) {
      console.error("Error saving styles:", error);
      toast({
        title: "Error",
        description: "Failed to save style configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultConfig = {
      colors: {
        primary: '#1a4d80',
        secondary: '#4fb3ff',
        success: '#06d6a0',
        warning: '#ffbe0b',
        danger: '#fb5607',
        background: '#ffffff',
        text: '#333333',
        accent: '#e0e0e0'
      },
      typography: {
        fontFamily: 'system-ui',
        baseFontSize: '16px',
        headingWeight: '600',
        bodyWeight: '400',
        lineHeight: '1.5'
      },
      spacing: {
        baseUnit: '4px',
        containerPadding: '24px',
        sectionGap: '32px',
        elementGap: '16px'
      },
      components: {
        buttonRadius: '0.75rem',
        cardRadius: '0.75rem',
        inputHeight: '40px',
        cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      },
      pageOverrides: {}
    };
    setStyleConfig(defaultConfig);
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(styleConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'style-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Style Management</CardTitle>
        <p className="text-sm text-gray-500">
          Comprehensive control over site appearance, typography, spacing, and page-specific styles
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6 mt-6">
            <ColorControls 
              colors={styleConfig.colors}
              onChange={(updates) => handleConfigChange('colors', updates)}
            />
          </TabsContent>

          <TabsContent value="typography" className="space-y-6 mt-6">
            <TypographyControls 
              typography={styleConfig.typography}
              onChange={(updates) => handleConfigChange('typography', updates)}
            />
          </TabsContent>

          <TabsContent value="spacing" className="space-y-6 mt-6">
            <SpacingControls 
              spacing={styleConfig.spacing}
              onChange={(updates) => handleConfigChange('spacing', updates)}
            />
          </TabsContent>

          <TabsContent value="components" className="space-y-6 mt-6">
            <ComponentControls 
              components={styleConfig.components}
              onChange={(updates) => handleConfigChange('components', updates)}
            />
          </TabsContent>

          <TabsContent value="pages" className="space-y-6 mt-6">
            <PageStyleManager 
              pageOverrides={styleConfig.pageOverrides}
              onChange={(updates) => handleConfigChange('pageOverrides', updates)}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-3 pt-6 border-t mt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSaving ? "Saving..." : "Save & Apply"}
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset to Default
          </Button>
          <Button onClick={exportConfig} variant="outline">
            Export Config
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleCustomizer;
