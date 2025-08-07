
import { lazy } from 'react';

const LazyChurnAnalysis = lazy(() => 
  import('../ChurnAnalysis').then(module => ({
    default: module.default
  }))
);

export default LazyChurnAnalysis;
