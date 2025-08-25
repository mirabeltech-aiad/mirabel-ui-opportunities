import axiosService from '../../../services/axiosService';
import { CONSULTANT_API } from '../../../utils/apiUrls';
import { getSessionValue } from '../../../utils/sessionHelpers';

/**
 * Consultant service for handling consultant-related API calls
 * Matches the backend logic for consultant info and email functionality
 * Note: Consultant assignment for Contact Consultant is handled automatically by the backend based on client ID
 */
export const consultantService = {
  /**
   * Get consultant information for the current client
   * Used by ScheduleTrainingForm and ContactSalesRepForm
   * @returns {Promise} Consultant information including primary consultant, other consultants, and sales reps
   */
  getConsultantInfo: async () => {
    try {
      const clientID = getSessionValue('ClientID');
      
      if (!clientID) {
        throw new Error('Client ID not found in session');
      }

      const endpoint = `${CONSULTANT_API.INFO_GET}${clientID}`;
      
      const response = await axiosService.get(endpoint);
      return response;
    } catch (error) {
      console.error('❌ ConsultantService: Error getting consultant info:', error);
      throw error;
    }
  },
  /**
   * Send email to consultant
   * @param {Object} emailData - Email data object matching ContactYourConsultantDTO
   * @param {Array} emailData.ToEmail - Array of recipient emails (backend will assign consultant)
   * @param {string} emailData.Subject - Email subject
   * @param {string} emailData.BodyText - Email body (HTML formatted)
   * @param {string} emailData.FromEmail - Sender email
   * @param {string} emailData.FromName - Sender name
   * @param {string} emailData.CcEmail - CC emails (comma-separated)
   * @param {Array} emailData.Attachments - Array of AttachmentDTO objects
   * @returns {Promise} Email send response
   */
  sendConsultantEmail: async (emailData) => {
    try {
      const clientID = getSessionValue('ClientID');
      if (!clientID) {
        throw new Error('Client ID not found in session');
      }

      // Ensure payload matches ContactYourConsultantDTO structure
      const payload = {
        FromEmail: emailData.FromEmail,
        FromName: emailData.FromName,
        ToEmail: emailData.ToEmail,
        CcEmail: emailData.CcEmail || '',
        Subject: emailData.Subject,
        BodyText: emailData.BodyText,
        Attachments: emailData.Attachments || [],
        EmailType: 'smtp' // Optional field for backend DTO
      };

      const response = await axiosService.post(
        `${CONSULTANT_API.CREATE_EMAIL}${clientID}/softwareconsultant`,
        payload
      );
      
      return response.content;
    } catch (error) {
      console.error('❌ ConsultantService: Error sending email:', error);
      throw error;
    }
  },

  /**
   * Format email body with HTML formatting (matches backend formatEmailBody function)
   * @param {string} bodyText - Email body text
   * @param {string} reporterName - Reporter name
   * @returns {string} Formatted HTML email body
   */
  formatEmailBody: (bodyText, reporterName) => {
    return `<p>Hello,</p><p>${bodyText}</p><p>Best regards,<br>${reporterName}</p>`;
  },

  /**
   * Validate email addresses (matches backend validation)
   * @param {string} emailString - Comma-separated email addresses
   * @returns {Object} Validation result with isValid and emails array
   */
  validateEmails: (emailString) => {
    if (!emailString || emailString.trim() === '') {
      return { isValid: true, emails: [] };
    }

    // Check if the input contains any characters other than letters, numbers, commas and spaces
    if (/[^a-zA-Z0-9,@\s.-]/.test(emailString)) {
      return { isValid: false, error: 'Invalid format: Only comma-separated email addresses are allowed.' };
    }

    // Split the input string by commas to get individual email addresses
    const emails = emailString.split(',');
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const validEmails = [];

    for (const email of emails) {
      const trimmedEmail = email.trim();
      if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
        return { isValid: false, error: 'Invalid email format for cc' };
      }
      if (trimmedEmail) {
        validEmails.push(trimmedEmail);
      }
    }

    return { isValid: true, emails: validEmails };
  },

  /**
   * Process file attachments and convert to base64
   * @param {FileList} files - File list from input
   * @returns {Promise<Array>} Array of attachment objects
   */
  processAttachments: async (files) => {
    if (!files || files.length === 0) {
      return [];
    }

    const attachments = [];
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`File too Big: ${file.name}, please select a file less than 10mb`);
      }

      const promise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          const splitIndex = fileContent.indexOf(';base64,');
          
          if (splitIndex !== -1) {
            const fileExtension = fileContent.substring(5, splitIndex); // Extract MIME type
            const postedFileInBase64String = fileContent.substring(splitIndex + ';base64,'.length); // Extract base64 data
            
            attachments.push({
              FileExtension: fileExtension,
              PostedFileInBase64String: postedFileInBase64String,
              AttachmentFileName: file.name
            });
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });

      promises.push(promise);
    }

    await Promise.all(promises);
    return attachments;
  }
}; 