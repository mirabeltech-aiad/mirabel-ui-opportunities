import axiosService from '@/services/axiosService';
import API_URLS from '@/utils/apiUrls';
const axiosInstance = axiosService;
class ContactsApi {
  // Method for fetching company details
  async getCompanyDetails(contactId, config = {}) {

    return axiosInstance.get(API_URLS.CONTACTS.EDIT_DETAILS(contactId), config);
  }

  // Method for fetching contact names
  async getContactNames(contactId) {

    return axiosInstance.get(API_URLS.CONTACTS.CONTACT_DETAILS(contactId));
  }

  // Masters for Lead fields (no hardcoded lists)
  async getLeadSources() {
    try {
      const response = await axiosInstance.get(API_URLS.MASTERS.LEAD_SOURCES);


      const leadSources = response.content?.Data?.LeadSources ||
        response.Data?.LeadSources ||
        response.List ||
        response || [];



      if (!Array.isArray(leadSources) || leadSources.length === 0) {
        console.warn('No lead sources found in API response');
        return [];
      }

      const formattedSources = leadSources.map(source => ({
        value: source.Value || source.ID,
        label: source.Display || source.Name
      })).filter(source => source.label && source.value);


      return formattedSources;

    } catch (error) {
      console.error('Failed to fetch lead sources:', error);
      throw error;
    }
  }

  async getLeadTypes() {
    try {
      const response = await axiosInstance.get(API_URLS.MASTERS.LEAD_TYPES);


      const leadTypes = response.content?.Data?.LeadTypes ||
        response.Data?.LeadTypes ||
        response.List ||
        response || [];



      if (!Array.isArray(leadTypes) || leadTypes.length === 0) {
        console.warn('No lead types found in API response');
        return [];
      }

      const formattedTypes = leadTypes.map(type => ({
        value: type.Value || type.ID,
        label: type.Display || type.Name
      })).filter(type => type.label && type.value);


      return formattedTypes;

    } catch (error) {
      console.error('Failed to fetch lead types:', error);
      throw error;
    }
  }

  async getLeadStatusMaster() {
    return axiosInstance.get(API_URLS.MASTERS.LEAD_STATUS);
  }

  async getProspectingStages() {
    try {
      // Fetch master list (id/name) and the color list (id/colorHex)
      const [mastersResp, colorsResp] = await Promise.all([
        axiosInstance.get(API_URLS.MASTERS.PROSPECTING_STAGES),
        axiosInstance.get(API_URLS.ADMIN_EXTENDED.PROSPECTING_STAGES_COLORS)
      ]);



      const extractList = (res) =>
        res?.content?.Data?.ProspectingStages ||
        res?.content?.List ||
        res?.Data?.ProspectingStages ||
        res?.List ||
        res ||
        [];
      console.log("extractList", mastersResp);
      console.log("extractList", colorsResp);

      const mastersRaw = extractList(mastersResp);
      const colorsRaw = extractList(colorsResp);



      const toId = (v) => (
        v?.id ?? v?.ID ?? v?.Value ?? v?.StageId ?? v?.StageID ?? null
      );
      const toName = (v) => (
        v?.name ?? v?.Name ?? v?.Display ?? v?.StageName ?? ''
      );
      const toColor = (v) => (
        v?.colorHex ?? v?.ColorHex ?? v?.color ?? v?.Color ?? v?.ColorCode ?? null
      );

      // Build color map from colors API by numeric/string id
      const colorById = new Map(
        (Array.isArray(colorsRaw) ? colorsRaw : []).map((s) => [String(toId(s)), toColor(s)])
      );

      const merged = (Array.isArray(mastersRaw) ? mastersRaw : [])
        .map((s) => {
          const id = toId(s);
          const name = toName(s);
          if (id == null || !name) return null;
          const color = colorById.get(String(id)) || '#ffffff';
          return {
            StageId: id,
            StageName: name,
            ColorCode: color,
          };
        })
        .filter(Boolean);


      return merged;

    } catch (error) {
      console.error('Failed to fetch prospecting stages:', error);
      throw error;
    }
  }

  // Method for searching customers with better error handling
  async searchCustomers(searchText) {

    try {
      const response = await axiosInstance.get(`/services/crm/contacts/GetDistinctCustomers/1/false/false/false/false`, {
        searchText: searchText
      });

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

  // Method for updating contact details
  async updateContact(updatePayload) {

    try {
      const response = await axiosInstance.post('/services/Crm/Contacts/Update', updatePayload);

      return response;
    } catch (error) {
      console.error('ContactsApi: Contact update failed:', error);
      throw error;
    }
  }

}

export default new ContactsApi();
