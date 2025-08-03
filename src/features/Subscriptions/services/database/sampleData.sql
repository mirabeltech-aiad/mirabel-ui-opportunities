-- Insert sample products
INSERT INTO products (id, product_name, product_type, base_price, business_unit) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Digital Basic', 'Digital Only', 49.99, 'Digital Publishing'),
('550e8400-e29b-41d4-a716-446655440002', 'Print Premium', 'Print Only', 79.99, 'Print Publishing'),
('550e8400-e29b-41d4-a716-446655440003', 'Complete Bundle', 'Print + Digital', 99.99, 'Integrated Media'),
('550e8400-e29b-41d4-a716-446655440004', 'Professional Suite', 'Professional', 149.99, 'Business Solutions'),
('550e8400-e29b-41d4-a716-446655440005', 'Enterprise Plan', 'Enterprise', 299.99, 'Enterprise Solutions');

-- Insert sample customers
INSERT INTO customers (id, customer_name, email, company, acquisition_channel, acquisition_date, status, segment, region, health_score) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john.smith@techcorp.com', 'TechCorp Solutions', 'Google Ads', '2023-01-15', 'active', 'Enterprise', 'North America', 85),
('650e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah.j@innovate.com', 'Innovation Labs Inc', 'Facebook Ads', '2023-02-01', 'active', 'Mid-Market', 'North America', 78),
('650e8400-e29b-41d4-a716-446655440003', 'Michael Brown', 'mbrown@global.com', 'Global Dynamics', 'Email Campaign', '2023-02-10', 'churned', 'Enterprise', 'Europe', 45),
('650e8400-e29b-41d4-a716-446655440004', 'Lisa Wilson', 'lwilson@startup.com', 'StartupX', 'Organic Search', '2023-03-05', 'active', 'Startup', 'North America', 92),
('650e8400-e29b-41d4-a716-446655440005', 'David Garcia', 'dgarcia@enterprise.com', 'Enterprise Plus LLC', 'Referral', '2023-03-12', 'active', 'Enterprise', 'Latin America', 87),
('650e8400-e29b-41d4-a716-446655440006', 'Jennifer Martinez', 'jmartinez@midsize.com', 'MidSize Corp', 'LinkedIn Ads', '2023-04-01', 'active', 'Mid-Market', 'Europe', 82),
('650e8400-e29b-41d4-a716-446655440007', 'Robert Taylor', 'rtaylor@alphacorp.com', 'AlphaTech Industries', 'Direct Mail', '2023-04-15', 'trial', 'Enterprise', 'Asia Pacific', 75),
('650e8400-e29b-41d4-a716-446655440008', 'Emily Davis', 'edavis@beta.com', 'BetaCorp Ltd', 'Google Ads', '2023-05-01', 'active', 'SMB', 'North America', 68),
('650e8400-e29b-41d4-a716-446655440009', 'James Wilson', 'jwilson@gamma.com', 'GammaSoft Solutions', 'Social Media', '2023-05-15', 'paused', 'Mid-Market', 'Europe', 55),
('650e8400-e29b-41d4-a716-446655440010', 'Maria Rodriguez', 'mrodriguez@delta.com', 'DeltaVentures Inc', 'Email Campaign', '2023-06-01', 'active', 'Startup', 'North America', 89);

-- Insert sample subscriptions
INSERT INTO subscriptions (id, customer_id, product_id, subscription_start_date, subscription_end_date, status, monthly_revenue, billing_cycle, contract_value) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '2023-01-30', NULL, 'active', 299.99, 'monthly', 3599.88),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '2023-02-15', NULL, 'active', 149.99, 'monthly', 1799.88),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2023-02-25', '2024-03-20', 'cancelled', 79.99, 'monthly', 959.88),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2023-03-20', NULL, 'active', 49.99, 'monthly', 599.88),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '2023-03-30', NULL, 'active', 299.99, 'quarterly', 3599.88),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '2023-04-16', NULL, 'active', 99.99, 'monthly', 1199.88),
('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', '2023-04-30', '2023-05-14', 'trial', 0, 'monthly', 0),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', '2023-05-15', NULL, 'active', 49.99, 'monthly', 599.88),
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', '2023-06-01', '2024-01-15', 'paused', 149.99, 'monthly', 1799.88),
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2023-06-15', NULL, 'active', 99.99, 'monthly', 1199.88);

-- Insert revenue records for the past 12 months
INSERT INTO revenue_records (subscription_id, customer_id, product_id, revenue_date, revenue_amount, revenue_type) VALUES
-- January 2024
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '2024-01-01', 299.99, 'new'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '2024-01-01', 149.99, 'new'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01', 49.99, 'new'),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '2024-01-01', 99.99, 'new'),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01', 49.99, 'new'),
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2024-01-01', 99.99, 'new'),
-- February 2024
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '2024-02-01', 299.99, 'new'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '2024-02-01', 149.99, 'new'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2024-02-01', 49.99, 'new'),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '2024-02-01', 99.99, 'new'),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', '2024-02-01', 49.99, 'new'),
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2024-02-01', 99.99, 'new'),
-- Add expansion revenue
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '2024-02-15', 150.00, 'expansion'),
-- March 2024 (including churn)
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '2024-03-01', 449.99, 'new'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '2024-03-01', 149.99, 'new'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2024-03-01', 49.99, 'new'),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '2024-03-01', 99.99, 'new'),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', '2024-03-01', 49.99, 'new'),
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2024-03-01', 99.99, 'new'),
-- Churn event
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-03-20', -79.99, 'churn');

-- Insert trial data
INSERT INTO trials (customer_id, product_id, trial_start_date, trial_end_date, trial_duration, trial_status, conversion_date, conversion_days, engagement_score, paid_subscription_value, retention_status_90_days, total_revenue) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '2023-01-15', '2023-01-29', 14, 'converted', '2023-01-27', 12, 8.5, 299.99, 'retained', 3599.88),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '2023-02-01', '2023-02-15', 14, 'converted', '2023-02-13', 12, 7.2, 149.99, 'retained', 1799.88),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2023-02-10', '2023-02-24', 14, 'converted', '2023-02-20', 10, 6.1, 79.99, 'churned', 79.99),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2023-03-05', '2023-03-19', 14, 'converted', '2023-03-16', 11, 9.2, 49.99, 'retained', 599.88),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', '2023-04-15', '2023-04-29', 14, 'expired', NULL, NULL, 3.2, NULL, NULL, 0);

-- Insert churn events
INSERT INTO churn_events (customer_id, subscription_id, churn_date, churn_reason, mrr_lost, tenure_months, recovery_opportunity, last_engagement_date, customer_segment) VALUES
('650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', '2024-03-20', 'Competitor switch', 79.99, 13, 'Low', '2024-03-15', 'Enterprise');

-- Insert contract expansion events
INSERT INTO contract_expansions (customer_id, subscription_id, original_value, new_value, expansion_amount, expansion_percentage, expansion_date, expansion_type, account_manager) VALUES
('650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 299.99, 449.99, 150.00, 50.00, '2024-02-15', 'upsell', 'Sarah Manager'),
('650e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', 299.99, 399.99, 100.00, 33.33, '2024-01-10', 'add-on', 'Mike Sales');

-- Insert cohort data
INSERT INTO cohort_data (cohort_month, customer_id, initial_mrr, month_1_retained, month_3_retained, month_6_retained, month_12_retained, lifetime_value) VALUES
('2023-01-01', '650e8400-e29b-41d4-a716-446655440001', 299.99, true, true, true, true, 3599.88),
('2023-02-01', '650e8400-e29b-41d4-a716-446655440002', 149.99, true, true, true, true, 1799.88),
('2023-02-01', '650e8400-e29b-41d4-a716-446655440003', 79.99, true, true, true, false, 79.99),
('2023-03-01', '650e8400-e29b-41d4-a716-446655440004', 49.99, true, true, true, true, 599.88),
('2023-03-01', '650e8400-e29b-41d4-a716-446655440005', 299.99, true, true, true, true, 3599.88),
('2023-04-01', '650e8400-e29b-41d4-a716-446655440006', 99.99, true, true, true, true, 1199.88),
('2023-05-01', '650e8400-e29b-41d4-a716-446655440008', 49.99, true, true, true, null, 599.88),
('2023-06-01', '650e8400-e29b-41d4-a716-446655440010', 99.99, true, true, true, null, 1199.88);