
import { lazy } from 'react';

const LazyCirculationRevenueDashboard = lazy(() => 
  import('../CirculationRevenueDashboard').then(module => ({
    default: module.default
  }))
);

export default LazyCirculationRevenueDashboard;
