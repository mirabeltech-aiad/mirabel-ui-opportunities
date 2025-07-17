import React, { useState, useRef, useEffect } from 'react';
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

const HelpSystem = () => {
  const { helpVisible, helpPosition, actions } = useHome();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [isContactConsultantOpen, setIsContactConsultantOpen] = useState(false);
  const buttonRef = useRef(null);
  const [showLivePhoneModal, setShowLivePhoneModal] = useState(false);
  const [showSalesRepForm, setShowSalesRepForm] = useState(false);
  const { isAdmin } = getUserInfo();
  const [consultantInfo, setConsultantInfo] = useState(null);
  const { toast } = useToast();

  // Watch for consultant info changes and open form when available
  useEffect(() => {
    if (consultantInfo && consultantInfo.Data) {
      console.log('🔧 HelpSystem: Consultant info available, opening form');
      setIsContactConsultantOpen(true);
    }
  }, [consultantInfo]);

  const defaultHelpPosition = { x: typeof window !== 'undefined' ? window.innerWidth - 100 : 1320, y: typeof window !== 'undefined' ? window.innerHeight - 100 : 620 };

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
      action: () => chatService.showChat(),
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
          
          if (consultantData?.content?.Status === 'Success') {
            setConsultantInfo(consultantData.content);
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

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    
    setIsDragging(true);
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Constrain to viewport
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    
    actions.setHelpPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Initialize Front Chat when component mounts
  useEffect(() => {
    console.log('🔧 HelpSystem: Initializing Front Chat...');
    chatService.initializeFrontChat().catch(error => {
      console.error('❌ HelpSystem: Failed to initialize Front Chat:', error);
    });
  }, []);

  return (
    <>
      {/* Draggable Help Button */}
      <div
        ref={buttonRef}
        style={{
          position: 'fixed',
          left: helpPosition.x,
          top: helpPosition.y,
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        className="group"
      >
        <Button
          size="lg"
          className="bg-ocean-600 hover:bg-ocean-700 text-white border-2 border-white shadow-lg rounded-full w-14 h-14 p-0 transition-all duration-200"
          onClick={() => actions.toggleHelp()}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Help
        </div>
      </div>

      {/* Help Panel */}
      {helpVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-y-auto">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={actions.toggleHelp}
              className="absolute top-4 right-4 text-gray-500 hover:bg-gray-200"
              aria-label="Close Help & Support"
            >
              <LucideX className="h-6 w-6" />
            </Button>
            {/* Title with Modern Styling */}
            <h2 className="text-3xl font-bold mb-8 mt-8 ml-8">
              <span className="bg-gradient-to-r from-slate-100 to-slate-300 text-slate-800 px-6 py-2 rounded-xl shadow-sm border border-slate-200">
                Help &amp; Support
              </span>
            </h2>
            <CardContent className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
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
            <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
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
                    <a href="tel:+1(954)332-3222" className="font-bold text-teal-700 hover:underline ml-1">live on demand consulting!</a> These calls are billed in 5 minute increments at $10 per five minutes with a limit of 15 minutes per call. If you reach a voicemail – your call will be returned within the hour.
                  </div>
                  <div className="text-base">
                    <strong>Hotline</strong><br />
                    <a href="tel:+1(954)332-3222" className="text-lg font-semibold text-teal-800 hover:underline">(954-332-3222)</a>
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