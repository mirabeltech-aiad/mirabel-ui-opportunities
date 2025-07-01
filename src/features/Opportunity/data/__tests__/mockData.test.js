
import { describe, it, expect, beforeEach } from 'vitest';
import { mockOpportunities, mockCompanies } from '../mockData.js';

describe('mockData.js - Backward Compatibility Tests', () => {
  describe('mockOpportunities', () => {
    it('should export mockOpportunities as an array', () => {
      expect(Array.isArray(mockOpportunities)).toBe(true);
    });

    it('should contain the expected number of opportunities', () => {
      // Original: 15 + Additional Won: 10 = 25 total
      expect(mockOpportunities).toHaveLength(25);
    });

    it('should have won opportunities with correct structure', () => {
      const wonOpportunities = mockOpportunities.filter(opp => opp.status === 'Won');
      expect(wonOpportunities.length).toBeGreaterThan(0);
      
      wonOpportunities.forEach(opp => {
        expect(opp).toHaveProperty('id');
        expect(opp).toHaveProperty('opportunityId');
        expect(opp).toHaveProperty('status', 'Won');
        expect(opp).toHaveProperty('name');
        expect(opp).toHaveProperty('company');
        expect(opp).toHaveProperty('assignedRep');
        expect(opp).toHaveProperty('amount');
        expect(opp).toHaveProperty('actualCloseDate');
      });
    });

    it('should preserve all required opportunity fields', () => {
      const requiredFields = [
        'id', 'opportunityId', 'status', 'name', 'company', 
        'createdDate', 'assignedRep', 'stage', 'amount', 
        'projCloseDate', 'source', 'leadSource', 'leadType', 
        'salesPresentation', 'createdBy'
      ];

      mockOpportunities.forEach(opp => {
        requiredFields.forEach(field => {
          expect(opp).toHaveProperty(field);
        });
      });
    });

    it('should have specific known opportunities for regression testing', () => {
      // Test specific opportunities to ensure they weren't modified
      const strategicERP = mockOpportunities.find(opp => opp.name === 'Strategic ERP Implementation');
      expect(strategicERP).toBeDefined();
      expect(strategicERP.company).toBe('Acme Corp');
      expect(strategicERP.assignedRep).toBe('Michael Scott');
      expect(strategicERP.amount).toBe(120000);

      const enterpriseCRM = mockOpportunities.find(opp => opp.name === 'Enterprise CRM Implementation');
      expect(enterpriseCRM).toBeDefined();
      expect(enterpriseCRM.status).toBe('Won');
      expect(enterpriseCRM.amount).toBe(450000);
    });

    it('should have unique opportunity IDs', () => {
      const ids = mockOpportunities.map(opp => opp.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('mockCompanies', () => {
    it('should export mockCompanies as an array', () => {
      expect(Array.isArray(mockCompanies)).toBe(true);
    });

    it('should contain exactly 5 companies', () => {
      expect(mockCompanies).toHaveLength(5);
    });

    it('should preserve all required company fields', () => {
      const requiredFields = [
        'id', 'name', 'firstName', 'lastName', 'phone', 
        'email', 'address', 'city', 'state', 'zipCode', 
        'website', 'industry', 'employees'
      ];

      mockCompanies.forEach(company => {
        requiredFields.forEach(field => {
          expect(company).toHaveProperty(field);
        });
      });
    });

    it('should have specific known companies for regression testing', () => {
      const acmeCorp = mockCompanies.find(company => company.name === 'Acme Corp');
      expect(acmeCorp).toBeDefined();
      expect(acmeCorp.firstName).toBe('John');
      expect(acmeCorp.lastName).toBe('Smith');
      expect(acmeCorp.industry).toBe('Technology');
    });
  });

  describe('Data Relationships', () => {
    it('should maintain referential integrity between opportunities and companies', () => {
      const companyNames = mockCompanies.map(company => company.name);
      const opportunityCompanies = mockOpportunities.map(opp => opp.company);
      
      // Check that some opportunities reference existing companies
      const referencedCompanies = opportunityCompanies.filter(name => 
        companyNames.includes(name)
      );
      expect(referencedCompanies.length).toBeGreaterThan(0);
    });

    it('should have consistent sales rep assignments', () => {
      const assignedReps = [...new Set(mockOpportunities.map(opp => opp.assignedRep))];
      expect(assignedReps.length).toBeGreaterThan(1);
      expect(assignedReps).toContain('Michael Scott');
      expect(assignedReps).toContain('Jim Halpert');
    });
  });
});
