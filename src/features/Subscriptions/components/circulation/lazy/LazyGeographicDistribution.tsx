
import { lazy } from 'react';

const LazyGeographicDistribution = lazy(() => 
  import('../GeographicDistribution').then(module => ({
    default: module.default
  }))
);

export default LazyGeographicDistribution;
