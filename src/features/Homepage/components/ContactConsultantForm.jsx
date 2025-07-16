import React, { useState, useEffect } from 'react';
import { X, Send, Upload, User, Mail, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { consultantService } from '../services/consultantService';
import { getSessionValue } from '../../../utils/sessionHelpers';
import { useToast } from '@/features/Opportunity/hooks/use-toast';

const ContactConsultantForm = ({ isOpen, onClose, consultantInfo }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: '',
    question: '',
    cc: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Get user session data
  const userEmail = getSessionValue('Email');
  const userName = getSessionValue('FullName');



  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setFormData({
        subject: '',
        question: '',
        cc: ''
      });
      setAttachments([]);
      setErrors({});
    }
  }, [isOpen, consultantInfo]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Validate file sizes
    const validFiles = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please select a smaller file.`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
    }
    
    setAttachments(validFiles);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject field is required!';
    }

    if (!formData.question.trim()) {
      newErrors.question = 'Question field is required!';
    }

    if (!consultantInfo?.Data?.Email) {
      newErrors.general = 'Consultant information is not available. Please try again.';
    }

    // Validate CC emails
    if (formData.cc.trim()) {
      const emailValidation = consultantService.validateEmails(formData.cc);
      if (!emailValidation.isValid) {
        newErrors.cc = emailValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Process attachments with better error handling
      let processedAttachments = [];
      if (attachments.length > 0) {
        try {
          processedAttachments = await consultantService.processAttachments(attachments);
        } catch (attachmentError) {
          console.error('Error processing attachments:', attachmentError);
          toast({
            title: "Attachment Error",
            description: attachmentError.message || 'Error processing attachments. Please try again.',
            variant: "destructive",
          });
          return;
        }
      }

      // Prepare email data
      const emailData = {
        ToEmail: consultantInfo?.Data?.Email ? [consultantInfo.Data.Email] : ['consultant@mirabeltechnologies.com'], // Use actual consultant email if available
        Subject: formData.subject,
        BodyText: consultantService.formatEmailBody(formData.question, userName),
        FromEmail: userEmail,
        FromName: userName,
        Attachments: processedAttachments
      };

      // Add CC if provided
      if (formData.cc.trim()) {
        const emailValidation = consultantService.validateEmails(formData.cc);
        if (emailValidation.isValid && emailValidation.emails.length > 0) {
          emailData.CcEmail = emailValidation.emails.join(',');
        }
      }

      console.log('Sending consultant email:', { emailData });

      // Send email
      await consultantService.sendConsultantEmail(emailData);

      // Show success toast notification
      toast({
        title: "Message sent successfully",
        description: "Your Software Consultant will respond back to you shortly.",
      });
      
      // Close form
      onClose();
      
    } catch (error) {
      console.error('Error sending consultant email:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      
      // Extract specific error message from backend response
      let errorMessage = 'Unable to send message. Please try again.';
      if (error.response?.data?.content?.Message) {
        errorMessage = error.response.data.content.Message;
      } else if (error.response?.data?.content?.Status === 'Error') {
        errorMessage = 'Backend validation error. Please check your input.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error sending message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Contact your Software Consultant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-blue-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* From/To Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">From:</span>
                  <span>{userName} &lt;{userEmail}&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">To:</span>
                  {(() => {
                    if (consultantInfo?.Data) {
                      return <span>{consultantInfo.Data.Name} &lt;{consultantInfo.Data.Email}&gt;</span>;
                    } else {
                      return <span className="text-gray-600">Loading consultant information...</span>;
                    }
                  })()}
                </div>
              </div>
              {errors.general && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              )}
            </div>

            {/* CC Field */}
            <div className="space-y-2">
              <Label htmlFor="cc" className="text-sm font-medium">
                CC
              </Label>
              <Input
                id="cc"
                type="text"
                placeholder="email1@example.com, email2@example.com"
                value={formData.cc}
                onChange={(e) => handleInputChange('cc', e.target.value)}
                className={errors.cc ? 'border-red-500' : ''}
              />
              {errors.cc && (
                <p className="text-red-500 text-sm">{errors.cc}</p>
              )}
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className={errors.subject ? 'border-red-500' : ''}
                required
              />
              {errors.subject && (
                <p className="text-red-500 text-sm">{errors.subject}</p>
              )}
            </div>

            {/* Question Field */}
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium">
                Question <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="question"
                placeholder="Enter your question or request"
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                className={`min-h-[200px] ${errors.question ? 'border-red-500' : ''}`}
                required
              />
              {errors.question && (
                <p className="text-red-500 text-sm">{errors.question}</p>
              )}
            </div>

            {/* File Attachments */}
            <div className="space-y-2">
              <Label htmlFor="attachments" className="text-sm font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Attach File:
              </Label>
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Selected files:</p>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactConsultantForm; 