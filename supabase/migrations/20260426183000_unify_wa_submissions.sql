ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS source_external_id TEXT;

ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_source_type_check;

ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_source_type_check
  CHECK (source_type IN ('form', 'chatbot', 'wa'));

UPDATE public.submissions
SET source_type = 'chatbot'
WHERE referral_source = 'ai-chat'
  AND source_type <> 'chatbot';

CREATE UNIQUE INDEX IF NOT EXISTS submissions_source_external_unique_idx
ON public.submissions (source_type, source_external_id)
WHERE source_external_id IS NOT NULL;

INSERT INTO public.submissions (
  form_type,
  source_type,
  source_external_id,
  category,
  fullname,
  country,
  city,
  business,
  field,
  email,
  phone,
  description,
  offers_needs,
  referral_source,
  referral_code,
  whatsapp_interest,
  consent,
  status,
  created_at
)
SELECT
  'register',
  'wa',
  COALESCE(wa_id, id::text),
  category,
  COALESCE(NULLIF(TRIM(CONCAT_WS(' ', name, surname)), ''), phone, wa_id, 'WhatsApp kullanıcısı'),
  COALESCE(NULLIF(country, ''), 'Belirtilmedi'),
  COALESCE(NULLIF(city, ''), 'Belirtilmedi'),
  organization,
  COALESCE(NULLIF(occupation_interest, ''), NULLIF(organization, ''), NULLIF(funnel_interest, ''), 'WhatsApp Bot'),
  COALESCE(NULLIF(email, ''), CONCAT(COALESCE(wa_id, id::text), '@wa.local')),
  COALESCE(NULLIF(phone, ''), wa_id, ''),
  note,
  funnel_interest,
  'whatsapp',
  NULLIF(referral_code, ''),
  COALESCE(whatsapp_group_interest, true),
  COALESCE(privacy_consent, false),
  CASE WHEN registration_status = 'completed' THEN 'contacted' ELSE 'new' END,
  created_at
FROM public.wa_users
ON CONFLICT (source_type, source_external_id) WHERE source_external_id IS NOT NULL DO NOTHING;
