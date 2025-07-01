// src/Routers/routeTree.js
import { lazy } from 'react';

const WelcomePage = lazy(() => import('../pages/Welcome'));
const SiteWideSettingsPage = lazy(() => import('../pages/SiteWideSettingsPage'));
const ReportsDashboardPage = lazy(() => import('../pages/ReportsDashboard'));
const Pipeline = lazy(() => import('../pages/Pipeline'));
const AdvancedSearch = lazy(() => import('../pages/AdvancedSearch'));
const AddOpportunity = lazy(() => import('../pages/AddOpportunity'));
const EditOpportunity = lazy(() => import('../pages/EditOpportunity'));
const EditProposal = lazy(() => import('../pages/EditProposal'));
const Proposals = lazy(() => import('../pages/Proposals'));
const LinkedProposals = lazy(() => import('../pages/LinkedProposals'));
const ProposalCodeExport = lazy(() => import('../pages/ProposalCodeExport'));
const Reports = lazy(() => import('../pages/Reports'));
const Admin = lazy(() => import('../pages/Admin'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

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
