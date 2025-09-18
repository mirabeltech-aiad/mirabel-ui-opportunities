import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';

const StatCard = ({ value, label, icon: Icon, bgColor = 'bg-white', iconColor = 'text-blue-500' }) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-600">{label}</div>
        <div className={`p-2 rounded-lg ${iconColor.replace('text-', 'bg-').replace('-500', '-50')}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

const OpportunityStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      <StatCard
        value={stats.totalCount}
        label="Total Opportunities"
        icon={Target}
        iconColor="text-blue-500"
      />
      <StatCard
        value={stats.totalAmount}
        label="Total Amount"
        icon={DollarSign}
        iconColor="text-green-500"
      />
      <StatCard
        value={stats.totalWon}
        label="Won Opportunities"
        icon={CheckCircle}
        iconColor="text-green-500"
      />
      <StatCard
        value={stats.totalWinAmount}
        label="Won Amount"
        icon={DollarSign}
        iconColor="text-green-500"
      />
      <StatCard
        value={stats.totalOpen}
        label="Open Opportunities"
        icon={Clock}
        iconColor="text-blue-500"
      />
      <StatCard
        value={stats.totalLost}
        label="Lost Opportunities"
        icon={XCircle}
        iconColor="text-red-500"
      />
      <StatCard
        value={stats.winPercentage}
        label="Win Rate"
        icon={BarChart3}
        iconColor="text-purple-500"
      />
    </div>
  );
};

export default OpportunityStatsCards;