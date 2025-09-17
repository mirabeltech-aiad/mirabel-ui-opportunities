import axiosService from '@/services/axiosService';
import { API_URLS } from '@/utils/apiUrls';
import { getCurrentUserId } from '@/utils/userUtils';

// API endpoints for Advanced Search dropdowns
export const advancedSearchApi = {
  // Opportunity related APIs
  opportunity: {
    // Get opportunity names - using existing opportunities API
    getOpportunityNames: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.CRM.OPPORTUNITIES_BY_CRITERIA);
        const opportunities = response.content?.List || [];
        return opportunities.map(opp => ({
          id: opp.ID || opp.Id,
          label: opp.Name || opp.OpportunityName || 'Unknown Opportunity',
          value: opp.ID || opp.Id
        }));
      } catch (error) {
        console.error('Error fetching opportunity names:', error);
        throw error;
      }
    },

    // Get company names - using existing contacts API
    getCompanyNames: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.CONTACTS.DISTINCT_CUSTOMERS);
        const companies = response.content?.List || [];
        return companies.map(company => ({
          id: company.ID || company.Id,
          label: company.CompanyName || company.Name || 'Unknown Company',
          value: company.ID || company.Id
        }));
      } catch (error) {
        console.error('Error fetching company names:', error);
        throw error;
      }
    },

    // Get sales presenters - using existing user accounts API
    getSalesPresenters: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.USER.ACCOUNTS_MASTER(getCurrentUserId()));
        const users = response.content?.List || [];
        return users.map(user => ({
          id: `IE=${user.Value}~`,
          label: user.Display || `${user.FirstName} ${user.LastName}`.trim() || 'Unknown User',
          value: `IE=${user.Value}~`
        }));
      } catch (error) {
        console.error('Error fetching sales presenters:', error);
        throw error;
      }
    },

    // Get created reps - same as sales presenters
    getCreatedReps: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.USER.ACCOUNTS_MASTER(getCurrentUserId()));
        const users = response.content?.List || [];
        return users.map(user => ({
          id: `IE=${user.Value}~`,
          label: user.Display || `${user.FirstName} ${user.LastName}`.trim() || 'Unknown User',
          value: `IE=${user.Value}~`
        }));
      } catch (error) {
        console.error('Error fetching created reps:', error);
        throw error;
      }
    },

    // Get assigned reps - same as sales presenters
    getAssignedReps: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.USER.ACCOUNTS_MASTER(getCurrentUserId()));
        const users = response.content?.List || [];
        return users.map(user => ({
          id: `IE=${user.Value}~`,
          label: user.Display || `${user.FirstName} ${user.LastName}`.trim() || 'Unknown User',
          value: `IE=${user.Value}~`
        }));
      } catch (error) {
        console.error('Error fetching assigned reps:', error);
        throw error;
      }
    },

    // Get business units - using business units API
    getBusinessUnits: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.BUSINESS_UNITS);
        const businessUnits = response.content?.List || [];
        return businessUnits.map(bu => ({
          id: bu.ID || bu.Id,
          label: bu.Name || bu.BusinessUnitName || 'Unknown Business Unit',
          value: bu.ID || bu.Id
        }));
      } catch (error) {
        console.error('Error fetching business units:', error);
        throw error;
      }
    },

    // Get products - using products master API
    getProducts: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.PRODUCTS_MASTER);
        const products = response.content?.List || [];
        return products.map(product => ({
          id: product.ID || product.Id,
          label: product.Display || product.Name || 'Unknown Product',
          value: product.ID || product.Id
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },

    // Get campaign sources - using lead sources API
    getCampaignSources: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.LEAD_SOURCES);
        const sources = response.content?.List || [];
        return sources.map(source => ({
          id: source.ID || source.Id,
          label: source.Name || source.LeadSourceName || 'Unknown Source',
          value: source.ID || source.Id
        }));
      } catch (error) {
        console.error('Error fetching campaign sources:', error);
        throw error;
      }
    },

    // Get opportunity statuses
    getStatuses: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.OPPORTUNITY_STATUS);
        const statuses = response.content?.List || [];
        return statuses.map(status => ({
          id: status.ID || status.Id,
          label: status.Name || status.StatusName || 'Unknown Status',
          value: status.ID || status.Id
        }));
      } catch (error) {
        console.error('Error fetching statuses:', error);
        throw error;
      }
    },

    // Get stages
    getStages: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.OPPORTUNITY_STAGES);
        const stages = response.content?.List || [];
        return stages.map(stage => ({
          id: stage.ID || stage.Id,
          label: stage.Name || stage.StageName || 'Unknown Stage',
          value: stage.ID || stage.Id
        }));
      } catch (error) {
        console.error('Error fetching stages:', error);
        throw error;
      }
    },

    // Get probabilities
    getProbabilities: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.OPPORTUNITY_PROBABILITY);
        const probabilities = response.content?.List || [];
        return probabilities.map(prob => ({
          id: prob.ID || prob.Id,
          label: prob.Name || prob.ProbabilityName || 'Unknown Probability',
          value: prob.ID || prob.Id
        }));
      } catch (error) {
        console.error('Error fetching probabilities:', error);
        throw error;
      }
    },

    // Get opportunity types
    getTypes: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.OPPORTUNITY_TYPES);
        const types = response.content?.List || [];
        return types.map(type => ({
          id: type.ID || type.Id,
          label: type.Name || type.TypeName || 'Unknown Type',
          value: type.ID || type.Id
        }));
      } catch (error) {
        console.error('Error fetching types:', error);
        throw error;
      }
    },

    // Get loss reasons
    getLossReasons: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.OPPORTUNITY_LOSS_REASONS);
        const lossReasons = response.content?.List || [];
        return lossReasons.map(reason => ({
          id: reason.ID || reason.Id,
          label: reason.Name || reason.LossReasonName || 'Unknown Loss Reason',
          value: reason.ID || reason.Id
        }));
      } catch (error) {
        console.error('Error fetching loss reasons:', error);
        throw error;
      }
    },

    // Contact/Address Info APIs for Opportunities
    getEmails: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.CONTACTS.DISTINCT_CUSTOMER_EMAILS(getCurrentUserId()));
        const emails = response.content?.List || [];
        return emails.map(email => ({
          id: email.ID || email.Id,
          label: email.Email || email.EmailAddress || 'Unknown Email',
          value: email.ID || email.Id
        }));
      } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
      }
    },

    getPhoneNumbers: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.CONTACTS.DISTINCT_CUSTOMERS);
        const contacts = response.content?.List || [];
        return contacts.map(contact => ({
          id: contact.ID || contact.Id,
          label: contact.Phone || contact.PhoneNumber || 'Unknown Phone',
          value: contact.ID || contact.Id
        }));
      } catch (error) {
        console.error('Error fetching phone numbers:', error);
        throw error;
      }
    },

    getCities: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.CONTACT_CITIES);
        const cities = response.content?.List || [];
        return cities.map(city => ({
          id: city.ID || city.Id,
          label: city.Name || city.CityName || 'Unknown City',
          value: city.ID || city.Id
        }));
      } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
    },

    getStates: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.CONTACT_STATES);
        const states = response.content?.List || [];
        return states.map(state => ({
          id: state.ID || state.Id,
          label: state.Name || state.StateName || 'Unknown State',
          value: state.ID || state.Id
        }));
      } catch (error) {
        console.error('Error fetching states:', error);
        throw error;
      }
    },

    getZipPostalCodes: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.CONTACTS.DISTINCT_CUSTOMERS);
        const contacts = response.content?.List || [];
        return contacts.map(contact => ({
          id: contact.ID || contact.Id,
          label: contact.ZipCode || contact.PostalCode || 'Unknown Zip',
          value: contact.ID || contact.Id
        }));
      } catch (error) {
        console.error('Error fetching zip/postal codes:', error);
        throw error;
      }
    },

    getCounties: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.CONTACT_COUNTIES);
        const counties = response.content?.List || [];
        return counties.map(county => ({
          id: county.ID || county.Id,
          label: county.Name || county.CountyName || 'Unknown County',
          value: county.ID || county.Id
        }));
      } catch (error) {
        console.error('Error fetching counties:', error);
        throw error;
      }
    },

    getCountries: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.CONTACT_COUNTRIES);
        const countries = response.content?.List || [];
        return countries.map(country => ({
          id: country.ID || country.Id,
          label: country.Name || country.CountryName || 'Unknown Country',
          value: country.ID || country.Id
        }));
      } catch (error) {
        console.error('Error fetching countries:', error);
        throw error;
      }
    },

    // Proposal Info APIs for Opportunities
    getProposalReps: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.USER.ACCOUNTS_MASTER(getCurrentUserId()));
        const users = response.content?.List || [];
        return users.map(user => ({
          id: `IE=${user.Value}~`,
          label: user.Display || `${user.FirstName} ${user.LastName}`.trim() || 'Unknown User',
          value: `IE=${user.Value}~`
        }));
      } catch (error) {
        console.error('Error fetching proposal reps:', error);
        throw error;
      }
    },

    getProposalNames: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.PROPOSALS.BY_CRITERIA);
        const proposals = response.content?.List || [];
        return proposals.map(proposal => ({
          id: proposal.ID || proposal.Id,
          label: proposal.Name || proposal.ProposalName || 'Unknown Proposal',
          value: proposal.ID || proposal.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal names:', error);
        throw error;
      }
    },

    getProposalIds: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.PROPOSALS.BY_CRITERIA);
        const proposals = response.content?.List || [];
        return proposals.map(proposal => ({
          id: proposal.ID || proposal.Id,
          label: proposal.ID || proposal.ProposalID || 'Unknown ID',
          value: proposal.ID || proposal.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal IDs:', error);
        throw error;
      }
    },

    getProposalStatuses: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.PROPOSAL_STAGES);
        const statuses = response.content?.List || [];
        return statuses.map(status => ({
          id: status.ID || status.Id,
          label: status.Name || status.StatusName || 'Unknown Status',
          value: status.ID || status.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal statuses:', error);
        throw error;
      }
    },

    getProposalApprovalStatuses: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.PROPOSAL_STAGES);
        const statuses = response.content?.List || [];
        return statuses.map(status => ({
          id: status.ID || status.Id,
          label: status.Name || status.ApprovalStatus || 'Unknown Status',
          value: status.ID || status.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal approval statuses:', error);
        throw error;
      }
    },

    getProposalApprovalStages: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.PROPOSAL_STAGES);
        const stages = response.content?.List || [];
        return stages.map(stage => ({
          id: stage.ID || stage.Id,
          label: stage.Name || stage.StageName || 'Unknown Stage',
          value: stage.ID || stage.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal approval stages:', error);
        throw error;
      }
    },

    getProposalTotals: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.PROPOSALS.BY_CRITERIA);
        const proposals = response.content?.List || [];
        return proposals.map(proposal => ({
          id: proposal.ID || proposal.Id,
          label: proposal.Total || proposal.Amount || 'Unknown Total',
          value: proposal.ID || proposal.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal totals:', error);
        throw error;
      }
    },

    getProposalCreatedDates: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.PROPOSALS.BY_CRITERIA);
        const proposals = response.content?.List || [];
        return proposals.map(proposal => ({
          id: proposal.ID || proposal.Id,
          label: proposal.CreatedDate || proposal.DateCreated || 'Unknown Date',
          value: proposal.ID || proposal.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal created dates:', error);
        throw error;
      }
    },
  },

  // Proposal related APIs
  proposal: {
    // Get proposal names - using existing proposals API
    getProposalNames: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.PROPOSALS.BY_CRITERIA);
        const proposals = response.content?.List || [];
        return proposals.map(proposal => ({
          id: proposal.ID || proposal.Id,
          label: proposal.Name || proposal.ProposalName || 'Unknown Proposal',
          value: proposal.ID || proposal.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal names:', error);
        throw error;
      }
    },

    // Get customer names - using existing contacts API
    getCustomerNames: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.CONTACTS.DISTINCT_CUSTOMERS);
        const customers = response.content?.List || [];
        return customers.map(customer => ({
          id: customer.ID || customer.Id,
          label: customer.CompanyName || customer.Name || 'Unknown Customer',
          value: customer.ID || customer.Id
        }));
      } catch (error) {
        console.error('Error fetching customer names:', error);
        throw error;
      }
    },

    // Get proposal statuses - using existing proposal stages API
    getStatuses: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.PROPOSAL_STAGES);
        const statuses = response.content?.List || [];
        return statuses.map(status => ({
          id: status.ID || status.Id,
          label: status.Name || status.StatusName || 'Unknown Status',
          value: status.ID || status.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal statuses:', error);
        throw error;
      }
    },

    // Get proposal stages - using existing proposal stages API
    getStages: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.PROPOSAL_STAGES);
        const stages = response.content?.List || [];
        return stages.map(stage => ({
          id: stage.ID || stage.Id,
          label: stage.Name || stage.StageName || 'Unknown Stage',
          value: stage.ID || stage.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal stages:', error);
        throw error;
      }
    },

    // Get proposal types - using opportunity types as fallback
    getTypes: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.OPPORTUNITY_TYPES);
        const types = response.content?.List || [];
        return types.map(type => ({
          id: type.ID || type.Id,
          label: type.Name || type.TypeName || 'Unknown Type',
          value: type.ID || type.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal types:', error);
        throw error;
      }
    },

    // Get proposal loss reasons - using existing loss reasons API
    getLossReasons: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.OPPORTUNITY_LOSS_REASONS);
        const lossReasons = response.content?.List || [];
        return lossReasons.map(reason => ({
          id: reason.ID || reason.Id,
          label: reason.Name || reason.LossReasonName || 'Unknown Loss Reason',
          value: reason.ID || reason.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal loss reasons:', error);
        throw error;
      }
    },

    // Contact/Address Info APIs
    getEmails: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.CONTACTS.DISTINCT_CUSTOMER_EMAILS(getCurrentUserId()));
        const emails = response.content?.List || [];
        return emails.map(email => ({
          id: email.ID || email.Id,
          label: email.Email || email.EmailAddress || 'Unknown Email',
          value: email.ID || email.Id
        }));
      } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
      }
    },

    getPhoneNumbers: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.CONTACTS.DISTINCT_CUSTOMERS);
        const contacts = response.content?.List || [];
        return contacts.map(contact => ({
          id: contact.ID || contact.Id,
          label: contact.Phone || contact.PhoneNumber || 'Unknown Phone',
          value: contact.ID || contact.Id
        }));
      } catch (error) {
        console.error('Error fetching phone numbers:', error);
        throw error;
      }
    },

    getCities: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.CONTACT_CITIES);
        const cities = response.content?.List || [];
        return cities.map(city => ({
          id: city.ID || city.Id,
          label: city.Name || city.CityName || 'Unknown City',
          value: city.ID || city.Id
        }));
      } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
    },

    getStates: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.CONTACT_STATES);
        const states = response.content?.List || [];
        return states.map(state => ({
          id: state.ID || state.Id,
          label: state.Name || state.StateName || 'Unknown State',
          value: state.ID || state.Id
        }));
      } catch (error) {
        console.error('Error fetching states:', error);
        throw error;
      }
    },

    getZipPostalCodes: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.CONTACTS.DISTINCT_CUSTOMERS);
        const contacts = response.content?.List || [];
        return contacts.map(contact => ({
          id: contact.ID || contact.Id,
          label: contact.ZipCode || contact.PostalCode || 'Unknown Zip',
          value: contact.ID || contact.Id
        }));
      } catch (error) {
        console.error('Error fetching zip/postal codes:', error);
        throw error;
      }
    },

    getCounties: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.CONTACT_COUNTIES);
        const counties = response.content?.List || [];
        return counties.map(county => ({
          id: county.ID || county.Id,
          label: county.Name || county.CountyName || 'Unknown County',
          value: county.ID || county.Id
        }));
      } catch (error) {
        console.error('Error fetching counties:', error);
        throw error;
      }
    },

    getCountries: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.CONTACT_COUNTRIES);
        const countries = response.content?.List || [];
        return countries.map(country => ({
          id: country.ID || country.Id,
          label: country.Name || country.CountryName || 'Unknown Country',
          value: country.ID || country.Id
        }));
      } catch (error) {
        console.error('Error fetching countries:', error);
        throw error;
      }
    },

    // Additional Proposal Info APIs
    getProposalReps: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.USER.ACCOUNTS_MASTER(getCurrentUserId()));
        const users = response.content?.List || [];
        return users.map(user => ({
          id: `IE=${user.Value}~`,
          label: user.Display || `${user.FirstName} ${user.LastName}`.trim() || 'Unknown User',
          value: `IE=${user.Value}~`
        }));
      } catch (error) {
        console.error('Error fetching proposal reps:', error);
        throw error;
      }
    },

    getProposalIds: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.PROPOSALS.BY_CRITERIA);
        const proposals = response.content?.List || [];
        return proposals.map(proposal => ({
          id: proposal.ID || proposal.Id,
          label: proposal.ID || proposal.ProposalID || 'Unknown ID',
          value: proposal.ID || proposal.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal IDs:', error);
        throw error;
      }
    },

    getProposalApprovalStatuses: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.PROPOSAL_STAGES);
        const statuses = response.content?.List || [];
        return statuses.map(status => ({
          id: status.ID || status.Id,
          label: status.Name || status.ApprovalStatus || 'Unknown Status',
          value: status.ID || status.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal approval statuses:', error);
        throw error;
      }
    },

    getProposalApprovalStages: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.PROPOSAL_STAGES);
        const stages = response.content?.List || [];
        return stages.map(stage => ({
          id: stage.ID || stage.Id,
          label: stage.Name || stage.StageName || 'Unknown Stage',
          value: stage.ID || stage.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal approval stages:', error);
        throw error;
      }
    },

    getProposalTotals: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.PROPOSALS.BY_CRITERIA);
        const proposals = response.content?.List || [];
        return proposals.map(proposal => ({
          id: proposal.ID || proposal.Id,
          label: proposal.Total || proposal.Amount || 'Unknown Total',
          value: proposal.ID || proposal.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal totals:', error);
        throw error;
      }
    },

    getProposalCreatedDates: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.PROPOSALS.BY_CRITERIA);
        const proposals = response.content?.List || [];
        return proposals.map(proposal => ({
          id: proposal.ID || proposal.Id,
          label: proposal.CreatedDate || proposal.DateCreated || 'Unknown Date',
          value: proposal.ID || proposal.Id
        }));
      } catch (error) {
        console.error('Error fetching proposal created dates:', error);
        throw error;
      }
    },
  },

  // Common APIs (used by both opportunities and proposals)
  common: {
    // Get sales presenters (shared) - using existing user accounts API
    getSalesPresenters: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.USER.ACCOUNTS_MASTER(getCurrentUserId()));
        const users = response.content?.List || [];
        return users.map(user => ({
          id: `IE=${user.Value}~`,
          label: user.Display || `${user.FirstName} ${user.LastName}`.trim() || 'Unknown User',
          value: `IE=${user.Value}~`
        }));
      } catch (error) {
        console.error('Error fetching sales presenters:', error);
        throw error;
      }
    },

    // Get created reps (shared) - using existing user accounts API
    getCreatedReps: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.USER.ACCOUNTS_MASTER(getCurrentUserId()));
        const users = response.content?.List || [];
        return users.map(user => ({
          id: `IE=${user.Value}~`,
          label: user.Display || `${user.FirstName} ${user.LastName}`.trim() || 'Unknown User',
          value: `IE=${user.Value}~`
        }));
      } catch (error) {
        console.error('Error fetching created reps:', error);
        throw error;
      }
    },

    // Get assigned reps (shared) - using existing user accounts API
    getAssignedReps: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.USER.ACCOUNTS_MASTER(getCurrentUserId()));
        const users = response.content?.List || [];
        return users.map(user => ({
          id: `IE=${user.Value}~`,
          label: user.Display || `${user.FirstName} ${user.LastName}`.trim() || 'Unknown User',
          value: `IE=${user.Value}~`
        }));
      } catch (error) {
        console.error('Error fetching assigned reps:', error);
        throw error;
      }
    },

    // Get business units (shared) - using business units API
    getBusinessUnits: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.BUSINESS_UNITS);
        const businessUnits = response.content?.List || [];
        return businessUnits.map(bu => ({
          id: bu.ID || bu.Id,
          label: bu.Name || bu.BusinessUnitName || 'Unknown Business Unit',
          value: bu.ID || bu.Id
        }));
      } catch (error) {
        console.error('Error fetching business units:', error);
        throw error;
      }
    },

    // Get products (shared) - using products master API
    getProducts: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.PRODUCTS_MASTER);
        const products = response.content?.List || [];
        return products.map(product => ({
          id: product.ID || product.Id,
          label: product.Display || product.Name || 'Unknown Product',
          value: product.ID || product.Id
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },

    // Get campaign sources (shared) - using lead sources API
    getCampaignSources: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.MASTERS.LEAD_SOURCES);
        const sources = response.content?.List || [];
        return sources.map(source => ({
          id: source.ID || source.Id,
          label: source.Name || source.LeadSourceName || 'Unknown Source',
          value: source.ID || source.Id
        }));
      } catch (error) {
        console.error('Error fetching campaign sources:', error);
        throw error;
      }
    },

    // Get probabilities (shared) - using existing probability API
    getProbabilities: async (searchTerm = '') => {
      try {
        const response = await axiosService.get(API_URLS.ADMIN.OPPORTUNITY_PROBABILITY);
        const probabilities = response.content?.List || [];
        return probabilities.map(prob => ({
          id: prob.ID || prob.Id,
          label: prob.Name || prob.ProbabilityName || 'Unknown Probability',
          value: prob.ID || prob.Id
        }));
      } catch (error) {
        console.error('Error fetching probabilities:', error);
        throw error;
      }
    },
  }
};

// Helper function to get API method based on field key and tab type
export const getApiMethod = (fieldKey, tabType) => {
  const apiMap = {
    // Opportunity specific
    opportunityName: () => advancedSearchApi.opportunity.getOpportunityNames(),
    companyName: () => advancedSearchApi.opportunity.getCompanyNames(),
    status: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getStatuses() 
      : advancedSearchApi.proposal.getStatuses(),
    stage: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getStages() 
      : advancedSearchApi.proposal.getStages(),
    type: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getTypes() 
      : advancedSearchApi.proposal.getTypes(),
    lossReason: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getLossReasons() 
      : advancedSearchApi.proposal.getLossReasons(),

    // Proposal specific
    proposalName: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getProposalNames() 
      : advancedSearchApi.proposal.getProposalNames(),
    customerName: () => advancedSearchApi.proposal.getCustomerNames(),

    // Contact/Address Info fields - available for both tabs
    email: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getEmails() 
      : advancedSearchApi.proposal.getEmails(),
    phoneNumber: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getPhoneNumbers() 
      : advancedSearchApi.proposal.getPhoneNumbers(),
    city: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getCities() 
      : advancedSearchApi.proposal.getCities(),
    state: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getStates() 
      : advancedSearchApi.proposal.getStates(),
    zipPostalCode: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getZipPostalCodes() 
      : advancedSearchApi.proposal.getZipPostalCodes(),
    county: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getCounties() 
      : advancedSearchApi.proposal.getCounties(),
    country: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getCountries() 
      : advancedSearchApi.proposal.getCountries(),

    // Additional Proposal Info fields - available for both tabs
    proposalRep: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getProposalReps() 
      : advancedSearchApi.proposal.getProposalReps(),
    proposalId: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getProposalIds() 
      : advancedSearchApi.proposal.getProposalIds(),
    proposalStatus: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getProposalStatuses() 
      : advancedSearchApi.proposal.getStatuses(),
    proposalApprovalStatus: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getProposalApprovalStatuses() 
      : advancedSearchApi.proposal.getProposalApprovalStatuses(),
    proposalApprovalStages: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getProposalApprovalStages() 
      : advancedSearchApi.proposal.getProposalApprovalStages(),
    proposalTotal: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getProposalTotals() 
      : advancedSearchApi.proposal.getProposalTotals(),
    proposalCreatedDate: () => tabType === 'opportunities' 
      ? advancedSearchApi.opportunity.getProposalCreatedDates() 
      : advancedSearchApi.proposal.getProposalCreatedDates(),

    // Common fields
    salesPresenter: () => advancedSearchApi.common.getSalesPresenters(),
    createdRep: () => advancedSearchApi.common.getCreatedReps(),
    assignedRep: () => advancedSearchApi.common.getAssignedReps(),
    businessUnit: () => advancedSearchApi.common.getBusinessUnits(),
    product: () => advancedSearchApi.common.getProducts(),
    primaryCampaignSource: () => advancedSearchApi.common.getCampaignSources(),
    probability: () => advancedSearchApi.common.getProbabilities(),
  };

  return apiMap[fieldKey] || null;
};

export default advancedSearchApi;
