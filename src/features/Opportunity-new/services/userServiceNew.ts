import axiosService from '@/services/axiosService.js';
import { getCurrentUserId } from '@/utils/userUtils';
import { API_URLS } from '@/utils/apiUrls';

export const userServiceNew = {
  async getUsersForDropdown(): Promise<Array<{display: string; value: string; id: string}>> {
    const endpoint = API_URLS.USER.ACCOUNTS_MASTER(1);
    const response = await axiosService.get(endpoint);
    const users = response?.content?.List || [];
    return users
      .map((u: any) => ({
        display: u.Display || `${u.FirstName ?? ''} ${u.LastName ?? ''}`.trim() || 'Unknown User',
        value: `IE=${u.Value}~`,
        id: `IE=${u.Value}~`
      }))
      .filter((u: any) => u.display && u.display !== 'Unknown User');
  },

  async getSavedSearches(): Promise<{ allOpportunities: any[]; myOpportunities: any[] }> {
    const endpoint = `/services/crm/contacts/search/SavedSearchesList/22/1/1`;
    const response = await axiosService.get(endpoint);
    const searches = response?.content?.List || [];
    const filtered = Array.isArray(searches) ? searches : [];

    const allOpportunities = filtered.filter((s: any) =>
      (s.Type === 'Recent Search' || !s.Type || s.Type === 'All Opportunities') &&
      s.Name !== 'Latest Search' && s.Name !== 'Recent Search'
    );

    const myOpportunities = filtered.filter((s: any) =>
      s.Type === 'My Opportunities' && s.Name !== 'Latest Search' && s.Name !== 'Recent Search'
    );

    return { allOpportunities, myOpportunities };
  }
};

export default userServiceNew;
