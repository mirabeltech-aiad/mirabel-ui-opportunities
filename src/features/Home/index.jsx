import React, { useEffect, useState } from 'react';
import { HomeProvider, useHome } from './contexts/HomeContext';
import TabNavigation from './components/TabNavigation';
import HelpSystem from './components/HelpSystem';
import TermsAndConditionsModal from './components/TermsAndConditionsModal';
import ChangePasswordManager from './components/ChangePasswordManager';
import JobFunctionNotification from './components/JobFunctionNotification';
import navigationService from './services/navigationService';
import { validateLocalStorage } from '../../utils/sessionHelpers';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import useHelpDragHandler from './hooks/useHelpDragHandler';
import IframeContainer from './components/IframeContainer';

const Home = () => {
  const [showJobFunction, setShowJobFunction] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  
  // Help drag handler
  const { handleDragEnd, setHelpDragHandler } = useHelpDragHandler();
  
  // DnD Kit sensors for help icon dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced activation distance for more responsive dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const sessionDataResponse = await navigationService.loadSessionDetails();
  
        if (sessionDataResponse && typeof sessionDataResponse === 'object') {
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
      <HomeContent 
        sensors={sensors}
        handleDragEnd={handleDragEnd}
        setHelpDragHandler={setHelpDragHandler}
        showJobFunction={showJobFunction}
        setShowJobFunction={setShowJobFunction}
      />
    </HomeProvider>
  ) : null;
};

const HomeContent = ({ sensors, handleDragEnd, setHelpDragHandler, showJobFunction, setShowJobFunction }) => {
  const { mmIntegrationSrc } = useHome();
  
  return (
    <>
      <IframeContainer
        url={mmIntegrationSrc}
        title="MM Integration"
        style={{ display: 'none' }}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => {
          // Optional: Add any logic needed when drag starts
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
          <TabNavigation />
          <HelpSystem onDragHandler={setHelpDragHandler} />
          <TermsAndConditionsModalWrapper />
          <ChangePasswordManager />
          <JobFunctionNotification
            isOpen={showJobFunction}
            onClose={() => setShowJobFunction(false)}
          />
        </div>
      </DndContext>
    </>
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