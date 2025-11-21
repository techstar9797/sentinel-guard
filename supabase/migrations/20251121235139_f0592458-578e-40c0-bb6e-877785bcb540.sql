-- Create cases table with tokenized PII
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_number TEXT NOT NULL UNIQUE,
  
  -- Tokenized PII (Skyflow tokens)
  name_token TEXT,
  email_token TEXT,
  address_token TEXT,
  phone_token TEXT,
  
  -- Public blockchain data (not PII)
  wallet_address TEXT NOT NULL,
  
  -- TRM risk data
  trm_risk_score NUMERIC(3,2),
  trm_risk_level TEXT,
  trm_evidence JSONB,
  
  -- Case metadata
  status TEXT NOT NULL DEFAULT 'pending',
  decision TEXT,
  priority TEXT,
  agent_version TEXT DEFAULT 'detective_v4',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo_comparison table to show with/without Skyflow
CREATE TABLE public.demo_comparison (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_name TEXT NOT NULL,
  
  -- Without Skyflow (raw PII - for demo only!)
  raw_name TEXT,
  raw_email TEXT,
  raw_address TEXT,
  raw_phone TEXT,
  
  -- With Skyflow (tokenized)
  tokenized_name TEXT,
  tokenized_email TEXT,
  tokenized_address TEXT,
  tokenized_phone TEXT,
  
  wallet_address TEXT NOT NULL,
  trm_risk_score NUMERIC(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance_metrics table
CREATE TABLE public.compliance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Tokenization coverage
  total_pii_fields INTEGER NOT NULL DEFAULT 0,
  tokenized_fields INTEGER NOT NULL DEFAULT 0,
  tokenization_percentage NUMERIC(5,2),
  
  -- Data access audit
  detokenization_requests INTEGER NOT NULL DEFAULT 0,
  analyst_access_count INTEGER NOT NULL DEFAULT 0,
  
  -- Compliance status
  gdpr_compliant BOOLEAN DEFAULT true,
  ccpa_compliant BOOLEAN DEFAULT true,
  data_residency TEXT DEFAULT 'US',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_comparison ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies (public for demo purposes)
CREATE POLICY "Allow public read access to cases" 
ON public.cases FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to cases" 
ON public.cases FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to cases" 
ON public.cases FOR UPDATE 
USING (true);

CREATE POLICY "Allow public read access to demo_comparison" 
ON public.demo_comparison FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to demo_comparison" 
ON public.demo_comparison FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read access to compliance_metrics" 
ON public.compliance_metrics FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to compliance_metrics" 
ON public.compliance_metrics FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to compliance_metrics" 
ON public.compliance_metrics FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample compliance metrics
INSERT INTO public.compliance_metrics (
  metric_date,
  total_pii_fields,
  tokenized_fields,
  tokenization_percentage,
  detokenization_requests,
  analyst_access_count,
  gdpr_compliant,
  ccpa_compliant,
  data_residency
) VALUES (
  CURRENT_DATE,
  4,
  4,
  100.00,
  12,
  3,
  true,
  true,
  'US'
);