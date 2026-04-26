
-- Add new columns for documents/CV and offers/needs free text
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS document_url text,
  ADD COLUMN IF NOT EXISTS document_name text,
  ADD COLUMN IF NOT EXISTS offers_needs text;

-- Create public storage bucket for submission documents (CV / files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submission-documents',
  'submission-documents',
  true,
  10485760, -- 10 MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies: anyone can upload and read from this bucket (anon submissions)
DROP POLICY IF EXISTS "Anyone can upload submission documents" ON storage.objects;
CREATE POLICY "Anyone can upload submission documents"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'submission-documents');

DROP POLICY IF EXISTS "Anyone can read submission documents" ON storage.objects;
CREATE POLICY "Anyone can read submission documents"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'submission-documents');
