import React from 'react';
import { FeatureSettingsProvider } from './context/FeatureSettingsProvider';
import DashboardDemoPage from './DashboardDemoPage';

export default function SiteWideDefaultsPage() {
  return (
    <FeatureSettingsProvider>
      <DashboardDemoPage />
    </FeatureSettingsProvider>
  );
}