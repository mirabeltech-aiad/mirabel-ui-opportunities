
import { renderHook } from '@testing-library/react';
import { useVelocityMetrics } from '../hooks/useVelocityMetrics';

const mockOpportunities = [
  {
    id: 1,
    stage: '1st Demo',
    status: 'Won',
    createdDate: '2024-01-01',
    actualCloseDate: '2024-01-15'
  },
  {
    id: 2,
    stage: 'Discovery',
    status: 'Won',
    createdDate: '2024-01-01',
    actualCloseDate: '2024-01-30'
  },
  {
    id: 3,
    stage: 'Proposal',
    status: 'Lost',
    createdDate: '2024-02-01',
    projCloseDate: '2024-02-20'
  }
];

describe('useVelocityMetrics', () => {
  test('calculates metrics correctly with valid data', () => {
    const { result } = renderHook(() => 
      useVelocityMetrics(mockOpportunities, 'last-6-months')
    );

    const metrics = result.current;
    
    expect(metrics).toHaveProperty('stageVelocity');
    expect(metrics).toHaveProperty('avgSalesCycle');
    expect(metrics).toHaveProperty('totalDeals');
    expect(metrics).toHaveProperty('wonDeals');
    
    expect(Array.isArray(metrics.stageVelocity)).toBe(true);
    expect(metrics.stageVelocity).toHaveLength(4); // 4 stages
    expect(typeof metrics.avgSalesCycle).toBe('number');
    expect(typeof metrics.totalDeals).toBe('number');
    expect(typeof metrics.wonDeals).toBe('number');
  });

  test('handles empty opportunities array', () => {
    const { result } = renderHook(() => 
      useVelocityMetrics([], 'last-6-months')
    );

    const metrics = result.current;
    
    expect(metrics.avgSalesCycle).toBe(0);
    expect(metrics.totalDeals).toBe(0);
    expect(metrics.wonDeals).toBe(0);
    expect(metrics.stageVelocity).toHaveLength(4);
  });

  test('stage velocity contains required properties', () => {
    const { result } = renderHook(() => 
      useVelocityMetrics(mockOpportunities, 'last-6-months')
    );

    const metrics = result.current;
    
    metrics.stageVelocity.forEach(stage => {
      expect(stage).toHaveProperty('stage');
      expect(stage).toHaveProperty('avgDays');
      expect(stage).toHaveProperty('benchmark');
      expect(stage).toHaveProperty('variance');
      expect(stage).toHaveProperty('dealCount');
      expect(stage).toHaveProperty('status');
      
      expect(['optimal', 'slow', 'fast']).toContain(stage.status);
    });
  });
});
