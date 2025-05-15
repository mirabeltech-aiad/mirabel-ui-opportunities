import React from 'react';
import { FeatureSettingsProvider } from './context/FeatureSettingsProvider';
import FeatureSettings from './components/FeatureSettings';

export default function SiteWideDefaultsPage() {
  return (
    <FeatureSettingsProvider>
      <FeatureSettings />
    </FeatureSettingsProvider>
  );
}