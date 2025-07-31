// src/Routers/routeTree.js
import { lazy } from 'react';
import Home from '../features/Homepage';
import Navigation from '@/features/Navigation/components/Navbar';

const WelcomePage = lazy(() => import('../pages/Welcome'));
const Pipeline = lazy(() => import('../pages/Opportunity/Pipeline'));
const AdvancedSearch = lazy(() => import('../pages/Opportunity/AdvancedSearch'));
const AddOpportunity = lazy(() => import('../pages/Opportunity/AddOpportunity'));
const EditOpportunity = lazy(() => import('../pages/Opportunity/EditOpportunity'));
const EditProposal = lazy(() => import('../pages/Opportunity/EditProposal'));
const Proposals = lazy(() => import('../pages/Opportunity/Proposals'));
const LinkedProposals = lazy(() => import('../pages/Opportunity/LinkedProposals'));
const ProposalCodeExport = lazy(() => import('../pages/Opportunity/ProposalCodeExport'));
const Reports = lazy(() => import('../pages/Opportunity/Reports'));
const Admin = lazy(() => import('../pages/Opportunity/Admin'));
const Settings = lazy(() => import('../pages/Opportunity/Settings'));
const NotFound = lazy(() => import('../pages/Opportunity/NotFound'));
// ChargeBrite module components
const ChargeBriteCirculation = lazy(() => import('../features/ChargeBrite/App').then(module => ({ default: module.ChargeBriteCirculation })));
const ChargeBriteAnalytics = lazy(() => import('../features/ChargeBrite/App').then(module => ({ default: module.ChargeBriteAnalytics })));
const ChargeBritePricing = lazy(() => import('../features/ChargeBrite/App').then(module => ({ default: module.ChargeBritePricing })));
const ChargeBriteAdvancedSearch = lazy(() => import('../features/ChargeBrite/App').then(module => ({ default: module.ChargeBriteAdvancedSearch })));
const ChargeBriteReports = lazy(() => import('../features/ChargeBrite/App').then(module => ({ default: module.ChargeBriteReports })));
const ChargeBriteAdmin = lazy(() => import('../features/ChargeBrite/App').then(module => ({ default: module.ChargeBriteAdmin })));
const ChargeBriteSettings = lazy(() => import('../features/ChargeBrite/App').then(module => ({ default: module.ChargeBriteSettings })));

export const routes = [
  {
    path: '/opportunities',
    component: Pipeline,
    exact: true,
  },
  {
    path: '/advanced-search',
    component: AdvancedSearch,
    exact: true,
  },
  {
    path: '/add-opportunity',
    component: AddOpportunity,
    exact: true,
  },
  {
    path: '/edit-opportunity/:id',
    component: EditOpportunity,
    exact: true,
  },
  {
    path: '/edit-proposal/:id',
    component: EditProposal,
    exact: true,
  },
  {
    path: '/proposals',
    component: Proposals,
    exact: true,
  },
  {
    path: '/linked-proposals',
    component: LinkedProposals,
    exact: true,
  },
  {
    path: '/proposal-code-export',
    component: ProposalCodeExport,
    exact: true,
  },
  {
    path: '/reports',
    component: Reports,
    exact: true,
  },
  {
    path: '/admin',
    component: Admin,
    exact: true,
  },
  {
    path: '/settings',
    component: Settings,
    exact: true,
  },
  {
    path: '/custom-fields',
    component: Settings,
    exact: true,
  },
  {
    path: '/home',
    component: Home,
    exact: true,
  },
  {
    path: '/navigation1',
    component: Navigation,
    exact: true,
  },

  {
    path: '/circulation',
    component: ChargeBriteCirculation,
    exact: true,
  },
  {
    path: '/chargebrite/analytics',
    component: ChargeBriteAnalytics,
    exact: true,
  },
  {
    path: '/chargebrite/pricing',
    component: ChargeBritePricing,
    exact: true,
  },
  {
    path: '/chargebrite/advanced-search',
    component: ChargeBriteAdvancedSearch,
    exact: true,
  },
  {
    path: '/chargebrite/reports',
    component: ChargeBriteReports,
    exact: true,
  },
  {
    path: '/chargebrite/admin',
    component: ChargeBriteAdmin,
    exact: true,
  },
  {
    path: '/chargebrite/settings',
    component: ChargeBriteSettings,
    exact: true,
  },


  // {
  //   path: '/sitewidesettings',
  //   component: SiteWideSettingsPage,
  //   exact: true,
  // },
  // {
  //   path: '/reportsdashboard',
  //   component: ReportsDashboardPage,
  //   exact: true,
  // }
];
