-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- 1. BRANDS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 2. CATEGORIES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 3. PRODUCTS (VEHICLES) TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    version TEXT,
    price_usd INTEGER,
    mileage INTEGER,
    transmission TEXT,
    fuel_type TEXT,
    year INTEGER,
    description TEXT,
    image_url TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    diagnostics_url TEXT,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_spotlight BOOLEAN DEFAULT false,
    inventory_order INTEGER DEFAULT 0,
    spotlight_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 4. MESSAGES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 5. SETTINGS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    usd_to_egp_rate NUMERIC DEFAULT 50.0,
    hero_bg_url TEXT,
    map_embed_url TEXT,
    location_pin_link TEXT,
    instagram_link TEXT,
    facebook_link TEXT,
    tiktok_link TEXT,
    whatsapp_number TEXT,
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-fill settings with a default row if empty
INSERT INTO public.settings (id, usd_to_egp_rate)
VALUES (1, 50.0)
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================
-- Enable RLS on all tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon read-access to public data
CREATE POLICY "Allow public read access on brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on settings" ON public.settings FOR SELECT USING (true);

-- Allow Public/Anon users to insert messages from contact form
CREATE POLICY "Allow public insert on messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Allow admins full access (for now, globally open to public as requested for MVP dev)
CREATE POLICY "Allow dev insert/update on brands" ON public.brands USING (true) WITH CHECK (true);
CREATE POLICY "Allow dev insert/update on categories" ON public.categories USING (true) WITH CHECK (true);
CREATE POLICY "Allow dev insert/update on products" ON public.products USING (true) WITH CHECK (true);
CREATE POLICY "Allow dev insert/update on settings" ON public.settings USING (true) WITH CHECK (true);
CREATE POLICY "Allow dev select/delete messages" ON public.messages USING (true) WITH CHECK (true);

-- ==============================================
-- STORAGE BUCKETS
-- ==============================================
-- Note: It is often easier to create buckets via the Supabase Dashboard UI > Storage.
-- If running directly in SQL Editor, this inserts the buckets:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow public viewing of files in the "uploads" bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

-- Allow unauthenticated uploads for dev usage (WARNING: Open for MVP dev phase)
CREATE POLICY "Anon Insertion" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anon Update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'uploads');

CREATE POLICY "Anon Delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'uploads');
