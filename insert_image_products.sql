BEGIN;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('640dc2b7-ae3d-4c51-a30d-4d5183246ff6', 'Terminator Structure Preservative', 'terminator-structure-preservative', 'Terminator Structure Preservative', 1533.55, 2295, 1809.59, 'CKP-TERSTRPRE-5LTR', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'fa205933-da15-499d-84ca-f0b7eba630fb', 
  (SELECT id FROM public.products WHERE slug = 'terminator-structure-preservative'), 
  '5 LTR', 
  'CKP-TERSTRPRE-5LTR', 
  1533.55, 
  2295, 
  1809.59, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'fe4ea1b9-012b-49d4-aa95-e9adb641cb59', 
  (SELECT id FROM public.products WHERE slug = 'terminator-structure-preservative'), 
  '1 LTR', 
  'CKP-TERSTRPRE-1LTR', 
  325.58, 
  490, 
  384.18, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'b509d934-970d-413e-b805-a026dd02f186', 
  (SELECT id FROM public.products WHERE slug = 'terminator-structure-preservative'), 
  '500 ML', 
  'CKP-TERSTRPRE-500ML', 
  174.62, 
  265, 
  206.05, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('edf6a388-a07a-49ab-ad6d-fa170aacff09', 'Terminator Wood Preservative', 'terminator-wood-preservative', 'Terminator Wood Preservative', 282.79, 435, 333.69, 'CKP-TERWOOPRE-1LTR', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '2b05e107-81ed-4a8f-9a2c-a63c06049238', 
  (SELECT id FROM public.products WHERE slug = 'terminator-wood-preservative'), 
  '1 LTR', 
  'CKP-TERWOOPRE-1LTR', 
  282.79, 
  435, 
  333.69, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'fbc125a2-a6a8-4c34-b3fd-b8ead77bdae9', 
  (SELECT id FROM public.products WHERE slug = 'terminator-wood-preservative'), 
  '5 LTR', 
  'CKP-TERWOOPRE-5LTR', 
  1357.15, 
  2030, 
  1601.44, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '37f497ec-14e3-4353-83c1-45ad5da41651', 
  (SELECT id FROM public.products WHERE slug = 'terminator-wood-preservative'), 
  '100 ML', 
  'CKP-TERWOOPRE-100ML', 
  41.44, 
  70, 
  48.9, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '5a3f1c22-56cf-43bd-8567-2142da6c57d8', 
  (SELECT id FROM public.products WHERE slug = 'terminator-wood-preservative'), 
  '250 ML', 
  'CKP-TERWOOPRE-250ML', 
  81.54, 
  130, 
  96.22, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'f007620c-9605-4b3f-a0b5-79b399516b1e', 
  (SELECT id FROM public.products WHERE slug = 'terminator-wood-preservative'), 
  '3 LTR', 
  'CKP-TERWOOPRE-3LTR', 
  746.76, 
  1270, 
  994.46, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '70040a32-ed17-4b0e-9c1e-f9908251d94d', 
  (SELECT id FROM public.products WHERE slug = 'terminator-wood-preservative'), 
  '500 ML', 
  'CKP-TERWOOPRE-500ML', 
  154.12, 
  235, 
  181.86, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('7ebd7733-4a90-461d-898a-63e007eebce6', 'Terminator Wood Preservative Spray', 'terminator-wood-preservative-spray', 'Terminator Wood Preservative Spray', 335.3, 530, 395.65, 'CKP-TERWOOPRESPR-1LTR', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '0bbc6bb7-9c17-4b43-9088-b3d6bd55a87f', 
  (SELECT id FROM public.products WHERE slug = 'terminator-wood-preservative-spray'), 
  '1 LTR', 
  'CKP-TERWOOPRESPR-1LTR', 
  335.3, 
  530, 
  395.65, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'bbb84c8a-b348-4689-b992-89fca8c96d8c', 
  (SELECT id FROM public.products WHERE slug = 'terminator-wood-preservative-spray'), 
  '500 ML', 
  'CKP-TERWOOPRESPR-500ML', 
  200.4, 
  320, 
  236.47, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '2b099cee-c693-49b2-86ea-6e9a294f37c9', 
  (SELECT id FROM public.products WHERE slug = 'terminator-wood-preservative-spray'), 
  '320 ML', 
  'CKP-TERWOOPRESPR-320ML', 
  157, 
  250, 
  185.26, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('2fd487e7-70e5-42b7-945d-9c79e6de1dca', 'Feviseal GP', 'feviseal-gp', 'Feviseal GP', 102, 315, 120, 'CKP-FEVGP-WBC', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '0d095b21-787b-4b23-87da-4dc0d79760fe', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-gp'), 
  'W-B-C', 
  'CKP-FEVGP-WBC', 
  102, 
  315, 
  120, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('b5faef19-960d-4acb-8967-d77138d0990a', 'Feviseal GP-PRO', 'feviseal-gp-pro', 'Feviseal GP-PRO', 117, 325, 138, 'CKP-FEVGPPRO-WBC', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'f3f26d28-a8bd-415d-8232-74d963082a57', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-gp-pro'), 
  'W-B-C', 
  'CKP-FEVGPPRO-WBC', 
  117, 
  325, 
  138, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('9a0d3337-5c42-4e2c-a92b-0412c883b442', 'Feviseal Neutral PRO', 'feviseal-neutral-pro', 'Feviseal Neutral PRO', 132, 400, 156, 'CKP-FEVNEUPRO-WBC', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '162fdbf6-8370-4121-a09c-01fb331b2bd3', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-neutral-pro'), 
  'W-B-C', 
  'CKP-FEVNEUPRO-WBC', 
  132, 
  400, 
  156, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'c1510a52-ebdc-4d6d-a1f4-17dbd7b0b9fa', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-neutral-pro'), 
  'GREY', 
  'CKP-FEVNEUPRO-GREY', 
  134, 
  400, 
  158, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'b64f2a55-73fb-498a-997d-19848e969e0f', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-neutral-pro'), 
  'BROWN', 
  'CKP-FEVNEUPRO-BROWN', 
  144, 
  400, 
  170, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('c17e80ff-2802-4f35-a468-171c074fa10a', 'Feviseal Weather Proof', 'feviseal-weather-proof', 'Feviseal Weather Proof', 179, 425, 211, 'CKP-FEVWEAPRO-WBC', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '58d63041-80d2-4bdb-9c14-186fbf292500', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-weather-proof'), 
  'W-B-C', 
  'CKP-FEVWEAPRO-WBC', 
  179, 
  425, 
  211, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '42771512-b529-4c9f-a7b6-e5c53b0768ce', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-weather-proof'), 
  'GREY', 
  'CKP-FEVWEAPRO-GREY', 
  189, 
  450, 
  223, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'b4cd8664-ff84-4b62-9cff-c1285a89b213', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-weather-proof'), 
  'BROWN', 
  'CKP-FEVWEAPRO-BROWN', 
  204, 
  450, 
  241, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('ed8f6f98-3bc1-4d9d-9720-4a14f8b0fea0', 'Feviseal Multi Purpose', 'feviseal-multi-purpose', 'Feviseal Multi Purpose', 80, 250, 95, 'CKP-FEVMULPUR-WBC', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '7848d8ee-1a06-4d31-a272-359b280560e3', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-multi-purpose'), 
  'W-B-C', 
  'CKP-FEVMULPUR-WBC', 
  80, 
  250, 
  95, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('6efc079e-7247-4508-b0ef-1beeb5a76b1c', 'Feviseal B&K', 'feviseal-b-k', 'Feviseal B&K', 85, 140, 100.3, 'CKP-FEVBK-WHITE', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'd138ba0e-05e1-4e9f-9808-15c854e2d7c2', 
  (SELECT id FROM public.products WHERE slug = 'feviseal-b-k'), 
  'WHITE', 
  'CKP-FEVBK-WHITE', 
  85, 
  140, 
  100.3, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('8ab3d45a-dca9-4df5-8b02-8dd616b8a9f6', 'Fevicol Wudfill', 'fevicol-wudfill', 'Fevicol Wudfill', 84.8, 160, 101.52, 'CKP-FEVWUD-50GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'bb5ae22b-7581-4ce9-a87a-2cce0eab63c5', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-wudfill'), 
  '50 GM', 
  'CKP-FEVWUD-50GM', 
  84.8, 
  160, 
  101.52, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '78045a70-c74e-4baf-9089-f2c690a3c8fc', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-wudfill'), 
  '20 GM', 
  'CKP-FEVWUD-20GM', 
  42.4, 
  80, 
  51, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('3327c8cf-c33f-46df-9bc8-ad5a1eb739a5', 'Fevikwik 463', 'fevikwik-463', 'Fevikwik 463', 332.8, 800, 392.7, 'CKP-FEV463-250GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '0466841e-7bef-45dd-b47d-370fc2acbf7a', 
  (SELECT id FROM public.products WHERE slug = 'fevikwik-463'), 
  '250 GM', 
  'CKP-FEV463-250GM', 
  332.8, 
  800, 
  392.7, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '41045457-cb26-4b23-a692-c1e46352bfc5', 
  (SELECT id FROM public.products WHERE slug = 'fevikwik-463'), 
  '125 GM', 
  'CKP-FEV463-125GM', 
  172.88, 
  420, 
  206, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'abd7caea-a440-4b11-b0ab-1188ed43f65a', 
  (SELECT id FROM public.products WHERE slug = 'fevikwik-463'), 
  '20 GM', 
  'CKP-FEV463-20GM', 
  43.91, 
  85, 
  52.41, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('0964aba9-97c7-46d7-bffe-f36d713865b6', 'Fevikwik 203', 'fevikwik-203', 'Fevikwik 203', 88.87, 170, 106, 'CKP-FEV203-50GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'fe086798-9df4-4056-81af-d49f07c91f17', 
  (SELECT id FROM public.products WHERE slug = 'fevikwik-203'), 
  '50 GM', 
  'CKP-FEV203-50GM', 
  88.87, 
  170, 
  106, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '3f193f25-b4c5-4e6c-be58-272a1b46b0db', 
  (SELECT id FROM public.products WHERE slug = 'fevikwik-203'), 
  '20 GM', 
  'CKP-FEV203-20GM', 
  43.91, 
  85, 
  53, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('2719a8ba-a280-47fa-a358-6c8edab00a97', 'Fevicol SR 505', 'fevicol-sr-505', 'Fevicol SR 505', 7018.75, 10835, 8282, 'CKP-FEVSR505-25LT', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '8edea1ec-f160-487a-8df2-5e66b8d95d4b', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-sr-505'), 
  '25 LT', 
  'CKP-FEVSR505-25LT', 
  7018.75, 
  10835, 
  8282, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '63be31f2-efcb-4c47-9eba-ca757b700ca4', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-sr-505'), 
  '5 LT', 
  'CKP-FEVSR505-5LT', 
  1682, 
  2215, 
  1681.5, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '2c5e5897-3e0b-49de-8f98-6234f057c42c', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-sr-505'), 
  '2 LT', 
  'CKP-FEVSR505-2LT', 
  707, 
  945, 
  706.82, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'acda9f55-1432-43ac-a053-d90d8199dd3c', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-sr-505'), 
  '1 LT', 
  'CKP-FEVSR505-1LT', 
  355, 
  490, 
  355.48, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '4c55af54-3d8c-4ad0-95aa-1ef93dea6593', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-sr-505'), 
  '500 ML', 
  'CKP-FEVSR505-500ML', 
  190, 
  265, 
  189.98, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('1aa37a23-5a9f-4cbd-824d-be88325e399c', 'Ezeespray', 'ezeespray', 'Ezeespray', 440.6, 870, 520, 'CKP-EZE-500ML', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '2a6f059f-6161-4210-800d-8f503064c73d', 
  (SELECT id FROM public.products WHERE slug = 'ezeespray'), 
  '500 ML', 
  'CKP-EZE-500ML', 
  440.6, 
  870, 
  520, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('0a395d5d-a1f3-4b93-9e04-ef55171fbada', 'Edgeglok', 'edgeglok', 'Edgeglok', 75, 125, 88, 'CKP-EDG-140GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '75658eb9-bd83-4b1c-a7ff-937bdbda450b', 
  (SELECT id FROM public.products WHERE slug = 'edgeglok'), 
  '140 GM', 
  'CKP-EDG-140GM', 
  75, 
  125, 
  88, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('81d9aaa3-3694-4673-99fe-3cc7a9b0bc9f', '1K PUR', '1k-pur', '1K PUR', 336, 595, 397, 'CKP-1KPUR-500GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '4c306b3c-2ed7-4947-8f67-770b1d07d35d', 
  (SELECT id FROM public.products WHERE slug = '1k-pur'), 
  '500 GM', 
  'CKP-1KPUR-500GM', 
  336, 
  595, 
  397, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('a0603c5c-44ec-4a73-9a3c-9d431b3d3e88', 'PU Foam', 'pu-foam', 'PU Foam', 290, 1000, 342.2, 'CKP-PUFOA-720GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '2d37288f-1874-42ed-96f3-24a9c43bff95', 
  (SELECT id FROM public.products WHERE slug = 'pu-foam'), 
  '720 GM', 
  'CKP-PUFOA-720GM', 
  290, 
  1000, 
  342.2, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('0f13863b-b639-4836-a08c-4cf985577d5a', 'Powerlok', 'powerlok', 'Powerlok', 125, 330, 147, 'CKP-POW-430GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'ae623b50-e470-421b-98c2-ca05e1219e8f', 
  (SELECT id FROM public.products WHERE slug = 'powerlok'), 
  '430 GM', 
  'CKP-POW-430GM', 
  125, 
  330, 
  147, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('58c84a63-9ee2-4d5a-a73a-4403ac4ab8a5', 'Nail Free Ultra', 'nail-free-ultra', 'Nail Free Ultra', 280, 549, 330.4, 'CKP-NAIFREULT-435GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '6f141972-8a67-4bb7-b408-2e2b9d5314ee', 
  (SELECT id FROM public.products WHERE slug = 'nail-free-ultra'), 
  '435 GM', 
  'CKP-NAIFREULT-435GM', 
  280, 
  549, 
  330.4, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('f400c5f2-73c1-439c-8281-08be251f0365', 'Relam', 'relam', 'Relam', 295, 470, 348, 'CKP-REL-430GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '98126e57-d673-48b9-b174-2dab9b7cf94e', 
  (SELECT id FROM public.products WHERE slug = 'relam'), 
  '430 GM', 
  'CKP-REL-430GM', 
  295, 
  470, 
  348, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('1e386f0f-ffb8-4563-aa8d-ead308cb2f49', 'Plaatilok', 'plaatilok', 'Plaatilok', 295, 470, 348, 'CKP-PLA-430GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '06a9d515-b2d6-44cf-85e8-6d64a334ab97', 
  (SELECT id FROM public.products WHERE slug = 'plaatilok'), 
  '430 GM', 
  'CKP-PLA-430GM', 
  295, 
  470, 
  348, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('1422e87f-da81-489c-81c0-0df596d3568b', 'Xpress', 'xpress', 'Xpress', 476.46, 850, 562.22, 'CKP-XPR-500GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'd4dbf89c-1d90-4825-9593-b50d9c4849b1', 
  (SELECT id FROM public.products WHERE slug = 'xpress'), 
  '500 GM', 
  'CKP-XPR-500GM', 
  476.46, 
  850, 
  562.22, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('07dd1977-058a-4a80-9cc6-1b86984ee066', 'Fevicol X-PER', 'fevicol-x-per', 'Fevicol X-PER', 444.8, 670, 524.8, 'CKP-FEVXPER-800GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '5e450482-b3cd-4dbd-bc32-4f0016bbba7a', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-x-per'), 
  '800 GM', 
  'CKP-FEVXPER-800GM', 
  444.8, 
  670, 
  524.8, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('83ec6a86-8677-4b71-8664-18a0b812ae2c', 'Fevicol Multilock', 'fevicol-multilock', 'Fevicol Multilock', 521.6, 785, 615.4, 'CKP-FEVMUL-800GM', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '34c0fae7-1bcc-4334-a66b-56d1e1f0b4b6', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-multilock'), 
  '800 GM', 
  'CKP-FEVMUL-800GM', 
  521.6, 
  785, 
  615.4, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('6a7ebfbc-6a3b-4cf8-9cd2-f93b281fcda7', 'Fevicol Fastrak', 'fevicol-fastrak', 'Fevicol Fastrak', 5050, 8655, 5959, 'CKP-FEVFAS-25LT', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '469db9a0-ca57-468d-ba4f-9ca133b1233e', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-fastrak'), 
  '25 LT', 
  'CKP-FEVFAS-25LT', 
  5050, 
  8655, 
  5959, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('251f7b15-5dc7-431e-837e-c0567f8af8e7', 'Fevicol Bejod', 'fevicol-bejod', 'Fevicol Bejod', 1050.8, 2110, 1239, 'CKP-FEVBEJ-45LT', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '5510e7d4-299f-44b0-8c09-03c209f7768d', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-bejod'), 
  '4.5 LT', 
  'CKP-FEVBEJ-45LT', 
  1050.8, 
  2110, 
  1239, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '0c2ba503-69c0-446b-aff6-80f3e08b362a', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-bejod'), 
  '25 LT', 
  'CKP-FEVBEJ-25LT', 
  5744, 
  10695, 
  6777, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('b9821635-a5d3-4424-a191-42285c6edb97', 'Fevicol Floorfix VT', 'fevicol-floorfix-vt', 'Fevicol Floorfix VT', 1186.25, 2195, 1399.78, 'CKP-FEVFLOVT-5KG', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '8471e850-ae3d-4c6f-9b70-6deea010b610', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-floorfix-vt'), 
  '5 KG', 
  'CKP-FEVFLOVT-5KG', 
  1186.25, 
  2195, 
  1399.78, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '5f26431a-05d1-4f48-99e2-19b4953c7152', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-floorfix-vt'), 
  '20 KG', 
  'CKP-FEVFLOVT-20KG', 
  4575, 
  8100, 
  5398.5, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('8d6c582c-2db1-442a-be0e-d1db18006dcf', 'Fevicol Floorfix CP', 'fevicol-floorfix-cp', 'Fevicol Floorfix CP', 1241.25, 2315, 1464.68, 'CKP-FEVFLOCP-5KG', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'a1e4b558-5219-43e2-bfd7-fb0e433518d9', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-floorfix-cp'), 
  '5 KG', 
  'CKP-FEVFLOCP-5KG', 
  1241.25, 
  2315, 
  1464.68, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'cd519ed2-79ff-459b-8efe-a700e55be1f4', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-floorfix-cp'), 
  '10 KG', 
  'CKP-FEVFLOCP-10KG', 
  2407.5, 
  4570, 
  2840.85, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'f4d1ed25-a8b7-4dfa-913c-74f3c6dcac3d', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-floorfix-cp'), 
  '20 KG', 
  'CKP-FEVFLOCP-20KG', 
  4660, 
  8890, 
  5498.8, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('44964ef1-01f3-400d-a954-c0e78a834218', 'Woodlok Pro', 'woodlok-pro', 'Woodlok Pro', 7680, 10160, 9062.4, 'CKP-WOOPRO-60KG', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'd9968051-cd91-44f6-a440-1af668bf2ace', 
  (SELECT id FROM public.products WHERE slug = 'woodlok-pro'), 
  '60 KG', 
  'CKP-WOOPRO-60KG', 
  7680, 
  10160, 
  9062.4, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('4b265e2a-e0b5-41d3-bd97-8013b404d088', 'Fevicol 707 FW', 'fevicol-707-fw', 'Fevicol 707 FW', 6375, 10810, 7523, 'CKP-FEV707FW-25LT', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '7d5a8f22-7f5f-4021-9837-d43386b37ea3', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-707-fw'), 
  '25 LT', 
  'CKP-FEV707FW-25LT', 
  6375, 
  10810, 
  7523, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '9c648180-6a8f-4a6d-836b-e2530b936968', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-707-fw'), 
  '5 LT', 
  'CKP-FEV707FW-5LT', 
  1290, 
  2395, 
  1522, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'c1b72a7d-6635-4be5-a698-96b8b447401f', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-707-fw'), 
  '2 LT', 
  'CKP-FEV707FW-2LT', 
  533, 
  950, 
  629, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '6d512996-2187-4cdd-9787-cfd5e36191ef', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-707-fw'), 
  '1 LT', 
  'CKP-FEV707FW-1LT', 
  271, 
  505, 
  320, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '02bc48a2-5548-44f5-b572-3f555b50fc07', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-707-fw'), 
  '500 ML', 
  'CKP-FEV707FW-500ML', 
  140, 
  265, 
  165, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('3d257021-cad8-4be2-b44c-8d246725b7e0', 'Fevicol Foamfix', 'fevicol-foamfix', 'Fevicol Foamfix', 6368.75, 10950, 7515.13, 'CKP-FEVFOA-25LTR', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '254b0e1e-e8b4-4c6c-ae11-b6f9dd093889', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-foamfix'), 
  '25 LTR', 
  'CKP-FEVFOA-25LTR', 
  6368.75, 
  10950, 
  7515.13, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  'a4cbc19f-1a92-4712-8cd1-ca09e1196626', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-foamfix'), 
  '5 LTR', 
  'CKP-FEVFOA-5LTR', 
  1292.5, 
  2230, 
  1525.15, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '24b2943f-8d89-4c23-b680-3df47b9e8ae3', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-foamfix'), 
  '2 LTR', 
  'CKP-FEVFOA-2LTR', 
  535, 
  925, 
  631.3, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '178a4452-ab17-409c-8aed-1ed188b4a873', 
  (SELECT id FROM public.products WHERE slug = 'fevicol-foamfix'), 
  '1 LTR', 
  'CKP-FEVFOA-1LTR', 
  271.75, 
  485, 
  320.67, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;

COMMIT;
