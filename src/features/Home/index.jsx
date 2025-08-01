import React, { useEffect, useState } from 'react';
import { HomeProvider, useHome } from './contexts/HomeContext';
import TabNavigation from './components/TabNavigation';
import HelpSystem from './components/HelpSystem';
import TermsAndConditionsModal from './components/TermsAndConditionsModal';
import ChangePasswordManager from './components/ChangePasswordManager';
import JobFunctionNotification from './components/JobFunctionNotification';
import navigationService from './services/navigationService';
import { validateLocalStorage } from '../../utils/sessionHelpers';

const Home = () => {
  const [showJobFunction, setShowJobFunction] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const sessionDataResponse = await navigationService.loadSessionDetails();
        // Ensure session data is properly loaded and not just fallback values
        if (sessionDataResponse && typeof sessionDataResponse === 'object') {
          // Wait a bit to ensure localStorage write is complete
          await new Promise(resolve => setTimeout(resolve, 100));
          setIsSessionLoaded(true);
          
          // Check Job Function Notification
          const shouldShowJobFunction = await navigationService.checkJobFunctionCondition(sessionDataResponse.UserID);
          setShowJobFunction(shouldShowJobFunction);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };
    
    initializeComponent();
  }, []);

  return isSessionLoaded ? (
    <HomeProvider sessionLoaded={true}>
     {isSessionLoaded && ( <div className="min-h-screen bg-gray-50">
        <TabNavigation />
        <HelpSystem />
       <TermsAndConditionsModalWrapper />
        <ChangePasswordManager />
        <JobFunctionNotification
          isOpen={showJobFunction}
          onClose={() => setShowJobFunction(false)}
        />
      </div>)}
    </HomeProvider>
  ) : null;
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