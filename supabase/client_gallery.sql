-- Create table for satisfied clients images
CREATE TABLE IF NOT EXISTS public.client_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Basic Policies for client_images
ALTER TABLE public.client_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to client_images"
    ON public.client_images
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access to client_images"
    ON public.client_images
    FOR ALL
    USING (auth.role() = 'authenticated');
