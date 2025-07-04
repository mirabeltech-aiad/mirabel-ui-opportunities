
import { getStageColor, formatDate, calculateDaysBetween } from '../stageTrailUtils';

describe('stageTrailUtils', () => {
  describe('getStageColor', () => {
    it('returns correct colors for all defined stages', () => {
      expect(getStageColor('Lead')).toBe('bg-gray-100 text-gray-800 border-gray-200');
      expect(getStageColor('Qualified')).toBe('bg-indigo-100 text-indigo-800 border-indigo-200');
      expect(getStageColor('1st Demo')).toBe('bg-orange-100 text-orange-800 border-orange-200');
      expect(getStageColor('Discovery')).toBe('bg-blue-100 text-blue-800 border-blue-200');
      expect(getStageColor('Technical Review')).toBe('bg-cyan-100 text-cyan-800 border-cyan-200');
      expect(getStageColor('Proposal')).toBe('bg-purple-100 text-purple-800 border-purple-200');
      expect(getStageColor('Negotiation')).toBe('bg-yellow-100 text-yellow-800 border-yellow-200');
      expect(getStageColor('Closed Won')).toBe('bg-green-100 text-green-800 border-green-200');
      expect(getStageColor('Closed Lost')).toBe('bg-red-100 text-red-800 border-red-200');
    });

    it('returns default color for unknown stages', () => {
      expect(getStageColor('Unknown Stage')).toBe('bg-gray-100 text-gray-800 border-gray-200');
      expect(getStageColor('')).toBe('bg-gray-100 text-gray-800 border-gray-200');
      expect(getStageColor(null)).toBe('bg-gray-100 text-gray-800 border-gray-200');
    });
  });

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
      expect(formatDate('2024-12-31')).toBe('Dec 31, 2024');
    });

    it('handles different date formats', () => {
      expect(formatDate('2024-02-01')).toBe('Feb 1, 2024');
    });
  });

  describe('calculateDaysBetween', () => {
    it('calculates days between dates correctly', () => {
      expect(calculateDaysBetween('2024-01-15', '2024-01-22')).toBe(7);
      expect(calculateDaysBetween('2024-01-01', '2024-01-02')).toBe(1);
    });

    it('handles reversed date order', () => {
      expect(calculateDaysBetween('2024-01-22', '2024-01-15')).toBe(7);
    });

    it('returns 0 for same dates', () => {
      expect(calculateDaysBetween('2024-01-15', '2024-01-15')).toBe(0);
    });
  });
});
