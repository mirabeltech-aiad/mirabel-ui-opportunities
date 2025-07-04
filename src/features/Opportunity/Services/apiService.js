import httpClient from '@/services/httpClient';
import { getCurrentUserId, getCurrentUserInfo } from '../../../utils/userUtils';
import { isActiveSession } from '../../../utils/sessionHelpers';
import opportunitiesApi from './opportunitiesApi';
import contactsApi from './contactsApi';
import activitiesApi from './activitiesApi';
import adminApi from './adminApi';
import proposalsApi from './proposalsApi';
import viewsApi from './viewsApi';

class ApiService {
  constructor() {
    this.httpClient = httpClient;
  }

  // Dynamic getters for current auth state
  get baseURL() {
    return this.httpClient.getBaseURL();
  }

  get authToken() {
    return this.httpClient.getCurrentToken();
  }

  get userId() {
    return getCurrentUserId();
  }

  get userInfo() {
    return getCurrentUserInfo();
  }

  get isAuthenticated() {
    return isActiveSession();
  }

  // Base HTTP methods
  async request(endpoint, options = {}) {
    return this.httpClient.request(endpoint, options);
  }

  async get(endpoint, params = {}) {
    return this.httpClient.get(endpoint, params);
  }

  async post(endpoint, data = {}) {
    return this.httpClient.post(endpoint, data);
  }

  async put(endpoint, data = {}) {
    return this.httpClient.put(endpoint, data);
  }

  async delete(endpoint) {
    return this.httpClient.delete(endpoint);
  }

  // Opportunities methods
  async updateOpportunity(opportunityData) {
    return opportunitiesApi.updateOpportunity(opportunityData);
  }

  async createOpportunity(opportunityData) {
    return opportunitiesApi.createOpportunity(opportunityData);
  }

  async updateOpportunityStage(stageId, opportunityId) {
    return opportunitiesApi.updateOpportunityStage(stageId, opportunityId);
  }

  async getOpportunityDetails(opportunityId) {
    return opportunitiesApi.getOpportunityDetails(opportunityId);
  }

  async getOpportunityHistory(opportunityId) {
    return opportunitiesApi.getOpportunityHistory(opportunityId);
  }

  async getOpportunityTypes() {
    return opportunitiesApi.getOpportunityTypes();
  }

  async getOpportunityLossReasons() {
    return opportunitiesApi.getOpportunityLossReasons();
  }

  async getOpportunityStages() {
    return adminApi.getOpportunityStages();
  }

  // Contacts methods
  async getCompanyDetails(contactId) {
    return contactsApi.getCompanyDetails(contactId);
  }

  async getContactNames(contactId) {
    return contactsApi.getContactNames(contactId);
  }

  async searchCustomers(searchText) {
    return contactsApi.searchCustomers(searchText);
  }

  // Activities methods
  async getActivities(contactId) {
    return activitiesApi.getActivities(contactId);
  }

  async getCallActivities(contactId) {
    return activitiesApi.getCallActivities(contactId);
  }

  async getMeetingActivities(contactId) {
    return activitiesApi.getMeetingActivities(contactId);
  }

  async getNotesActivities(contactId) {
    return activitiesApi.getNotesActivities(contactId);
  }

  async getEmailActivities(contactId) {
    return activitiesApi.getEmailActivities(contactId);
  }

  // Admin methods
  async getBusinessUnits() {
    return adminApi.getBusinessUnits();
  }

  async getProducts() {
    return adminApi.getProducts();
  }

  async getProductsByCriteria(businessUnitIds = "") {
    return adminApi.getProductsByCriteria(businessUnitIds);
  }

  async getUserAccounts() {
    return adminApi.getUserAccounts();
  }

  // Proposals methods
  async getLinkedProposals(params = {}) {
    return proposalsApi.getLinkedProposals(params);
  }

  // Views methods
  async getSavedViews() {
    return viewsApi.getSavedViews();
  }

  async getProposalViews() {
    return viewsApi.getProposalViews();
  }

  async getAvailableColumns() {
    return viewsApi.getAvailableColumns();
  }

  async getProposalAvailableColumns() {
    return viewsApi.getProposalAvailableColumns();
  }

  async getViewDetails(viewId) {
    return viewsApi.getViewDetails(viewId);
  }

  async saveCustomView(viewData) {
    return viewsApi.saveCustomView(viewData);
  }

  async updateView(viewData) {
    return viewsApi.updateView(viewData);
  }

  async deleteProposalView(viewId) {
    return viewsApi.deleteProposalView(viewId);
  }

  // Settings methods
  async getReportSettings(userId = null, viewId = -1) {
    const currentUserId = userId || this.userId;
    return this.get(`Reports/Settings/${currentUserId}/${viewId}`);
  }

  async updateReportSettings(payload) {
    return this.post('Reports/Settings/', payload);
  }

  // Utility methods
  getApiInfo() {
    return {
      baseURL: this.baseURL,
      isAuthenticated: this.isAuthenticated,
      userId: this.userId,
      userInfo: this.userInfo,
      domain: this.httpClient.getDomain()
    };
  }

  // Force refresh authentication state
  refreshAuth() {
    // This will force httpClient to update its configuration
    this.httpClient.updateConfiguration();
  }
}

export default new ApiService();
