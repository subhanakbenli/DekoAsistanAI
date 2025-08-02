-- Add price field to designs table
-- Manual migration for price field

ALTER TABLE designs ADD COLUMN price FLOAT NULL;

-- Add comment for documentation
COMMENT ON COLUMN designs.price IS 'Fiyat limiti (TL) - kullanicinin belirttigi maksimum butce';

-- Update existing records to have NULL price (which means no limit)
-- This is safe since we're adding a nullable column

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'designs' AND column_name = 'price';
