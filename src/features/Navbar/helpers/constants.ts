import SearchPage from '@/components/tabs/SearchPage';
import AdvancedSearchPage from '@/components/tabs/AdvancedSearchPage';
import InboxPage from '@/components/tabs/InboxPage';
import DashboardPage from '@/components/tabs/DashboardPage';
import type { Tab } from '../types/tab.types';

export const DEFAULT_TABS: Tab[] = [
  {
    id: 'sales-dashboard',
    title: 'Sales Dashboard',
    type: 'fixed',
    component: DashboardPage,
    isCloseable: false,
    isActive: true,
  },
  {
    id: 'inbox',
    title: 'Inbox',
    type: 'fixed',
    component: InboxPage,
    isCloseable: false,
    isActive: false,
  },
  {
    id: 'search',
    title: 'Search',
    type: 'fixed',
    component: SearchPage,
    isCloseable: false,
    isActive: false,
  },
];

export const DEFAULT_ACTIVE_TAB_ID = 'sales-dashboard';