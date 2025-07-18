import React, { useState, useEffect, useRef } from 'react';
import { X, Send, AlertCircle, Paperclip, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/features/Opportunity/hooks/use-toast';
import { getUserInfo, getSessionValue } from '@/utils/sessionHelpers';
import httpClient, { apiCall } from '@/services/httpClient';
import {
  HELPDESK_API_ERROR_CATEGORY,
  HELPDESK_API_TECHSUPPORT_CREATEREQUEST,
  HELPDESK_API_ATTACHTEMPORARY_FILE
} from '@/config/apiUrls';

const JiraTicketForm = ({ onClose }) => {
  const { toast } = useToast();
  const user = getUserInfo();
  const [categories, setCategories] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    summary: '',
    description: '',
    name: user.fullName || '',
    email: user.email || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  useEffect(() => {
    fetchCategories();
  }, []);

  // Update form data when user info becomes available
  useEffect(() => {
    if (user && (user.fullName || user.email)) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await apiCall(HELPDESK_API_ERROR_CATEGORY, 'GET');
      if (res && res.content && res.content.List) {
        setCategories(res.content.List);
      }
    } catch (e) {
      setCategories([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Support category is required';
    if (!formData.summary.trim()) newErrors.summary = 'Summary is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    let validFiles = [];
    
    // Validate file sizes
    for (let file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ 
          title: 'File too big', 
          description: `${file.name} is larger than 10MB.`, 
          variant: 'destructive' 
        });
        continue;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    setIsUploading(true);
    
    // Optimistically add files to UI with a temporary ID
    const tempAttachments = validFiles.map(f => ({
      temporaryAttachmentId: `temp-${f.name}-${Date.now()}`,
      fileName: f.name,
      uploading: true
    }));
    
    setAttachments(prev => [...prev, ...tempAttachments]);
    
    try {
      const formDataObj = new FormData();
      validFiles.forEach(f => formDataObj.append('fileInput', f));
      
      const baseUrl = httpClient.getBaseURL();
      const uploadUrl = baseUrl.replace(/\/$/, '') + HELPDESK_API_ATTACHTEMPORARY_FILE;
      
      // Use proper headers for file upload
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formDataObj // Don't set Content-Type header, let browser set it with boundary
      });
      
      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data && data.content && data.content.Data && data.content.Data.temporaryAttachments) {
        // Replace temp attachments with actual uploaded ones
        setAttachments(prev => [
          ...prev.filter(a => !a.uploading),
          ...data.content.Data.temporaryAttachments
        ]);
        
        toast({ 
          title: 'Files uploaded successfully', 
          description: `${validFiles.length} file(s) uploaded.`, 
          variant: 'default' 
        });
      } else {
        throw new Error('Invalid response format from upload endpoint');
      }
    } catch (error) {
      // Mark temp attachments as errored
      setAttachments(prev => prev.map(a => 
        a.uploading ? { ...a, uploading: false, error: true } : a
      ));
      
      toast({ 
        title: 'Upload Failed', 
        description: error.message || 'Could not upload file(s). Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.temporaryAttachmentId !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Check authentication before submitting
    const token = getSessionValue("Token");
    const userInfo = getUserInfo();
    
    // More robust authentication check
    if (!token || !userInfo.email || !userInfo.userId) {
      console.error('Authentication check failed:', { 
        hasToken: !!token, 
        hasEmail: !!userInfo.email, 
        hasUserId: !!userInfo.userId,
        userInfo 
      });
      toast({ 
        title: 'Authentication Error', 
        description: 'Please log in again to submit a support ticket.', 
        variant: 'destructive' 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get user data from session
      const clientId = getSessionValue("ClientID");
      const companyName = getSessionValue("CompanyName") || userInfo.companyName || '';
      const productType = getSessionValue("ProductType") || userInfo.clientId || '';
      
      console.log('Submitting ticket with data:', {
        reporterName: formData.name || userInfo.fullName,
        reporterEmail: formData.email || userInfo.email,
        companyName,
        productType,
        clientId
      });
      
      // Prepare request payload matching backend expectations exactly
      const request = {
        serviceDeskId: 4, // as per legacy
        requestTypeId: 39, // as per legacy
        attachmentFile: attachments.map(a => a.temporaryAttachmentId),
        requestFieldValues: {
          summary: formData.summary, // Backend expects lowercase 'summary'
          description: formData.description,
          customfield_10054: { value: formData.category },
          customfield_10057: window.location.hostname,
          customfield_10055: companyName,
          customfield_10059: formData.name,
          customfield_10060: formData.email,
          customfield_10066: { id: productType }
        }
      };
      
      const reporterName = encodeURIComponent(formData.name || userInfo.fullName || '');
      const reporterEmail = encodeURIComponent(formData.email || userInfo.email || '');
      const endpoint = `${HELPDESK_API_TECHSUPPORT_CREATEREQUEST}${reporterName}/${reporterEmail}`;
      
      console.log('Making API call to:', endpoint);
      console.log('Request payload:', request);
      
      const res = await apiCall(endpoint, 'POST', request);
      
      console.log('API response:', res);
      
      if (res && res.content && res.content.Data && res.content.Data.issueKey) {
        toast({
          title: 'Ticket Created Successfully',
          description: (
            <div>
              <p>Your request {res.content.Data.issueKey} has been created.</p>
              <a 
                href={`https://mirabel.atlassian.net/browse/${res.content.Data.issueKey}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                View Ticket
              </a>
            </div>
          ),
          variant: 'default',
        });
        onClose();
      } else {
        console.error('Invalid API response format:', res);
        throw new Error('No issue key returned from API');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response,
        status: error.status
      });
      
      // Handle specific error cases
      let errorMessage = 'Failed to create ticket. Please try again.';
      
      if (error.message && error.message.includes('Unexpected character encountered while parsing value')) {
        errorMessage = 'Authentication error. Please refresh the page and try again.';
      } else if (error.isHtmlResponse) {
        errorMessage = 'Server returned an error page. Please check your authentication and try again.';
      } else if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You may not have permission to create support tickets.';
      } else if (error.status === 404) {
        errorMessage = 'API endpoint not found. Please contact support.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({ 
        title: 'Error Creating Ticket', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Submit Tech Support Ticket
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Support Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Support Category *</Label>
              <Select value={formData.category} onValueChange={v => handleInputChange('category', v)}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat, idx) => (
                    <SelectItem key={idx} value={cat.Display}>{cat.Display}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-1" />{errors.category}</div>}
            </div>
            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Input id="summary" value={formData.summary} onChange={e => handleInputChange('summary', e.target.value)} placeholder="Brief description of the issue" className={errors.summary ? 'border-red-500' : ''} />
              {errors.summary && <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-1" />{errors.summary}</div>}
            </div>
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Detailed description, steps to reproduce, expected vs actual behavior..." rows={6} className={errors.description ? 'border-red-500' : ''} />
              {errors.description && <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-1" />{errors.description}</div>}
            </div>
            {/* Name/Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className={errors.name ? 'border-red-500' : ''} />
                {errors.name && <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-1" />{errors.name}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Your Email *</Label>
                <Input id="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-1" />{errors.email}</div>}
                </div>
            </div>
            {/* Attachments */}
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="flex items-center space-x-2">
                <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} disabled={isUploading} className="hidden" id="file-upload" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={isUploading}>
                  <Paperclip className="h-4 w-4 mr-1" /> Attach File
                </Button>
                {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {attachments.map(a => (
                  <div key={a.temporaryAttachmentId} className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                    <span className="mr-2">
                      {a.fileName}
                      {a.uploading && <span className="ml-1 text-xs text-gray-400">(Uploading...)</span>}
                      {a.error && <span className="ml-1 text-xs text-red-500">(Upload failed)</span>}
                    </span>
                    <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveAttachment(a.temporaryAttachmentId)} disabled={a.uploading}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                ))}
              </div>
            </div>
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                {isSubmitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Creating...</>) : (<><Send className="h-4 w-4 mr-2" />Submit Ticket</>)}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JiraTicketForm; 