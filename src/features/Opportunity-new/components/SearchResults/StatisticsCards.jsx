import React from 'react';

const StatisticsCards = ({ data = {} }) => {
  const stats = [
    {
      title: 'Total Opportunities',
      value: data.totalOpportunities || 0,
      icon: '📊',
      color: 'blue'
    },
    {
      title: 'Active Proposals',
      value: data.activeProposals || 0,
      icon: '📝',
      color: 'green'
    },
    {
      title: 'Won Deals',
      value: data.wonDeals || 0,
      icon: '🏆',
      color: 'gold'
    },
    {
      title: 'Total Value',
      value: `$${(data.totalValue || 0).toLocaleString()}`,
      icon: '💰',
      color: 'purple'
    }
  ];

  return (
    <div className="statistics-cards">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card stat-card--${stat.color}`}>
          <div className="stat-card__icon">{stat.icon}</div>
          <div className="stat-card__content">
            <h3 className="stat-card__title">{stat.title}</h3>
            <p className="stat-card__value">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;