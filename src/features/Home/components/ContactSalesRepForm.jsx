import React, { useState, useEffect, useRef } from 'react';
import { X as LucideX, Send, Upload, User, Mail, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import axiosService from '../../../services/axiosService';
import {
  API_CONSULTANT_INFO_GET,
  HELPDESK_API_SALESREP_CREATEREQUEST,
  HELPDESK_API_ATTACHTEMPORARY_FILE
} from '../../../utils/apiUrls';
import { getUserInfo, getSessionValue } from '@/utils/sessionHelpers';
import { toast } from '@/components/ui/sonner';

const ContactSalesRepForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    subject: '',
    question: ''
  });
  const [salesReps, setSalesReps] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef();

  const user = getUserInfo();

  useEffect(() => {
    if (isOpen) {
      setFormData({ to: '', cc: '', subject: '', question: '' });
      setAttachments([]);
      setUploadedFiles([]);
      setErrors({});
      fetchSalesReps();
    }
  }, [isOpen]);

  const fetchSalesReps = async () => {
    try {
      const clientID = getSessionValue('ClientID');
      if (!clientID) {
        throw new Error('Client ID not found in session');
      }

      const res = await axiosService.get(`${API_CONSULTANT_INFO_GET}${clientID}`);
      if (res && res.content && res.content.Messages) {
        // Extract sales reps from Messages field (matches legacy implementation)
        const salesRepsList = res.content.Messages.map(rep => ({
          Name: rep.Message || '',
          Email: rep.Field || ''
        }));
        setSalesReps(salesRepsList.filter(rep => rep.Name && rep.Email));
      } else {
        setSalesReps([]);
      }
    } catch (e) {
      console.error('Error fetching sales reps:', e);
      setSalesReps([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setAttachments(files.slice(0, 1)); // Only allow one file
  };

  const handleRemoveAttachment = () => {
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateEmails = (emails) => {
    if (!emails) return { isValid: true, emails: [] };
    const emailArr = emails.split(',').map(e => e.trim()).filter(Boolean);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (let email of emailArr) {
      if (!emailRegex.test(email)) {
        return { isValid: false, error: `Invalid email: ${email}` };
      }
    }
    return { isValid: true, emails: emailArr };
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.to) newErrors.to = 'Sales Rep is required!';
    if (!formData.subject.trim()) newErrors.subject = 'Subject field is required!';
    if (!formData.question.trim()) newErrors.question = 'Question field is required!';
    if (formData.cc.trim()) {
      const emailValidation = validateEmails(formData.cc);
      if (!emailValidation.isValid) newErrors.cc = emailValidation.error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadAttachments = async () => {
    if (attachments.length === 0) return [];
    setIsUploading(true);
    try {
      const formDataObj = new FormData();
      attachments.forEach(f => formDataObj.append('fileInput', f));
      
      const baseUrl = window.location.origin;
      const uploadUrl = baseUrl + HELPDESK_API_ATTACHTEMPORARY_FILE;
      
      // Get authentication token
      const token = getSessionValue("Token");
      const domain = getSessionValue("Domain") || window.location.hostname;
      
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'domain': domain
        },
        body: formDataObj // Don't set Content-Type header, let browser set it with boundary
      });
      
      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data && data.content && data.content.Data && data.content.Data.temporaryAttachments) {
        setUploadedFiles(data.content.Data.temporaryAttachments);
        return data.content.Data.temporaryAttachments;
      } else {
        throw new Error('Invalid response format from upload endpoint');
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error('Could not upload file(s). Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      const uploaded = await uploadAttachments();
      
      // Prepare request payload matching backend expectations for JIRA ticket creation
      const request = {
        serviceDeskId: 4, // as per legacy
        requestTypeId: 39, // as per legacy
        attachmentFile: uploaded.map(f => f.temporaryAttachmentId),
        requestFieldValues: {
          summary: formData.subject,
          description: formData.question,
          customfield_10054: { value: "Sales Rep Contact" },
          customfield_10057: window.location.hostname,
          customfield_10055: user.companyName || '',
          customfield_10059: user.fullName || '',
          customfield_10060: user.email || '',
          customfield_10066: { id: user.clientId }
        }
      };
      
      const reporterName = encodeURIComponent(user.fullName || '');
      const reporterEmail = encodeURIComponent(user.email || '');
      const assigneeName = encodeURIComponent(formData.to.split('@')[0] || ''); // Extract name from email
      const assigneeEmail = encodeURIComponent(formData.to);
      
      const endpoint = `${HELPDESK_API_SALESREP_CREATEREQUEST}${reporterName}/${reporterEmail}/${assigneeName}/${assigneeEmail}`;
      
      const res = await axiosService.post(endpoint, request);
      
      if (res && res.content && res.content.Data && res.content.Data.issueKey) {
        toast.success(
          `Your request ${res.content.Data.issueKey} has been created. Your Sales Rep will respond back to you shortly.`,
          {
            action: {
              label: 'View Ticket',
              onClick: () => window.open(`https://mirabel.atlassian.net/browse/${res.content.Data.issueKey}`, '_blank')
            }
          }
        );
        onClose();
      } else {
        throw new Error('No issue key returned from API');
      }
    } catch (error) {
      console.error('Error creating sales rep contact:', error);
      toast.error(error.message || 'Unable to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-ocean-gradient text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Contact your Sales Rep
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <LucideX className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* From/To Information */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">From:</span>
                  <span>{user.fullName} &lt;{user.email}&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">To:</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={formData.to}
                    onChange={e => handleInputChange('to', e.target.value)}
                  >
                    <option value="">Select Sales Rep</option>
                    {salesReps.map((rep, idx) => (
                      <option key={idx} value={rep.Email}>{rep.Name} &lt;{rep.Email}&gt;</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* CC Field */}
            <div className="space-y-1">
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
            <div className="space-y-1">
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
            <div className="space-y-1">
              <Label htmlFor="question" className="text-sm font-medium">
                Question <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="question"
                placeholder="Enter your question or request"
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                className={`min-h-[120px] ${errors.question ? 'border-red-500' : ''}`}
                required
              />
              {errors.question && (
                <p className="text-red-500 text-sm">{errors.question}</p>
              )}
            </div>
            {/* File Attachments */}
            <div className="space-y-1">
              <Label htmlFor="attachments" className="text-sm font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Attach File:
              </Label>
              <Input
                id="attachments"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Selected file:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {attachments[0].name}
                      <Button type="button" size="icon" variant="ghost" onClick={handleRemoveAttachment} className="ml-1"><Trash2 className="h-3 w-3 text-red-500" /></Button>
                    </Badge>
                  </div>
                </div>
              )}
            </div>
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-3 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting || isUploading}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || isUploading} className="bg-ocean-600 hover:bg-ocean-700">
                {isSubmitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Sending...</>) : (<><Send className="h-4 w-4 mr-2" />Send</>)}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSalesRepForm; 