-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  acquisition_channel TEXT,
  acquisition_date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'churned', 'trial', 'paused')) DEFAULT 'active',
  segment TEXT CHECK (segment IN ('SMB', 'Mid-Market', 'Enterprise', 'Startup')) DEFAULT 'SMB',
  region TEXT DEFAULT 'North America',
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100) DEFAULT 75,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  product_type TEXT CHECK (product_type IN ('Digital Only', 'Print Only', 'Print + Digital', 'Premium', 'Basic', 'Professional', 'Enterprise')) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  business_unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  subscription_start_date DATE NOT NULL,
  subscription_end_date DATE,
  status TEXT CHECK (status IN ('active', 'cancelled', 'trial', 'expired', 'paused')) DEFAULT 'active',
  monthly_revenue DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'quarterly', 'annually')) DEFAULT 'monthly',
  auto_renew BOOLEAN DEFAULT true,
  trial_end_date DATE,
  cancellation_date DATE,
  cancellation_reason TEXT,
  contract_value DECIMAL(10,2),
  payment_method TEXT DEFAULT 'credit_card',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue tracking table
CREATE TABLE revenue_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  revenue_date DATE NOT NULL,
  revenue_amount DECIMAL(10,2) NOT NULL,
  revenue_type TEXT CHECK (revenue_type IN ('new', 'expansion', 'contraction', 'churn')) DEFAULT 'new',
  churn_reason TEXT,
  expansion_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trials table
CREATE TABLE trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  trial_start_date DATE NOT NULL,
  trial_end_date DATE NOT NULL,
  trial_duration INTEGER DEFAULT 14,
  trial_status TEXT CHECK (trial_status IN ('active', 'converted', 'expired', 'cancelled')) DEFAULT 'active',
  conversion_date DATE,
  conversion_days INTEGER,
  engagement_score DECIMAL(3,1) CHECK (engagement_score >= 0 AND engagement_score <= 10),
  paid_subscription_value DECIMAL(10,2),
  retention_status_90_days TEXT CHECK (retention_status_90_days IN ('retained', 'churned')),
  total_revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Churn analysis table
CREATE TABLE churn_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  churn_date DATE NOT NULL,
  churn_reason TEXT NOT NULL,
  mrr_lost DECIMAL(10,2) NOT NULL,
  tenure_months INTEGER NOT NULL,
  recovery_opportunity TEXT CHECK (recovery_opportunity IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  last_engagement_date DATE,
  customer_segment TEXT,
  recovery_date DATE,
  recovery_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contract expansion events
CREATE TABLE contract_expansions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  original_value DECIMAL(10,2) NOT NULL,
  new_value DECIMAL(10,2) NOT NULL,
  expansion_amount DECIMAL(10,2) NOT NULL,
  expansion_percentage DECIMAL(5,2) NOT NULL,
  expansion_date DATE NOT NULL,
  expansion_type TEXT CHECK (expansion_type IN ('upsell', 'cross-sell', 'add-on', 'seat-expansion')) NOT NULL,
  account_manager TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cohort analysis table
CREATE TABLE cohort_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_month DATE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  initial_mrr DECIMAL(10,2) NOT NULL,
  month_1_retained BOOLEAN DEFAULT true,
  month_3_retained BOOLEAN,
  month_6_retained BOOLEAN,
  month_12_retained BOOLEAN,
  month_24_retained BOOLEAN,
  lifetime_value DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE churn_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_expansions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_data ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, customize based on your needs)
CREATE POLICY "Allow all operations" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON revenue_records FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON trials FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON churn_events FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON contract_expansions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON cohort_data FOR ALL USING (true);