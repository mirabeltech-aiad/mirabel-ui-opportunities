import React from 'react';
import { FileText, DollarSign, Send, CheckCircle, Clock, TrendingUp, Users, BarChart3 } from 'lucide-react';

const StatCard = ({ value, label, icon: Icon, bgColor = 'bg-white', iconColor = 'text-blue-500' }) => {
  return (
    <div className={`${bgColor} rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-gray-600">{label}</div>
        <div className={`p-2 rounded-lg ${iconColor.replace('text-', 'bg-').replace('-500', '-50')}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <div className="text-xl font-bold text-gray-900 truncate" title={value}>{value}</div>
    </div>
  );
};

const ProposalStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      <StatCard
        value={stats.total}
        label="Total Proposals"
        icon={FileText}
        iconColor="text-blue-500"
      />
      <StatCard
        value={`$${(stats.amount || 0).toLocaleString()}`}
        label="Total Amount"
        icon={DollarSign}
        iconColor="text-green-500"
      />
      <StatCard
        value={stats.activeProposals}
        label="Active Proposals"
        icon={Clock}
        iconColor="text-blue-500"
      />
      <StatCard
        value={`$${(stats.activeProposalsAmount || 0).toLocaleString()}`}
        label="Active Amount"
        icon={DollarSign}
        iconColor="text-blue-500"
      />
      <StatCard
        value={stats.sentProposals}
        label="Sent Proposals"
        icon={Send}
        iconColor="text-orange-500"
      />
      <StatCard
        value={stats.approvedProposals}
        label="Approved Proposals"
        icon={CheckCircle}
        iconColor="text-green-500"
      />
      <StatCard
        value={stats.conversionRate}
        label="Conversion Rate"
        icon={BarChart3}
        iconColor="text-purple-500"
      />
    </div>
  );
};

export default ProposalStatsCards;