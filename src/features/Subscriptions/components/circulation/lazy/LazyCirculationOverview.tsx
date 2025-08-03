
import { lazy } from 'react';

const LazyCirculationOverview = lazy(() => 
  import('../OptimizedCirculationOverview').then(module => ({
    default: module.default
  }))
);

export default LazyCirculationOverview;
