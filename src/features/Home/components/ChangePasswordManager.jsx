import React, { useState, useEffect } from 'react';
import ChangePasswordAlert from './ChangePasswordAlert';
import ChangePasswordModal from './ChangePasswordModal';
import changePasswordService from '../services/changePasswordService';

/**
 * Change Password Manager Component
 * Orchestrates the change password flow with alert and iframe modal
 */
const ChangePasswordManager = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [changePasswordUrl, setChangePasswordUrl] = useState(null);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  // Check for change password requirement on mount and session data changes
  useEffect(() => {
    const checkChangePasswordRequirement = () => {
      // Don't show again if already shown in this session
      if (hasBeenShown) {
        return;
      }

      const changePasswordData = changePasswordService.getChangePasswordData();
      
      if (changePasswordData) {
        console.log('Change password required:', changePasswordData);
        
        // Generate the change password URL
        const url = changePasswordService.generateChangePasswordUrl(
          changePasswordData.email,
          changePasswordData.changePassword,
          changePasswordData.cultureUI
        );
        
        if (url) {
          setChangePasswordUrl(url);
          setShowModal(true);
          setHasBeenShown(true);
        } else {
          console.error('Failed to generate change password URL');
        }
      }
    };

    // Check immediately
    checkChangePasswordRequirement();

    // Also listen for storage changes in case session data is updated
    const handleStorageChange = (e) => {
      if (e.key === 'MMClientVars') {
        checkChangePasswordRequirement();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [hasBeenShown]);

  const handleAlertClose = () => {
    setShowAlert(false);
    // Note: We don't reset hasBeenShown here because user might try to close without fixing password
  };

  const handleAlertContinue = () => {
    setShowAlert(false);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Could optionally reset hasBeenShown here if you want to show the alert again
    // setHasBeenShown(false);
  };

  return (
    <>

      <ChangePasswordModal
        isOpen={showModal}
        onClose={handleModalClose}
        changePasswordUrl={changePasswordUrl}
      />
    </>
  );
};

export default ChangePasswordManager; 