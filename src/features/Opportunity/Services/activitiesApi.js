import axiosService from '@/services/axiosService';
import { getCurrentUserId } from '@/utils/userUtils';
import { 
  ACTIVITY_TYPES,
  ACTIVITY_SOURCE_TYPES,
  API_CONFIG,
  ACTIVITY_CATEGORY_MAPPINGS,
  API_ENDPOINTS
} from '../constants/activityConstants';

// This is correct: axiosService is already the default export from '@/services/axiosService' and is used as an axios instance.
const axiosInstance = axiosService;

class ActivitiesApi {
  // Method for fetching activities
  async getActivities(contactId) {
    console.log('Fetching activities for contact ID:', contactId);
    const payload = {
      ActivityType: ACTIVITY_TYPES.ALL,
      LimitChars: API_CONFIG.LIMIT_CHARS,
      UserID: getCurrentUserId(), // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: ACTIVITY_SOURCE_TYPES.USER_ONLY,
      IsPinned: false
    };
    return axiosInstance.post(API_ENDPOINTS.ACTIVITIES, payload);
  }

  // Method for fetching calls with ActivityType 2
  async getCallActivities(contactId) {
    console.log('ActivitiesApi: Fetching call activities for contact ID:', contactId);
    const payload = {
      ActivityType: ACTIVITY_TYPES.CALLS,
      LimitChars: API_CONFIG.LIMIT_CHARS,
      UserID: getCurrentUserId(), // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: ACTIVITY_SOURCE_TYPES.USER_ONLY,
      IsPinned: false
    };

    const response = await axiosInstance.post(API_ENDPOINTS.ACTIVITIES, payload);
  
    return response;
  }

  // Method for fetching meeting activities with ActivityType 3
  async getMeetingActivities(contactId) {
    console.log('ActivitiesApi: Fetching meeting activities for contact ID:', contactId);
    const payload = {
      ActivityType: ACTIVITY_TYPES.MEETINGS,
      LimitChars: API_CONFIG.LIMIT_CHARS,
      UserID: getCurrentUserId(), // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: ACTIVITY_SOURCE_TYPES.USER_ONLY,
      IsPinned: false
    };

    const response = await axiosInstance.post(API_ENDPOINTS.ACTIVITIES, payload);
    console.log('ActivitiesApi: Meeting activities response:', response);
    return response;
  }

  // Method for fetching notes-specific activities
  async getNotesActivities(contactId) {
    console.log('Fetching notes activities for contact ID:', contactId);
    const payload = {
      ActivityType: ACTIVITY_TYPES.NOTES,
      LimitChars: API_CONFIG.LIMIT_CHARS,
      UserID: getCurrentUserId(), // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: ACTIVITY_SOURCE_TYPES.ALL_INCLUDING_SYSTEM,
      IsPinned: false
    };
    return axiosInstance.post(API_ENDPOINTS.ACTIVITIES, payload);
  }

  // Method for fetching email activities with ActivityType 7
  async getEmailActivities(contactId) {
    console.log('ActivitiesApi: Fetching email activities for contact ID:', contactId);
    const payload = {
      ActivityType: ACTIVITY_TYPES.EMAILS,
      LimitChars: API_CONFIG.LIMIT_CHARS,
      UserID: getCurrentUserId(), // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: ACTIVITY_SOURCE_TYPES.USER_ONLY,
      IsPinned: false
    };

    console.log('ActivitiesApi: Email activities payload:', payload);
    const response = await axiosInstance.post(API_ENDPOINTS.ACTIVITIES, payload);
    console.log('ActivitiesApi: Email activities response:', response);
    return response;
  }

  // Method for toggling pin status (single endpoint for both pin/unpin)
  async togglePinActivity(activityID, activityCategory = 'Activity') {
    console.log('ActivitiesApi: Toggling pin for activity with ID:', activityID, 'Category:', activityCategory);
    
    // Use 'Activity' as the default category since that's what the endpoint expects
    const categoryValue = activityCategory === 'Activity' ? 'Activity' : 'Activity';
    const response = await axiosInstance.get(`${API_ENDPOINTS.PIN_ACTIVITY}/${activityID}/${categoryValue}`);
    
    console.log('ActivitiesApi: Toggle pin activity response:', response);
    return response;
  }

  // Legacy methods for backward compatibility
  async pinActivity(activityID, activityCategory) {
    return this.togglePinActivity(activityID, activityCategory);
  }

  async unpinActivity(activityID, activityCategory) {
    return this.togglePinActivity(activityID, activityCategory);
  }
}

export default new ActivitiesApi();
