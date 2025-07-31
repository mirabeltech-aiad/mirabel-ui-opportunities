import React, { useEffect, useState } from 'react';
import { HomeProvider, useHome } from './contexts/HomeContext';
import TabNavigation from './components/TabNavigation';
import HelpSystem from './components/HelpSystem';
import TermsAndConditionsModal from './components/TermsAndConditionsModal';
import ChangePasswordManager from './components/ChangePasswordManager';
import JobFunctionNotification from './components/JobFunctionNotification';
import axiosService from '../../services/axiosService';
import navigationService from './services/navigationService';

const API_USER_ACCOUNTS_CHECKCONDITION = '/services/User/Accounts/CheckCondition/';

const Home = () => {
  const [showJobFunction, setShowJobFunction] = useState(false);

  useEffect(() => {
    // On mount, check if we need to show the Job Function Notification
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
  }, []);
  return (
    <HomeProvider>
      <div className="min-h-screen bg-gray-50">
        <TabNavigation />
        <HelpSystem />
        <TermsAndConditionsModalWrapper />
        <ChangePasswordManager />
        <JobFunctionNotification
          isOpen={showJobFunction}
          onClose={() => setShowJobFunction(false)}
        />
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