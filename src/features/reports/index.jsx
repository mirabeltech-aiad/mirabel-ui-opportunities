
import React from 'react';
import { ReportsProvider } from './context/index.js';
import { ReportsDirectory } from './components/index.js';

/**
 * Main entry point for the Reports feature
 * Wraps the ReportsDirectory with the ReportsProvider
 */
const ReportsFeature = () => {
  return (
    <ReportsProvider>
      <ReportsDirectory />
    </ReportsProvider>
  );
};

export default ReportsFeature;
