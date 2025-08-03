
import { lazy } from 'react';

const LazyInteractiveTrendsChart = lazy(() => 
  import('../InteractiveTrendsChart').then(module => ({
    default: module.default
  }))
);

export default LazyInteractiveTrendsChart;
