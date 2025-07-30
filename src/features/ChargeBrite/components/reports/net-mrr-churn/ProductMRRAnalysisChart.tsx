
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface ProductMRRData {
  product: string;
  mrr: number;
  churnRate: number;
  netRetention: number;
}

interface ProductMRRAnalysisChartProps {
  data: ProductMRRData[];
}

const ProductMRRAnalysisChart: React.FC<ProductMRRAnalysisChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    product: item.product,
    'Churn Rate': item.churnRate,
    'Net Retention': item.netRetention,
    'MRR': item.mrr / 1000 // Convert to thousands for better display
  }));

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Product MRR Analysis</CardTitle>
          <HelpTooltip helpId="product-mrr-analysis" />
        </div>
        <CardDescription>MRR performance and retention by product line</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="product" 
              fontSize={12}
              tick={{ fill: '#075985' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: '#075985' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'MRR' ? `$${value}K` : `${value}%`, 
                name
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #bae6fd',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="Churn Rate" fill="#f43f5e" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Net Retention" fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProductMRRAnalysisChart;
