
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { CustomerSegmentExpansion, TenureExpansion, PredictiveIndicator } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface ExpansionPatternAnalysisProps {
  segmentData: CustomerSegmentExpansion[];
  tenureData: TenureExpansion[];
  predictiveIndicators: PredictiveIndicator[];
}

const ExpansionPatternAnalysis: React.FC<ExpansionPatternAnalysisProps> = ({
  segmentData,
  tenureData,
  predictiveIndicators
}) => {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Customer Segment Expansion Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Customer Segment Expansion Analysis</CardTitle>
            <HelpTooltip helpId="segment-expansion-analysis" />
          </div>
          <CardDescription>Expansion patterns across different customer segments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={segmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="segment" 
                fontSize={12} 
                tick={{ fill: '#0369a1' }}
              />
              <YAxis 
                fontSize={12} 
                tick={{ fill: '#0369a1' }}
                label={{ value: 'Expansion Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, 'Expansion Rate']}
                labelFormatter={(label) => `Segment: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="expansionRate" radius={[4, 4, 0, 0]}>
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tenure-Based Expansion Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Tenure-Based Expansion Analysis</CardTitle>
            <HelpTooltip helpId="tenure-expansion-analysis" />
          </div>
          <CardDescription>How expansion rates change with customer tenure</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tenureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="tenureRange" 
                fontSize={12} 
                tick={{ fill: '#0369a1' }}
              />
              <YAxis 
                fontSize={12} 
                tick={{ fill: '#0369a1' }}
                label={{ value: 'Expansion Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, 'Expansion Rate']}
                labelFormatter={(label) => `Tenure: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="expansionRate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Predictive Indicators */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Predictive Expansion Indicators</CardTitle>
            <HelpTooltip helpId="predictive-expansion-indicators" />
          </div>
          <CardDescription>Key indicators that predict expansion likelihood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictiveIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{indicator.indicator}</div>
                  <div className="text-sm text-gray-600">{indicator.description}</div>
                  <div className="text-xs text-gray-500 mt-1">Threshold: {indicator.threshold}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{(indicator.correlation * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Correlation</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpansionPatternAnalysis;
