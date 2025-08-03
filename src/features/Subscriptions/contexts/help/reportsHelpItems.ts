import { HelpItem } from './types';

export const reportsHelpItems: HelpItem[] = [
  {
    id: 'net-mrr-metrics',
    fieldName: 'Net MRR Metrics',
    instruction: 'Key monthly recurring revenue metrics that show the health of your subscription business. These metrics help track revenue retention, expansion, and churn patterns.'
  },
  {
    id: 'gross-mrr-churn',
    fieldName: 'Gross MRR Churn',
    instruction: 'Total monthly recurring revenue lost from churned customers, without accounting for expansion revenue from existing customers. This represents pure revenue loss from cancellations and downgrades.'
  },
  {
    id: 'net-mrr-churn',
    fieldName: 'Net MRR Churn',
    instruction: 'Net monthly recurring revenue churn rate after accounting for expansion revenue from existing customers. A negative net churn indicates revenue growth from existing customers exceeds losses.'
  },
  {
    id: 'expansion-mrr',
    fieldName: 'Expansion MRR',
    instruction: 'Additional monthly recurring revenue generated from existing customers through upgrades, upsells, add-ons, and cross-sells. This is a key indicator of product-market fit and customer satisfaction.'
  },
  {
    id: 'net-revenue-retention',
    fieldName: 'Net Revenue Retention',
    instruction: 'Percentage of recurring revenue retained from existing customers, including expansion revenue and accounting for churn. Values above 100% indicate net revenue growth from the existing customer base.'
  },
  {
    id: 'net-mrr-trend-chart',
    fieldName: 'Net MRR Churn Trends',
    instruction: 'Monthly trend analysis showing gross churn, net churn, and expansion rates over time. Track patterns and seasonal variations in MRR churn performance to identify improvement opportunities.'
  },
  {
    id: 'mrr-bridge-chart',
    fieldName: 'MRR Movement Bridge',
    instruction: 'Waterfall chart showing how MRR changes from different sources - new customer revenue, expansion revenue, and churned revenue. Visualizes the key drivers of MRR growth or decline.'
  },
  {
    id: 'segment-net-mrr',
    fieldName: 'Net MRR by Customer Segment',
    instruction: 'Comparison of expansion vs churn performance across different customer segments (Enterprise, Mid-Market, SMB). Helps identify which segments drive growth and which need attention.'
  },
  {
    id: 'cohort-net-retention',
    fieldName: 'Cohort Net Revenue Retention',
    instruction: 'Revenue retention curves by customer acquisition cohort, showing how different customer groups retain and expand revenue over time. Essential for understanding customer lifetime value trends.'
  },
  {
    id: 'product-mrr-analysis',
    fieldName: 'Product MRR Analysis',
    instruction: 'Analysis of MRR performance by product line, showing churn rates and net retention for each product. Helps identify which products drive expansion and which experience high churn.'
  },
  {
    id: 'geographic-net-mrr',
    fieldName: 'Geographic Net MRR Analysis',
    instruction: 'Regional comparison of net churn rates and expansion performance. Identifies geographic markets with strong growth potential and those requiring retention focus.'
  },
  {
    id: 'expansion-opportunities',
    fieldName: 'Expansion Opportunities',
    instruction: 'Table of customers with high expansion potential based on usage patterns, engagement scores, and account characteristics. Prioritizes accounts for upsell and cross-sell efforts.'
  },
  {
    id: 'net-revenue-bridge',
    fieldName: 'Net Revenue Bridge Analysis',
    instruction: 'Detailed breakdown of revenue movements showing the impact of new customers, expansions, downgrades, and churn on overall revenue growth. Provides actionable insights for revenue optimization.'
  },
  {
    id: 'predictive-net-churn',
    fieldName: 'Predictive Net Churn Model',
    instruction: 'Machine learning model that predicts future churn risk and expansion opportunities. Uses customer behavior, usage patterns, and engagement data to forecast revenue changes.'
  },

  // Revenue Churn Rate Report Help Items
  {
    id: 'revenue-churn-metrics',
    fieldName: 'Revenue Churn Metrics',
    instruction: 'Key revenue churn metrics that track the financial impact of customer attrition. These metrics help identify revenue retention challenges and measure the effectiveness of retention strategies.'
  },
  {
    id: 'gross-revenue-churn',
    fieldName: 'Gross Revenue Churn',  
    instruction: 'Total percentage of monthly recurring revenue lost from churned customers without accounting for expansion revenue. This metric shows the pure revenue impact of customer cancellations and downgrades.'
  },
  {
    id: 'net-revenue-churn-rate',
    fieldName: 'Net Revenue Churn Rate',
    instruction: 'Revenue churn rate after accounting for expansion revenue from existing customers. A negative rate indicates that expansion revenue exceeds churn losses, driving net revenue growth.'
  },
  {
    id: 'mrr-lost',
    fieldName: 'MRR Lost',
    instruction: 'Total dollar amount of monthly recurring revenue lost due to customer churn during the period. This provides the absolute financial impact of churn on the business.'
  },
  {
    id: 'avg-revenue-per-lost-customer',
    fieldName: 'Average Revenue per Lost Customer',
    instruction: 'Average monthly recurring revenue value of customers who churned during the period. Helps identify whether high-value or low-value customers are churning more frequently.'
  },
  {
    id: 'monthly-churn-change',
    fieldName: 'Monthly Churn Change',
    instruction: 'Month-over-month percentage change in revenue churn rate. Positive values indicate worsening churn, while negative values show improvement in revenue retention.'
  },
  {
    id: 'revenue-churn-trend',
    fieldName: 'Revenue Churn Trend',
    instruction: '12-month trend analysis of gross and net revenue churn rates. Shows seasonal patterns and long-term trends to help identify whether churn is improving or deteriorating over time.'
  },
  {
    id: 'revenue-waterfall',
    fieldName: 'Revenue Waterfall Analysis',
    instruction: 'Waterfall chart showing the flow of revenue changes from new customers, expansions, downgrades, and churn. Visualizes how different revenue components contribute to overall growth or decline.'
  },
  {
    id: 'churn-by-segment',
    fieldName: 'Churn by Revenue Segment',
    instruction: 'Comparison of revenue churn rates across different customer segments (Enterprise, Mid-Market, SMB). Identifies which customer segments have the highest churn risk and revenue impact.'
  },
  {
    id: 'churn-by-product',
    fieldName: 'Churn by Product',
    instruction: 'Revenue churn distribution by product line, showing which products contribute most to overall churn. Helps prioritize product improvement and retention efforts based on revenue impact.'
  },
  {
    id: 'geographic-churn',
    fieldName: 'Geographic Churn Analysis',
    instruction: 'Regional comparison of revenue churn rates to identify geographic markets with retention challenges. Enables targeted regional retention strategies and resource allocation.'
  },
  {
    id: 'high-value-churn',
    fieldName: 'High-Value Customer Churn',
    instruction: 'Table of recently churned customers with highest revenue impact, including churn reasons and recovery opportunities. Prioritizes win-back efforts and helps prevent similar future churn.'
  },
  {
    id: 'revenue-recovery',
    fieldName: 'Revenue Recovery Analysis',
    instruction: 'Analysis of win-back campaign performance and revenue recovery opportunities from recently churned customers. Shows potential revenue that can be recovered through targeted retention efforts.'
  },
  {
    id: 'cohort-revenue-retention',
    fieldName: 'Cohort Revenue Retention',
    instruction: 'Revenue retention rates by customer acquisition cohort over time. Shows how well different customer groups retain their revenue value and identifies cohorts with stronger or weaker retention patterns.'
  },
  {
    id: 'predictive-churn-risk',
    fieldName: 'Predictive Churn Risk Scoring',
    instruction: 'Machine learning model that scores customers based on their likelihood to churn and potential revenue impact. Enables proactive retention efforts focused on high-risk, high-value customers.'
  },

  // Contract Expansion Rate Report Help Items
  {
    id: 'contract-expansion-metrics',
    fieldName: 'Contract Expansion Metrics',
    instruction: 'Key metrics tracking contract expansion performance, including expansion rates, average expansion values, and renewal outcomes. These metrics help measure customer growth and satisfaction.'
  },
  {
    id: 'expansion-rate-overall',
    fieldName: 'Overall Expansion Rate',
    instruction: 'Percentage of contracts that expanded in value during renewal compared to their original contract value. Indicates customer satisfaction and product stickiness.'
  },
  {
    id: 'avg-expansion-value',
    fieldName: 'Average Expansion Value',
    instruction: 'Average dollar amount of contract value increase when expansions occur. Shows the typical magnitude of expansion among customers who do expand.'
  },
  {
    id: 'total-expansion-revenue',
    fieldName: 'Total Expansion Revenue',
    instruction: 'Total additional revenue generated from contract expansions during the selected period. Represents the direct financial impact of expansion efforts.'
  },
  {
    id: 'contracts-analyzed',
    fieldName: 'Contracts Analyzed',
    instruction: 'Total number of contracts included in the expansion analysis. This represents the complete dataset used for calculating expansion metrics and trends.'
  },
  {
    id: 'expansion-trend-chart',
    fieldName: 'Expansion Rate Trend',
    instruction: 'Monthly trend of contract expansion rates over the past 12 months. Helps identify seasonal patterns and overall growth trajectory in customer expansions.'
  },
  {
    id: 'expansion-distribution',
    fieldName: 'Expansion Amount Distribution',
    instruction: 'Distribution showing how contract expansion percentages are spread across different ranges. Helps understand the typical expansion magnitude and identify outliers.'
  },
  {
    id: 'contract-size-expansion',
    fieldName: 'Expansion Rate by Contract Size',
    instruction: 'Analysis of how expansion rates vary by contract value buckets. Larger contracts often have different expansion patterns than smaller ones.'
  },
  {
    id: 'renewal-outcomes',
    fieldName: 'Renewal Outcome Breakdown',
    instruction: 'Distribution of all contract renewal outcomes including expansions, flat renewals, downgrades, and churn. Provides complete picture of renewal performance.'
  },
  {
    id: 'revenue-impact-metrics',
    fieldName: 'Revenue Impact Metrics',
    instruction: 'Detailed analysis of revenue impact from contract expansions, including net revenue retention and total revenue growth from existing customers.'
  },
  {
    id: 'contract-renewals-table',
    fieldName: 'Contract Renewals Analysis',
    instruction: 'Detailed table of upcoming contract renewals with expansion opportunities, renewal probabilities, and account health scores. Helps prioritize renewal and expansion efforts.'
  },
  {
    id: 'expansion-drivers',
    fieldName: 'Expansion Drivers Analysis',
    instruction: 'Analysis of factors driving contract expansions, including business growth, new use cases, user growth, and feature adoption. Identifies key expansion opportunities.'
  },
  {
    id: 'expansion-patterns',
    fieldName: 'Expansion Pattern Analysis',
    instruction: 'Analysis of expansion patterns by customer segment, tenure, and predictive indicators. Helps identify which customer characteristics lead to successful expansions.'
  },

  // Expansion Payback Period Report Help Items
  {
    id: 'expansion-payback-metrics',
    fieldName: 'Expansion Payback Metrics',
    instruction: 'Key metrics tracking the financial return on expansion investments, including average payback periods, ROI calculations, and revenue generation from expansion efforts.'
  },
  {
    id: 'avg-payback-period',
    fieldName: 'Average Payback Period',
    instruction: 'Average time in months for expansion investments to be recovered through additional monthly recurring revenue. Shorter periods indicate more efficient expansion strategies.'
  },
  {
    id: 'total-expansion-investment',
    fieldName: 'Total Expansion Investment',
    instruction: 'Total amount invested in expansion efforts including sales, marketing, implementation, and customer success costs. Represents the complete cost of driving expansion revenue.'
  },
  {
    id: 'expansion-roi',
    fieldName: 'Overall Expansion ROI',
    instruction: 'Return on investment for expansion efforts, calculated as the annualized revenue gain compared to total investment. Positive ROI indicates profitable expansion programs.'
  },
  {
    id: 'monthly-expansion-revenue',
    fieldName: 'Total Monthly Expansion Revenue',
    instruction: 'Total additional monthly recurring revenue generated from all expansion deals. This represents the ongoing revenue impact of successful expansion efforts.'
  },
  {
    id: 'expansion-deals-count',
    fieldName: 'Expansion Deals This Month',
    instruction: 'Number of expansion deals closed in the current month. Tracks the velocity and volume of expansion activities across the customer base.'
  },
  {
    id: 'payback-distribution',
    fieldName: 'Payback Period Distribution',
    instruction: 'Distribution of expansion deals by their payback period ranges. Shows how quickly different expansion investments recover their costs and generate returns.'
  },
  {
    id: 'roi-trend-analysis',
    fieldName: 'ROI Trend Analysis',
    instruction: 'Monthly trend analysis of expansion ROI, investment levels, and revenue generation. Tracks the improving or declining efficiency of expansion programs over time.'
  },
  {
    id: 'expansion-type-performance',
    fieldName: 'Expansion Type Performance',
    instruction: 'Comparison of performance across different expansion types (upsells, cross-sells, add-ons). Shows which expansion strategies deliver the best payback periods and ROI.'
  },
  {
    id: 'investment-breakdown',
    fieldName: 'Investment Breakdown Analysis',
    instruction: 'Detailed breakdown of expansion investment by category (sales effort, marketing campaigns, implementation, customer success). Helps optimize resource allocation.'
  },
  {
    id: 'channel-performance',
    fieldName: 'Channel Performance Analysis',
    instruction: 'Performance comparison across different expansion channels (direct sales, self-service, marketing campaigns). Identifies the most efficient channels for driving expansion.'
  },
  {
    id: 'expansion-deals-table',
    fieldName: 'Individual Expansion Deals',
    instruction: 'Detailed table of individual expansion deals with investment amounts, revenue impact, payback calculations, and current ROI status. Provides deal-level insights for optimization.'
  },

  // Cross-sell Attach Rate Report Help Items
  {
    id: 'cross-sell-attach-rate-report',
    fieldName: 'Cross-sell Attach Rate Report',
    instruction: 'Comprehensive analysis of cross-selling performance and product attachment opportunities. This report helps identify the most effective cross-sell strategies and optimize product bundling approaches.'
  },
  {
    id: 'overall-attach-rate',
    fieldName: 'Overall Attach Rate',
    instruction: 'Percentage of customers who purchased additional products beyond their initial subscription. This metric indicates the success of cross-selling efforts and product-market fit across the portfolio.'
  },
  {
    id: 'cross-sell-revenue-metric',
    fieldName: 'Cross-Sell Revenue',
    instruction: 'Additional revenue generated from selling supplementary products to existing customers. This represents the direct financial impact of successful cross-selling initiatives.'
  },
  {
    id: 'avg-products-per-customer',
    fieldName: 'Average Products per Customer',
    instruction: 'Average number of products each customer has purchased, indicating product adoption depth and cross-sell effectiveness across the customer base.'
  },
  {
    id: 'total-cross-sell-opportunities',
    fieldName: 'Total Cross-sell Opportunities',
    instruction: 'Total number of existing customers who could be targeted for cross-sell campaigns based on their current product usage and engagement patterns.'
  },
  {
    id: 'cross-sell-trend-chart',
    fieldName: 'Cross-sell Performance Trends',
    instruction: 'Monthly trend analysis of cross-sell attach rates, number of cross-sells, and revenue generated. Helps identify seasonal patterns and the effectiveness of cross-sell campaigns over time.'
  },
  {
    id: 'cross-sell-time-distribution',
    fieldName: 'Time to Cross-sell Distribution',
    instruction: 'Distribution showing when customers typically add complementary products after their initial purchase. Helps optimize timing for cross-sell campaigns and outreach efforts.'
  },
  {
    id: 'product-combinations-chart',
    fieldName: 'Product Combination Performance',
    instruction: 'Analysis of the most successful product combinations, showing which products are frequently purchased together and their average revenue contribution.'
  },
  {
    id: 'cross-sell-segment-analysis',
    fieldName: 'Cross-sell by Customer Segment',
    instruction: 'Comparison of cross-sell performance across different customer segments (Enterprise, Mid-Market, SMB). Identifies which segments respond best to cross-sell initiatives.'
  },
  {
    id: 'product-affinity-matrix',
    fieldName: 'Product Affinity Matrix',
    instruction: 'Matrix showing cross-sell success rates by initial product type, revealing which products create the strongest foundation for additional sales and customer expansion.'
  },
  {
    id: 'cross-sell-customer-journey',
    fieldName: 'Customer Cross-sell Journey',
    instruction: 'Individual customer product adoption timelines showing the progression from initial purchase to multiple product ownership. Helps understand customer expansion patterns.'
  },
  {
    id: 'cross-sell-insights',
    fieldName: 'Cross-sell Key Insights',
    instruction: 'Strategic insights and recommendations based on cross-sell performance data, highlighting opportunities for improvement and successful patterns to replicate.'
  },
  // Time to Upgrade Report Help Items
  {
    id: 'time-to-upgrade-metrics',
    fieldName: 'Time to Upgrade Metrics',
    instruction: 'Key metrics tracking how long customers take to upgrade from their initial subscription to higher-tier plans. These metrics help optimize upgrade timing and identify conversion opportunities.'
  },
  {
    id: 'avg-time-to-upgrade',
    fieldName: 'Average Time to Upgrade',
    instruction: 'Average number of days customers take to upgrade from their initial subscription to a higher-tier plan. Shorter times indicate strong product-market fit and effective upgrade strategies.'
  },
  {
    id: 'customers-upgraded',
    fieldName: 'Customers Upgraded',
    instruction: 'Total number of customers who successfully upgraded to higher-tier plans during the selected period. This metric tracks the volume of upgrade activity.'
  },
  {
    id: 'fastest-upgrade',
    fieldName: 'Fastest Upgrade',
    instruction: 'Shortest time recorded for a customer to upgrade from initial subscription to a higher plan. This represents the best-case scenario for upgrade velocity.'
  },
  {
    id: 'upgrade-rate',
    fieldName: 'Upgrade Rate',
    instruction: 'Percentage of customers who eventually upgrade from their initial subscription plan. This metric indicates the overall upgrade conversion rate across the customer base.'
  },
  {
    id: 'time-distribution-chart',
    fieldName: 'Time to Upgrade Distribution',
    instruction: 'Bar chart showing how customers are distributed across different upgrade timeframes (0-30 days, 31-60 days, etc.). Helps identify common upgrade patterns and optimal timing windows.'
  },
  {
    id: 'upgrade-trend-chart',
    fieldName: 'Average Time to Upgrade Trend',
    instruction: 'Line chart showing monthly trends in average upgrade timing. Tracks whether customers are upgrading faster or slower over time, indicating campaign effectiveness.'
  },
  {
    id: 'segment-upgrade-analysis',
    fieldName: 'Upgrade Timing by Customer Segment',
    instruction: 'Comparison of upgrade patterns across different customer segments (Startup, SMB, Enterprise). Shows which customer types upgrade fastest and their relative upgrade rates.'
  },
  {
    id: 'upgrade-journey-table',
    fieldName: 'Customer Upgrade Journey Details',
    instruction: 'Detailed table of individual customer upgrade timelines showing initial dates, upgrade dates, days to upgrade, and plan transitions. Provides granular insights into upgrade behavior.'
  },
  {
    id: 'upgrade-insights',
    fieldName: 'Time to Upgrade Key Insights',
    instruction: 'Strategic insights and recommendations based on upgrade timing analysis, highlighting successful patterns and opportunities for improvement in upgrade conversion strategies.'
  },

  // Renewal Performance Report Help Items
  {
    id: 'renewal-performance-report',
    fieldName: 'Renewal Performance Report',
    instruction: 'Comprehensive analysis of subscription renewal rates, campaign effectiveness, and renewal performance across different customer segments and renewal types.'
  },
  {
    id: 'first-time-renewals',
    fieldName: 'First-Time Renewals',
    instruction: 'Performance metrics for customers renewing their subscriptions for the first time. These customers typically have different renewal patterns and may need specialized retention strategies.'
  },
  {
    id: 'multi-time-renewals',
    fieldName: 'Multi-Time Renewals',
    instruction: 'Performance metrics for customers who have renewed multiple times. These loyal customers generally have higher renewal rates and represent stable revenue streams.'
  },
  {
    id: 'auto-renewals',
    fieldName: 'Auto-Renewals',
    instruction: 'Metrics for subscriptions that renew automatically without customer intervention. Auto-renewals typically have higher success rates and reduce operational overhead.'
  },
  {
    id: 'manual-renewals',
    fieldName: 'Manual Renewals',
    instruction: 'Metrics for subscriptions requiring active customer decision to renew. These renewals need more attention and often benefit from targeted campaigns and outreach.'
  },
  {
    id: 'renewal-trends',
    fieldName: 'Renewal Rate Trends',
    instruction: 'Monthly trend analysis showing how renewal rates change over time for different renewal types. Helps identify seasonal patterns and the impact of retention initiatives.'
  },
  {
    id: 'renewal-campaigns',
    fieldName: 'Campaign Performance Analysis',
    instruction: 'Detailed analysis of renewal campaign effectiveness across different channels including email, direct mail, phone calls, SMS, and in-app notifications.'
  },
  {
    id: 'subscription-renewal-report',
    fieldName: 'Subscription Renewal Report',
    instruction: 'Comprehensive analysis of subscription renewal performance and trends. Track renewal completion rates, MRR retention, and identify high-value renewal opportunities to optimize revenue retention strategies.'
  },
  {
    id: 'renewal-completion-rate',
    fieldName: 'Renewal Completion Rate',
    instruction: 'Percentage of renewals completed successfully out of total renewals due in the period. A key indicator of customer retention effectiveness and renewal process efficiency.'
  },
  {
    id: 'mrr-retained',
    fieldName: 'MRR Retained',
    instruction: 'Total monthly recurring revenue successfully retained from completed renewals. This metric shows the direct financial impact of successful renewal efforts on your subscription revenue.'
  },
  {
    id: 'pending-renewals',
    fieldName: 'Pending Renewals',
    instruction: 'Number of customers with renewals approaching or overdue, representing MRR at risk. Focus on these accounts for proactive retention outreach and renewal acceleration.'
  },
  {
    id: 'net-mrr-impact',
    fieldName: 'Net MRR Impact',
    instruction: 'Net change in monthly recurring revenue from renewal activities, including expansions, flat renewals, downgrades, and lost renewals. Positive values indicate overall revenue growth from renewal activities.'
  },
  {
    id: 'renewal-account-details',
    fieldName: 'Renewal Account Details',
    instruction: 'Detailed breakdown of individual renewal accounts showing customer information, renewal dates, revenue impact, and renewal outcomes. Use this data to identify patterns and optimize renewal strategies.'
  },
  {
    id: 'renewal-analysis-summary',
    fieldName: 'Renewal Analysis Summary',
    instruction: 'Strategic insights and recommendations based on renewal performance data, including key findings about what drives successful renewals and areas for improvement.'
  },
  {
    id: 'auto-vs-manual-renewals',
    fieldName: 'Auto vs Manual Renewal Comparison',
    instruction: 'Visual comparison of renewal success rates between automated and manual renewal processes. Shows the significant performance difference and helps identify opportunities to increase automation adoption.'
  },

  // Deferred Revenue Report Help Items
  {
    id: 'deferred-revenue-report',
    fieldName: 'Deferred Revenue Report',
    instruction: 'Comprehensive analysis of deferred revenue tracking, recognition schedules, and revenue realization patterns. Essential for financial reporting and revenue forecasting.'
  },
  {
    id: 'current-deferred-revenue',
    fieldName: 'Current Deferred Revenue',
    instruction: 'Total revenue received but not yet recognized according to revenue recognition standards. This represents cash collected in advance that will be recognized as revenue over time.'
  },
  {
    id: 'total-recognized-revenue',
    fieldName: 'Recognized Revenue',
    instruction: 'Revenue that has been officially recognized in accounting records according to contract terms and revenue recognition principles. This is the portion that counts toward current period earnings.'
  },
  {
    id: 'recognition-rate',
    fieldName: 'Recognition Rate',
    instruction: 'Percentage of total deferred revenue that has been recognized to date. This metric helps track progress through contract terms and revenue realization timing.'
  },
  {
    id: 'active-contracts-count',
    fieldName: 'Active Contracts',
    instruction: 'Number of subscription contracts currently being tracked for revenue recognition. Each contract represents a stream of future revenue to be recognized over time.'
  },
  {
    id: 'deferred-growth',
    fieldName: 'Deferred Growth',
    instruction: 'Month-over-month percentage change in total deferred revenue balance. Positive growth indicates increasing advance payments and future revenue commitments.'
  },
  {
    id: 'revenue-trends-chart',
    fieldName: 'Deferred vs Recognized Revenue Trends',
    instruction: 'Monthly trend comparison of deferred and recognized revenue over time. Shows the relationship between cash collection and revenue recognition patterns.'
  },
  {
    id: 'customer-schedules-table',
    fieldName: 'Customer Revenue Schedules',
    instruction: 'Detailed table of individual customer contracts showing recognition schedules, remaining deferred amounts, and monthly recognition patterns. Essential for contract-level revenue tracking.'
  },

  // Logo Retention Report Help Items
  {
    id: 'logo-retention-rate',
    fieldName: 'Logo Retention Rate',
    instruction: 'Percentage of customers (logos) that remained active over a specific period. This metric tracks customer count retention regardless of revenue changes, providing insights into customer loyalty and satisfaction.'
  },
  {
    id: 'active-logos',
    fieldName: 'Active Logos',
    instruction: 'Total number of active customer accounts (logos) currently subscribed to your services. This represents your entire customer base count at a point in time.'
  },
  {
    id: 'logos-retained',
    fieldName: 'Logos Retained',
    instruction: 'Number of existing customers who continued their subscriptions during the period. This metric shows successful retention efforts and customer satisfaction levels.'
  },
  {
    id: 'logos-lost',
    fieldName: 'Logos Lost',
    instruction: 'Number of customers who churned or cancelled their subscriptions during the period. This metric helps identify retention challenges and customer satisfaction issues.'
  },
  {
    id: 'logo-retention-by-segment',
    fieldName: 'Logo Retention by Segment, Cohort & Tenure',
    instruction: 'Detailed breakdown of customer retention rates across different customer segments, acquisition cohorts, and tenure periods. Helps identify which customer groups have the strongest or weakest retention patterns.'
  },
  {
    id: 'logo-retention-analysis',
    fieldName: 'Logo Retention Analysis',
    instruction: 'Strategic insights and recommendations based on customer retention patterns, highlighting successful retention factors and areas requiring improvement in customer success strategies.'
  },

  // Top Customer Revenue Report Help Items
  {
    id: 'top-10-percent-revenue-share',
    fieldName: 'Top 10% Revenue Share',
    instruction: 'Percentage of total revenue generated by the top 10% highest paying customers. This metric indicates revenue concentration and dependency on key accounts for business stability.'
  },
  {
    id: 'top-10-percent-count',
    fieldName: 'Top 10% Count',
    instruction: 'Number of customers that make up the top 10% revenue contributors. Shows the absolute count of your highest value customer segment for focused account management.'
  },
  {
    id: 'average-mrr-top-10',
    fieldName: 'Average MRR (Top 10%)',
    instruction: 'Average monthly recurring revenue per customer in the top 10% revenue segment. Indicates the typical value of your most important customer accounts.'
  },
  {
    id: 'total-revenue-top-customers',
    fieldName: 'Total Revenue',
    instruction: 'Total monthly recurring revenue across all customer accounts. Represents the complete revenue base for understanding concentration and distribution patterns.'
  },
  {
    id: 'revenue-concentration-analysis',
    fieldName: 'Revenue Concentration Analysis',
    instruction: 'Breakdown of revenue distribution across top customer tiers (1%, 5%, 10%). Helps assess business risk from customer concentration and identify diversification opportunities.'
  },
  {
    id: 'top-customers-by-mrr',
    fieldName: 'Top Customers by MRR',
    instruction: 'Detailed list of highest revenue customers with segment, plan, tenure, and expansion history. Essential for account management prioritization and retention strategies.'
  },
  {
    id: 'revenue-concentration-insights',
    fieldName: 'Revenue Concentration Insights',
    instruction: 'Strategic analysis and recommendations for managing revenue concentration risk while maximizing value from top customer relationships and growth opportunities.'
  },

  // Lifetime Value Report Help Items
  {
    id: 'average-ltv',
    fieldName: 'Average LTV',
    instruction: 'Average customer lifetime value across all channels and subscription types. This metric represents the total revenue expected from a typical customer throughout their relationship with your business.'
  },
  {
    id: 'total-customers-ltv',
    fieldName: 'Total Customers',
    instruction: 'Total number of active subscribers included in the lifetime value analysis. This represents your current customer base used for LTV calculations and projections.'
  },
  {
    id: 'avg-lifespan',
    fieldName: 'Average Lifespan',
    instruction: 'Average duration in months that customers remain subscribed before churning. Longer lifespans directly correlate with higher lifetime values and better customer satisfaction.'
  },
  {
    id: 'total-revenue-ltv',
    fieldName: 'Total Revenue',
    instruction: 'Total lifetime value across all customers, representing the complete revenue potential of your current customer base. This metric helps assess overall business value and growth potential.'
  },
  {
    id: 'ltv-by-acquisition-channel',
    fieldName: 'Lifetime Value by Acquisition Channel',
    instruction: 'Comparison of customer lifetime values across different acquisition channels with ROI analysis. Identifies which channels bring the most valuable long-term customers for optimized marketing spend.'
  },
  {
    id: 'ltv-by-subscription-format',
    fieldName: 'LTV by Subscription Format',
    instruction: 'Breakdown of lifetime values by subscription format (print, digital, bundled). Shows which product offerings generate the highest customer value and retention rates.'
  },
  {
    id: 'ltv-by-term-length',
    fieldName: 'LTV by Term Length',
    instruction: 'Analysis of how subscription term length affects lifetime value and retention. Longer-term subscriptions typically show higher LTV due to reduced churn and commitment levels.'
  },
  {
    id: 'ltv-trends-over-time',
    fieldName: 'LTV Trends Over Time',
    instruction: 'Monthly trend analysis of average lifetime values to track changes in customer value and retention patterns. Helps identify seasonal variations and the impact of business initiatives.'
  },
  {
    id: 'key-ltv-insights',
    fieldName: 'Key LTV Insights',
    instruction: 'Strategic insights about customer lifetime value patterns, highest-performing channels, format preferences, and actionable recommendations for improving customer value and retention.'
  },

  // Customer Churn Report Help Items
  {
    id: 'monthly-churn-rate',
    fieldName: 'Monthly Churn Rate',
    instruction: 'Percentage of customers who cancelled their subscriptions during the month, indicating customer retention health. Lower churn rates suggest better customer satisfaction and product-market fit.'
  },
  {
    id: 'churned-mrr',
    fieldName: 'Churned MRR',
    instruction: 'Total monthly recurring revenue lost due to customer cancellations, showing the financial impact of churn. This metric helps quantify the revenue cost of customer attrition.'
  },
  {
    id: 'churned-customers-this-month',
    fieldName: 'Churned Customers This Month',
    instruction: 'Detailed breakdown of customers who cancelled, including reasons, tenure, and revenue impact for analysis. Use this data to identify patterns and improve retention strategies.'
  },

  // Customer Segmentation Report Help Items
  {
    id: 'customer-segmentation-report',
    fieldName: 'Customer Segmentation Report',
    instruction: 'Comprehensive analysis of customer segments by size, behavior, and lifecycle stage. Helps identify high-value customer groups and areas requiring retention focus.'
  },
  {
    id: 'total-customers-segmentation',
    fieldName: 'Total Customers',
    instruction: 'Total number of customers analyzed across all segments. This provides the overall customer base size used for segmentation analysis.'
  },
  {
    id: 'total-mrr-segmentation',
    fieldName: 'Total MRR',
    instruction: 'Total monthly recurring revenue across all customer segments. Shows the complete revenue base generated by your segmented customer portfolio.'
  },
  {
    id: 'average-arpa',
    fieldName: 'Average ARPA',
    instruction: 'Average revenue per account across all customer segments. This metric indicates the typical revenue value generated per customer relationship.'
  },
  {
    id: 'overall-churn-rate',
    fieldName: 'Overall Churn Rate',
    instruction: 'Monthly churn rate calculated across all customer segments. Provides a baseline for comparing individual segment performance against the overall business average.'
  },
  {
    id: 'mrr-by-customer-segment',
    fieldName: 'MRR by Customer Segment',
    instruction: 'Bar chart showing monthly recurring revenue distribution across different customer segments. Helps identify which segments contribute most to overall revenue performance.'
  },
  {
    id: 'detailed-segment-analysis',
    fieldName: 'Detailed Segment Analysis',
    instruction: 'Comprehensive table showing key metrics for each customer segment including customer count, MRR, ARPA, churn rates, and growth trends. Essential for identifying high-value segments and retention risks.'
  },
  {
    id: 'segmentation-insights',
    fieldName: 'Segmentation Insights',
    instruction: 'Strategic analysis highlighting high-performing customer segments and areas requiring improvement. Provides actionable recommendations for customer success and retention strategies.'
  },

  // Churn by Cohort Report Help Items
  {
    id: 'churn-by-cohort-report',
    fieldName: 'Churn by Cohort Report',
    instruction: 'Comprehensive analysis of customer retention and churn patterns by acquisition cohort. Track how different customer groups perform over time to optimize acquisition and retention strategies.'
  },
  {
    id: 'total-cohorts',
    fieldName: 'Total Cohorts',
    instruction: 'Number of active customer cohorts being tracked. Each cohort represents customers acquired during a specific time period for retention analysis.'
  },
  {
    id: 'avg-retention-rate',
    fieldName: 'Average Retention Rate',
    instruction: 'Average percentage of customers retained across all cohorts. Higher retention rates indicate better customer satisfaction and product-market fit.'
  },
  {
    id: 'best-cohort-retention',
    fieldName: 'Best Cohort Retention',
    instruction: 'Highest retention rate achieved by any customer cohort. This represents the benchmark performance for customer retention strategies.'
  },
  {
    id: 'worst-cohort-retention',
    fieldName: 'Worst Cohort Retention',
    instruction: 'Lowest retention rate among all customer cohorts. Identifies cohorts requiring immediate attention and retention intervention strategies.'
  },
  {
    id: 'avg-churn-rate',
    fieldName: 'Average Churn Rate',
    instruction: 'Average percentage of customers who churned across all cohorts. Lower churn rates indicate better customer retention and satisfaction levels.'
  },
  {
    id: 'cohort-trend',
    fieldName: 'Cohort Trend',
    instruction: 'Month-over-month trend in cohort performance showing whether retention is improving or declining. Positive trends indicate successful retention initiatives.'
  },
  {
    id: 'cohort-retention-heatmap',
    fieldName: 'Cohort Retention Heatmap',
    instruction: 'Visual matrix showing retention rates by cohort and lifecycle stage. Color-coded cells make it easy to identify high and low performing cohorts over time.'
  },
  {
    id: 'cohort-lifetime-trends',
    fieldName: 'Cohort Lifetime Trends',
    instruction: 'Line chart showing retention and churn progression over time for different cohorts. Helps identify patterns and optimal retention strategies across customer lifecycles.'
  },

  // Trial To Paid Conversion Report Help Items
  {
    id: 'trial-to-paid-conversion-report',
    fieldName: 'Trial to Paid Conversion Report',
    instruction: 'Comprehensive analysis tracking how trial users convert to paid subscriptions with revenue impact and behavioral insights across acquisition channels.'
  },
  {
    id: 'trial-total-trials',
    fieldName: 'Total Trials',
    instruction: 'Total number of trial subscriptions started during the selected period. Represents the volume of trial activity and user acquisition efforts.'
  },
  {
    id: 'trial-conversion-rate',
    fieldName: 'Conversion Rate',
    instruction: 'Percentage of trial users who convert to paid subscriptions. Higher conversion rates indicate effective trial experiences and product-market fit.'
  },
  {
    id: 'trial-avg-conversion-time',
    fieldName: 'Average Conversion Time',
    instruction: 'Average number of days from trial start to paid conversion, helping optimize trial length and follow-up timing.'
  },
  {
    id: 'trial-90day-retention',
    fieldName: '90-Day Retention',
    instruction: 'Percentage of converted trial users who remain active subscribers after 90 days, indicating long-term conversion quality.'
  },
  {
    id: 'trial-conversion-trends',
    fieldName: 'Monthly Conversion Trends',
    instruction: 'Month-by-month trial-to-paid conversion rates showing seasonal patterns and improvement trends over time.'
  },
  {
    id: 'trial-conversion-time-distribution',
    fieldName: 'Conversion Time Distribution',
    instruction: 'Breakdown of how quickly trials convert to paid subscriptions, showing optimal trial length and follow-up timing windows.'
  },
  {
    id: 'trial-conversion-by-source',
    fieldName: 'Conversion by Source',
    instruction: 'Trial conversion performance broken down by traffic source, showing which acquisition channels produce the highest-quality trial users.'
  },
  {
    id: 'trial-retention-analysis',
    fieldName: 'Retention Analysis',
    instruction: 'Long-term retention rates of converted trial users, tracking subscriber quality and lifetime value potential.'
  },
  {
    id: 'trial-details-table',
    fieldName: 'Trial Details',
    instruction: 'Detailed table of individual trial subscriptions showing conversion status, timing, source, and customer information.'
  },
  {
    id: 'trial-key-insights',
    fieldName: 'Key Insights',
    instruction: 'Summary of key performance insights including conversion rates, optimal timing, retention metrics, and best-performing sources.'
  },
  {
    id: 'total-conversions',
    fieldName: 'Total Conversions',
    instruction: 'Number of trials that successfully converted to paid subscriptions. This metric shows the absolute success of trial conversion efforts.'
  },
  {
    id: 'total-trial-revenue',
    fieldName: 'Total Trial Revenue',
    instruction: 'Total revenue generated from converted trial users. Shows the direct financial impact of trial conversion programs on business growth.'
  },
  {
    id: 'trial-conversion-by-channel',
    fieldName: 'Trial Conversion Rate by Channel',
    instruction: 'Bar chart showing conversion rates across different acquisition channels. Identifies which channels deliver the highest quality trial users for optimization.'
  },
  {
    id: 'trial-conversion-details',
    fieldName: 'Trial Conversion Details',
    instruction: 'Detailed table of individual trial performance with behavior scores and conversion outcomes. Essential for understanding user engagement patterns and conversion factors.'
  },

  // Sales Funnel Conversion Report Help Items
  {
    id: 'sales-funnel-total-prospects',
    fieldName: 'Total Prospects',
    instruction: 'Total number of prospects entering the sales funnel during the analyzed period. This represents the top of your funnel.'
  },
  {
    id: 'sales-funnel-overall-conversion',
    fieldName: 'Overall Conversion Rate',
    instruction: 'Percentage of prospects that convert to closed won deals. This is your end-to-end funnel efficiency.'
  },
  {
    id: 'sales-funnel-active-opportunities',
    fieldName: 'Active Opportunities',
    instruction: 'Current number of opportunities in your sales pipeline across all stages.'
  },
  {
    id: 'sales-funnel-pipeline-value',
    fieldName: 'Pipeline Value',
    instruction: 'Total monetary value of all active opportunities in your sales pipeline.'
  },
  {
    id: 'sales-funnel-conversion-rates',
    fieldName: 'Sales Funnel Conversion Rates',
    instruction: 'Visualization showing conversion rates between each stage of your sales funnel, helping identify bottlenecks.'
  },
  {
    id: 'sales-funnel-opportunities-table',
    fieldName: 'Active Opportunities by Stage',
    instruction: 'Detailed breakdown of individual opportunities with metrics like deal size, probability, and age in stage.'
  },

  // Active Subscriber Summary Report Help Items
  {
    id: 'active-subscribers-by-type',
    fieldName: 'By Subscription Type',
    instruction: 'Breakdown of active subscribers by subscription type: Paid (revenue generating), Comp (complimentary), and Trial (evaluation period).'
  },
  {
    id: 'active-subscribers-by-format',
    fieldName: 'By Format',
    instruction: 'Distribution of subscribers by delivery format: Print (physical), Digital (online access), and Combo (print + digital).'
  },
  {
    id: 'active-subscribers-by-source',
    fieldName: 'By Source',
    instruction: 'Active subscribers grouped by their original acquisition channel or marketing source.'
  },
  {
    id: 'active-subscribers-by-renewal',
    fieldName: 'By Auto-Renewal',
    instruction: 'Breakdown showing how many subscribers have automatic renewal enabled versus manual renewal.'
  },
  {
    id: 'active-subscribers-detailed-breakdown',
    fieldName: 'Detailed Breakdown',
    instruction: 'Comprehensive table showing subscriber counts and percentages across all format categories.'
  },

  // Complimentary Subscriptions Report Help Items
  {
    id: 'complimentary-total-subscriptions',
    fieldName: 'Total Complimentary',
    instruction: 'Total number of active complimentary subscriptions across all qualification types. These are non-revenue generating subscriptions provided for business purposes.'
  },
  {
    id: 'complimentary-bpa-qualified',
    fieldName: 'BPA Qualified',
    instruction: 'Number of complimentary subscribers who meet Business Publications Audit (BPA) qualification standards for verified professional readership.'
  },
  {
    id: 'complimentary-high-engagement',
    fieldName: 'High Engagement',
    instruction: 'Count of complimentary subscribers with high engagement scores, indicating active readership and potential conversion value.'
  },
  {
    id: 'complimentary-avg-engagement',
    fieldName: 'Average Engagement Score',
    instruction: 'Average engagement score across all complimentary subscribers, measured on a scale of 1-10 based on reading behavior and interaction patterns.'
  },
  {
    id: 'complimentary-by-qualification',
    fieldName: 'Subscriptions by Qualification Type',
    instruction: 'Distribution of complimentary subscriptions across different qualification categories such as BPA Qualified, Industry VIP, Academic, and Media Exchange.'
  },
  {
    id: 'complimentary-engagement-levels',
    fieldName: 'Engagement Levels',
    instruction: 'Breakdown of subscriber engagement levels from Low to Very High, helping identify the most valuable complimentary subscribers for potential conversion.'
  },
  {
    id: 'complimentary-subscription-details',
    fieldName: 'Complimentary Subscription Details',
    instruction: 'Detailed table of individual complimentary subscribers with qualification type, source, engagement metrics, and current status for account management.'
  },

  // Customer Health Report Help Items
  {
    id: 'customer-health-avg-score',
    fieldName: 'Average Health Score',
    instruction: 'Overall average health score across all customers, calculated based on usage patterns, engagement levels, support interactions, and account activity.'
  },
  {
    id: 'customer-health-distribution',
    fieldName: 'Health Distribution',
    instruction: 'Breakdown of customers across health tiers: Healthy (7-10 score), At Risk (4-6 score), and Critical (1-3 score) for targeted intervention strategies.'
  },
  {
    id: 'customer-health-chart',
    fieldName: 'Customer Health Distribution Chart',
    instruction: 'Visual representation of customer health distribution with percentage breakdown across healthy, at-risk, and critical tiers.'
  },
  {
    id: 'customer-health-details',
    fieldName: 'Customer Health Details',
    instruction: 'Individual customer health metrics including last login, usage trends, health scores, risk factors, and assigned account managers for proactive management.'
  },

  // Geographic Distribution Report Help Items
  {
    id: 'geographic-total-subscribers',
    fieldName: 'Total Subscribers',
    instruction: 'Total number of active subscribers across all geographic regions, providing the overall scope of geographic distribution analysis.'
  },
  {
    id: 'geographic-countries-covered',
    fieldName: 'Countries Covered',
    instruction: 'Number of countries with active subscribers, indicating the global reach and international market penetration of your publications.'
  },
  {
    id: 'geographic-avg-delivery-cost',
    fieldName: 'Average Delivery Cost',
    instruction: 'Average cost per delivery across all geographic regions, helping optimize distribution costs and pricing strategies for different markets.'
  },
  {
    id: 'geographic-top-zip-areas',
    fieldName: 'Top ZIP Areas',
    instruction: 'Number of high-density ZIP code areas with significant subscriber concentrations, useful for targeted marketing and efficient distribution planning.'
  },
  {
    id: 'geographic-by-country',
    fieldName: 'Subscribers by Country',
    instruction: 'Detailed breakdown of subscriber distribution by country including print vs digital split, delivery costs, and percentage of total subscriber base.'
  },
  {
    id: 'geographic-by-state',
    fieldName: 'Subscribers by State/Region',
    instruction: 'Regional distribution analysis within countries showing state-level subscriber counts and format preferences for regional targeting strategies.'
  },
  {
    id: 'geographic-by-zipcode',
    fieldName: 'Top ZIP Code Areas',
    instruction: 'Analysis of highest-concentration ZIP codes with subscriber counts and format breakdown for micro-targeting and local market optimization.'
  },

  // Issue Fulfillment Report Help Items
  {
    id: 'fulfillment-total-issues',
    fieldName: 'Total Issues',
    instruction: 'Total number of issues processed for fulfillment across all subscriptions and publication schedules during the selected period.'
  },
  {
    id: 'fulfillment-delivered-issues',
    fieldName: 'Delivered Issues',
    instruction: 'Number of issues successfully delivered to subscribers, representing successful fulfillment operations and customer satisfaction.'
  },
  {
    id: 'fulfillment-pending-issues',
    fieldName: 'Pending Issues',
    instruction: 'Number of issues currently in the fulfillment pipeline awaiting processing, printing, or delivery to subscribers.'
  },
  {
    id: 'fulfillment-failed-deliveries',
    fieldName: 'Failed Deliveries',
    instruction: 'Number of delivery failures due to address issues, postal problems, or other fulfillment challenges requiring resolution.'
  },

  // Net Revenue Retention Report Help Items
  {
    id: 'net-revenue-retention-rate',
    fieldName: 'Net Revenue Retention Rate',
    instruction: 'Percentage of revenue retained from existing customers including expansions minus churn. Values above 100% indicate net revenue growth from the existing customer base.'
  },
  {
    id: 'revenue-retention-trends',
    fieldName: 'Revenue Retention Trends',
    instruction: 'Monthly trend analysis of net revenue retention rates showing seasonal patterns and the impact of retention and expansion initiatives over time.'
  },

  // New Acquisition Report Help Items
  {
    id: 'new-acquisition-metrics',
    fieldName: 'New Acquisition Metrics',
    instruction: 'Key metrics tracking new customer acquisition including total new subscribers, acquisition costs, channel performance, and conversion rates.'
  },
  {
    id: 'acquisition-by-channel',
    fieldName: 'Acquisition by Channel',
    instruction: 'Breakdown of new customer acquisitions by marketing channel, showing which channels are most effective for driving new subscriber growth.'
  },

  // Payment Method Behavior Report Help Items
  {
    id: 'payment-method-distribution',
    fieldName: 'Payment Method Distribution',
    instruction: 'Distribution of subscribers across different payment methods (credit card, bank transfer, digital wallets) with success rates and preferences.'
  },
  {
    id: 'payment-behavior-analysis',
    fieldName: 'Payment Behavior Analysis',
    instruction: 'Analysis of payment behavior patterns including success rates, failure reasons, and retry patterns for different payment methods.'
  },

  // Revenue by Region Channel Report Help Items
  {
    id: 'revenue-by-region-breakdown',
    fieldName: 'Revenue by Region Breakdown',
    instruction: 'Geographic revenue distribution showing which regions contribute most to overall revenue and their growth patterns over time.'
  },
  {
    id: 'regional-channel-performance',
    fieldName: 'Regional Channel Performance',
    instruction: 'Analysis of marketing channel effectiveness by geographic region, identifying which channels work best in specific markets.'
  },

  // Revenue by Subscription Type Report Help Items
  {
    id: 'revenue-by-subscription-type',
    fieldName: 'Revenue by Subscription Type',
    instruction: 'Revenue breakdown across different subscription types (print, digital, combo) showing contribution percentages and growth trends.'
  },
  {
    id: 'subscription-type-trends',
    fieldName: 'Subscription Type Trends',
    instruction: 'Monthly trends showing how revenue distribution changes across subscription types, indicating customer format preferences and market shifts.'
  },

  // Source Promo Performance Report Help Items
  {
    id: 'source-promo-performance',
    fieldName: 'Source Promo Performance',
    instruction: 'Performance analysis of promotional campaigns and traffic sources, measuring conversion rates, customer quality, and ROI by source.'
  },
  {
    id: 'promo-conversion-rates',
    fieldName: 'Promotion Conversion Rates',
    instruction: 'Conversion rates by promotional campaign showing which offers and messaging resonate best with target audiences.'
  },

  // Subscriber Demographic Report Help Items
  {
    id: 'subscriber-demographics-overview',
    fieldName: 'Subscriber Demographics Overview',
    instruction: 'Comprehensive demographic breakdown of subscriber base including age distribution, gender, income levels, education, and geographic concentration.'
  },
  {
    id: 'demographic-segmentation',
    fieldName: 'Demographic Segmentation',
    instruction: 'Detailed segmentation analysis showing how different demographic groups engage with content and their subscription preferences.'
  },

  // Subscriber Growth Over Time Report Help Items
  {
    id: 'subscriber-growth-current-active',
    fieldName: 'Current Active Subscribers',
    instruction: 'Total number of currently active subscribers across all products and subscription types as of the current reporting period.'
  },
  {
    id: 'subscriber-growth-net-monthly',
    fieldName: 'Net Growth (Monthly)',
    instruction: 'Net change in subscriber count for the current month, calculated as new subscriptions minus cancellations and expirations.'
  },
  {
    id: 'subscriber-growth-churn-rate',
    fieldName: 'Current Churn Rate',
    instruction: 'Percentage of subscribers who cancelled or expired their subscriptions in the current month relative to the total active base.'
  },
  {
    id: 'subscriber-growth-yoy',
    fieldName: 'Year-over-Year Growth',
    instruction: 'Percentage change in total active subscribers compared to the same month in the previous year, showing annual growth trends.'
  },
  {
    id: 'subscriber-growth-trends',
    fieldName: 'Subscriber Growth Trends',
    instruction: 'Monthly and quarterly subscriber growth patterns showing net additions, churn impact, and overall growth trajectory over time.'
  },
  {
    id: 'subscriber-growth-activity-breakdown',
    fieldName: 'Monthly Activity Breakdown',
    instruction: 'Detailed breakdown of subscriber activity including new starts, renewals, reactivations, and expirations for recent months.'
  },
  {
    id: 'subscriber-growth-details-table',
    fieldName: 'Monthly Growth Details',
    instruction: 'Comprehensive table showing all growth metrics by month including subscriber movements, net growth calculations, and churn rates.'
  },
  {
    id: 'growth-by-segment',
    fieldName: 'Growth by Segment',
    instruction: 'Growth rate analysis by customer segment, product type, and acquisition channel to identify which areas drive sustainable growth.'
  },

  // Churn & Cancellation Analysis Report Help Items
  {
    id: 'churn-cancellation-report',
    fieldName: 'Churn & Cancellation Analysis',
    instruction: 'Comprehensive analysis of customer churn patterns, cancellation trends, and retention insights to understand why subscribers leave.'
  },
  {
    id: 'churn-total-cancellations',
    fieldName: 'Total Cancellations',
    instruction: 'Total number of subscription cancellations across all products and subscription types in the last 12 months.'
  },
  {
    id: 'churn-avg-days-to-cancel',
    fieldName: 'Average Days to Cancel',
    instruction: 'Average number of days from subscription start to cancellation, indicating customer lifetime and satisfaction levels.'
  },
  {
    id: 'churn-total-refunds',
    fieldName: 'Total Refunds',
    instruction: 'Total monetary amount refunded to cancelled subscribers and the overall refund rate percentage.'
  },
  {
    id: 'churn-early-cancellations',
    fieldName: 'Early Cancellations',
    instruction: 'Number of subscribers who cancelled within 30 days of starting their subscription, indicating onboarding or expectation issues.'
  },
  {
    id: 'churn-monthly-trend',
    fieldName: 'Monthly Cancellation Trend',
    instruction: 'Month-by-month breakdown of cancellations over the last 12 months showing seasonal patterns and trends.'
  },
  {
    id: 'churn-cancellation-reasons',
    fieldName: 'Top Cancellation Reasons',
    instruction: 'Breakdown of the most common reasons subscribers give for cancelling, helping identify areas for improvement.'
  },
  {
    id: 'churn-cancellation-details',
    fieldName: 'Recent Cancellations Details',
    instruction: 'Detailed table showing individual cancellation records with customer information, reasons, and refund details.'
  },

  // Issue Fulfillment Report
  {
    id: 'fulfillment-total-issues',
    fieldName: 'Total Issues',
    instruction: 'Total number of publication issues scheduled for delivery across all active subscriptions. This includes all issues that need to be processed and delivered to subscribers.'
  },
  {
    id: 'fulfillment-delivered-issues',
    fieldName: 'Delivered Issues',
    instruction: 'Number of issues successfully delivered to subscribers with confirmation. This represents completed fulfillment with successful delivery verification.'
  },
  {
    id: 'fulfillment-pending-issues',
    fieldName: 'Pending Issues',
    instruction: 'Issues currently in the delivery process but not yet confirmed as delivered. These are in transit or awaiting processing by fulfillment partners.'
  },
  {
    id: 'fulfillment-failed-deliveries',
    fieldName: 'Failed Deliveries',
    instruction: 'Issues that failed to deliver due to address problems, postal issues, or other delivery failures. These require investigation and potential subscriber contact.'
  },

  // Subscriber Demographic Report
  {
    id: 'demographic-largest-age-group',
    fieldName: 'Largest Age Group',
    instruction: 'The age range with the highest number of subscribers. Helps identify your primary demographic target and tailor content accordingly.'
  },
  {
    id: 'demographic-top-industry',
    fieldName: 'Top Industry',
    instruction: 'The industry sector with the most subscribers. Critical for understanding your market focus and developing industry-specific content strategies.'
  },
  {
    id: 'demographic-common-income',
    fieldName: 'Most Common Income',
    instruction: 'The income bracket representing the largest portion of your subscriber base. Essential for pricing strategies and premium content positioning.'
  },
  {
    id: 'demographic-behavioral-tag',
    fieldName: 'Top Behavioral Tag',
    instruction: 'The most prevalent behavioral characteristic among subscribers. Indicates primary engagement patterns and content preferences.'
  },
  {
    id: 'demographic-age-distribution',
    fieldName: 'Age Distribution',
    instruction: 'Breakdown of subscribers across different age ranges. Use this data to tailor content tone, topics, and marketing approaches to your audience demographics.'
  },
  {
    id: 'demographic-gender-distribution',
    fieldName: 'Gender Distribution',
    instruction: 'Gender composition of your subscriber base. Helps inform content creation, marketing messaging, and product development decisions.'
  },
  {
    id: 'demographic-job-titles',
    fieldName: 'Top Job Titles',
    instruction: 'Most common professional roles among subscribers. Essential for B2B content strategy and understanding decision-making hierarchies in your audience.'
  },
  {
    id: 'demographic-industry-breakdown',
    fieldName: 'Industry Breakdown',
    instruction: 'Detailed analysis of subscriber distribution across industry sectors, including growth rates and average income levels by industry.'
  },
  {
    id: 'demographic-income-analysis',
    fieldName: 'Income Bracket Analysis',
    instruction: 'Comprehensive view of subscriber income distribution, subscription preferences by income level, and lifetime value patterns.'
  },
  {
    id: 'demographic-behavioral-segmentation',
    fieldName: 'Behavioral Segmentation',
    instruction: 'Subscriber groups based on engagement patterns, content preferences, and behavioral characteristics. Use for targeted content and retention strategies.'
  },
  {
    id: 'demographic-subscriber-profiles',
    fieldName: 'Sample Subscriber Profiles',
    instruction: 'Representative subscriber profiles showing demographic, professional, and behavioral characteristics. Provides concrete examples for persona development and marketing strategies.'
  },

  // Complimentary Subscriptions Report
  {
    id: 'complimentary-total-subscriptions',
    fieldName: 'Total Complimentary',
    instruction: 'Total number of active complimentary subscriptions across all qualification types. These are non-paid subscriptions provided for strategic value.'
  },
  {
    id: 'complimentary-bpa-qualified',
    fieldName: 'BPA Qualified',
    instruction: 'Number of complimentary subscriptions that meet Business Publication Audit (BPA) qualification criteria for verified professional readership.'
  },
  {
    id: 'complimentary-high-engagement',
    fieldName: 'High Engagement',
    instruction: 'Count of complimentary subscribers with high engagement scores, indicating active and valuable readership despite non-paid status.'
  },
  {
    id: 'complimentary-avg-engagement',
    fieldName: 'Average Engagement Score',
    instruction: 'Average engagement score across all complimentary subscribers on a scale of 1-10, measuring interaction level and content consumption.'
  },
  {
    id: 'complimentary-by-qualification',
    fieldName: 'Subscriptions by Qualification Type',
    instruction: 'Distribution of complimentary subscriptions across different qualification categories (BPA Qualified, Industry VIP, Academic, Media Exchange, etc.).'
  },
  {
    id: 'complimentary-engagement-levels',
    fieldName: 'Engagement Levels',
    instruction: 'Breakdown of complimentary subscribers by their engagement level classification (Very High, High, Medium, Low) based on reading behavior.'
  },
  {
    id: 'complimentary-subscription-details',
    fieldName: 'Complimentary Subscription Details',
    instruction: 'Detailed table showing individual complimentary subscriptions with subscriber information, qualification types, engagement metrics, and subscription sources.'
  },

  // Gift Subscriptions Report
  {
    id: 'gift-total-subscriptions',
    fieldName: 'Total Gift Subscriptions',
    instruction: 'Total number of gift subscriptions purchased across all time periods. This includes both activated and unactivated gift subscriptions.'
  },
  {
    id: 'gift-active-gifts',
    fieldName: 'Active Gifts',
    instruction: 'Number of gift subscriptions currently active and being delivered to recipients. This represents gifts that have been activated and are in use.'
  },
  {
    id: 'gift-conversion-rate',
    fieldName: 'Conversion Rate',
    instruction: 'Percentage of gift recipients who converted to paid subscriptions after their gift period ended. High conversion rates indicate satisfied gift recipients.'
  },
  {
    id: 'gift-revenue',
    fieldName: 'Gift Revenue',
    instruction: 'Total revenue generated from gift subscription purchases. This represents direct sales from gift purchasers, not recipient conversions.'
  },
  {
    id: 'gift-subscription-status',
    fieldName: 'Gift Subscription Status',
    instruction: 'Distribution of gift subscriptions by their current status: Active, Expired, Converted, or Pending Activation. Shows the lifecycle state of all gifts.'
  },
  {
    id: 'gift-monthly-trends',
    fieldName: 'Monthly Gift Trends',
    instruction: 'Month-by-month analysis of gift subscription purchases and recipient conversions. Reveals seasonal patterns and growth trends in gift giving.'
  },
  {
    id: 'gift-subscription-types',
    fieldName: 'Gift Subscription Types',
    instruction: 'Breakdown of gift subscriptions by subscription type (Digital, Print, Hybrid) showing count and average value for each category.'
  },

  // Subscription Aging Report Help Items
  {
    id: 'subscription-aging-report',
    fieldName: 'Subscription Aging Report',
    instruction: 'Comprehensive analysis of subscription expiration timeline and renewal requirements. This report helps identify subscriptions requiring attention and ensures proactive renewal management.'
  },
  {
    id: 'expiring-30-days',
    fieldName: 'Expiring in 30 Days',
    instruction: 'Subscriptions that will expire within the next 30 days. These require immediate attention for renewal processing and customer retention efforts.'
  },
  {
    id: 'expiring-60-days',
    fieldName: 'Expiring in 60 Days',
    instruction: 'Subscriptions expiring within 31-60 days. This provides a window for proactive renewal outreach and preparation of renewal materials.'
  },
  {
    id: 'expiring-90-days',
    fieldName: 'Expiring in 90 Days',
    instruction: 'Subscriptions expiring within 61-90 days. Early identification allows for strategic renewal planning and relationship building activities.'
  },
  {
    id: 'expiration-timeline-distribution',
    fieldName: 'Expiration Timeline Distribution',
    instruction: 'Chart showing the distribution of subscriptions across different expiration time periods, broken down by auto-renewal vs manual renewal types.'
  },
  {
    id: 'subscription-aging-details',
    fieldName: 'Subscription Aging Details',
    instruction: 'Detailed table of individual subscriptions with expiration dates, auto-renewal status, and days until expiry. Enables prioritized renewal management and customer outreach.'
  },

  // Expiration Forecast Report Help Items
  {
    id: 'expiration-forecast-report',
    fieldName: 'Expiration Forecast Report',
    instruction: 'Predictive analysis of upcoming subscription expirations with actionable insights for proactive renewal management and retention strategies.'
  },
  {
    id: 'expiring-30-days-forecast',
    fieldName: 'Expiring in 30 Days',
    instruction: 'Subscriptions requiring immediate attention for renewal processing. Critical for preventing involuntary churn and maintaining revenue continuity.'
  },
  {
    id: 'expiring-60-days-forecast',
    fieldName: 'Expiring in 60 Days',
    instruction: 'Subscriptions entering the renewal planning window. Ideal timeframe for proactive engagement and renewal campaign deployment.'
  },
  {
    id: 'expiring-90-days-forecast',
    fieldName: 'Expiring in 90 Days',
    instruction: 'Subscriptions in early planning phase allowing time for strategic renewal approaches and relationship strengthening activities.'
  },
  {
    id: 'expiration-timeline-overview',
    fieldName: 'Expiration Timeline Overview',
    instruction: 'Visual breakdown of subscription expirations by time period, showing auto-renewal vs manual renewal distributions for effective resource allocation.'
  },
  {
    id: 'expiration-details-table',
    fieldName: 'Detailed Expiration List',
    instruction: 'Comprehensive table of expiring subscriptions with customer details, product information, and renewal status. Enables targeted renewal strategies and customer outreach.'
  },
  {
    id: 'expiration-action-items',
    fieldName: 'Recommended Actions',
    instruction: 'Strategic recommendations for managing expiring subscriptions based on urgency levels and renewal requirements. Provides actionable insights for retention teams.'
  },
  
  // New Acquisition Report
  {
    id: 'new-acquisition-report',
    instruction: 'New Acquisition Report provides comprehensive analysis of customer acquisition metrics, tracking new subscriptions across channels, marketing spend effectiveness, and conversion rates over time.',
    fieldName: 'New Acquisition Report'
  },
  {
    id: 'new-acquisition-metrics',
    instruction: 'Key metrics showing total new subscriptions acquired in the last 6 months, including revenue performance and conversion rates across different marketing channels.',
    fieldName: 'New Acquisition Metrics'
  },
  {
    id: 'acquisition-by-channel',
    instruction: 'Chart displaying the distribution of new customer acquisitions across different marketing channels, helping identify the most effective acquisition sources.',
    fieldName: 'Acquisition by Channel'
  },
  {
    id: 'channel-performance-breakdown',
    instruction: 'Detailed table showing performance metrics for each acquisition channel including subscriber counts, revenue, average revenue per subscriber, and relative performance rankings.',
    fieldName: 'Channel Performance Breakdown'
  },
  
  // Source/Promo Performance Report
  {
    id: 'source-promo-performance-report',
    instruction: 'Source/Promo Performance Report provides comprehensive analysis of promotional code effectiveness and marketing source attribution, tracking conversion rates, revenue impact, and channel performance.',
    fieldName: 'Source/Promo Performance Report'
  },
  {
    id: 'promo-active-codes',
    instruction: 'Number of currently active promotional codes and new codes added this month, helping track promotional campaign activity and growth.',
    fieldName: 'Active Promotional Codes'
  },
  {
    id: 'promo-total-conversions',
    instruction: 'Total number of promotional code conversions and the average conversion rate across all active promotional campaigns.',
    fieldName: 'Total Conversions'
  },
  {
    id: 'promo-total-revenue',
    instruction: 'Total revenue generated from promotional codes and the average order value for promotional conversions.',
    fieldName: 'Total Revenue'
  },
  {
    id: 'promo-avg-retention',
    instruction: '90-day retention rate for customers acquired through promotional codes, showing the long-term value of promotional campaigns.',
    fieldName: 'Average Retention'
  },
  {
    id: 'top-performing-codes',
    instruction: 'Chart showing the highest revenue-generating promotional codes, helping identify the most effective marketing campaigns and promotional strategies.',
    fieldName: 'Top Performing Codes'
  },
  {
    id: 'code-type-distribution',
    instruction: 'Pie chart displaying revenue breakdown by promotional code type (discount, free trial, bundle, loyalty), showing which promotion categories drive the most revenue.',
    fieldName: 'Code Type Distribution'
  },
  {
    id: 'monthly-performance-trend',
    instruction: 'Line chart tracking promotional campaign performance over time, showing conversion rates and revenue trends to identify seasonal patterns and campaign effectiveness.',
    fieldName: 'Monthly Performance Trend'
  },
  {
    id: 'detailed-code-performance',
    instruction: 'Comprehensive table showing individual promotional code metrics including impressions, conversions, conversion rates, revenue, average order value, and retention rates.',
    fieldName: 'Detailed Code Performance'
  },
  {
    id: 'channel-performance',
    instruction: 'Performance breakdown by marketing channel showing active codes, conversion rates, revenue, and retention metrics for each promotional distribution channel.',
    fieldName: 'Channel Performance'
  },
  {
    id: 'complimentary-filter-controls',
    fieldName: 'Filter Complimentary Subscriptions',
    instruction: 'Advanced filtering options to refine the complimentary subscriptions view by qualification type, source, engagement level, and search terms. Use these filters to identify specific subscriber segments and analyze performance patterns.'
  },
  {
    id: 'complimentary-subscription-insights',
    fieldName: 'Complimentary Subscription Insights',
    instruction: 'Strategic insights and actionable recommendations based on complimentary subscription analysis. This section provides key findings about engagement patterns, qualification effectiveness, and optimization opportunities for complimentary programs.'
  }
];
