import apiService from './apiService';
import { userId } from '@/services/httpClient';

export const userService = {
  async getUsersForDropdown() {
    try {
      // Make API call to get users/sales reps using the correct endpoint
      const response = await apiService.get(`/services/User/Accounts/Master/${userId}/false/true`);
      
      console.log('Sales reps API response:', response);
      
      // The API response structure is: response.content.List
      const users = response.content?.List || [];
      
      console.log('Raw users from API:', users);
      
      if (!Array.isArray(users) || users.length === 0) {
        console.warn('No users found in API response or users is not an array');
        return [];
      }
      
      const formattedUsers = users.map(user => ({
        display: user.Display || `${user.FirstName} ${user.LastName}`.trim() || 'Unknown User',
        value: `IE=${user.Value}~`,
        id: `IE=${user.Value}~`
      })).filter(user => user.display !== 'Unknown User'); // Filter out users without proper names
      
      console.log('Formatted users for dropdown:', formattedUsers);
      
      return formattedUsers;
      
    } catch (error) {
      console.error('Failed to fetch users from API:', error);
      throw error; // Re-throw error instead of falling back to mock data
    }
  },

  async getOpportunityCreators() {
    try {
      // Make API call to get opportunity creators using the new endpoint
      const response = await apiService.get(`/services/User/Accounts/Master/${userId}/false/true`);
      
      console.log('Opportunity creators API response:', response);
      
      // The API response structure is: response.content.List
      const creators = response.content?.List || [];
      
      console.log('Raw creators from API:', creators);
      
      if (!Array.isArray(creators) || creators.length === 0) {
        console.warn('No creators found in API response or creators is not an array');
        return [];
      }
      
      const formattedCreators = creators.map(creator => ({
        label: `${creator.FirstName} ${creator.LastName}`.trim() || creator.Display || 'Unknown User',
        value: creator.Value
      })).filter(creator => creator.label !== 'Unknown User'); // Filter out creators without proper names
      
      console.log('Formatted creators for dropdown:', formattedCreators);
      
      return formattedCreators;
      
    } catch (error) {
      console.error('Failed to fetch opportunity creators from API:', error);
      throw error; // Re-throw error instead of falling back to mock data
    }
  },

  async getBusinessUnits() {
    try {
      // Make API call to get business units
      const response = await apiService.get('/services/admin/BusinessUnits/ByCriteria/true/-1');
      
      console.log('Business units API response:', response);
      
      // The API response structure is: response.content.List
      const businessUnits = response.content?.List || [];
      
      console.log('Raw business units from API:', businessUnits);
      
      if (!Array.isArray(businessUnits) || businessUnits.length === 0) {
        console.warn('No business units found in API response or business units is not an array');
        return [];
      }
      
      const formattedBusinessUnits = businessUnits.map(unit => ({
        label: unit.Display || 'Unknown Business Unit',
        value: unit.Value
      })).filter(unit => unit.label !== 'Unknown Business Unit'); // Filter out units without proper display names
      
      console.log('Formatted business units for dropdown:', formattedBusinessUnits);
      
      return formattedBusinessUnits;
      
    } catch (error) {
      console.error('Failed to fetch business units from API:', error);
      throw error; // Re-throw error instead of falling back to mock data
    }
  },

  async getProducts() {
    try {
      // Make API call to get products
      const response = await apiService.get('/services/Admin/Products/Master/-1/true/-1/1');
      
      console.log('Products API response:', response);
      
      // The API response structure is: response.content.List
      const products = response.content?.List || [];
      
      console.log('Raw products from API:', products);
      
      if (!Array.isArray(products) || products.length === 0) {
        console.warn('No products found in API response or products is not an array');
        return [];
      }
      
      const formattedProducts = products.map(product => ({
        label: product.Display || 'Unknown Product',
        value: product.Value
      })).filter(product => product.label !== 'Unknown Product'); // Filter out products without proper display names
      
      console.log('Formatted products for dropdown:', formattedProducts);
      
      return formattedProducts;
      
    } catch (error) {
      console.error('Failed to fetch products from API:', error);
      throw error; // Re-throw error instead of fallingback to mock data
    }
  },

  async getCampaigns() {
    try {
      // Make API call to get campaigns
      const response = await apiService.get('/services/Admin/Opportunities/Opportunity/Source/');
      
      console.log('Campaigns API response:', response);
      
      // The API response structure is: response.content.List
      const campaigns = response.content?.List || [];
      
      console.log('Raw campaigns from API:', campaigns);
      
      if (!Array.isArray(campaigns) || campaigns.length === 0) {
        console.warn('No campaigns found in API response or campaigns is not an array');
        return [];
      }
      
      const formattedCampaigns = campaigns.map(campaign => ({
        label: campaign.Source || 'Unknown Campaign',
        value: campaign.Source || ''
      })).filter(campaign => campaign.label !== 'Unknown Campaign' && campaign.value.trim() !== ''); // Filter out campaigns without proper source names
      
      console.log('Formatted campaigns for dropdown:', formattedCampaigns);
      
      return formattedCampaigns;
      
    } catch (error) {
      console.error('Failed to fetch campaigns from API:', error);
      throw error; // Re-throw error instead of falling back to mock data
    }
  },

  // Add implementation for getOpportunities
  async getOpportunities() {
    try {
      // Make API call to get opportunities
      // Using a generic endpoint to get opportunities list
      const response = await apiService.get('/services/CRM/Opportunities/ByCriteria/0/0/0/false/false/1/25');
      
      console.log('Opportunities API response:', response);
      
      // The API response structure might be: response.content.List or response.content.Opportunities
      const opportunities = response.content?.List || response.content?.Opportunities || [];
      
      console.log('Raw opportunities from API:', opportunities);
      
      if (!Array.isArray(opportunities) || opportunities.length === 0) {
        console.warn('No opportunities found in API response or opportunities is not an array');
        return [];
      }
      
      const formattedOpportunities = opportunities.map(opportunity => ({
        id: opportunity.ID || opportunity.Id || opportunity.id || '',
        name: opportunity.Name || opportunity.OpportunityName || opportunity.Display || 'Unknown Opportunity',
        value: opportunity.ID || opportunity.Id || opportunity.id || '',
        label: opportunity.Name || opportunity.OpportunityName || opportunity.Display || 'Unknown Opportunity'
      })).filter(opportunity => opportunity.name !== 'Unknown Opportunity'); // Filter out opportunities without proper names
      
      console.log('Formatted opportunities for dropdown:', formattedOpportunities);
      
      return formattedOpportunities;
      
    } catch (error) {
      console.error('Failed to fetch opportunities from API:', error);
      throw error;
    }
  },

  async getLeadSources() {
    try {
      const response = await apiService.get('/services/Admin/Masters/MasterData/LeadSources');
      
      console.log('Lead sources API response:', response);
      
      const leadSources = response.content?.Data?.LeadSources || [];
      
      console.log('Raw lead sources from API:', leadSources);
      
      if (!Array.isArray(leadSources) || leadSources.length === 0) {
        console.warn('No lead sources found in API response or lead sources is not an array');
        return [];
      }
      
      const formattedLeadSources = leadSources.map(source => ({
        value: source.Value,
        label: source.Display
      })).filter(source => source.label && source.value);
      
      console.log('Formatted lead sources for dropdown:', formattedLeadSources);
      
      return formattedLeadSources;
      
    } catch (error) {
      console.error('Failed to fetch lead sources from API:', error);
      throw error;
    }
  },

  async getLeadTypes() {
    try {
      const response = await apiService.get('/services/Admin/Masters/MasterData/LeadTypes');
      
      console.log('Lead types API response:', response);
      
      const leadTypes = response.content?.Data?.LeadTypes || [];
      
      console.log('Raw lead types from API:', leadTypes);
      
      if (!Array.isArray(leadTypes) || leadTypes.length === 0) {
        console.warn('No lead types found in API response or lead types is not an array');
        return [];
      }
      
      const formattedLeadTypes = leadTypes.map(type => ({
        value: type.Value,
        label: type.Display
      })).filter(type => type.label && type.value);
      
      console.log('Formatted lead types for dropdown:', formattedLeadTypes);
      
      return formattedLeadTypes;
      
    } catch (error) {
      console.error('Failed to fetch lead types from API:', error);
      throw error;
    }
  },

  async getLeadStatus() {
    try {
      const response = await apiService.get('/services/Admin/Masters/MasterData/LeadStatus');
      
      console.log('Lead status API response:', response);
      
      const leadStatus = response.content?.Data?.LeadStatus || [];
      
      console.log('Raw lead status from API:', leadStatus);
      
      if (!Array.isArray(leadStatus) || leadStatus.length === 0) {
        console.warn('No lead status found in API response or lead status is not an array');
        return [];
      }
      
      const formattedLeadStatus = leadStatus.map(status => ({
        value: status.Value,
        label: status.Display
      })).filter(status => status.label && status.value);
      
      console.log('Formatted lead status for dropdown:', formattedLeadStatus);
      
      return formattedLeadStatus;
      
    } catch (error) {
      console.error('Failed to fetch lead status from API:', error);
      throw error;
    }
  },

  async getSalesPresentations() {
    try {
      const response = await apiService.get(`/services/User/Accounts/Master/${userId}/false/true`);
      
      console.log('Sales presentations API response:', response);
      
      const presentations = response.content?.List || [];
      
      console.log('Raw sales presentations from API:', presentations);
      
      if (!Array.isArray(presentations) || presentations.length === 0) {
        console.warn('No sales presentations found in API response or presentations is not an array');
        return [];
      }
      
      const formattedPresentations = presentations.map(presentation => ({
        value: `IE=${presentation.Value}~`,
        label: `${presentation.FirstName} ${presentation.LastName}`,
        id: `IE=${presentation.Value}~`,
        Value: presentation.Value,
        FirstName: presentation.FirstName,
        LastName: presentation.LastName
      })).filter(presentation => presentation.label.trim() !== '' && presentation.value.trim() !== '');
      
      console.log('Formatted sales presentations for dropdown:', formattedPresentations);
      
      return formattedPresentations;
      
    } catch (error) {
      console.error('Failed to fetch sales presentations from API:', error);
      throw error;
    }
  },

  async getStages() {
    try {
      const response = await apiService.get('/services/Admin/Opportunities/Stage/');
      
      console.log('Stages API response:', response);
      
      const stages = response.content?.List || [];
      
      console.log('Raw stages from API:', stages);
      
      if (!Array.isArray(stages) || stages.length === 0) {
        console.warn('No stages found in API response or stages is not an array');
        return [];
      }
      
      const formattedStages = stages.map(stage => ({
        value: stage.ID || stage.Value || '',
        label: stage.Stage || stage.Display || stage.Name || 'Unknown Stage',
        ID: stage.ID,
        Stage: stage.Stage
      })).filter(stage => stage.label !== 'Unknown Stage' && stage.value.toString().trim() !== '');
      
      console.log('Formatted stages for dropdown:', formattedStages);
      
      return formattedStages;
      
    } catch (error) {
      console.error('Failed to fetch stages from API:', error);
      throw error;
    }
  },

  async getContactCountries() {
    try {
      const response = await apiService.get('/services/Admin/Masters/MasterData/ContactCountries');
      
      console.log('Contact countries API response:', response);
      
      const countries = response.content?.Data?.ContactCountries || [];
      
      console.log('Raw contact countries from API:', countries);
      
      if (!Array.isArray(countries) || countries.length === 0) {
        console.warn('No contact countries found in API response or countries is not an array');
        return [];
      }
      
      const formattedCountries = countries.map(country => ({
        value: country.Value,
        label: country.Display
      })).filter(country => country.label && country.value);
      
      console.log('Formatted contact countries for dropdown:', formattedCountries);
      
      return formattedCountries;
      
    } catch (error) {
      console.error('Failed to fetch contact countries from API:', error);
      throw error;
    }
  },

  async getContactStates() {
    try {
      const response = await apiService.get('/services/Admin/Masters/MasterData/ContactStates');
      
      console.log('Contact states API response:', response);
      
      const states = response.content?.Data?.ContactStates || [];
      
      console.log('Raw contact states from API:', states);
      
      if (!Array.isArray(states) || states.length === 0) {
        console.warn('No contact states found in API response or states is not an array');
        return [];
      }
      
      const formattedStates = states.map(state => ({
        value: state.Value,
        label: state.Display
      })).filter(state => state.label && state.value);
      
      console.log('Formatted contact states for dropdown:', formattedStates);
      
      return formattedStates;
      
    } catch (error) {
      console.error('Failed to fetch contact states from API:', error);
      throw error;
    }
  },

  async getContactCities() {
    try {
      const response = await apiService.get('/services/Admin/Masters/MasterData/ContactCities');
      
      console.log('Contact cities API response:', response);
      
      const cities = response.content?.Data?.ContactCities || [];
      
      console.log('Raw contact cities from API:', cities);
      
      if (!Array.isArray(cities) || cities.length === 0) {
        console.warn('No contact cities found in API response or cities is not an array');
        return [];
      }
      
      const formattedCities = cities.map(city => ({
        value: city.Value,
        label: city.Display
      })).filter(city => city.label && city.value);
      
      console.log('Formatted contact cities for dropdown:', formattedCities);
      
      return formattedCities;
      
    } catch (error) {
      console.error('Failed to fetch contact cities from API:', error);
      throw error;
    }
  },

  async getContactCounties() {
    try {
      const response = await apiService.get('/services/Admin/Masters/MasterData/ContactCounties');
      
      console.log('Contact counties API response:', response);
      
      const counties = response.content?.Data?.ContactCounties || [];
      
      console.log('Raw contact counties from API:', counties);
      
      if (!Array.isArray(counties) || counties.length === 0) {
        console.warn('No contact counties found in API response or counties is not an array');
        return [];
      }
      
      const formattedCounties = counties.map(county => ({
        value: county.Value,
        label: county.Display
      })).filter(county => county.label && county.value && county.value.trim() !== ''); // Filter out empty values
      
      console.log('Formatted contact counties for dropdown:', formattedCounties);
      
      return formattedCounties;
      
    } catch (error) {
      console.error('Failed to fetch contact counties from API:', error);
      throw error;
    }
  },

  async getSavedSearches() {
    try {
      const response = await apiService.get('/services/crm/contacts/search/SavedSearchesList/22/-1/1');
      
      console.log('Saved searches API response:', response);
      
      const searches = response.content?.List || [];
      
      console.log('Raw saved searches from API:', searches);
      
      if (!Array.isArray(searches) || searches.length === 0) {
        console.warn('No saved searches found in API response or searches is not an array');
        return { allOpportunities: [], myOpportunities: [] };
      }
      
      // Group searches by type
      const allOpportunities = searches.filter(search => 
        search.Type === "Recent Search" || !search.Type || search.Type === "All Opportunities"
      );
      
      const myOpportunities = searches.filter(search => 
        search.Type === "My Opportunities"
      );
      
      console.log('Grouped saved searches - All:', allOpportunities, 'My:', myOpportunities);
      
      return { allOpportunities, myOpportunities };
      
    } catch (error) {
      console.error('Failed to fetch saved searches from API:', error);
      throw error;
    }
  },

  async getOpportunityStatus() {
    try {
      // Make API call to get opportunity status
      const response = await apiService.get('/services/Admin/Opportunities/Status/');
      
      console.log('Opportunity status API response:', response);
      
      const statuses = response.content?.List || [];
      
      console.log('Raw opportunity status from API:', statuses);
      
      if (!Array.isArray(statuses) || statuses.length === 0) {
        console.warn('No opportunity status found in API response or statuses is not an array');
        return [];
      }
      
      const formattedStatuses = statuses.map(status => ({
        label: status.Display || status.Status || 'Unknown Status',
        value: status.Value || status.ID || ''
      })).filter(status => status.label !== 'Unknown Status' && status.value.trim() !== '');
      
      console.log('Formatted opportunity status for dropdown:', formattedStatuses);
      
      return formattedStatuses;
      
    } catch (error) {
      console.error('Failed to fetch opportunity status from API:', error);
      throw error;
    }
  },

  async getOpportunityTypes() {
    try {
      // Make API call to get opportunity types with new response structure
      const response = await apiService.get('/services/Admin/Opportunities/Type/');
      
      console.log('Opportunity types API response:', response);
      
      const types = response.content?.List || [];
      
      console.log('Raw opportunity types from API:', types);
      
      if (!Array.isArray(types) || types.length === 0) {
        console.warn('No opportunity types found in API response or types is not an array');
        return [];
      }
      
      const formattedTypes = types.map(type => ({
        label: type.Name || type.Display || type.Type || 'Unknown Type',
        value: type.ID || type.Value || '',
        ID: type.ID,
        Name: type.Name
      })).filter(type => type.label !== 'Unknown Type' && type.value.toString().trim() !== '');
      
      console.log('Formatted opportunity types for dropdown:', formattedTypes);
      
      return formattedTypes;
      
    } catch (error) {
      console.error('Failed to fetch opportunity types from API:', error);
      throw error;
    }
  },

  async getLossReasons() {
    try {
      // Make API call to get loss reasons with new response structure
      const response = await apiService.get('/services/Admin/Opportunities/lossreason/');
      
      console.log('Loss reasons API response:', response);
      
      const lossReasons = response.content?.List || [];
      
      console.log('Raw loss reasons from API:', lossReasons);
      
      if (!Array.isArray(lossReasons) || lossReasons.length === 0) {
        console.warn('No loss reasons found in API response or loss reasons is not an array');
        return [];
      }
      
      const formattedLossReasons = lossReasons.map(reason => ({
        label: reason.Name || reason.Display || reason.LossReason || 'Unknown Reason',
        value: reason.ID || reason.Value || '',
        ID: reason.ID,
        Name: reason.Name
      })).filter(reason => reason.label !== 'Unknown Reason' && reason.value.toString().trim() !== '');
      
      console.log('Formatted loss reasons for dropdown:', formattedLossReasons);
      
      return formattedLossReasons;
      
    } catch (error) {
      console.error('Failed to fetch loss reasons from API:', error);
      throw error;
    }
  },

  async getProbabilityOptions() {
    try {
      // Make API call to get probability options
      const response = await apiService.get('/services/Admin/Opportunities/Probability/');
      
      console.log('Probability options API response:', response);
      
      const probabilities = response.content?.List || [];
      
      console.log('Raw probability options from API:', probabilities);
      
      if (!Array.isArray(probabilities) || probabilities.length === 0) {
        console.warn('No probability options found in API response or probabilities is not an array');
        return [];
      }
      
      const formattedProbabilities = probabilities.map(prob => ({
        label: prob.Display || `${prob.Probability}%` || 'Unknown Probability',
        value: prob.Value || prob.Probability || ''
      })).filter(prob => prob.label !== 'Unknown Probability' && prob.value.toString().trim() !== '');
      
      console.log('Formatted probability options for dropdown:', formattedProbabilities);
      
      return formattedProbabilities;
      
    } catch (error) {
      console.error('Failed to fetch probability options from API:', error);
      throw error;
    }
  },

  async getProposalReps() {
    try {
      const response = await apiService.get(`/services/User/Accounts/Master/${userId}/false/true`);
      
      console.log('Proposal reps API response:', response);
      
      const reps = response.content?.List || [];
      
      console.log('Raw proposal reps from API:', reps);
      
      if (!Array.isArray(reps) || reps.length === 0) {
        console.warn('No proposal reps found in API response or reps is not an array');
        return [];
      }
      
      const formattedReps = reps.map(rep => ({
        value: rep.Value,
        label: rep.Display
      })).filter(rep => rep.label && rep.value);
      
      console.log('Formatted proposal reps for dropdown:', formattedReps);
      
      return formattedReps;
      
    } catch (error) {
      console.error('Failed to fetch proposal reps from API:', error);
      throw error;
    }
  },

  async getProposalApprovalStages() {
    try {
      const response = await apiService.get('/services/production/stages/proposal');
      
      console.log('Proposal approval stages API response:', response);
      
      const stages = response.content?.List || [];
      
      console.log('Raw proposal approval stages from API:', stages);
      
      if (!Array.isArray(stages) || stages.length === 0) {
        console.warn('No proposal approval stages found in API response or stages is not an array');
        return [];
      }
      
      const formattedStages = stages.map(stage => ({
        value: stage.StageId,
        label: stage.Name
      })).filter(stage => stage.label && stage.value);
      
      console.log('Formatted proposal approval stages for dropdown:', formattedStages);
      
      return formattedStages;
      
    } catch (error) {
      console.error('Failed to fetch proposal approval stages from API:', error);
      throw error;
    }
  }
};
