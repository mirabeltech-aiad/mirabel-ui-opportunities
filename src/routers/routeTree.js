// src/Routers/routeTree.js
import { lazy } from 'react';
import { NavigationFeature } from '../features/Navbar';

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
const Navbar = lazy(() => import('../features/Navbar/components/Navbar/Navbar'));

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
    path: '/navbar',
    component: NavigationFeature,
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
