-- Create table for main gallery images
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Basic Policies for gallery_images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to gallery_images"
    ON public.gallery_images
    FOR SELECT
    USING (true);

-- Assuming authenticated users have an admin role or similar setup.
-- We'll just allow all authenticated users to manage for simplicity in this script, similar to others.
CREATE POLICY "Allow authenticated full access to gallery_images"
    ON public.gallery_images
    FOR ALL
    USING (auth.role() = 'authenticated');
