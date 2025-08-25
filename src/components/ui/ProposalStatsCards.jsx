
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({ value, label, colorType = "primary", bgColorType = "white" }) => {
  const [colors, setColors] = useState({
    primary: '#1a4d80',
    secondary: '#4fb3ff',
    success: '#06d6a0',
    warning: '#ffbe0b',
    danger: '#fb5607'
  });

  useEffect(() => {
    // Load saved colors from localStorage
    const savedColors = localStorage.getItem('dashboard_colors');
    if (savedColors) {
      setColors(JSON.parse(savedColors));
    }
  }, []);

  const getTextColor = () => {
    switch (colorType) {
      case 'success': return { color: colors.success };
      case 'secondary': return { color: colors.secondary };
      case 'danger': return { color: colors.danger };
      case 'warning': return { color: colors.warning };
      default: return { color: colors.primary };
    }
  };

  return (
    <Card className="rounded-md border border-gray-200 shadow-sm bg-white h-full">
      <CardContent className="p-3 text-center">
        <div className="text-xl font-bold mb-0.5" style={getTextColor()}>{value}</div>
        <p className="text-black text-xs font-medium uppercase tracking-tight">{label}</p>
      </CardContent>
    </Card>
  );
};

const ProposalStatsCards = ({ stats }) => {
  return (
    <div className="flex flex-nowrap gap-4 mb-6 mt-4">
      <div className="flex-1">
        <StatCard 
          value={stats.total} 
          label="# Of Proposals" 
          colorType="primary"
        />
      </div>
      <div className="flex-1">
        <StatCard 
          value={`$${stats.amount}`} 
          label="Proposal Amount" 
          colorType="primary"
        />
      </div>
      <div className="flex-1">
        <StatCard 
          value={stats.activeProposals} 
          label="Active Proposals" 
          colorType="success"
        />
      </div>
      <div className="flex-1">
        <StatCard 
          value={`$${stats.activeProposalsAmount}`} 
          label="Active Proposals Total" 
          colorType="secondary"
        />
      </div>
      <div className="flex-1">
        <StatCard 
          value={stats.sentProposals} 
          label="Sent Proposals" 
          colorType="danger"
        />
      </div>
      <div className="flex-1">
        <StatCard 
          value={`$${stats.sentProposalsAmount}`} 
          label="Sent Proposals Total" 
          colorType="success"
        />
      </div>
      <div className="flex-1">
        <StatCard 
          value={`${stats.approvedProposals}`} 
          label="Approved Proposals" 
          colorType="warning"
        />
      </div>
      <div className="flex-1">
        <StatCard 
          value={`$${stats.approvedProposalsAmount}`} 
          label="Approved Proposals Total" 
          colorType="warning"
        />
      </div>
    </div>
  );
};

export default ProposalStatsCards;
