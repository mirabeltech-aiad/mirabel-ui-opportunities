import httpClient, { userId } from '@/services/httpClient';

class ActivitiesApi {
  // Method for fetching activities
  async getActivities(contactId) {
    console.log('Fetching activities for contact ID:', contactId);
    const payload = {
      ActivityType: 4,
      LimitChars: "200",
      UserID: userId, // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: 0,
      IsPinned: false
    };
    return httpClient.post('/services/Crm/Activities', payload);
  }

  // Method for fetching calls with ActivityType 2
  async getCallActivities(contactId) {
    console.log('ActivitiesApi: Fetching call activities for contact ID:', contactId);
    const payload = {
      ActivityType: 2,
      LimitChars: "200",
      UserID: userId, // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: 0,
      IsPinned: false
    };

    console.log('ActivitiesApi: Call activities payload:', payload);
    const response = await httpClient.post('/services/Crm/Activities', payload);
    console.log('ActivitiesApi: Call activities response:', response);
    return response;
  }

  // Method for fetching meeting activities with ActivityType 3
  async getMeetingActivities(contactId) {
    console.log('ActivitiesApi: Fetching meeting activities for contact ID:', contactId);
    const payload = {
      ActivityType: 3,
      LimitChars: "200",
      UserID: userId, // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: 0,
      IsPinned: false
    };

    console.log('ActivitiesApi: Meeting activities payload:', payload);
    const response = await httpClient.post('/services/Crm/Activities', payload);
    console.log('ActivitiesApi: Meeting activities response:', response);
    return response;
  }

  // Method for fetching notes-specific activities
  async getNotesActivities(contactId) {
    console.log('Fetching notes activities for contact ID:', contactId);
    const payload = {
      ActivityType: 5,
      LimitChars: "200",
      UserID: userId, // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: 2,
      IsPinned: false
    };
    return httpClient.post('/services/Crm/Activities', payload);
  }

  // Method for fetching email activities with ActivityType 7
  async getEmailActivities(contactId) {
    console.log('ActivitiesApi: Fetching email activities for contact ID:', contactId);
    const payload = {
      ActivityType: 7,
      LimitChars: "200",
      UserID: userId, // Use correct user ID from JWT token
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: 0,
      IsPinned: false
    };

    console.log('ActivitiesApi: Email activities payload:', payload);
    const response = await httpClient.post('/services/Crm/Activities', payload);
    console.log('ActivitiesApi: Email activities response:', response);
    return response;
  }
}

export default new ActivitiesApi();
