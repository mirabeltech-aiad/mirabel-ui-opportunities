import React, { useState } from 'react';
import { 
  Plus, 
  RotateCcw, 
  Settings, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Grid3X3,
  List,
  BarChart3,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const TestSearchResults = ({ searchType = 'opportunities', searchParams = {} }) => {
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    all: searchType === 'opportunities' ? 'All Opportunities' : 'All Proposals',
    probability: 'All Probability',
    reps: 'All Reps'
  });

  const isOpportunities = searchType === 'opportunities';
  const title = isOpportunities ? 'Opportunities' : 'Proposals';

  // Sample statistics
  const statistics = isOpportunities ? {
    totalCount: '605',
    totalAmount: '$10,026,759.1',
    totalWon: '265',
    totalOpen: '283',
    totalLost: '57',
    totalWinAmount: '$1,069,857.6',
    winPercentage: '82%'
  } : {
    totalCount: '342',
    totalAmount: '$8,456,234.5',
    totalActive: '189',
    totalPending: '98',
    totalConverted: '55',
    totalConvertedAmount: '$2,345,678.9',
    conversionRate: '16%'
  };

  // Sample data
  const sampleData = [
    {
      id: 1,
      amount: '$1,000',
      assignedRep: { name: 'NC', color: 'bg-red-500' },
      projCloseDate: '9/30/2025',
      company: 'Crypto.com',
      name: 'Opportunity-Today',
      probability: '20%',
      stage: '2nd...',
      stageColor: 'bg-green-500',
      status: 'Open',
      statusColor: 'bg-blue-100 text-blue-800',
      contactName: 'Patty Beck'
    },
    {
      id: 2,
      amount: '$87,000',
      assignedRep: { name: 'BL', color: 'bg-purple-500' },
      projCloseDate: '10/29/2017',
      company: 'SL Powers',
      name: 'Opportunity',
      probability: '100%',
      stage: 'Closed Won',
      stageColor: 'bg-green-500',
      status: 'Won',
      statusColor: 'bg-green-100 text-green-800',
      contactName: 'Dawn Hardesty'
    },
    {
      id: 3,
      amount: '$780',
      assignedRep: { name: 'BL', color: 'bg-purple-500' },
      projCloseDate: '10/31/2022',
      company: 'The BWP',
      name: 'Opportunity',
      probability: '10%',
      stage: 'Proposal',
      stageColor: 'bg-orange-500',
      status: 'Open',
      statusColor: 'bg-blue-100 text-blue-800',
      contactName: 'Samantha Brown'
    },
    {
      id: 4,
      amount: '$10,000',
      assignedRep: { name: 'BL', color: 'bg-purple-500' },
      projCloseDate: '12/30/2022',
      company: 'Salt & Pepper, Ltd.',
      name: 'Opportunity',
      probability: '10%',
      stage: 'Meeting',
      stageColor: 'bg-orange-500',
      status: 'Open',
      statusColor: 'bg-blue-100 text-blue-800',
      contactName: 'Brian Riley'
    },
    {
      id: 5,
      amount: '$10,000',
      assignedRep: { name: 'BL', color: 'bg-purple-500' },
      projCloseDate: '10/31/2022',
      company: 'Salt & Pepper, Ltd.',
      name: 'Opportunity',
      probability: '30%',
      stage: 'Qualification',
      stageColor: 'bg-yellow-500',
      status: 'Open',
      statusColor: 'bg-blue-100 text-blue-800',
      contactName: 'Brian Riley'
    }
  ];

  const opportunityStats = [
    { value: statistics.totalCount, label: '# OF OPPORTUNITIES', color: 'text-blue-600' },
    { value: statistics.totalAmount, label: 'OPPORTUNITY AMOUNT', color: 'text-gray-900' },
    { value: statistics.totalWon, label: 'TOTAL OPPORTUNITY WON', color: 'text-green-600' },
    { value: statistics.totalOpen, label: 'TOTAL OPPORTUNITY OPEN', color: 'text-blue-600' },
    { value: statistics.totalLost, label: 'TOTAL OPPORTUNITY LOST', color: 'text-red-600' },
    { value: statistics.totalWinAmount, label: 'OPPORTUNITY WIN TOTAL', color: 'text-green-600' },
    { value: statistics.winPercentage, label: 'OPPORTUNITY WIN %', color: 'text-orange-600' }
  ];

  const proposalStats = [
    { value: statistics.totalCount, label: '# OF PROPOSALS', color: 'text-blue-600' },
    { value: statistics.totalAmount, label: 'PROPOSAL AMOUNT', color: 'text-gray-900' },
    { value: statistics.totalActive, label: 'TOTAL PROPOSALS ACTIVE', color: 'text-green-600' },
    { value: statistics.totalPending, label: 'TOTAL PROPOSALS PENDING', color: 'text-yellow-600' },
    { value: statistics.totalConverted, label: 'TOTAL PROPOSALS CONVERTED', color: 'text-purple-600' },
    { value: statistics.totalConvertedAmount, label: 'CONVERTED AMOUNT TOTAL', color: 'text-green-600' },
    { value: statistics.conversionRate, label: 'CONVERSION RATE %', color: 'text-orange-600' }
  ];

  const stats = isOpportunities ? opportunityStats : proposalStats;

  const columns = [
    { key: 'select', label: '', width: 'w-8' },
    { key: 'amount', label: 'Amount', width: 'w-24' },
    { key: 'assignedRep', label: 'Assigned Rep', width: 'w-24' },
    { key: 'projCloseDate', label: 'Proj Close Date', width: 'w-28' },
    { key: 'company', label: 'Company Name', width: 'w-32' },
    { key: 'name', label: `${title.slice(0, -1)} Name`, width: 'w-40' },
    { key: 'probability', label: 'Probability (%)', width: 'w-28' },
    { key: 'stage', label: 'Stage', width: 'w-32' },
    { key: 'status', label: 'Status', width: 'w-20' },
    { key: 'contactName', label: 'Contact Name', width: 'w-32' },
    { key: 'actions', label: '', width: 'w-8' }
  ];

  const renderCell = (item, column) => {
    switch (column.key) {
      case 'select':
        return <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />;
      case 'amount':
        return <span className="font-medium">{item.amount}</span>;
      case 'assignedRep':
        return (
          <div className={`w-8 h-8 rounded-full ${item.assignedRep.color} flex items-center justify-center text-white text-sm font-medium`}>
            {item.assignedRep.name}
          </div>
        );
      case 'projCloseDate':
        return <span className="text-sm">{item.projCloseDate}</span>;
      case 'company':
        return <span className="font-medium">{item.company}</span>;
      case 'name':
        return (
          <a href={`/${searchType}/${item.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center space-x-1">
            <span>{item.name}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      case 'probability':
        return <span>{item.probability}</span>;
      case 'stage':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${item.stageColor}`}>
            {item.stage}
          </span>
        );
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.statusColor}`}>
            {item.status}
          </span>
        );
      case 'contactName':
        return <span>{item.contactName}</span>;
      case 'actions':
        return (
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Statistics Cards */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="grid grid-cols-7 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Combined Filter and Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All {title}</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Probability</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Reps</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">1-25 of 605</span>
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-1 ml-4">
              <button className="p-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                <Plus className="h-4 w-4" />
              </button>
              
              <button className="p-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                <RotateCcw className="h-4 w-4" />
              </button>
              
              <button className="p-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                <Settings className="h-4 w-4" />
              </button>
              
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 border-l border-gray-300 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 border-l border-gray-300 ${viewMode === 'kanban' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>
              
              <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Filter className="h-4 w-4" />
              </button>
              
              <button className="p-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-white h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`${column.width} px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleData.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing 5 of 605 opportunities - Scroll down to load more
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSearchResults;