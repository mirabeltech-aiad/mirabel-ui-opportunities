
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@OpportunityComponents/ui/table';
import { Badge } from '@OpportunityComponents/ui/badge';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const HighRiskOpportunities = ({ opportunities = [] }) => {
  const { getTitleClass } = useDesignSystem();

  // Mock data if no opportunities provided
  const mockOpportunities = [
    { id: 1, opportunity: 'Acme Corp', value: 120000, riskScore: 66, daysStagnant: 6, status: 'Medium Risk' },
    { id: 2, opportunity: 'Beta Solutions', value: 95000, riskScore: 58, daysStagnant: 30, status: 'Low Risk' },
    { id: 3, opportunity: 'Gamma Innovations', value: 150000, riskScore: 55, daysStagnant: 17, status: 'Low Risk' },
    { id: 4, opportunity: 'Delta Analytics', value: 220000, riskScore: 16, daysStagnant: 5, status: 'Low Risk' },
    { id: 5, opportunity: 'Epsilon Systems', value: 180000, riskScore: 1, daysStagnant: 29, status: 'Low Risk' },
    { id: 6, opportunity: 'Zeta Security', value: 90000, riskScore: 38, daysStagnant: 10, status: 'Low Risk' },
    { id: 7, opportunity: 'Eta Mobile', value: 110000, riskScore: 92, daysStagnant: 7, status: 'High Risk' },
    { id: 8, opportunity: 'Theta Consulting', value: 130000, riskScore: 66, daysStagnant: 28, status: 'Medium Risk' }
  ];

  const safeOpportunities = Array.isArray(opportunities) && opportunities.length > 0 ? opportunities : mockOpportunities;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'high risk':
        return 'destructive';
      case 'medium risk':
        return 'secondary';
      case 'low risk':
        return 'default';
      default:
        return 'default';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'text-red-600 font-semibold';
    if (score >= 60) return 'text-orange-600 font-medium';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-white border-b border-gray-200 pb-4">
        <CardTitle className={`${getTitleClass()} text-xl font-semibold flex items-center gap-2`}>
          High-Risk Opportunities
          <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-500">?</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-white border-b border-gray-200 hover:bg-white">
              <TableHead className="h-12 px-6 py-4 text-left align-middle font-semibold text-gray-900 border-r border-gray-200">
                Opportunity
              </TableHead>
              <TableHead className="h-12 px-6 py-4 text-center align-middle font-semibold text-gray-900 border-r border-gray-200">
                Value
              </TableHead>
              <TableHead className="h-12 px-6 py-4 text-center align-middle font-semibold text-gray-900 border-r border-gray-200">
                Risk Score
              </TableHead>
              <TableHead className="h-12 px-6 py-4 text-center align-middle font-semibold text-gray-900 border-r border-gray-200">
                Days Stagnant
              </TableHead>
              <TableHead className="h-12 px-6 py-4 text-center align-middle font-semibold text-gray-900">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeOpportunities.map((opp, index) => (
              <TableRow 
                key={opp.id} 
                className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <TableCell className="px-6 py-4 font-medium text-gray-900 border-r border-gray-100">
                  {opp.opportunity}
                </TableCell>
                <TableCell className="px-6 py-4 text-center font-semibold text-gray-900 border-r border-gray-100">
                  {formatCurrency(opp.value)}
                </TableCell>
                <TableCell className="px-6 py-4 text-center border-r border-gray-100">
                  <span className={getRiskScoreColor(opp.riskScore)}>
                    {opp.riskScore}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-center text-gray-700 border-r border-gray-100">
                  {opp.daysStagnant}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge variant={getRiskBadgeVariant(opp.status)}>
                    {opp.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HighRiskOpportunities;
