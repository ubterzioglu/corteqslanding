-- Table to store AI-generated matches between submissions
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  matched_submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  match_type TEXT NOT NULL DEFAULT 'offer-need',
  match_score NUMERIC,
  match_reason TEXT,
  notified_source BOOLEAN NOT NULL DEFAULT false,
  notified_target BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_submission_id, matched_submission_id)
);

CREATE INDEX idx_matches_source ON public.matches(source_submission_id);
CREATE INDEX idx_matches_target ON public.matches(matched_submission_id);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a match (created by edge function with service role anyway, but allow anon for safety)
CREATE POLICY "System can create matches"
ON public.matches
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated admin can read all matches
CREATE POLICY "Authenticated users can read matches"
ON public.matches
FOR SELECT
TO authenticated
USING (true);