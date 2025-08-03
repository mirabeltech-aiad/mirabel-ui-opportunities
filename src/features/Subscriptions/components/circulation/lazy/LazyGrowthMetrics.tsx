
import { lazy } from 'react';

const LazyGrowthMetrics = lazy(() => 
  import('../GrowthMetrics').then(module => ({
    default: module.default
  }))
);

export default LazyGrowthMetrics;
