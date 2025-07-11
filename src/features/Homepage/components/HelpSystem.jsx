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
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JiraTicketForm from './JiraTicketForm';
import ContactConsultantForm from './ContactConsultantForm';

const HelpSystem = () => {
  const { helpVisible, helpPosition, actions } = useHome();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const buttonRef = useRef(null);

  const helpOptions = [
    {
      id: 'help',
      title: 'Help',
      description: 'Access documentation and guides',
      icon: BookOpen,
      action: () => window.open('https://docs.mirabel.com', '_blank'),
      color: 'bg-blue-500'
    },
    {
      id: 'chat',
      title: 'Chat',
      description: 'Quick questions and support',
      icon: MessageCircle,
      action: () => window.open('https://chat.mirabel.com', '_blank'),
      color: 'bg-green-500'
    },
    {
      id: 'consultant',
      title: 'Contact your Consultant',
      description: 'Get in touch with your dedicated consultant',
      icon: Users,
      action: () => setShowContactForm(true),
      color: 'bg-purple-500'
    },
    {
      id: 'training',
      title: 'Schedule Training',
      description: 'Book a training session',
      icon: Calendar,
      action: () => window.open('https://training.mirabel.com', '_blank'),
      color: 'bg-orange-500'
    },
    {
      id: 'ticket',
      title: 'Submit Ticket',
      description: 'Create a JIRA support ticket',
      icon: Ticket,
      action: () => setShowTicketForm(true),
      color: 'bg-red-500'
    },
    {
      id: 'portal',
      title: 'Ticket Portal',
      description: 'View and manage your tickets',
      icon: ExternalLink,
      action: () => window.open('https://portal.mirabel.com', '_blank'),
      color: 'bg-indigo-500'
    },
    {
      id: 'phone',
      title: 'Live Phone Support',
      description: 'Call us for immediate assistance',
      icon: Phone,
      action: () => window.open('tel:+1-800-MIRABEL'),
      color: 'bg-teal-500'
    },
    {
      id: 'sales',
      title: 'Contact your Sales Rep',
      description: 'Get in touch with your sales representative',
      icon: Mail,
      action: () => window.open('mailto:sales@mirabel.com'),
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

  return (
    <>
      {/* Draggable Help Button */}
      <div
        ref={buttonRef}
        style={
          isDragging
            ? {
                position: 'fixed',
                left: helpPosition.x,
                top: helpPosition.y,
                zIndex: 1000,
                cursor: 'grabbing',
              }
            : {
                position: 'fixed',
                right: 32,
                bottom: 32,
                zIndex: 1000,
                cursor: 'grab',
              }
        }
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
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-ocean-600 to-ocean-700 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Help & Support
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => actions.toggleHelp()}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
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
          </Card>
        </div>
      )}

      {/* JIRA Ticket Form Modal */}
      {showTicketForm && (
        <JiraTicketForm
          onClose={() => setShowTicketForm(false)}
        />
      )}

      {/* Contact Consultant Form Modal */}
      {showContactForm && (
        <ContactConsultantForm
          onClose={() => setShowContactForm(false)}
        />
      )}
    </>
  );
};

export default HelpSystem; 