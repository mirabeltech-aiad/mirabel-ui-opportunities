import React from 'react';
import { HomeProvider } from './contexts/HomeContext';
import TabNavigation from './components/TabNavigation';
import HelpSystem from './components/HelpSystem';
import { Toaster } from '@/components/ui/toaster';

const Home = () => {
  return (
    <HomeProvider>
      <div className="min-h-screen bg-gray-50">
        <TabNavigation />
        <HelpSystem />
        <Toaster />
      </div>
    </HomeProvider>
  );
};

export default Home; 