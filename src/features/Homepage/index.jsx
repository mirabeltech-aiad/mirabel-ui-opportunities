import React from 'react';
import { HomeProvider, useHome } from './contexts/HomeContext';
import TabNavigation from './components/TabNavigation';
import HelpSystem from './components/HelpSystem';
import TermsAndConditionsModal from './components/TermsAndConditionsModal';
import { Toaster } from '@/components/ui/toaster';

const Home = () => {
  return (
    <HomeProvider>
      <div className="min-h-screen bg-gray-50">
        <TabNavigation />
        <HelpSystem />
        <TermsAndConditionsModalWrapper />
      </div>
    </HomeProvider>
  );
};

const TermsAndConditionsModalWrapper = () => {
  const { showTermsModal, actions } = useHome();
  
  return (
    <TermsAndConditionsModal
      isOpen={showTermsModal}
      onClose={actions.hideTermsModal}
      onAccept={actions.hideTermsModal}
    />
  );
};

export default Home; 