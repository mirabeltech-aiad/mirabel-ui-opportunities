import React, { useState, useEffect } from 'react';
import { X, Check, Printer, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/features/Opportunity/hooks/use-toast';
import { termsAndConditionsService } from '@/services/termsAndConditionsService';

const TermsAndConditionsModal = ({ isOpen, onClose, onAccept }) => {
  const { toast } = useToast();
  const [agreementText, setAgreementText] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAgreementText();
    }
  }, [isOpen]);

  const fetchAgreementText = async () => {
    setIsLoading(true);
    try {
      const text = await termsAndConditionsService.getAgreementText();
      setAgreementText(text);
    } catch (error) {
      console.error('Error fetching agreement text:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Terms and Conditions. Please try again.',
        variant: 'destructive'
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!isAgreed) return;
    
    setIsSubmitting(true);
    try {
      await termsAndConditionsService.acceptAgreement();
      toast({
        title: 'Agreement Accepted',
        description: 'You have successfully accepted the Terms and Conditions.',
        variant: 'default'
      });
      
      // Call the onAccept callback if provided
      if (onAccept) {
        onAccept();
      } else {
        // Default behavior: reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error('Error accepting agreement:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept agreement. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', 'TermsNCondPrintPreview', 
      'location=no,directories=yes,menubar=no,scrollbars=yes,width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Terms and Conditions Print Preview</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
              .agreement-content { margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1>Terms and Conditions</h1>
            <div class="agreement-content">
              ${agreementText}
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Add delay for Chrome to prevent blank page
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  };

  const handleLogout = () => {
    // Redirect to logout page (matching legacy behavior)
    window.top.location.href = '/intranet/Members/Home/Logout.aspx';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Accept Terms and Conditions
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white/20"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading Terms and Conditions...</span>
            </div>
          ) : (
            <>
              {/* Agreement Text */}
              <div 
                className="prose prose-sm max-w-none mb-6 p-4 border rounded-lg bg-gray-50 max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: agreementText }}
              />
              
              {/* Agreement Checkbox */}
              <div className="flex items-center space-x-2 mb-6 p-4 border rounded-lg bg-blue-50">
                <Checkbox
                  id="agree"
                  checked={isAgreed}
                  onCheckedChange={setIsAgreed}
                  disabled={isSubmitting}
                />
                <label 
                  htmlFor="agree" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I Agree
                </label>
              </div>
            </>
          )}
        </CardContent>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 p-6 border-t bg-gray-50">
          <Button
            onClick={handleAccept}
            disabled={!isAgreed || isSubmitting || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Accepting...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Accept
              </>
            )}
          </Button>
          
          <Button
            onClick={handlePrint}
            variant="outline"
            disabled={isLoading || isSubmitting}
            className="border-gray-300 hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            disabled={isSubmitting}
            className="border-red-300 hover:bg-red-50 text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TermsAndConditionsModal; 