import axiosService from '@/services/axiosService.js';
import { getCurrentUserId } from '@/utils/userUtils';
import { API_URLS } from '@/utils/apiUrls';
import { OpportunityFormData } from '../types/opportunity';

// Helper function to format date for API (MM/DD/YYYY format)
const formatDateForApi = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  });
};

// Helper function to format date from API - avoid timezone issues
const formatApiDate = (dateString: string): string => {
  if (!dateString || dateString === "0001-01-01T00:00:00") return "";
  const datePart = dateString.split('T')[0];
  return datePart;
};

// Helper function to safely get nested object values
const safeGet = (obj: any, path: string, defaultValue: any = ''): any => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  } catch (e) {
    return defaultValue;
  }
};

export class OpportunityService {
  // Get opportunity details by ID
  async getOpportunityDetails(opportunityId: string): Promise<any> {
    try {
      const response = await axiosService.get(`${API_URLS.OPPORTUNITIES.BASE}/${opportunityId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch opportunity details:', error);
      throw error;
    }
  }

  // Create or update opportunity
  async saveOpportunity(formData: OpportunityFormData): Promise<any> {
    try {
      const payload = this.buildOpportunityPayload(formData);
      console.log('OpportunityService: Saving opportunity with payload:', payload);
      
      const response = await axiosService.post(API_URLS.OPPORTUNITIES.BASE, payload);
      console.log('OpportunityService: Save response:', response);
      
      return response;
    } catch (error) {
      console.error('Failed to save opportunity:', error);
      throw error;
    }
  }

  // Delete opportunity
  async deleteOpportunity(opportunityId: string, userId?: string): Promise<any> {
    try {
      const userIdToUse = userId || getCurrentUserId();
      const response = await axiosService.delete(`${API_URLS.OPPORTUNITIES.BASE}/${opportunityId}/${userIdToUse}`);
      return response;
    } catch (error) {
      console.error('Failed to delete opportunity:', error);
      throw error;
    }
  }

  // Get opportunity history
  async getOpportunityHistory(opportunityId: string): Promise<any> {
    try {
      const response = await axiosService.get(`${API_URLS.OPPORTUNITIES.BASE}/History/${opportunityId}/10/1`);
      return response;
    } catch (error) {
      console.error('Failed to fetch opportunity history:', error);
      throw error;
    }
  }

  // Update opportunity stage via drag and drop
  async updateOpportunityStage(opportunityId: string, stageId: number, userId?: string): Promise<any> {
    try {
      const userIdToUse = userId || getCurrentUserId();
      const endpoint = `${API_URLS.OPPORTUNITIES.BASE}/Field/PipelineStageID/${opportunityId}/0/${userIdToUse}/Insert`;
      const response = await axiosService.post(endpoint, stageId);
      return response;
    } catch (error) {
      console.error('Failed to update opportunity stage:', error);
      throw error;
    }
  }

  // Build API payload from form data
  private buildOpportunityPayload(formData: OpportunityFormData): any {
    return {
      ID: formData.opportunityId ? parseInt(formData.opportunityId) : 0,
      Name: formData.name || "Opportunity",
      Status: formData.status || "Open",
      CloseDate: formatDateForApi(formData.projCloseDate),
      Amount: formData.amount ? formData.amount.toString() : "0.00",
      Probability: formData.probability ? parseInt(formData.probability) : 0,
      Source: formData.primaryCampaignSource || null,
      Notes: formData.notes || "",
      NextStep: formData.nextSteps || "",
      CreatedDate: formatDateForApi(formData.createdDate),
      ModfiedDate: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/, '$3-$1-$2 $4:$5:$6'),
      OppStageDetails: {
        ID: formData.stageDetails?.ID ? parseInt(formData.stageDetails.ID.toString()) : null,
        Stage: formData.stage || ""
      },
      ContactDetails: formData.contactDetails?.ID ? {
        ID: parseInt(formData.contactDetails.ID.toString()),
        SalesRepID: parseInt(formData.assignedRepDetails?.ID?.toString() || '0')
      } : {
        ID: 1611, // Default contact ID
        SalesRepID: parseInt(formData.assignedRepDetails?.ID?.toString() || '0')
      },
      ProductDetails: formData.productDetails && formData.productDetails.length > 0
        ? formData.productDetails.map(product => ({
          Details: null,
          Products: null,
          ListOfProducts: null,
          ID: parseInt(product.ID.toString()) || 0,
          Name: product.Name || ""
        }))
        : formData.product && formData.product.length > 0
          ? formData.product.map((name, index) => ({
            Details: null,
            Products: null,
            ListOfProducts: null,
            ID: parseInt(formData.productId[index]) || 0,
            Name: name
          }))
          : [{
            Details: null,
            Products: null,
            ListOfProducts: null,
            ID: 47,
            Name: "Classified Services"
          }],
      OwnerDetails: {
        ID: parseInt(formData.assignedRepDetails?.ID?.toString() || '0')
      },
      AssignedTODetails: formData.assignedRepDetails?.ID ? {
        ID: parseInt(formData.assignedRepDetails.ID.toString()),
        Name: formData.assignedRepDetails.Name || formData.assignedRep || ""
      } : {
        ID: 71, // Default assigned rep ID
        Name: formData.assignedRep || ""
      },
      SalesPresenterDetails: formData.salesPresenterDetails?.ID ? {
        ID: parseInt(formData.salesPresenterDetails.ID.toString()),
        Name: formData.salesPresenterDetails.Name || formData.salesPresentation || ""
      } : {
        ID: 0,
        Name: "*Unassigned*"
      },
      OppTypeDetails: {
        ID: formData.opportunityType?.id ? parseInt(formData.opportunityType.id) : null,
        Name: formData.opportunityType?.name || ""
      },
      BusinessUnitDetails: formData.businessUnitDetails && formData.businessUnitDetails.length > 0
        ? formData.businessUnitDetails.map(bu => ({
          ID: parseInt(bu.ID.toString()) || 0,
          Name: bu.Name || ""
        }))
        : formData.businessUnit && formData.businessUnit.length > 0
          ? formData.businessUnit.map((name, index) => ({
            ID: parseInt(formData.businessUnitId[index]) || 0,
            Name: name
          }))
          : [{ ID: "", Name: "" }],
      BusinessUnitIDS: formData.businessUnitId && formData.businessUnitId.length > 0
        ? formData.businessUnitId.join(",")
        : "",
      ProductIDS: formData.productId && formData.productId.length > 0
        ? formData.productId.join(",")
        : "",
      OppLossReasonDetails: formData.lossReasonDetails?.ID ? {
        ID: parseInt(formData.lossReasonDetails.ID.toString()),
        Name: formData.lossReasonDetails.Name || formData.lostReason || ""
      } : {
        ID: null,
        Name: formData.lostReason || ""
      },
      StageAction: "Add",
      SubContactDetails: formData.contactDetails?.ID ? {
        ID: parseInt(formData.contactDetails.ID.toString()),
        Name: formData.contactDetails.Name || formData.contactName || ""
      } : {
        ID: 0,
        Name: formData.contactName || ""
      },
      ProposalID: formData.proposalId || ""
    };
  }

  // Map API response to form data
  mapApiResponseToFormData(data: any): OpportunityFormData {
    // Helper functions for multiselect business units
    const getBusinessUnitValues = (data: any): string[] => {
      try {
        if (data.BusinessUnitDetailsArr && Array.isArray(data.BusinessUnitDetailsArr) && data.BusinessUnitDetailsArr.length > 0) {
          return data.BusinessUnitDetailsArr.map((bu: any) => bu.Name || '').filter((name: string) => name);
        }
        if (data.BusinessUnitDetails && data.BusinessUnitDetails.Name) {
          return [data.BusinessUnitDetails.Name];
        }
        return [];
      } catch (e) {
        return [];
      }
    };

    const getBusinessUnitIds = (data: any): string[] => {
      try {
        if (data.BusinessUnitDetailsArr && Array.isArray(data.BusinessUnitDetailsArr) && data.BusinessUnitDetailsArr.length > 0) {
          return data.BusinessUnitDetailsArr.map((bu: any) => bu.ID.toString()).filter((id: string) => id);
        }
        if (data.BusinessUnitDetails && data.BusinessUnitDetails.ID) {
          return [data.BusinessUnitDetails.ID.toString()];
        }
        return [];
      } catch (e) {
        return [];
      }
    };

    const getBusinessUnitDetailsArray = (data: any) => {
      try {
        if (data.BusinessUnitDetailsArr && Array.isArray(data.BusinessUnitDetailsArr) && data.BusinessUnitDetailsArr.length > 0) {
          return data.BusinessUnitDetailsArr.map((bu: any) => ({
            ID: bu.ID,
            Name: bu.Name || ''
          }));
        }
        if (data.BusinessUnitDetails && data.BusinessUnitDetails.Name) {
          return [{
            ID: data.BusinessUnitDetails.ID,
            Name: data.BusinessUnitDetails.Name
          }];
        }
        return [];
      } catch (e) {
        return [];
      }
    };

    // Helper functions for multiselect products
    const getProductValues = (data: any): string[] => {
      try {
        if (data.ProductsArr && Array.isArray(data.ProductsArr) && data.ProductsArr.length > 0) {
          return data.ProductsArr.map((product: any) => product.Name || '').filter((name: string) => name);
        }
        if (data.ProductDetails && data.ProductDetails.Name) {
          return [data.ProductDetails.Name];
        }
        return [];
      } catch (e) {
        return [];
      }
    };

    const getProductIds = (data: any): string[] => {
      try {
        if (data.ProductsArr && Array.isArray(data.ProductsArr) && data.ProductsArr.length > 0) {
          return data.ProductsArr.map((product: any) => product.ID.toString()).filter((id: string) => id);
        }
        if (data.ProductDetails && data.ProductDetails.ID) {
          return [data.ProductDetails.ID.toString()];
        }
        return [];
      } catch (e) {
        return [];
      }
    };

    const getProductDetailsArray = (data: any) => {
      try {
        if (data.ProductsArr && Array.isArray(data.ProductsArr) && data.ProductsArr.length > 0) {
          return data.ProductsArr.map((product: any) => ({
            ID: product.ID,
            Name: product.Name
          }));
        }
        if (data.ProductDetails && data.ProductDetails.Name) {
          return [{
            ID: safeGet(data, 'ProductDetails.ID'),
            Name: safeGet(data, 'ProductDetails.Name')
          }];
        }
        return [];
      } catch (e) {
        return [];
      }
    };

    return {
      opportunityId: data.ID?.toString() || '',
      proposalId: safeGet(data, 'ProposalID'),
      proposalName: safeGet(data, 'ProposalName'),
      name: safeGet(data, 'Name'),
      company: safeGet(data, 'ContactDetails.Name'),
      contactName: safeGet(data, 'SubContactDetails.ContactFullName') ||
        safeGet(data, 'SubContactDetails.ContactName') ||
        `${safeGet(data, 'SubContactDetails.FirstName')} ${safeGet(data, 'SubContactDetails.LastName')}`.trim(),
      status: safeGet(data, 'Status'),
      stage: safeGet(data, 'OppStageDetails.Stage'),
      stageDetails: data.OppStageDetails || {},
      amount: safeGet(data, 'Amount', ''),
      probability: safeGet(data, 'Probability', ''),
      stagePercentage: safeGet(data, 'OppStageDetails.PercentClosed', ''),
      opportunityType: {
        id: safeGet(data, 'OppTypeDetails.ID'),
        name: safeGet(data, 'OppTypeDetails.Name')
      },
      opportunityTypeId: safeGet(data, 'OppTypeDetails.ID'),
      businessUnit: getBusinessUnitValues(data),
      businessUnitId: getBusinessUnitIds(data),
      businessUnitDetails: getBusinessUnitDetailsArray(data),
      product: getProductValues(data),
      productId: getProductIds(data),
      productDetails: getProductDetailsArray(data),
      primaryCampaignSource: safeGet(data, 'Source'),
      assignedRep: safeGet(data, 'AssignedTODetails.Name'),
      assignedRepDetails: {
        ID: safeGet(data, 'AssignedTODetails.ID'),
        Name: safeGet(data, 'AssignedTODetails.Name')
      },
      createdBy: safeGet(data, 'OwnerDetails.Name') || safeGet(data, 'OwnerDetails.SalesRepName'),
      source: safeGet(data, 'Source'),
      leadSource: safeGet(data, 'LeadSource'),
      leadType: safeGet(data, 'LeadType'),
      leadStatus: safeGet(data, 'LeadStatus'),
      salesPresentation: safeGet(data, 'SalesPresenterDetails.Name') || safeGet(data, 'SalesPresenterDetails.SalesRepName'),
      salesPresenterDetails: {
        ID: safeGet(data, 'SalesPresenterDetails.ID'),
        Name: safeGet(data, 'SalesPresenterDetails.Name') || safeGet(data, 'SalesPresenterDetails.SalesRepName')
      },
      projCloseDate: formatApiDate(safeGet(data, 'CloseDate')),
      actualCloseDate: formatApiDate(safeGet(data, 'ActualCloseDate')),
      createdDate: formatApiDate(safeGet(data, 'CreatedDateTo')) || formatApiDate(safeGet(data, 'CreatedDate')),
      description: safeGet(data, 'Description'),
      priority: '',
      location: '',
      remote: false,
      industry: '',
      companySize: '',
      budget: '',
      decisionMaker: safeGet(data, 'SubContactDetails.ContactName'),
      timeframe: '',
      competitors: '',
      nextSteps: safeGet(data, 'NextStep'),
      lastActivity: safeGet(data, 'LastActivity'),
      territory: '',
      campaign: safeGet(data, 'Source'),
      referralSource: '',
      productInterest: getProductValues(data)[0] || '',
      painPoints: '',
      currentSolution: '',
      decisionCriteria: '',
      implementationDate: '',
      contractLength: '',
      renewalDate: '',
      lostReason: safeGet(data, 'OppLossReasonDetails.Name'),
      winReason: '',
      tags: '',
      notes: safeGet(data, 'Notes'),
      forecastRevenue: safeGet(data, 'Amount', ''),
      lossReasonDetails: {
        ID: safeGet(data, 'OppLossReasonDetails.ID'),
        Name: safeGet(data, 'OppLossReasonDetails.Name')
      },
      contactDetails: {
        ID: safeGet(data, 'SubContactDetails.ID'),
        Name: safeGet(data, 'SubContactDetails.ContactFullName') || safeGet(data, 'SubContactDetails.ContactName')
      }
    };
  }
}

export const opportunityService = new OpportunityService();