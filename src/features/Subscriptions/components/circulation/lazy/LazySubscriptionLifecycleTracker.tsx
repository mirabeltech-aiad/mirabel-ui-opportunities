
import { lazy } from 'react';

const LazySubscriptionLifecycleTracker = lazy(() => 
  import('../SubscriptionLifecycleTracker').then(module => ({
    default: module.default
  }))
);

export default LazySubscriptionLifecycleTracker;
