
import React from 'react';
import { OceanTitle } from '@/components/ui/design-system';

interface ReportsHeaderProps {
  totalReports: number;
  filteredCount: number;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ totalReports, filteredCount }) => {
  return (
    <div className="mb-8">
      <OceanTitle level={1} className="mb-2">
        Reports Directory
      </OceanTitle>
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Select a report to view detailed analytics and insights
        </p>
        <div className="text-sm text-gray-500">
          {filteredCount} of {totalReports} reports
        </div>
      </div>
    </div>
  );
};

export default ReportsHeader;
