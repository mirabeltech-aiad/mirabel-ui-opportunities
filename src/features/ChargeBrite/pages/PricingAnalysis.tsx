import React, { Suspense, useState } from 'react';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import { ProductFilterProvider } from '@/contexts/ProductFilterContext';
import ProductFilter from '@/components/filters/ProductFilter';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PricingAnalysis = () => {
  const [dateRange, setDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  const handleDateRangeChange = (startDate?: Date, endDate?: Date) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <ProductFilterProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ocean-800 mb-2">
              Pricing Analysis Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive pricing strategy and revenue optimization insights
            </p>
          </div>
          
          <ProductFilter
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-ocean-800">Pricing Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Pricing analysis dashboard content will be displayed here.
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <ScrollToTopButton />
      </div>
    </ProductFilterProvider>
  );
};

export default PricingAnalysis;