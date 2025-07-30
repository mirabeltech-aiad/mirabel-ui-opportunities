import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Globe, Users, DollarSign, Truck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import { HelpTooltip } from '../../components';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';

const GeographicDistributionReport = () => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  const [dateRange, setDateRange] = React.useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  // Use React Query to fetch real geographic data from Supabase
  const { data: geographicData, isLoading, error } = useQuery({
    queryKey: ['geographic-distribution', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getGeographicData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Globe className="h-5 w-5" />
            Geographic Distribution Report - Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading geographic distribution data: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data for display
  const locationStats = geographicData || {};
  const countryData = Object.entries(locationStats).map(([country, stats]: [string, any]) => ({
    country,
    total: stats.total,
    print: stats.print,
    digital: stats.digital,
    percentage: 0, // Will calculate below
    deliveryCost: 2.45, // Mock delivery cost
    states: Object.entries(stats.states || {}).map(([state, stateStats]: [string, any]) => ({
      state,
      total: stateStats.total,
      print: stateStats.print,
      digital: stateStats.digital,
      percentage: 0 // Will calculate below
    }))
  }));

  // Calculate percentages
  const totalSubscribers = countryData.reduce((sum, country) => sum + country.total, 0);
  countryData.forEach(country => {
    country.percentage = totalSubscribers > 0 ? (country.total / totalSubscribers) * 100 : 0;
    const countryTotal = country.total;
    country.states.forEach((state: any) => {
      state.percentage = countryTotal > 0 ? (state.total / countryTotal) * 100 : 0;
    });
  });

  // Mock ZIP code data since it's not in our current schema
  const topZipCodes = [
    {
      zipCode: '10001',
      city: 'New York',
      state: 'NY',
      total: 15,
      print: 9,
      digital: 6
    },
    {
      zipCode: '90210',
      city: 'Beverly Hills',
      state: 'CA',
      total: 12,
      print: 7,
      digital: 5
    },
    {
      zipCode: '60601',
      city: 'Chicago',
      state: 'IL',
      total: 8,
      print: 5,
      digital: 3
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Total Subscribers
              <HelpTooltip helpId="geographic-total-subscribers" />
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{totalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-gray-600">across all regions</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Countries Covered
              <HelpTooltip helpId="geographic-countries-covered" />
            </CardTitle>
            <Globe className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{countryData.length}</div>
            <p className="text-xs text-gray-600">global markets</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Avg Delivery Cost
              <HelpTooltip helpId="geographic-avg-delivery-cost" />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              ${countryData.length > 0 ? (countryData.reduce((sum, c) => sum + c.deliveryCost, 0) / countryData.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-gray-600">per delivery</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Top ZIP Areas
              <HelpTooltip helpId="geographic-top-zip-areas" />
            </CardTitle>
            <MapPin className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">{topZipCodes.length}</div>
            <p className="text-xs text-gray-600">high-density areas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="countries" className="w-full">
        <TabsList className="bg-blue-50 w-full grid grid-cols-3 p-1 rounded-md mb-6">
          <TabsTrigger 
            value="countries" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            By Country
          </TabsTrigger>
          <TabsTrigger 
            value="states" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            By State/Region
          </TabsTrigger>
          <TabsTrigger 
            value="zipcodes" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            By ZIP Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-ocean-800 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Subscribers by Country
                <HelpTooltip helpId="geographic-by-country" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {countryData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No geographic data available
                  </div>
                ) : (
                  countryData.map(country => (
                    <div key={country.country} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{country.country}</h3>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {country.percentage.toFixed(1)}% of total
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Truck className="h-4 w-4" />
                            ${country.deliveryCost}/delivery
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{country.total.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">total subscribers</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-blue-800">Print Subscriptions</span>
                          <div className="text-right">
                            <div className="font-bold text-blue-800">{country.print.toLocaleString()}</div>
                            <div className="text-sm text-blue-600">
                              {country.total > 0 ? (country.print / country.total * 100).toFixed(1) : 0}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="font-medium text-green-800">Digital Subscriptions</span>
                          <div className="text-right">
                            <div className="font-bold text-green-800">{country.digital.toLocaleString()}</div>
                            <div className="text-sm text-green-600">
                              {country.total > 0 ? (country.digital / country.total * 100).toFixed(1) : 0}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-ocean-800 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Subscribers by State/Region
                <HelpTooltip helpId="geographic-by-state" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {countryData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No state/region data available
                  </div>
                ) : (
                  countryData.map(country => (
                    <div key={country.country}>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">{country.country}</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {country.states.map(state => (
                          <div key={state.state} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{state.state}</span>
                              <Badge variant="secondary">{state.percentage.toFixed(1)}%</Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              Total: <span className="font-semibold">{state.total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-blue-600">Print: {state.print.toLocaleString()}</span>
                              <span className="text-green-600">Digital: {state.digital.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zipcodes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-ocean-800 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top ZIP Code Areas
                <HelpTooltip helpId="geographic-by-zipcode" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topZipCodes.map((zip, index) => (
                  <div key={zip.zipCode} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{zip.zipCode}</div>
                        <div className="text-sm text-gray-600">{zip.city}, {zip.state}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{zip.total.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        P: {zip.print} | D: {zip.digital}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeographicDistributionReport;