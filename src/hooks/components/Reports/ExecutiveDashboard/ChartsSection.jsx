
import React from 'react';
import RevenueChart from "../RevenueChart";
import PipelineHealthChart from "../PipelineHealthChart";
import MetricTooltip from "../MetricTooltip";

const ChartsSection = ({ revenueData, pipelineData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MetricTooltip
        title="Revenue Trend & Forecast"
        description="Shows actual revenue achieved and forecasted future revenue based on pipeline progression and historical conversion rates."
        calculation="Actual: Sum of won deals by month. Forecast: Predictive model based on pipeline health and stage conversion probabilities"
        period="Monthly view for current year with 6-month forecast projection"
        benchmarks={{
          good: "Above quota target",
          average: "Within 10% of quota",
          concerning: "Below 90% of quota"
        }}
      >
        <RevenueChart data={revenueData} />
      </MetricTooltip>
      
      <MetricTooltip
        title="Pipeline Distribution by Stage"
        description="Distribution of open opportunities across different sales stages showing both deal count and total value to identify bottlenecks."
        calculation="Count and sum of opportunities grouped by current stage, excluding closed won/lost deals"
        period="Current active pipeline snapshot updated in real-time"
        benchmarks={{
          good: "Balanced distribution",
          average: "Some stage concentration",
          concerning: "Heavy bottlenecks in early stages"
        }}
      >
        <PipelineHealthChart data={pipelineData} />
      </MetricTooltip>
    </div>
  );
};

export default ChartsSection;
