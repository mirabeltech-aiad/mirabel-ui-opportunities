import React from 'react';
import { HomeProvider } from './contexts/HomeContext';
import TabNavigation from './components/TabNavigation';
import HelpSystem from './components/HelpSystem';
import navigationService from './services/navigationService';

const Home = () => {
  React.useEffect(() => {
    // Load session details and set in localStorage on /ui60/home load
    navigationService.loadSessionDetails();
  }, []);
  return (
    <HomeProvider>
      <div className="min-h-screen bg-gray-50">
        <TabNavigation />
        <HelpSystem />
      </div>
    </HomeProvider>
  );
};

export default Home; 