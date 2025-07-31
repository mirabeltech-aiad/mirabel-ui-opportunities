import React, { useEffect, useState } from 'react';
import { HomeProvider, useHome } from './contexts/HomeContext';
import TabNavigation from './components/TabNavigation';
import HelpSystem from './components/HelpSystem';
import TermsAndConditionsModal from './components/TermsAndConditionsModal';
import ChangePasswordManager from './components/ChangePasswordManager';
import JobFunctionNotification from './components/JobFunctionNotification';
import axiosService from '../../services/axiosService';
import navigationService from './services/navigationService';
import { validateLocalStorage } from '../../utils/sessionHelpers';

const API_USER_ACCOUNTS_CHECKCONDITION = '/services/User/Accounts/CheckCondition/';

const Home = () => {

  debugger;
  const [showJobFunction, setShowJobFunction] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Validate localStorage first
        const isLocalStorageValid = validateLocalStorage();
        console.log('🔍 localStorage validation result:', isLocalStorageValid);
        
        const sessionDataResponse = await navigationService.loadSessionDetails();
        
        // Ensure session data is properly loaded and not just fallback values
        if (sessionDataResponse && typeof sessionDataResponse === 'object') {
          // Wait a bit to ensure localStorage write is complete
          await new Promise(resolve => setTimeout(resolve, 100));
          setIsSessionLoaded(true);
          
          // Check Job Function Notification
          const checkJobFunctionCondition = async () => {
            try {
              const res = await axiosService.get(`${API_USER_ACCOUNTS_CHECKCONDITION}${1}/-1`);
              if (res?.Data || res?.content?.Data) {
                setShowJobFunction(true);
              }
            } catch (e) {
              console.log(e,"e");
            }
          };
          checkJobFunctionCondition();
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