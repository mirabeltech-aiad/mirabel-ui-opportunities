import apiService from './apiService';
import { mapStageToStandard } from '@OpportunityUtils/reports/stageMapping';

class StageService {
  constructor() {
    this.cachedStages = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.lastCacheTime = null;
  }

  // Get live stages from API
  async getLiveStages() {
    try {
      // Check cache first
      if (this.cachedStages && this.lastCacheTime && 
          (Date.now() - this.lastCacheTime) < this.cacheTimeout) {
        return this.cachedStages;
      }

      const response = await apiService.get('/services/Admin/Opportunities/Stage/');
      console.log('Live stages API response:', response);
      
      const stages = response.content?.List || [];
      
      if (!Array.isArray(stages) || stages.length === 0) {
        console.warn('No stages found in API response');
        return this.getFallbackStages();
      }

      // Format stages for use in components
      const formattedStages = stages.map(stage => ({
        id: stage.ID,
        name: stage.Stage || stage.Display || 'Unknown Stage',
        value: stage.Stage || stage.Display,
        standardStage: mapStageToStandard(stage.Stage || stage.Display),
        apiStage: stage.Stage || stage.Display
      })).filter(stage => stage.name !== 'Unknown Stage');

      // Cache the results
      this.cachedStages = formattedStages;
      this.lastCacheTime = Date.now();
      
      console.log('Formatted live stages:', formattedStages);
      return formattedStages;
      
    } catch (error) {
      console.error('Failed to fetch live stages:', error);
      return this.getFallbackStages();
    }
  }

  // Fallback stages if API fails
  getFallbackStages() {
    return [
      { id: 1, name: 'Prospecting', value: 'Prospecting', standardStage: 'Prospecting', apiStage: 'Prospecting' },
      { id: 2, name: 'Qualification', value: 'Qualification', standardStage: 'Qualification', apiStage: 'Qualification' },
      { id: 3, name: 'Needs Analysis', value: 'Needs Analysis', standardStage: 'Needs Analysis', apiStage: 'Needs Analysis' },
      { id: 4, name: 'Proposal', value: 'Proposal', standardStage: 'Proposal', apiStage: 'Proposal' },
      { id: 5, name: 'Negotiation', value: 'Negotiation', standardStage: 'Negotiation', apiStage: 'Negotiation' },
      { id: 6, name: 'Closed Won', value: 'Closed Won', standardStage: 'Closed Won', apiStage: 'Closed Won' },
      { id: 7, name: 'Closed Lost', value: 'Closed Lost', standardStage: 'Closed Lost', apiStage: 'Closed Lost' }
    ];
  }

  // Enhanced stage mapping with real-time validation
  mapToStandardStage(apiStageName) {
    const mapped = mapStageToStandard(apiStageName);
    console.log(`Stage mapping: "${apiStageName}" -> "${mapped}"`);
    return mapped;
  }

  // Get stage mapping for all current live stages
  async getStageMapping() {
    try {
      const liveStages = await this.getLiveStages();
      const mapping = {};
      
      liveStages.forEach(stage => {
        mapping[stage.apiStage] = {
          id: stage.id,
          name: stage.name,
          standardStage: stage.standardStage,
          apiStage: stage.apiStage
        };
      });
      
      return mapping;
    } catch (error) {
      console.error('Error creating stage mapping:', error);
      return {};
    }
  }

  // Validate stage data against live API stages
  async validateStageData(stageData) {
    try {
      const liveStages = await this.getLiveStages();
      const validStageNames = liveStages.map(stage => stage.apiStage);
      
      const unmappedStages = stageData.filter(item => 
        item.stage && !validStageNames.includes(item.stage)
      );

      if (unmappedStages.length > 0) {
        console.warn('Found unmapped stages:', unmappedStages.map(item => item.stage));
      }

      return {
        isValid: unmappedStages.length === 0,
        unmappedStages: unmappedStages.map(item => item.stage),
        validStages: validStageNames
      };
    } catch (error) {
      console.error('Error validating stage data:', error);
      return { isValid: false, error: error.message };
    }
  }

  // Clear cache to force refresh
  clearCache() {
    this.cachedStages = null;
    this.lastCacheTime = null;
  }
}

export default new StageService(); 