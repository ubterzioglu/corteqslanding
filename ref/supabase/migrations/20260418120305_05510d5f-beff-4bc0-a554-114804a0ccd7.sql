ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS donation_amount numeric,
  ADD COLUMN IF NOT EXISTS donation_currency text DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS company_name text;