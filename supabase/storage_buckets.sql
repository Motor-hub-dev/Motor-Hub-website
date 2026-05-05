-- Create buckets for gallery and client images
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('client-images', 'client-images', true) ON CONFLICT DO NOTHING;

-- Public read policies
CREATE POLICY "Public Read Access for gallery-images"
ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY "Public Read Access for client-images"
ON storage.objects FOR SELECT USING (bucket_id = 'client-images');

-- Auth management policies
CREATE POLICY "Authenticated Insert Access for gallery-images"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Insert Access for client-images"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'client-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update Access for gallery-images"
ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update Access for client-images"
ON storage.objects FOR UPDATE USING (bucket_id = 'client-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete Access for gallery-images"
ON storage.objects FOR DELETE USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete Access for client-images"
ON storage.objects FOR DELETE USING (bucket_id = 'client-images' AND auth.role() = 'authenticated');
