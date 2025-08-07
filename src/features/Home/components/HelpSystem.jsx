import React, { useState, useEffect } from 'react';
import { useHome } from '../contexts/HomeContext';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Ticket, 
  ExternalLink, 
  X,
  BookOpen,
  Users,
  Mail,
  X as LucideX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JiraTicketForm from './JiraTicketForm';
import ContactConsultantForm from './ContactConsultantForm';
import ScheduleTrainingForm from './ScheduleTrainingForm';
import ContactSalesRepForm from './ContactSalesRepForm';
import { helpService } from '../services/helpService';
import { chatService } from '../services/chatService';
import { consultantService } from '../services/consultantService';
import { getUserInfo } from '@/utils/sessionHelpers';
import { useToast } from '@/components/ui/use-toast';
import {
  DndContext,
  useDraggable,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Custom draggable help icon component using dnd-kit
const DraggableHelpIcon = ({ position, onPositionChange, onClick, onHide }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: 'help-icon',
    data: {
      type: 'help-icon',
      position,
    },
  });

  const style = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    zIndex: 1000,
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    touchAction: 'none',
    willChange: isDragging ? 'transform' : 'auto',
    transform: CSS.Translate.toString(transform),
  };

  const handleClick = (e) => {
    if (!isDragging) {
      onClick(e);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group"
      onClick={handleClick}
    >
      <Button
        size="lg"
        className="bg-ocean-600 hover:bg-ocean-700 text-white border-2 border-white shadow-lg rounded-full w-14 h-14 p-0 transition-all duration-200"
        style={{
          userSelect: 'none',
          touchAction: 'none',
          pointerEvents: isDragging ? 'none' : 'auto',
        }}
      >
        <HelpCircle className="h-10 w-10" />
      </Button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Help
      </div>
      
      {/* Hide Help Icon Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onHide}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        title="Hide Help Icon"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

const HelpSystem = () => {
  const { helpVisible, helpPosition, actions } = useHome();
  
  const [helpIconVisible, setHelpIconVisible] = useState(true);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [isContactConsultantOpen, setIsContactConsultantOpen] = useState(false);
  const [showLivePhoneModal, setShowLivePhoneModal] = useState(false);
  const [showSalesRepForm, setShowSalesRepForm] = useState(false);
  const userInfo = getUserInfo();
  const isAdmin = userInfo?.isAdmin || userInfo?.IsAdmin || false;
  const [consultantInfo, setConsultantInfo] = useState(null);
  const { toast } = useToast();

  // Watch for consultant info changes and open form when available
  useEffect(() => {
    if (consultantInfo && consultantInfo.Data) {
      console.log('🔧 HelpSystem: Consultant info available, opening form');
      setIsContactConsultantOpen(true);
    }
  }, [consultantInfo]);

  const defaultHelpPosition = { x: typeof window !== 'undefined' ? window.innerWidth - 76 : 1320, y: typeof window !== 'undefined' ? window.innerHeight - 76 : 620 };

  // DnD Kit sensors
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

  // DnD Kit event handlers
  const handleDragStart = (event) => {
    // Optional: Add any logic needed when drag starts
  };



  const handleDragEnd = (event) => {
    const { active, delta } = event;
    
    if (active.id === 'help-icon') {
      // Calculate new position based on the delta
      const newX = helpPosition.x + delta.x;
      const newY = helpPosition.y + delta.y;
      
      // Constrain to viewport (button is 56px x 56px)
      const maxX = window.innerWidth - 56;
      const maxY = window.innerHeight - 56;
      
      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));
      
      // Update the position in the context
      actions.setHelpPosition({
        x: constrainedX,
        y: constrainedY
      });
    }
  };

  const helpOptions = [
    {
      id: 'help',
      title: 'Help',
      description: 'To access our help library of videos and documentation click here.',
      icon: BookOpen,
      action: () => helpService.openHelp(),
      color: 'bg-blue-500'
    },
    {
      id: 'chat',
      title: 'Chat',
      description: 'To ask a quick question on the software click here.',
      icon: MessageCircle,
      action: () => {
        chatService.showChat();
        actions.toggleHelp(); // Close help panel when chat is opened
      },
      color: 'bg-green-500'
    },
    {
      id: 'consultant',
      title: 'Contact your Consultant',
      description: 'To contact your Software Consultant click here.',
      icon: Users,
      action: async () => {
        try {
          const consultantData = await consultantService.getConsultantInfo();
          
          if (consultantData?.Status === 'Success') {
            setConsultantInfo(consultantData);
            // Form will be opened by useEffect when consultant info is set
          } else {
            toast({
              title: "Error loading consultant information",
              description: "Unable to load consultant details. Please try again.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error getting consultant info:', error);
          toast({
            title: "Error loading consultant information",
            description: "Unable to load consultant details. Please try again.",
            variant: "destructive",
          });
        }
      },
      color: 'bg-purple-500'
    },
    {
      id: 'training',
      title: 'Schedule Training',
      description: 'To schedule training with a Software Consultant click here.',
      icon: Calendar,
      action: () => setShowTrainingForm(true),
      color: 'bg-orange-500'
    },
    {
      id: 'ticket',
      title: 'Submit Ticket',
      description: 'If you experience an error in the software, click here to submit a ticket.',
      icon: Ticket,
      action: () => setShowTicketForm(true),
      color: 'bg-red-500'
    },
    {
      id: 'portal',
      title: 'Ticket Portal',
      description: 'To access your Tickets Portal click here.',
      icon: ExternalLink,
      action: () => window.open('https://mirabel.atlassian.net/servicedesk/customer/portal/4', '_blank'),
      color: 'bg-indigo-500'
    },
    {
      id: 'phone',
      title: 'Live Phone Support',
      description: 'Live on demand consulting.',
      icon: Phone,
      action: () => setShowLivePhoneModal(true),
      color: 'bg-teal-500'
    },
    {
      id: 'sales',
      title: 'Contact your Sales Rep',
      description: 'To contact our Sales Team click here.',
      icon: Mail,
      action: () => setShowSalesRepForm(true),
      color: 'bg-pink-500'
    }
  ];

  const handleClick = (e) => {
    actions.toggleHelp();
  };

  const handleCloseHelp = () => {
    actions.toggleHelp();
  };

  const handleHideHelpIcon = () => {
    setHelpIconVisible(false);
  };

  const handleOverlayClick = (e) => {
    // Close help panel when clicking on the overlay
    if (e.target === e.currentTarget) {
      handleCloseHelp();
    }
  };

  const handleKeyDown = (e) => {
    // Close help panel when pressing Escape key
    if (e.key === 'Escape') {
      handleCloseHelp();
    }
  };

  // Initialize Front Chat when component mounts
  useEffect(() => {
    chatService.initializeFrontChat().catch(error => {
      console.error('❌ HelpSystem: Failed to initialize Front Chat:', error);
    });
  }, []);

  // Handle Escape key to close help panel
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && helpVisible) {
        handleCloseHelp();
      }
    };

    if (helpVisible) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [helpVisible]);

  return (
    <>
      {/* DnD Context for Draggable Help Button */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {helpIconVisible && (
          <DraggableHelpIcon
            position={helpPosition}
            onClick={handleClick}
            onHide={handleHideHelpIcon}
          />
        )}
      </DndContext>



            {/* Help Panel */}
      {helpVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Professional Header */}
            <CardHeader className="bg-ocean-gradient text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Support Center
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseHelp}
                  className="text-white hover:bg-white/20"
                  aria-label="Close Support Center"
                >
                  <LucideX className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {helpOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Card
                      key={option.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-ocean-300"
                      onClick={option.action}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {option.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </div>
        </div>
      )}

      {/* JIRA Ticket Form Modal */}
      {showTicketForm && (
        <JiraTicketForm
          onClose={() => setShowTicketForm(false)}
        />
      )}

      {/* Contact Consultant Form Modal */}
      {isContactConsultantOpen && (
        <>
          {console.log('🔧 HelpSystem: Rendering ContactConsultantForm with consultantInfo:', consultantInfo)}
          <ContactConsultantForm
            isOpen={isContactConsultantOpen}
            onClose={() => {
              setIsContactConsultantOpen(false);
              setConsultantInfo(null); // Reset consultant info when form is closed
            }}
            consultantInfo={consultantInfo}
          />
        </>
      )}

      {/* Schedule Training Form Modal */}
      {showTrainingForm && (
        <ScheduleTrainingForm
          isOpen={showTrainingForm}
          onClose={() => setShowTrainingForm(false)}
        />
      )}

      {/* Live Phone Support Modal */}
      {showLivePhoneModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-hidden">
            <CardHeader className="bg-ocean-gradient text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Live Phone Support
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowLivePhoneModal(false)} className="text-white hover:bg-white/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {isAdmin ? (
                <div className="space-y-4">
                  <div className="text-base">
                    If you would like to skip to the front of the line to get immediate assistance and are willing to pay for that service, we get it! We also offer
                    <a href="tel:+1(954)332-3222" className="font-bold text-ocean-700 hover:underline ml-1">live on demand consulting!</a> These calls are billed in 5 minute increments at $10 per five minutes with a limit of 15 minutes per call. If you reach a voicemail – your call will be returned within the hour.
                  </div>
                  <div className="text-base">
                    <strong>Hotline</strong><br />
                    <a href="tel:+1(954)332-3222" className="text-lg font-semibold text-ocean-800 hover:underline">(954-332-3222)</a>
                  </div>
                </div>
              ) : (
                <div className="text-base text-red-700">
                  Currently, our live phone support hotline is for Administrative users only – please contact an Administrator of your site or your Software Consultant for additional assistance.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Sales Rep Modal */}
      {showSalesRepForm && (
        <ContactSalesRepForm isOpen={showSalesRepForm} onClose={() => setShowSalesRepForm(false)} />
      )}
    </>
  );
};

export default HelpSystem; 