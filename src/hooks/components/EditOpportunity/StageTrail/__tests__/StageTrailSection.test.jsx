
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StageTrailSection from '../StageTrailSection';
import { getMockStageChanges } from '../StageTrail/mockStageData';

// Mock the child components to focus on integration testing
jest.mock('../StageTrail/TimelineContainer', () => {
  return function MockTimelineContainer({ stageChanges }) {
    return <div data-testid="timeline-container">Timeline with {stageChanges.length} stages</div>;
  };
});

jest.mock('../StageTrail/EmptyStageTrail', () => {
  return function MockEmptyStageTrail() {
    return <div data-testid="empty-stage-trail">No stage changes found</div>;
  };
});

describe('StageTrailSection', () => {
  it('renders the section header correctly', () => {
    render(<StageTrailSection opportunityId="123" />);
    
    expect(screen.getByText('Stage Progression Timeline')).toBeInTheDocument();
    expect(screen.getByText('8 stage changes')).toBeInTheDocument();
  });

  it('displays timeline container when stage changes exist', () => {
    render(<StageTrailSection opportunityId="123" />);
    
    expect(screen.getByTestId('timeline-container')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-stage-trail')).not.toBeInTheDocument();
  });

  it('displays correct stage count in header', () => {
    render(<StageTrailSection opportunityId="123" />);
    
    const mockData = getMockStageChanges();
    expect(screen.getByText(`${mockData.length} stage changes`)).toBeInTheDocument();
  });

  it('accepts opportunityId prop without breaking', () => {
    const { rerender } = render(<StageTrailSection opportunityId="123" />);
    
    expect(screen.getByText('Stage Progression Timeline')).toBeInTheDocument();
    
    rerender(<StageTrailSection opportunityId="456" />);
    expect(screen.getByText('Stage Progression Timeline')).toBeInTheDocument();
  });
});
