-- Restrict INSERT to service role only (edge function uses service role)
DROP POLICY IF EXISTS "System can create matches" ON public.matches;