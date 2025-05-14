import React from 'react';
import { Button } from '@/components/ui/button';
import DashboardDemoPage from './DashboardDemoPage';
import { StoreSupplyProvider } from './context/StoreSupplyContext';

const SalesModule = () => {
  return (
    <StoreSupplyProvider>
      <div className="container mx-auto text-3xl font-bold text-center">
        <DashboardDemoPage />
      </div>
    </StoreSupplyProvider>
  );
};

export default SalesModule;
