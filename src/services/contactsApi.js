
import httpClient from './httpClient';

class ContactsApi {
  // Method for fetching company details
  async getCompanyDetails(contactId) {
    console.log('Fetching company details for contact ID:', contactId);
    return httpClient.get(`/services/Crm/Contacts/EditDetails/${contactId}/1`);
  }

  // Method for fetching contact names
  async getContactNames(contactId) {
    console.log('Fetching contact names for contact ID:', contactId);
    return httpClient.get(`/services/Crm/Contacts/Contacts/${contactId}`);
  }

  // Method for searching customers with better error handling
  async searchCustomers(searchText) {
    console.log('ContactsApi: Searching customers with text:', searchText);
    try {
      const response = await httpClient.get(`/services/crm/contacts/GetDistinctCustomers/1/false/false/false/false`, {
        searchText: searchText
      });
      console.log('ContactsApi: Customer search response:', response);
      return response;
    } catch (error) {
      console.error('ContactsApi: Customer search failed:', error);
      // Return a safe response structure to prevent UI errors
      return {
        content: {
          Status: 'Error',
          StatusCode: 500,
          JSONContent: '[]'
        }
      };
    }
  }
}

export default new ContactsApi();
