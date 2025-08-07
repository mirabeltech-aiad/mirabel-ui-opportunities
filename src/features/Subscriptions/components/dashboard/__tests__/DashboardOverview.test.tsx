
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import DashboardOverview from '../DashboardOverview';

// Unit test to ensure refactoring doesn't break functionality
describe('DashboardOverview', () => {
  const mockMetrics = {
    totalServices: 12,
    activeConnections: 847,
    apiRequests: 15420,
    uptime: '99.9%'
  };

  const mockServices = [
    { name: 'User Service', status: 'healthy' as const, instances: 3, cpu: '45%', memory: '62%' },
    { name: 'Auth Service', status: 'healthy' as const, instances: 2, cpu: '23%', memory: '41%' }
  ];

  it('renders all metrics correctly', () => {
    render(<DashboardOverview metrics={mockMetrics} services={mockServices} />);
    
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('847')).toBeInTheDocument();
    expect(screen.getByText('15420')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  it('renders all services correctly', () => {
    render(<DashboardOverview metrics={mockMetrics} services={mockServices} />);
    
    expect(screen.getByText('User Service')).toBeInTheDocument();
    expect(screen.getByText('Auth Service')).toBeInTheDocument();
  });

  it('renders quick actions section', () => {
    render(<DashboardOverview metrics={mockMetrics} services={mockServices} />);
    
    expect(screen.getByText('Deploy New Service')).toBeInTheDocument();
    expect(screen.getByText('View Logs')).toBeInTheDocument();
    expect(screen.getByText('System Health Check')).toBeInTheDocument();
  });
});
