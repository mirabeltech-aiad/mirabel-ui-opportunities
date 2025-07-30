import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { CohortNetRetention } from './types';

interface CohortNetRetentionTableProps {
  data: CohortNetRetention[];
}

const CohortNetRetentionTable: React.FC<CohortNetRetentionTableProps> = ({ data }) => {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : [];
  
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: validData,
    initialSort: { key: 'startingMrr', direction: 'desc', dataType: 'currency' }
  });

  const handleSort = (columnKey: string) => {
    const dataType = getDataTypeFromColumn(columnKey);
    requestSort(columnKey, dataType);
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null || isNaN(value)) return '$0';
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null || isNaN(value)) return '0%';
    return `${value}%`;
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Cohort Net Retention Data</CardTitle>
          <HelpTooltip helpId="cohort-net-retention-table" />
        </div>
        <CardDescription>Detailed net revenue retention data by acquisition cohort</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('cohort')}
              >
                <div className="flex items-center gap-1">
                  Cohort
                  {getSortIcon('cohort') && (
                    <span className="text-ocean-500">{getSortIcon('cohort')}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('startingMrr')}
              >
                <div className="flex items-center gap-1">
                  Starting MRR
                  {getSortIcon('startingMrr') && (
                    <span className="text-ocean-500">{getSortIcon('startingMrr')}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('month1')}
              >
                <div className="flex items-center gap-1">
                  Month 1
                  {getSortIcon('month1') && (
                    <span className="text-ocean-500">{getSortIcon('month1')}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('month3')}
              >
                <div className="flex items-center gap-1">
                  Month 3
                  {getSortIcon('month3') && (
                    <span className="text-ocean-500">{getSortIcon('month3')}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('month6')}
              >
                <div className="flex items-center gap-1">
                  Month 6
                  {getSortIcon('month6') && (
                    <span className="text-ocean-500">{getSortIcon('month6')}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('month12')}
              >
                <div className="flex items-center gap-1">
                  Month 12
                  {getSortIcon('month12') && (
                    <span className="text-ocean-500">{getSortIcon('month12')}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('month24')}
              >
                <div className="flex items-center gap-1">
                  Month 24
                  {getSortIcon('month24') && (
                    <span className="text-ocean-500">{getSortIcon('month24')}</span>
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? sortedData.map((cohort) => (
              <TableRow key={cohort.cohort}>
                <TableCell className="font-medium">{cohort.cohort}</TableCell>
                <TableCell>{formatCurrency(cohort.startingMrr)}</TableCell>
                <TableCell>
                  <span className={(cohort.month1 || 0) >= 100 ? 'text-green-600' : (cohort.month1 || 0) >= 90 ? 'text-yellow-600' : 'text-red-600'}>
                    {formatPercentage(cohort.month1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={(cohort.month3 || 0) >= 100 ? 'text-green-600' : (cohort.month3 || 0) >= 90 ? 'text-yellow-600' : 'text-red-600'}>
                    {formatPercentage(cohort.month3)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={(cohort.month6 || 0) >= 100 ? 'text-green-600' : (cohort.month6 || 0) >= 90 ? 'text-yellow-600' : 'text-red-600'}>
                    {formatPercentage(cohort.month6)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={(cohort.month12 || 0) >= 100 ? 'text-green-600' : (cohort.month12 || 0) >= 90 ? 'text-yellow-600' : 'text-red-600'}>
                    {formatPercentage(cohort.month12)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={(cohort.month24 || 0) >= 100 ? 'text-green-600' : (cohort.month24 || 0) >= 90 ? 'text-yellow-600' : 'text-red-600'}>
                    {formatPercentage(cohort.month24)}
                  </span>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="p-8 text-center text-gray-500">
                  No cohort data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CohortNetRetentionTable;