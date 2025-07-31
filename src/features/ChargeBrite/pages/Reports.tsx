import React from 'react';
import { ReportsDirectory } from '../features/reports';
import PageLayout from '../components/layout/PageLayout';

const Reports = () => {
  return (
    <PageLayout
      showBreadcrumbs={true}
      showRefreshButton={false}
    >
      <ReportsDirectory />
    </PageLayout>
  );
};

export default Reports;