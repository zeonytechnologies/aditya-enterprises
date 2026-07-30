-- 1. Update SKUs in the "products" table to prepend "CKP-" if not already present
UPDATE "public"."products"
SET sku = 'CKP-' || sku
WHERE sku NOT LIKE 'CKP-%';

-- 2. Update SKUs in the "product_variants" table to prepend "CKP-" if not already present
-- The NOT EXISTS clause ensures we don't hit duplicate key errors if the CKP- version was already inserted!
UPDATE "public"."product_variants" pv1
SET sku = 'CKP-' || sku
WHERE sku NOT LIKE 'CKP-%'
AND NOT EXISTS (
  SELECT 1 FROM "public"."product_variants" pv2 
  WHERE pv2.sku = 'CKP-' || pv1.sku
);

-- 3. Delete any leftover old variants that couldn't be updated because their CKP- version already existed
DELETE FROM "public"."product_variants" pv1
WHERE sku NOT LIKE 'CKP-%'
AND EXISTS (
  SELECT 1 FROM "public"."product_variants" pv2 
  WHERE pv2.sku = 'CKP-' || pv1.sku
);
