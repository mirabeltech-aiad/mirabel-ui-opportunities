// src/Routers/routeTree.js
import React, { lazy } from 'react';
import OpportunityProviders from '@/features/Opportunity/contexts/OpportunityProviders';

const HomePage = lazy(() => import('../pages/HomePage'));
const WelcomePage = lazy(() => import('../pages/Welcome'));
const Pipeline = lazy(() => import('../pages/Opportunity/Pipeline'));
const AdvancedSearch = lazy(() => import('../pages/Opportunity/AdvancedSearch'));
const AddOpportunity = lazy(() => import('../pages/Opportunity/AddOpportunity'));
const EditOpportunity = lazy(() => import('../pages/Opportunity/EditOpportunity'));
const EditProposal = lazy(() => import('../pages/Opportunity/EditProposal'));
const Proposals = lazy(() => import('../pages/Opportunity/Proposals'));
const LinkedProposals = lazy(() => import('../pages/Opportunity/LinkedProposals'));
const ProposalCodeExport = lazy(() => import('../pages/Opportunity/ProposalCodeExport'));
// const Reports = lazy(() => import('../pages/Opportunity/Reports'));

export const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  },
  {
    path: '/home',
    component: HomePage,
    exact: true,
  },
  {
    path: '/welcome',
    component: WelcomePage,
    exact: true,
  },{
    path: '/opportunities',
    component: () => (
      <OpportunityProviders>
        <Pipeline />
      </OpportunityProviders>
    ),
    exact: true
  },
  {
    path: '/advanced-search',
    component: () => (
      <OpportunityProviders>
        <AdvancedSearch />
      </OpportunityProviders>
    ),
    exact: true
  },
  {
    path: '/add-opportunity',
    component: () => (
      <OpportunityProviders>
        <AddOpportunity />
      </OpportunityProviders>
    ),
    exact: true
  },
  {
    path: '/edit-opportunity/:id',
    component: () => (
      <OpportunityProviders>
        <EditOpportunity />
      </OpportunityProviders>
    ),
    exact: true
  },
  {
    path: '/edit-proposal/:id',
    component: () => (
      <OpportunityProviders>
        <EditProposal />
      </OpportunityProviders>
    ),
    exact: true
  },
  {
    path: '/proposals',
    component: () => (
      <OpportunityProviders>
        <Proposals />
      </OpportunityProviders>
    ),
    exact: true
  },
  {
    path: '/linked-proposals',
    component: () => (
      <OpportunityProviders>
        <LinkedProposals />
      </OpportunityProviders>
    ),
    exact: true
  },
  {
    path: '/proposal-code-export',
    component: () => (
      <OpportunityProviders>
        <ProposalCodeExport />
      </OpportunityProviders>
    ),
    exact: true
  },
  {
    path: '/reports',
    component: () => (
      <OpportunityProviders>
        <Reports />
      </OpportunityProviders>
    ),
    exact: true
  }
];


