

import { useRevenueAttribution } from '@/hooks/useRevenueData';
import TouchpointsAttribution from './revenue/TouchpointsAttribution';
import ChannelTypeMatrix from './revenue/ChannelTypeMatrix';
import GeographicAttribution from './revenue/GeographicAttribution';
import AttributionSummary from './revenue/AttributionSummary';

const RevenueAttribution = () => {
  const { data: attribution, isLoading } = useRevenueAttribution();

  if (isLoading || !attribution) {
    return <div>Loading revenue attribution data...</div>;
  }

  return (
    <div className="space-y-6">
      <TouchpointsAttribution touchpoints={attribution.touchpoints} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelTypeMatrix channelTypeMatrix={attribution.channelTypeMatrix} />
        <GeographicAttribution geographic={attribution.geographic} />
      </div>

      <AttributionSummary summary={attribution.summary} />
    </div>
  );
};

export default RevenueAttribution;
