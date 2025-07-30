/**
 * @fileoverview Tests for Reports utility formatters
 */

import { describe, it, expect } from 'vitest';
import {
  formatReportStatus
} from '../formatters';

describe('Reports Formatters', () => {
  describe('formatReportStatus', () => {
    it('formats status correctly', () => {
      expect(formatReportStatus('completed')).toBe('Completed');
      expect(formatReportStatus('pending')).toBe('Pending');
      expect(formatReportStatus('failed')).toBe('Failed');
      expect(formatReportStatus('processing')).toBe('Processing');
    });

    it('handles unknown status', () => {
      expect(formatReportStatus('unknown')).toBe('Unknown');
    });
  });
});