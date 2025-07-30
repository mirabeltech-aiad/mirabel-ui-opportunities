
import React, { Suspense, lazy } from 'react';
import { Skeleton } from './skeleton';

// Lazy load chart components
const LazyLineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const LazyBarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const LazyAreaChart = lazy(() => import('recharts').then(module => ({ default: module.AreaChart })));
const LazyPieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));

interface OptimizedChartProps {
  type: 'line' | 'bar' | 'area' | 'pie';
  height?: number;
  children: React.ReactNode;
  className?: string;
}

const chartComponents = {
  line: LazyLineChart,
  bar: LazyBarChart,
  area: LazyAreaChart,
  pie: LazyPieChart
};

export const OptimizedChart: React.FC<OptimizedChartProps> = ({ 
  type, 
  height = 300, 
  children,
  className = ""
}) => {
  const ChartComponent = chartComponents[type];

  return (
    <div className={className}>
      <Suspense fallback={<Skeleton className={`h-[${height}px] w-full`} />}>
        <ChartComponent height={height}>
          {children}
        </ChartComponent>
      </Suspense>
    </div>
  );
};
