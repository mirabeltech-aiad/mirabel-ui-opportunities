import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@OpportunityComponents/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@OpportunityComponents/ui/select';
import { Checkbox } from '@OpportunityComponents/ui/checkbox';
import { Label } from '@OpportunityComponents/ui/label';

const RepMonthlyActivity = ({ 
  repMonthlyData = [], 
  selectedYear, 
  onYearChange, 
  availableYears = [],
  timeFrame,
  onTimeFrameChange
}) => {
  const [selectedColumns, setSelectedColumns] = React.useState({
    created: true,
    won: true,
    lost: true,
    wonPercentage: false
  });

  const getTimeHeaders = () => {
    switch (timeFrame) {
      case 'quarterly':
        return ['Q1', 'Q2', 'Q3', 'Q4'];
      case 'yearly':
        return [selectedYear];
      default: // monthly
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
  };

  const getSubHeaders = () => {
    switch (timeFrame) {
      case 'quarterly':
        return ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
      case 'yearly':
        return ['Full Year'];
      default: // monthly
        return null;
    }
  };

  const getDataKey = (period, metric) => {
    switch (timeFrame) {
      case 'quarterly':
        const quarterMap = { 'Q1': ['Jan', 'Feb', 'Mar'], 'Q2': ['Apr', 'May', 'Jun'], 'Q3': ['Jul', 'Aug', 'Sep'], 'Q4': ['Oct', 'Nov', 'Dec'] };
        return quarterMap[period] || [];
      case 'yearly':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default: // monthly
        return [period];
    }
  };

  const calculateAggregatedValue = (rep, period, metric) => {
    if (!rep || typeof rep !== 'object') return 0;
    
    const months = getDataKey(period, metric);
    if (Array.isArray(months)) {
      return months.reduce((sum, month) => {
        const value = rep[`${month}_${metric}`];
        return sum + (typeof value === 'number' ? value : 0);
      }, 0);
    }
    const value = rep[`${period}_${metric}`];
    return typeof value === 'number' ? value : 0;
  };

  const calculateWonPercentage = (rep, period) => {
    const won = calculateAggregatedValue(rep, period, 'won');
    const lost = calculateAggregatedValue(rep, period, 'lost');
    const total = won + lost;
    return total > 0 ? Math.round((won / total) * 100) : 0;
  };

  // Calculate totals for each period and metric
  const calculateTotals = (period, metric) => {
    return safeRepMonthlyData.reduce((sum, rep) => {
      return sum + calculateAggregatedValue(rep, period, metric);
    }, 0);
  };

  const calculateTotalWonPercentage = (period) => {
    const totalWon = calculateTotals(period, 'won');
    const totalLost = calculateTotals(period, 'lost');
    const total = totalWon + totalLost;
    return total > 0 ? Math.round((totalWon / total) * 100) : 0;
  };

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const timeHeaders = getTimeHeaders();
  const subHeaders = getSubHeaders();

  const getVisibleColumns = () => {
    const columns = [];
    if (selectedColumns.created) columns.push({ key: 'created', label: 'Created', color: 'text-blue-600' });
    if (selectedColumns.won) columns.push({ key: 'won', label: 'Won', color: 'text-green-600' });
    if (selectedColumns.lost) columns.push({ key: 'lost', label: 'Lost', color: 'text-red-600' });
    if (selectedColumns.wonPercentage) columns.push({ key: 'wonPercentage', label: 'Win %', color: 'text-purple-600' });
    return columns;
  };

  const visibleColumns = getVisibleColumns();

  // Safety check for data
  const safeRepMonthlyData = Array.isArray(repMonthlyData) ? repMonthlyData : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex-shrink-0 text-ocean-800 text-xl font-bold">
              {timeFrame === 'monthly' ? 'Monthly' : timeFrame === 'quarterly' ? 'Quarterly' : 'Yearly'} Deal Activity by Rep - {selectedYear}
            </CardTitle>
            
            <div className="flex items-center gap-6 flex-wrap">
              {/* Column Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Show:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-1">
                    <Checkbox 
                      id="created" 
                      checked={selectedColumns.created}
                      onCheckedChange={() => handleColumnToggle('created')}
                    />
                    <Label htmlFor="created" className="text-sm font-medium">Created</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Checkbox 
                      id="won" 
                      checked={selectedColumns.won}
                      onCheckedChange={() => handleColumnToggle('won')}
                    />
                    <Label htmlFor="won" className="text-sm font-medium">Won</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Checkbox 
                      id="lost" 
                      checked={selectedColumns.lost}
                      onCheckedChange={() => handleColumnToggle('lost')}
                    />
                    <Label htmlFor="lost" className="text-sm font-medium">Lost</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Checkbox 
                      id="wonPercentage" 
                      checked={selectedColumns.wonPercentage}
                      onCheckedChange={() => handleColumnToggle('wonPercentage')}
                    />
                    <Label htmlFor="wonPercentage" className="text-sm font-medium">Win %</Label>
                  </div>
                </div>
              </div>
              
              {/* Time Frame and Year Selectors */}
              <div className="flex items-center gap-2">
                <Select value={timeFrame} onValueChange={onTimeFrameChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={onYearChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white border-r-2 border-gray-300 font-bold text-gray-800 text-base">
                    Rep Name
                  </TableHead>
                  {timeHeaders.map((period, index) => (
                    <TableHead 
                      key={period} 
                      className={`text-center min-w-[120px] px-2 bg-gray-50 ${index > 0 ? 'border-l-2 border-gray-300' : ''}`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-gray-800 text-base">{period}</div>
                        {subHeaders && (
                          <div className="text-xs text-gray-500 font-medium">{subHeaders[index]}</div>
                        )}
                        <div className="flex justify-between text-xs text-gray-600 font-semibold">
                          {visibleColumns.map(column => (
                            <span key={column.key}>{column.label}</span>
                          ))}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeRepMonthlyData.map((rep, repIndex) => (
                  <TableRow 
                    key={repIndex}
                    className={repIndex % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 hover:bg-gray-150'}
                  >
                    <TableCell className={`sticky left-0 font-semibold text-gray-800 border-r-2 border-gray-300 text-base ${
                      repIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                    }`}>
                      {rep?.rep || 'Unknown Rep'}
                    </TableCell>
                    {timeHeaders.map((period, periodIndex) => (
                      <TableCell 
                        key={period} 
                        className={`text-center px-2 ${periodIndex > 0 ? 'border-l-2 border-gray-300' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          {visibleColumns.map(column => (
                            <span key={column.key} className={`font-bold text-base ${column.color}`}>
                              {column.key === 'wonPercentage' 
                                ? `${calculateWonPercentage(rep, period)}%`
                                : calculateAggregatedValue(rep, period, column.key)
                              }
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="border-t-2 border-gray-300 bg-gray-200 font-bold hover:bg-gray-200">
                  <TableCell className="sticky left-0 bg-gray-200 font-bold text-gray-900 border-r-2 border-gray-300 text-lg">
                    TOTALS
                  </TableCell>
                  {timeHeaders.map((period, periodIndex) => (
                    <TableCell 
                      key={period} 
                      className={`text-center px-2 font-bold bg-gray-200 ${periodIndex > 0 ? 'border-l-2 border-gray-300' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        {visibleColumns.map(column => (
                          <span key={column.key} className={`font-bold text-lg ${column.color}`}>
                            {column.key === 'wonPercentage' 
                              ? `${calculateTotalWonPercentage(period)}%`
                              : calculateTotals(period, column.key)
                            }
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepMonthlyActivity;
