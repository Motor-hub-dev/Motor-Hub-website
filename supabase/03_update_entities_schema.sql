-- ==============================================
-- UPDATE SCHEMAS TO INTEGRATE ADMIN UI PROPS
-- Safely add new columns to exist tables
-- ==============================================

DO $$ 
BEGIN

    -- BRANDS modifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='brands' AND column_name='logo_url') THEN
        ALTER TABLE public.brands ADD COLUMN logo_url TEXT;
    END IF;

    -- PRODUCTS modifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='name_ar') THEN
        ALTER TABLE public.products ADD COLUMN name_ar TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='description_ar') THEN
        ALTER TABLE public.products ADD COLUMN description_ar TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='origin') THEN
        ALTER TABLE public.products ADD COLUMN origin TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price_egp') THEN
        ALTER TABLE public.products ADD COLUMN price_egp NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='upon_request') THEN
        ALTER TABLE public.products ADD COLUMN upon_request BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_sold_out') THEN
        ALTER TABLE public.products ADD COLUMN is_sold_out BOOLEAN DEFAULT false;
    END IF;

END $$;
