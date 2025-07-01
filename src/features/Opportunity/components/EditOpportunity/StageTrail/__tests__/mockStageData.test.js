
import { getMockStageChanges } from '../mockStageData';

describe('mockStageData', () => {
  it('returns array of stage changes with correct structure', () => {
    const stageChanges = getMockStageChanges();
    
    expect(Array.isArray(stageChanges)).toBe(true);
    expect(stageChanges.length).toBe(8);
    
    // Test first item structure
    const firstChange = stageChanges[0];
    expect(firstChange).toHaveProperty('id');
    expect(firstChange).toHaveProperty('date');
    expect(firstChange).toHaveProperty('stage');
    expect(firstChange).toHaveProperty('previousStage');
    expect(firstChange).toHaveProperty('user');
    expect(firstChange).toHaveProperty('notes');
  });

  it('maintains chronological order', () => {
    const stageChanges = getMockStageChanges();
    
    for (let i = 1; i < stageChanges.length; i++) {
      const prevDate = new Date(stageChanges[i - 1].date);
      const currentDate = new Date(stageChanges[i].date);
      expect(currentDate.getTime()).toBeGreaterThan(prevDate.getTime());
    }
  });

  it('has consistent stage progression', () => {
    const stageChanges = getMockStageChanges();
    
    for (let i = 1; i < stageChanges.length; i++) {
      const currentChange = stageChanges[i];
      const previousChange = stageChanges[i - 1];
      expect(currentChange.previousStage).toBe(previousChange.stage);
    }
  });
});
