import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Users, ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { consultantService } from '../services/consultantService';

const isValidConsultant = (consultant) => {
  return consultant && consultant.Name && consultant.TimeTradeLink;
};

const ScheduleTrainingForm = ({ isOpen, onClose }) => {
  const [consultantInfo, setConsultantInfo] = useState(null);
  const [otherConsultants, setOtherConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const contentRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadConsultantInfo();
    }
  }, [isOpen]);

  // Handle scroll events to show/hide scroll to bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollToBottom(!isNearBottom);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [loading, error, consultantInfo, otherConsultants]);

  const scrollToBottom = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const loadConsultantInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await consultantService.getConsultantInfo();
      if (response && response.Status === 'Success') {
        let primary = null;
        let others = response.List || [];
        // Prefer Data if valid, else use first from List
        if (isValidConsultant(response.Data)) {
          primary = response.Data;
          // Remove from others if present
          others = others.filter(c => c.Name !== primary.Name);
        } else if (others.length > 0) {
          primary = others[0];
          others = others.slice(1);
        }
        if (!primary) {
          setError('No consultant information available.');
        } else {
          setConsultantInfo(primary);
          setOtherConsultants(others);
        }
      } else {
        setError('Unable to load consultant information');
      }
    } catch (error) {
      console.error('❌ ScheduleTrainingForm: Error loading consultant info:', error);
      setError('Unable to load consultant information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleWithPrimary = () => {
    if (consultantInfo?.TimeTradeLink) {
      window.open(consultantInfo.TimeTradeLink, '_blank');
    }
  };

  const handleScheduleWithOther = (consultant) => {
    if (consultant?.TimeTradeLink) {
      window.open(consultant.TimeTradeLink, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-1 sm:p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        <CardHeader className="text-white" style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #38bdf8 100%)' }}>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center flex-1">
              <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>Schedule Training</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 flex-shrink-0 rounded-full w-8 h-8 p-0 border border-white/20 hover:border-white/40"
              aria-label="Close Schedule Training"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Additional close button for very small screens */}
          <div className="flex justify-center mt-2 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-white border-white/30 hover:bg-white/10 text-xs"
            >
              Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent 
          ref={contentRef}
          className="p-3 sm:p-6 overflow-y-auto flex-1 relative"
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600"></div>
              <span className="ml-2 text-gray-600">Loading consultant information...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={loadConsultantInfo} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Primary Consultant Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Primary Consultant
                </h3>
                
                {consultantInfo && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={consultantInfo.ImageUrl || '/default-avatar.png'}
                        alt={consultantInfo.Name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-300"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {consultantInfo.Name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Click the button below to schedule Training or Consulting time with{' '}
                        <strong>{consultantInfo.Name}</strong>.
                      </p>
                      <Button
                        onClick={handleScheduleWithPrimary}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!consultantInfo.TimeTradeLink}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule with Primary Consultant
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Other Consultants Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Other Software Consultants
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  If your primary software consultant is not available by the next day, 
                  please feel free to schedule a training with one of our other software consultants.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {otherConsultants.map((consultant, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <img
                              src={consultant.ImageUrl || '/default-avatar.png'}
                              alt={consultant.Name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.src = '/default-avatar.png';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1 truncate">
                              {consultant.Name}
                            </h4>
                            <Button
                              onClick={() => handleScheduleWithOther(consultant)}
                              variant="outline"
                              size="sm"
                              className="w-full"
                              disabled={!consultant.TimeTradeLink}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Schedule Training
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {otherConsultants.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No additional consultants available at this time.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Scroll to bottom button - only visible on small screens when not near bottom */}
          {showScrollToBottom && (
            <div className="absolute bottom-4 right-4 sm:hidden">
              <Button
                onClick={scrollToBottom}
                className="bg-ocean-600 hover:bg-ocean-700 text-white rounded-full w-10 h-10 p-0 shadow-lg"
                aria-label="Scroll to bottom"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>
          )}
          

          

        </CardContent>
        
        <div ref={footerRef} className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50 flex-shrink-0">
          <div className="flex justify-center sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-ocean-600 border-ocean-600 hover:bg-ocean-50 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2 shadow-sm"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScheduleTrainingForm; 