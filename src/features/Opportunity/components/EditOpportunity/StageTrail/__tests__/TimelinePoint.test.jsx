
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimelinePoint from '../StageTrail/TimelinePoint';
import { getMockStageChanges } from '../StageTrail/mockStageData';

describe('TimelinePoint', () => {
  const mockStageChanges = getMockStageChanges();
  const firstChange = mockStageChanges[0];
  const lastChange = mockStageChanges[mockStageChanges.length - 1];

  it('renders stage information correctly', () => {
    render(
      <TimelinePoint 
        change={firstChange} 
        index={0} 
        stageChanges={mockStageChanges} 
      />
    );

    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByText('Michael Scott')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  it('shows days interval for non-last items', () => {
    render(
      <TimelinePoint 
        change={firstChange} 
        index={0} 
        stageChanges={mockStageChanges} 
      />
    );

    expect(screen.getByText('7 days')).toBeInTheDocument();
  });

  it('does not show days interval for last item', () => {
    const lastIndex = mockStageChanges.length - 1;
    render(
      <TimelinePoint 
        change={lastChange} 
        index={lastIndex} 
        stageChanges={mockStageChanges} 
      />
    );

    expect(screen.queryByText(/days/)).not.toBeInTheDocument();
  });

  it('shows arrow for non-last items', () => {
    const { container } = render(
      <TimelinePoint 
        change={firstChange} 
        index={0} 
        stageChanges={mockStageChanges} 
      />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not show arrow for last item', () => {
    const lastIndex = mockStageChanges.length - 1;
    const { container } = render(
      <TimelinePoint 
        change={lastChange} 
        index={lastIndex} 
        stageChanges={mockStageChanges} 
      />
    );

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
