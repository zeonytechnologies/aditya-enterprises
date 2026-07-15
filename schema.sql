-- ==========================================
-- INDUSTRIAL ADHESIVES & HARDWARE PLATFORM
-- Database Schema & Seeds (Custom Table-Based Credentials)
-- ==========================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up existing tables
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.rfqs CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Profiles Table (Holds Custom Table-based User Logins)
CREATE TABLE public.profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Plain text password for custom credentials logic
    full_name TEXT NOT NULL,
    company_name TEXT,
    gst_number TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'dealer', 'distributor', 'admin')),
    phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'India',
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Product Categories
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Product Brands
CREATE TABLE public.brands (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    catalog_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Products Table
CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    technical_description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    mrp NUMERIC(12, 2) NOT NULL,
    dealer_price NUMERIC(12, 2),
    moq INTEGER DEFAULT 1,
    stock INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE NOT NULL,
    hsn_code TEXT NOT NULL,
    gst_percent NUMERIC(5, 2) DEFAULT 18.00 NOT NULL,
    pack_size TEXT,
    weight NUMERIC(10, 2),
    shelf_life TEXT,
    application TEXT,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    specifications JSONB DEFAULT '{}'::JSONB NOT NULL,
    features TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_flash_sale BOOLEAN DEFAULT FALSE,
    discount_percent NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    tds_url TEXT,
    msds_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Orders Table
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Order Placed',
    subtotal NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    gst_amount NUMERIC(12, 2) NOT NULL,
    cgst NUMERIC(12, 2) NOT NULL,
    sgst NUMERIC(12, 2) NOT NULL,
    shipping NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    grand_total NUMERIC(12, 2) NOT NULL,
    company_name TEXT,
    gst_number TEXT,
    billing_address JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Order Items Table
CREATE TABLE public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    gst_percent NUMERIC(5, 2) NOT NULL,
    gst_amount NUMERIC(12, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL
);

-- 7. Manual Payments Table
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE NOT NULL,
    method TEXT NOT NULL,
    utr_number TEXT UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    screenshot_url TEXT,
    transaction_date DATE NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pending Verification',
    admin_remarks TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Bulk RFQs
CREATE TABLE public.rfqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    gst_number TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    requirement TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    response_quotation JSONB,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Coupons Table
CREATE TABLE public.coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_value NUMERIC(12, 2) NOT NULL,
    type TEXT NOT NULL,
    min_order_value NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Wishlists Table
CREATE TABLE public.wishlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (user_id, product_id)
);

-- 11. Product Reviews
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (user_id, product_id)
);

-- 12. Blogs Table
CREATE TABLE public.blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author TEXT NOT NULL DEFAULT 'Admin',
    tags TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. System Notifications
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    type TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) DISABLED FOR CUSTOM CREDENTIALS
-- ==========================================
-- Disabling RLS allows the frontend client to query the user table directly
-- without requiring an active Supabase Auth token session.

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;


-- ==========================================
-- SEED DATA QUERIES
-- ==========================================

-- Seeding Default Admin User
INSERT INTO public.profiles (id, email, password, full_name, role, is_approved) VALUES
('a0000000-0000-0000-0000-000000000000', 'admin@aditya.com', 'password123', 'System Administrator', 'admin', TRUE);

-- Seeding Default Customer User
INSERT INTO public.profiles (id, email, password, full_name, role, is_approved) VALUES
('a0000000-0000-0000-0000-000000000001', 'customer@example.com', 'password', 'Rahul Mehta', 'customer', TRUE);

-- Brands Seeding
INSERT INTO public.brands (id, name, slug, logo_url, description, catalog_url) VALUES
('b1111111-1111-1111-1111-111111111111', '3M', '3m', 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=200&auto=format&fit=crop&q=80', 'Global science-based technology company known for VHB tapes, masking tapes, and high-performance industrial adhesives.', '#'),
('b2222222-2222-2222-2222-222222222222', 'Pidilite', 'pidilite', 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=200&auto=format&fit=crop&q=80', 'India’s leading manufacturer of consumer and industrial adhesives, waterproofing agents, and chemicals (makers of Fevicol, Dr. Fixit).', '#'),
('b3333333-3333-3333-3333-333333333333', 'Fevicol', 'fevicol', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80', 'The legendary adhesive brand, synonymous with strong bonding for wood, plywood, and furniture manufacturing.', '#'),
('b4444444-4444-4444-4444-444444444444', 'Kerakoll', 'kerakoll', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80', 'Italian pioneer in GreenBuilding materials, delivering eco-friendly tile adhesives, grouts, and technical mortars.', '#'),
('b5555555-5555-5555-5555-555555555555', 'Ozone', 'ozone', 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=200&auto=format&fit=crop&q=80', 'Leading architectural hardware brand specializing in glass fittings, locks, door closers, and digital safety systems.', '#'),
('b6666666-6666-6666-6666-666666666666', 'Araldite', 'araldite', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80', 'The absolute standard in epoxy resins and hardeners, trusted worldwide for metal, glass, ceramic, and structural repairs.', '#'),
('b7777777-7777-7777-7777-777777777777', 'Lapox', 'lapox', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80', 'High-quality epoxy systems by Atul Ltd, widely utilized for river tables, stone cladding, and electronics encapsulation.', '#'),
('b8888888-8888-8888-8888-888888888888', 'Bostik', 'bostik', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=200&auto=format&fit=crop&q=80', 'Smart adhesive solutions provider offering industrial sealants, polyurethane caulks, and construction chemicals.', '#');

-- Categories
INSERT INTO public.categories (id, name, slug, description, icon, image_url) VALUES
('c1111111-1111-1111-1111-111111111111', 'Adhesives', 'adhesives', 'Wood glues, synthetic contact adhesives, and structural assembly bonding compounds.', 'Layers', 'https://images.unsplash.com/photo-1572883454114-1cf0031ed2a5?w=500&auto=format&fit=crop&q=80'),
('c2222222-2222-2222-2222-222222222222', 'Sealants', 'sealants', 'High-expansion silicone, polyurethane, duct, and flexible weatherproofing sealants.', 'Wrench', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'),
('c3333333-3333-3333-3333-333333333333', 'Tapes', 'tapes', 'Heavy-duty mounting tapes, masking rolls, electrical, and kapton tape solutions.', 'Film', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80'),
('c4444444-4444-4444-4444-444444444444', 'Epoxy', 'epoxy', 'Industrial casting resins, standard epoxies, grout systems, and super-strong binders.', 'Activity', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=80'),
('c5555555-5555-5555-5555-555555555555', 'Waterproofing', 'waterproofing', 'Waterproof chemical coatings, barrier membranes, and liquid roof protectants.', 'Droplets', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80'),
('c6666666-6666-6666-6666-666666666666', 'Tile Products', 'tile-products', 'Specialist polymer-modified tile adhesives, cleaners, and joint epoxy grouts.', 'Grid', 'https://images.unsplash.com/photo-1502005229762-fc1b2d812ca7?w=500&auto=format&fit=crop&q=80'),
('c7777777-7777-7777-7777-777777777777', 'Hardware', 'hardware', 'Architectural handles, modular fittings, sliding tracks, and structural hinges.', 'Cpu', 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=500&auto=format&fit=crop&q=80'),
('c8888888-8888-8888-8888-888888888888', 'Wood Products', 'wood-products', 'High-build wood fillers, structural wood putties, and sanding prep compounds.', 'Home', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&auto=format&fit=crop&q=80');

-- Products
INSERT INTO public.products (id, name, slug, description, technical_description, price, mrp, dealer_price, moq, stock, sku, hsn_code, gst_percent, pack_size, weight, shelf_life, application, brand_id, category_id, images, specifications, features, is_featured, is_trending, is_flash_sale, discount_percent) VALUES
(
  'a1111111-1111-1111-1111-111111111111',
  'Fevicol SH Premium Wood Glue',
  'fevicol-sh-premium-wood-glue',
  'Fevicol SH is a synthetic resin adhesive intended for woodworking and various bonding applications. It offers unmatched strength and reliability for commercial, industrial, and household furniture fabrication.',
  'Standard polyvinyl acetate (PVA) emulsion based adhesive with high solids content. Resists moisture and aging, drying into a semi-translucent strong bond.',
  380.00, 420.00, 320.00, 5, 120, 'FEV-SH-001', '35069190', 18.00, '1 Kg Tub', 1.05, '12 Months from Mfg', 'Furniture Manufacturing, Wood Veneers, Ply Laminations',
  'b3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111',
  ARRAY['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'],
  '{"Appearance": "White Paste", "Viscosity": "300 Poise", "Curing Time": "24 Hours"}'::jsonb,
  ARRAY['Unmatched bonding strength', 'Resistant to water and heat once cured', 'Easy spreadability', 'Economical packaging'],
  TRUE, TRUE, FALSE, 10.00
),
(
  'a2222222-2222-2222-2222-222222222222',
  '3M VHB Double-Sided Acrylic Foam Tape 4910',
  '3m-vhb-double-sided-tape-4910',
  '3M VHB Tape 4910 utilizes a general purpose acrylic adhesive. It is commonly used in applications to join transparent material or where clear or colorless tape is preferred. Designed for high-strength permanent bonds.',
  'Clear, 1.0 mm thick tape with acrylic foam core and red PE liner. Provides viscoelastic properties for thermal expansion flexibility.',
  1540.00, 1800.00, 1300.00, 2, 75, '3M-VHB-4910', '39191000', 18.00, '25mm x 33m Roll', 0.45, '24 Months', 'Signage Mounting, Glass Wall Panel Attachment, Architectural Trim',
  'b1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333',
  ARRAY['https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'],
  '{"Thickness": "1.0 mm", "Color": "Clear", "Density": "960 kg/m³"}'::jsonb,
  ARRAY['Replaces mechanical fasteners (screws, rivets, welds)', 'Virtually invisible fastening keeps surfaces smooth', 'Spreads stress load across the length of joint'],
  TRUE, TRUE, TRUE, 14.00
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Araldite Standard Heavy Duty Epoxy Adhesive',
  'araldite-standard-heavy-duty-epoxy',
  'Araldite Standard is a slow-curing, high-strength two-component epoxy adhesive. Ideal for large-scale operations or complex assembly where repositioning is crucial during bonding.',
  'Resin and Hardener ratio 1:1 by volume. Complete setting in 14-16 hours at room temperature, showing exceptional tensile and shear strengths.',
  290.00, 320.00, 240.00, 10, 250, 'AR-STD-320', '35069110', 18.00, '180g Combined Pack', 0.22, '36 Months', 'Metal Bonding, Ceramics Repair, Heavy Machinery Grout Fixes',
  'b6666666-6666-6666-6666-666666666666', 'c4444444-4444-4444-4444-444444444444',
  ARRAY['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1572883454114-1cf0031ed2a5?w=600&auto=format&fit=crop&q=80'],
  '{"Mix Ratio": "1:1", "Gel Time": "90 Minutes", "Tensile Strength": "30 MPa"}'::jsonb,
  ARRAY['Slow curing allows precise adjustments', 'Waterproof, chemical-resistant, oil-resistant', 'Resists high impacts and stresses'],
  FALSE, TRUE, FALSE, 9.00
),
(
  'a4444444-4444-4444-4444-444444444444',
  'Dr. Fixit LW+ Waterproofing Liquid',
  'dr-fixit-lw-waterproofing-liquid',
  'Dr. Fixit LW+ is a specially formulated concrete additive containing plasticizers, waterproofing, and active chemicals. It enhances cement workability and acts as a barrier against moisture and water seepage.',
  'Modified lignosulfonate liquid admixture. Prevents segregation, decreases permeability, and improves mechanical strengths.',
  180.00, 210.00, 145.00, 6, 180, 'DF-LW-1L', '38244090', 18.00, '1 Litre Can', 1.10, '24 Months', 'Concrete Basements, Pillars, Roof Slabs, Plastering Mortars',
  'b2222222-2222-2222-2222-222222222222', 'c5555555-5555-5555-5555-555555555555',
  ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80'],
  '{"pH Value": "7.5", "Specific Gravity": "1.08", "Dosage": "200ml per 50Kg bag"}'::jsonb,
  ARRAY['Increases compressive strength of mortar', 'Prevents dampness and salt efflorescence', 'Reduces water-cement ratio by 10%'],
  TRUE, FALSE, FALSE, 14.00
),
(
  'a5555555-5555-5555-5555-555555555555',
  'Ozone Hydraulic Floor Spring (OFS-84)',
  'ozone-hydraulic-floor-spring-ofs84',
  'Heavy-duty double action hydraulic floor spring designed specifically for frameless glass doors and metal-framed entryways. Ensures smooth closing control with adjustable speeds.',
  'Dual-speed adjustable valves. Holds open at 90 degrees and supports maximum door weights up to 100 kilograms.',
  2450.00, 2900.00, 2100.00, 1, 40, 'OZ-OFS-84', '83024110', 18.00, 'Single Unit Box', 5.20, '60 Months', 'Glass Doors, Office Cabins, Showroom Entrances',
  'b5555555-5555-5555-5555-555555555555', 'c7777777-7777-7777-7777-777777777777',
  ARRAY['https://images.unsplash.com/photo-1502005229762-fc1b2d812ca7?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=600&auto=format&fit=crop&q=80'],
  '{"Capacity": "100 Kg", "Closing Cycle": "500,000 runs", "Damping Control": "Dual speed Valve"}'::jsonb,
  ARRAY['Double-action door movement', 'High corrosion resistance body shell', 'Tested for over 500,000 cycles without pressure leaks'],
  TRUE, FALSE, FALSE, 15.00
),
(
  'a6666666-6666-6666-6666-666666666666',
  'Bostik PU Construction Grade Sealant',
  'bostik-pu-construction-grade-sealant',
  'Bostik Polyurethane sealant is a one-component, moisture-curing polyurethane mastic. Formulated for sealing expansion joints in commercial concrete floors, wall panels, and metal roofing sheet assemblies.',
  'Highly elastic sealant with ±25% joint movement capability. Paintable once completely skin-dry.',
  410.00, 480.00, 345.00, 12, 150, 'BOS-PU-600', '32141000', 18.00, '600ml Sausage Pack', 0.85, '12 Months', 'Concrete expansion joints, precast joints, perimeter glazing frames',
  'b8888888-8888-8888-8888-888888888888', 'c2222222-2222-2222-2222-222222222222',
  ARRAY['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80'],
  '{"Skinning Time": "90 Mins", "Elongation at Break": "600%", "Hardness": "Shore A 35"}'::jsonb,
  ARRAY['Stays permanently flexible', 'Excellent adhesion to stone, brick, concrete, and sheet metals', 'Weather-resistant and UV-stable formulas'],
  FALSE, TRUE, TRUE, 15.00
),
(
  'a7777777-7777-7777-7777-777777777777',
  'Lapox Granito Stone Epoxy Bonding System',
  'lapox-granito-stone-epoxy-bonding',
  'Lapox Granito is a rapid gel two-part epoxy formulation designed specifically for structural spot gluing, marble slab lamination, and granite corner reinforcement work.',
  'Thixotropic solvent-free epoxy. High green strength allows processing of stone within hours of adhesive application.',
  650.00, 720.00, 520.00, 4, 90, 'LAP-GRN-1.2', '35069110', 18.00, '1.25 Kg Combined Kit', 1.25, '24 Months', 'Granite slab joints, marble under-cladding, vertical stone anchoring',
  'b7777777-7777-7777-7777-777777777777', 'c4444444-4444-4444-4444-444444444444',
  ARRAY['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80'],
  '{"Gel Time": "20 Minutes", "Full Cure": "4 Hours", "Consistency": "Thixotropic Gel"}'::jsonb,
  ARRAY['Does not sag on vertical surfaces', 'Polishes cleanly to match granite texture', 'Dries water-clear without staining white marble surfaces'],
  TRUE, FALSE, FALSE, 10.00
),
(
  'a8888888-8888-8888-8888-888888888888',
  'Kerakoll Biofast Eco Tile Adhesive',
  'kerakoll-biofast-eco-tile-adhesive',
  'Biofast Eco is a single-component, fast-setting, polymer-modified adhesive mortar. Specifically engineered for waterproofing ceramic, vitreous, and natural stone tiles on floors and walls.',
  'Eco-friendly mineral formulation based on active binders and recycled quartz sands. Zero volatile organic compound (VOC) emissions.',
  780.00, 850.00, 620.00, 10, 200, 'KER-BIO-20K', '38245090', 18.00, '20 Kg Bag', 20.00, '12 Months', 'Commercial floors, swimming pools, wet shower rooms, underfloor heating tiles',
  'b4444444-4444-4444-4444-444444444444', 'c6666666-6666-6666-6666-666666666666',
  ARRAY['https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1502005229762-fc1b2d812ca7?w=600&auto=format&fit=crop&q=80'],
  '{"Water mixing ratio": "5.5 Litres per bag", "Open Time": "30 Minutes", "Setting Time": "4 Hours"}'::jsonb,
  ARRAY['Eco-friendly mineral formulation', 'Fast-setting; allows foot traffic in 4 hours', 'Exceptional structural bond strength on screeds'],
  FALSE, TRUE, FALSE, 8.00
);

-- Coupons Seeding
INSERT INTO public.coupons (code, discount_value, type, min_order_value, is_active) VALUES
('IND10', 10.00, 'percent', 500.00, TRUE),
('BULK5000', 5000.00, 'fixed', 50000.00, TRUE);

-- Blogs Seeding
INSERT INTO public.blogs (title, slug, summary, content, image_url, author, tags) VALUES
(
  'Why 3M VHB Tapes are Replacing Rivets in Modern Metal Framing',
  'why-3m-vhb-tapes-replace-rivets',
  'Explore how acrylic foam tapes are changing architecture by eliminating drilling and distribution stress.',
  '<p>For decades, welding, rivets, and screws were the only options to secure structural metal sheets. However, 3M VHB Tapes have completely revolutionized this. Through its viscoelastic acrylic foam core, VHB tape distributes load evenly along the entire joint joint boundary rather than focusing stress at a single screw point.</p><p>This leads to superior vibration damping, corrosion protection (as there are no drilled holes to accumulate moisture), and a clean, screwless, modern finish favored by contemporary architectural designers.</p>',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=800&auto=format&fit=crop&q=80',
  'Dr. Vivek Sharma (Technical Lead)',
  ARRAY['Industrial Tapes', 'Construction', '3M']
),
(
  'A Complete Guide to Waterproofing Basements: Dr. Fixit LW+ Admixtures',
  'guide-to-basement-waterproofing-dr-fixit',
  'Learn the proper dosing ratios and application tips to ensure seamless water-resistant foundations.',
  '<p>Basement leakages are a nightmare for building integrity. Utilizing a standard plaster is never enough because water capillary suction forces liquid through tiny concrete pores. Using Dr. Fixit LW+ alters this by reducing concrete permeability by up to 20%.</p><p>Always maintain a dosage of 200ml per bag of 50Kg cement. Ensure thorough dry-mixing of aggregate before adding the wet admixture to achieve consistent dispersion and avoid dry spots.</p>',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
  'Ramesh Krishnan (Structure Engineer)',
  ARRAY['Waterproofing', 'Concrete', 'Pidilite']
);


-- ==========================================
-- GRANT TABLE PRIVILEGES TO PUBLIC ROLE (ANON)
-- ==========================================
-- Since custom credentials bypass Supabase Auth, requests execute as the 'anon' role.
-- We must explicitly grant write permissions to this role for public schema tables.

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated;
