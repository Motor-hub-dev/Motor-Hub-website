-- ==============================================
-- UPDATE SETTINGS TABLE SCHEMAS
-- Safely add the new columns to the existing table
-- ==============================================

DO $$ 
BEGIN
    -- Add hero_bg_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='hero_bg_url') THEN
        ALTER TABLE public.settings ADD COLUMN hero_bg_url TEXT;
    END IF;

    -- Add location_pin_link
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='location_pin_link') THEN
        ALTER TABLE public.settings ADD COLUMN location_pin_link TEXT;
    END IF;

    -- Add instagram_link
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='instagram_link') THEN
        ALTER TABLE public.settings ADD COLUMN instagram_link TEXT;
    END IF;

    -- Add facebook_link
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='facebook_link') THEN
        ALTER TABLE public.settings ADD COLUMN facebook_link TEXT;
    END IF;

    -- Add tiktok_link
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='tiktok_link') THEN
        ALTER TABLE public.settings ADD COLUMN tiktok_link TEXT;
    END IF;

    -- Add whatsapp_number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='whatsapp_number') THEN
        ALTER TABLE public.settings ADD COLUMN whatsapp_number TEXT;
    END IF;

    -- Add phone_number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='phone_number') THEN
        ALTER TABLE public.settings ADD COLUMN phone_number TEXT;
    END IF;
END $$;
