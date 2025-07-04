
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Target, TrendingUp } from 'lucide-react';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const PipelineForecastTab = ({ forecastData }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <TrendingUp className="h-5 w-5 text-purple-600" />
            6-Month Pipeline Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: chartColors.axisText }} />
              <YAxis tick={{ fill: chartColors.axisText }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="projected" fill={chartColors.primary[2]} name="Projected Deals" radius={[4, 4, 0, 0]} />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke={chartColors.primary[4]} 
                strokeWidth={3}
                name="Confidence %" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <Target className="h-5 w-5 text-orange-600" />
            Forecast Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-gray-50 text-muted-foreground">Month</TableHead>
                <TableHead className="bg-gray-50 text-muted-foreground">Projected Deals</TableHead>
                <TableHead className="bg-gray-50 text-muted-foreground">Projected Value</TableHead>
                <TableHead className="bg-gray-50 text-muted-foreground">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecastData.map((forecast) => (
                <TableRow key={forecast.month} className="hover:bg-gray-50">
                  <TableCell className="py-2.5">{forecast.month}</TableCell>
                  <TableCell className="py-2.5">{forecast.projected}</TableCell>
                  <TableCell className="py-2.5">${(forecast.projectedValue / 1000000).toFixed(2)}M</TableCell>
                  <TableCell className="py-2.5">
                    <Badge variant={forecast.confidence > 70 ? "default" : "secondary"} className={
                      forecast.confidence > 70 ? 'bg-green-500 text-white' : 'bg-blue-300 text-gray-800'
                    }>
                      {forecast.confidence}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineForecastTab;
