
import { renderHook } from '@testing-library/react';
import { useLostDealsData } from '../hooks/useLostDealsData';

describe('useLostDealsData', () => {
  const mockOpportunities = [
    { status: 'Lost', amount: 50000 },
    { status: 'Closed Lost', amount: 75000 },
    { status: 'Won', amount: 100000 },
  ];

  test('should return correct total lost deals count', () => {
    const { result } = renderHook(() => 
      useLostDealsData(mockOpportunities, 'last-6-months')
    );

    expect(result.current.totalLost).toBe(2);
  });

  test('should calculate total lost value correctly', () => {
    const { result } = renderHook(() => 
      useLostDealsData(mockOpportunities, 'last-6-months')
    );

    expect(result.current.totalLostValue).toBe(125000);
  });

  test('should return loss reason stats with correct structure', () => {
    const { result } = renderHook(() => 
      useLostDealsData(mockOpportunities, 'last-6-months')
    );

    expect(result.current.lossReasonStats).toHaveLength(8);
    expect(result.current.lossReasonStats[0]).toHaveProperty('reason');
    expect(result.current.lossReasonStats[0]).toHaveProperty('count');
    expect(result.current.lossReasonStats[0]).toHaveProperty('percentage');
    expect(result.current.lossReasonStats[0]).toHaveProperty('value');
  });

  test('should return competitor stats with correct structure', () => {
    const { result } = renderHook(() => 
      useLostDealsData(mockOpportunities, 'last-6-months')
    );

    expect(result.current.competitorStats).toHaveLength(10);
    expect(result.current.competitorStats[0]).toHaveProperty('competitor');
    expect(result.current.competitorStats[0]).toHaveProperty('losses');
    expect(result.current.competitorStats[0]).toHaveProperty('percentage');
    expect(result.current.competitorStats[0]).toHaveProperty('avgDealSize');
    expect(result.current.competitorStats[0]).toHaveProperty('totalValue');
  });

  test('should return stage loss patterns with correct structure', () => {
    const { result } = renderHook(() => 
      useLostDealsData(mockOpportunities, 'last-6-months')
    );

    expect(result.current.stageLossPatterns).toHaveLength(4);
    expect(result.current.stageLossPatterns[0]).toHaveProperty('stage');
    expect(result.current.stageLossPatterns[0]).toHaveProperty('losses');
    expect(result.current.stageLossPatterns[0]).toHaveProperty('percentage');
    expect(result.current.stageLossPatterns[0]).toHaveProperty('conversionRate');
    expect(result.current.stageLossPatterns[0]).toHaveProperty('avgDaysInStage');
    expect(result.current.stageLossPatterns[0]).toHaveProperty('topLossReason');
  });

  test('should handle empty opportunities array', () => {
    const { result } = renderHook(() => 
      useLostDealsData([], 'last-6-months')
    );

    expect(result.current.totalLost).toBe(0);
    expect(result.current.totalLostValue).toBe(0);
    expect(result.current.lossReasonStats).toHaveLength(8);
    expect(result.current.competitorStats).toHaveLength(10);
    expect(result.current.stageLossPatterns).toHaveLength(4);
  });
});
