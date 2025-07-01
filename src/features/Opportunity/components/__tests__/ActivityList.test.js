
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityList from '../ActivityList';
import { Phone } from 'lucide-react';

describe('ActivityList', () => {
  test('renders empty state when no activities', () => {
    render(<ActivityList activities={[]} />);
    expect(screen.getByText('No activities yet')).toBeInTheDocument();
  });

  test('renders activities when provided', () => {
    const mockActivities = [
      {
        id: 1,
        type: 'call',
        date: 'Wed Jun 04 2025 04:22 PM',
        user: 'Test User',
        description: 'Test description',
        icon: Phone,
        color: 'text-orange-600'
      }
    ];

    render(<ActivityList activities={mockActivities} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Wed Jun 04 2025 04:22 PM')).toBeInTheDocument();
  });

  test('renders read more button for each activity', () => {
    const mockActivities = [
      {
        id: 1,
        type: 'call',
        date: 'Wed Jun 04 2025 04:22 PM',
        user: 'Test User',
        description: 'Test description',
        icon: Phone,
        color: 'text-orange-600'
      }
    ];

    render(<ActivityList activities={mockActivities} />);
    expect(screen.getByText('Read more')).toBeInTheDocument();
  });

  // Warning: Consider adding tests for activity interaction behaviors
  // such as clicking read more or expanding activity details
});
