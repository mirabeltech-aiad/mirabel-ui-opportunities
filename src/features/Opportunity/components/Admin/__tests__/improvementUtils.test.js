
import { describe, it, expect } from 'vitest';
import { 
  formatDate, 
  getPriorityColor, 
  formatPriorityLabel, 
  sortImprovements 
} from '../utils/improvementUtils';

describe('improvementUtils', () => {
  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const dateString = '2023-01-01T12:00:00.000Z';
      const formatted = formatDate(dateString);
      
      expect(formatted).toMatch(/Jan 1, 2023/);
    });
  });

  describe('getPriorityColor', () => {
    it('returns correct colors for each priority', () => {
      expect(getPriorityColor('high')).toBe('bg-red-100 text-red-700');
      expect(getPriorityColor('medium')).toBe('bg-yellow-100 text-yellow-700');
      expect(getPriorityColor('low')).toBe('bg-green-100 text-green-700');
      expect(getPriorityColor('nice-to-have')).toBe('bg-blue-100 text-blue-700');
      expect(getPriorityColor('unknown')).toBe('bg-gray-100 text-gray-700');
    });
  });

  describe('formatPriorityLabel', () => {
    it('returns correct labels for each priority', () => {
      expect(formatPriorityLabel('high')).toBe('High Priority');
      expect(formatPriorityLabel('medium')).toBe('Medium Priority');
      expect(formatPriorityLabel('low')).toBe('Low Priority');
      expect(formatPriorityLabel('nice-to-have')).toBe('Nice to Have');
      expect(formatPriorityLabel('custom')).toBe('custom');
    });
  });

  describe('sortImprovements', () => {
    it('sorts improvements by priority and creation date', () => {
      const improvements = [
        { id: 1, priority: 'low', createdAt: '2023-01-01T00:00:00.000Z' },
        { id: 2, priority: 'high', createdAt: '2023-01-02T00:00:00.000Z' },
        { id: 3, priority: 'medium', createdAt: '2023-01-03T00:00:00.000Z' },
      ];

      const sorted = sortImprovements(improvements);
      
      expect(sorted[0].priority).toBe('high');
      expect(sorted[1].priority).toBe('medium');
      expect(sorted[2].priority).toBe('low');
    });
  });
});
