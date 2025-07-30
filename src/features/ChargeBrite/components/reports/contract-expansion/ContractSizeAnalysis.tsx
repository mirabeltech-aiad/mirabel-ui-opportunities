
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { colorTokens } from '@/styles/designTokens';
import { ContractSizeBucket } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface ContractSizeAnalysisProps {
  data: ContractSizeBucket[];
}

const ContractSizeAnalysis: React.FC<ContractSizeAnalysisProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Expansion Rate by Contract Size</CardTitle>
          <HelpTooltip helpId="contract-size-expansion" />
        </div>
        <CardDescription>How expansion rates vary by contract value segments</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colorTokens.semantic.secondary} />
            <XAxis 
              dataKey="sizeRange" 
              fontSize={12} 
              tick={{ fill: colorTokens.ocean[700] }}
            />
            <YAxis 
              fontSize={12} 
              tick={{ fill: colorTokens.ocean[700] }}
              label={{ value: 'Expansion Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, 'Expansion Rate']}
              labelFormatter={(label) => `Contract Size: ${label}`}
              contentStyle={{
                backgroundColor: colorTokens.backgrounds.white,
                border: `1px solid ${colorTokens.ocean[200]}`,
                borderRadius: '6px'
              }}
            />
            <Bar 
              dataKey="expansionRate" 
              fill={colorTokens.chartPrimary.blue}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ContractSizeAnalysis;
