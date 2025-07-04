
import { useMemo } from 'react';

export const useDealSizeCorrelation = (dealVelocityData) => {
  return useMemo(() => {
    if (!dealVelocityData || !dealVelocityData.dealSizeCorrelation) {
      console.log('No deal size correlation data available from API');
      return {
        correlationData: [],
        correlationCoefficient: 0,
        sizeSegments: {},
        insights: []
      };
    }

    const { individualDeals, sizeSegments, correlationStats } = dealVelocityData.dealSizeCorrelation;
    
    // Use individual deals data directly from API (Result Set 5)
    const correlationData = individualDeals || [];

    // Use correlation coefficient from API (Result Set 7)
    const correlationCoefficient = Math.abs(correlationStats?.correlationCoefficient || 0);

    // Generate insights based on correlation and segments
    const generateInsights = (correlation, segments, stats) => {
      const insights = [];
      
      if (correlation > 0.7) {
        insights.push("Strong positive correlation: Larger deals tend to have longer sales cycles.");
      } else if (correlation > 0.4) {
        insights.push("Moderate correlation: Some relationship exists between deal size and cycle time.");
      } else if (correlation > 0.1) {
        insights.push("Weak correlation: Deal size has minimal impact on sales cycle length.");
      } else {
        insights.push("No correlation: Deal size does not significantly impact sales cycle length.");
      }
      
      // Add data quality insights
      if (stats?.dataPoints > 0) {
        insights.push(`Analysis based on ${stats.dataPoints} closed deals with an average deal size of $${stats.avgAmount?.toLocaleString()}.`);
      }
      
      // Analyze segments for insights
      const segmentKeys = Object.keys(segments);
      if (segmentKeys.length >= 2) {
        const smallestSegment = segments[segmentKeys[0]];
        const largestSegment = segments[segmentKeys[segmentKeys.length - 1]];
        
        if (smallestSegment?.avgCycle > 0 && largestSegment?.avgCycle > 0) {
          const difference = largestSegment.avgCycle - smallestSegment.avgCycle;
          if (Math.abs(difference) > 15) {
            const direction = difference > 0 ? "longer" : "shorter";
            insights.push(`Large deals take ${Math.abs(difference)} days ${direction} on average than small deals.`);
          }
        }
      }
      
      return insights;
    };

    const insights = generateInsights(correlationCoefficient, sizeSegments, correlationStats);

    return {
      correlationData,
      correlationCoefficient,
      sizeSegments: sizeSegments || {},
      insights,
      correlationStats: correlationStats || {}
    };
  }, [dealVelocityData]);
};
