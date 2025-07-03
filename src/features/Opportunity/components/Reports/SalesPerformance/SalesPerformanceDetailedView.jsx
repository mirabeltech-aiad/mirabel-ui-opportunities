
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@OpportunityComponents/ui/table';
import { Badge } from '@OpportunityComponents/ui/badge';
import { Button } from '@OpportunityComponents/ui/button';
import { Input } from '@OpportunityComponents/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@OpportunityComponents/ui/select';
import UserAvatar from '@OpportunityComponents/table/UserAvatar';
import { 
  Filter, 
  Search, 
  DollarSign, 
  Calendar, 
  Building, 
  Users, 
  Target,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const SalesPerformanceDetailedView = ({ filteredOpportunities = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('amount');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const { getTitleClass } = useDesignSystem();

  // Filter and sort opportunities
  const processedOpportunities = filteredOpportunities
    .filter(opp => {
      const matchesSearch = !searchTerm || 
        (opp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opp.company || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
      
      return matchesSearch && matchesStage;
    })
    .sort((a, b) => {
      let aValue = a[sortBy] || 0;
      let bValue = b[sortBy] || 0;
      
      if (sortBy === 'amount') {
        aValue = a.amount || 0;
        bValue = b.amount || 0;
      } else if (sortBy === 'createdDate') {
        aValue = new Date(a.createdDate || 0);
        bValue = new Date(b.createdDate || 0);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get unique stages for filter
  const stages = [...new Set(filteredOpportunities.map(opp => opp.stage).filter(Boolean))];

  // Calculate days since created
  const getDaysSinceCreated = (createdDate) => {
    if (!createdDate) return 0;
    const now = new Date();
    const created = new Date(createdDate);
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
          <Filter className="h-5 w-5 text-gray-500" />
          Detailed Opportunities Analysis
        </CardTitle>
        
        {/* Enhanced Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0 w-64"
            />
          </div>
          
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map(stage => (
                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="createdDate">Date Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 text-sm text-gray-600">
          Showing {processedOpportunities.length} of {filteredOpportunities.length} opportunities
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-50 text-muted-foreground h-11">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-indigo-500" />
                  Opportunity Details
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground h-11">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Assigned Rep
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground h-11">Status</TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground h-11">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Stage
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground h-11">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Value
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground h-11">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Age (Days)
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground h-11">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Created Date
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedOpportunities.map((opp) => {
              const daysSinceCreated = getDaysSinceCreated(opp.createdDate);
              
              return (
                <TableRow key={opp.id} className="hover:bg-gray-50">
                  <TableCell className="py-2.5">
                    <div>
                      <div className="font-medium text-black">{opp.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Building className="h-3 w-3" />
                        {opp.company}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={opp.assignedRep} />
                      <span className="text-sm">{opp.assignedRep}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-2.5">
                    <Badge variant={
                      opp.status === 'Won' ? "green" : 
                      opp.status === 'Open' ? "blue" : "red"
                    }>
                      {opp.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-2.5">
                    <Badge variant="orange" className="text-xs">
                      {opp.stage}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-2.5">
                    <span className="font-medium text-green-600">
                      {formatCurrency(opp.amount)}
                    </span>
                  </TableCell>
                  
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-orange-500" />
                      <span className={`text-sm ${daysSinceCreated > 90 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {daysSinceCreated}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {new Date(opp.createdDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {processedOpportunities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No opportunities found</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesPerformanceDetailedView;
