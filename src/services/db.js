// ========================================================
// Client-side LocalStorage DB Engine (Supabase Fallback)
// ========================================================

const SEED_BRANDS = [
  { id: 'b1', name: '3M', slug: '3m', logo_url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80', description: 'Global science-based technology company known for VHB tapes, masking tapes, and high-performance industrial adhesives.', catalog_url: '#' },
  { id: 'b2', name: 'Pidilite', slug: 'pidilite', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=150&auto=format&fit=crop&q=80', description: 'India’s leading manufacturer of consumer and industrial adhesives, waterproofing agents, and chemicals (makers of Fevicol, Dr. Fixit).', catalog_url: '#' },
  { id: 'b3', name: 'Fevicol', slug: 'fevicol', logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80', description: 'The legendary adhesive brand, synonymous with strong bonding for wood, plywood, and furniture manufacturing.', catalog_url: '#' },
  { id: 'b4', name: 'Kerakoll', slug: 'kerakoll', logo_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80', description: 'Italian pioneer in GreenBuilding materials, delivering eco-friendly tile adhesives, grouts, and technical mortars.', catalog_url: '#' },
  { id: 'b5', name: 'Ozone', slug: 'ozone', logo_url: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=150&auto=format&fit=crop&q=80', description: 'Leading architectural hardware brand specializing in glass fittings, locks, door closers, and digital safety systems.', catalog_url: '#' },
  { id: 'b6', name: 'Araldite', slug: 'araldite', logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80', description: 'The absolute standard in epoxy resins and hardeners, trusted worldwide for metal, glass, ceramic, and structural repairs.', catalog_url: '#' },
  { id: 'b7', name: 'Lapox (Atul Ltd)', slug: 'lapox', logo_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80', description: 'High-quality epoxy systems by Atul Ltd, widely utilized for river tables, stone cladding, and electronics encapsulation.', catalog_url: '#' },
  { id: 'b8', name: 'Bostik', slug: 'bostik', logo_url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&auto=format&fit=crop&q=80', description: 'Smart adhesive solutions provider offering industrial sealants, polyurethane caulks, and construction chemicals.', catalog_url: '#' },
  { id: 'b9', name: 'Falcofix', slug: 'falcofix', logo_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&auto=format&fit=crop&q=80', description: 'Premium high-strength synthetic resin woodworking adhesives and binders for industrial wood bonding.', catalog_url: '#' }
];

const SEED_CATEGORIES = [
  { id: 'c1', name: 'Adhesives', slug: 'adhesives', description: 'Wood glues, synthetic contact adhesives, and structural assembly bonding compounds.', icon: 'Layers', image_url: 'https://images.unsplash.com/photo-1572883454114-1cf0031ed2a5?w=500&auto=format&fit=crop&q=80' },
  { id: 'c2', name: 'Sealants', slug: 'sealants', description: 'High-expansion silicone, polyurethane, duct, and flexible weatherproofing sealants.', icon: 'Wrench', image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80' },
  { id: 'c3', name: 'Tapes', slug: 'tapes', description: 'Heavy-duty mounting tapes, masking rolls, electrical, and kapton tape solutions.', icon: 'Film', image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80' },
  { id: 'c4', name: 'Epoxy', slug: 'epoxy', description: 'Industrial casting resins, standard epoxies, grout systems, and super-strong binders.', icon: 'Activity', image_url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=80' },
  { id: 'c5', name: 'Waterproofing', slug: 'waterproofing', description: 'Waterproof chemical coatings, barrier membranes, and liquid roof protectants.', icon: 'Droplets', image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80' },
  { id: 'c6', name: 'Tile Products', slug: 'tile-products', description: 'Specialist polymer-modified tile adhesives, cleaners, and joint epoxy grouts.', icon: 'Grid', image_url: 'https://images.unsplash.com/photo-1502005229762-fc1b2d812ca7?w=500&auto=format&fit=crop&q=80' },
  { id: 'c7', name: 'Hardware', slug: 'hardware', description: 'Architectural handles, modular fittings, sliding tracks, and structural hinges.', icon: 'Cpu', image_url: 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=500&auto=format&fit=crop&q=80' },
  { id: 'c8', name: 'Wood Products', slug: 'wood-products', description: 'High-build wood fillers, structural wood putties, and sanding prep compounds.', icon: 'Home', image_url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&auto=format&fit=crop&q=80' }
];

const SEED_PRODUCTS = [
  {
    id: 'p1',
    name: 'Fevicol SH Woodworking Glue',
    slug: 'fevicol-sh-woodworking-glue',
    description: 'Classic synthetic resin adhesive for superior wood-to-wood and plywood lamination bonding.',
    technical_description: 'PVA based emulsion, high solids content. Transparent line, high bonding load.',
    price: 334.75,
    mrp: 395.00,
    dealer_price: 246.69,
    moq: 5,
    stock: 150,
    sku: 'PID-FSH-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '1 Kg Tub',
    weight: 1.00,
    shelf_life: '12 Months',
    application: 'Furniture making, wood joinery, laminations',
    brand_id: 'b3',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'White Paste', 'Curing Time': '24 Hours' },
    features: ['Unmatched bonding strength', 'Water-resistant wood bond'],
    is_featured: true,
    is_trending: true,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v1_1', pack_size: '1 Kg Tub', sku: 'PID-FSH-1KG', price: 334.75, mrp: 395.00, dealer_price: 246.69, stock: 150, moq: 5, weight: 1.00 },
      { id: 'v1_2', pack_size: '2 Kg Tub', sku: 'PID-FSH-2KG', price: 614.41, mrp: 725.00, dealer_price: 471.26, stock: 80, moq: 5, weight: 2.00 },
      { id: 'v1_3', pack_size: '5 Kg Tub', sku: 'PID-FSH-5KG', price: 1444.92, mrp: 1705.00, dealer_price: 1132.30, stock: 80, moq: 2, weight: 5.00 },
      { id: 'v1_4', pack_size: '10 Kg Tub', sku: 'PID-FSH-10KG', price: 2779.66, mrp: 3280.00, dealer_price: 2173.60, stock: 45, moq: 1, weight: 10.00 },
      { id: 'v1_5', pack_size: '20 Kg Tub', sku: 'PID-FSH-20KG', price: 5288.14, mrp: 6240.00, dealer_price: 4131.00, stock: 30, moq: 1, weight: 20.00 },
      { id: 'v1_6', pack_size: '30 Kg Tub', sku: 'PID-FSH-30KG', price: 7703.39, mrp: 9090.00, dealer_price: 5998.20, stock: 25, moq: 1, weight: 30.00 },
      { id: 'v1_7', pack_size: '50 Kg Drum', sku: 'PID-FSH-50KG', price: 12525.42, mrp: 14780.00, dealer_price: 9756.00, stock: 20, moq: 1, weight: 50.00 },
      { id: 'v1_8', pack_size: '60 Kg Drum', sku: 'PID-FSH-60KG', price: 14148.31, mrp: 16695.00, dealer_price: 11287.80, stock: 15, moq: 1, weight: 60.00 }
    ]
  },
  {
    id: 'p2',
    name: '3M VHB Double-Sided Acrylic Foam Tape 4910',
    slug: '3m-vhb-double-sided-tape-4910',
    description: '3M VHB Tape 4910 utilizes a general purpose acrylic adhesive. Designed for high-strength permanent bonds.',
    technical_description: 'Clear, 1.0 mm thick tape with acrylic foam core and red PE liner.',
    price: 1540.00,
    mrp: 1800.00,
    dealer_price: 1300.00,
    moq: 2,
    stock: 75,
    sku: '3M-VHB-4910',
    hsn_code: '39191000',
    gst_percent: 18.00,
    pack_size: '25mm x 33m Roll',
    weight: 0.45,
    shelf_life: '24 Months',
    application: 'Signage Mounting, Glass Wall Panel Attachment, Architectural Trim',
    brand_id: 'b1',
    category_id: 'c3',
    images: [
      'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Thickness': '1.0 mm', 'Color': 'Clear', 'Adhesive Type': 'General Purpose Acrylic' },
    features: ['Replaces mechanical fasteners', 'Virtually invisible fastening keeps surfaces smooth'],
    is_featured: true,
    is_trending: true,
    is_flash_sale: true,
    discount_percent: 14,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v2_1', pack_size: '25mm x 33m Roll', sku: '3M-VHB-4910', price: 1540.00, mrp: 1800.00, dealer_price: 1300.00, stock: 75, moq: 2, weight: 0.45 }
    ]
  },
  {
    id: 'p3',
    name: 'Araldite Standard Heavy Duty Epoxy Adhesive',
    slug: 'araldite-standard-heavy-duty-epoxy',
    description: 'Araldite Standard is a slow-curing, high-strength two-component epoxy adhesive.',
    technical_description: 'Resin and Hardener ratio 1:1 by volume. Complete setting in 14-16 hours.',
    price: 290.00,
    mrp: 320.00,
    dealer_price: 240.00,
    moq: 10,
    stock: 250,
    sku: 'AR-STD-320',
    hsn_code: '35069110',
    gst_percent: 18.00,
    pack_size: '180g Combined Pack',
    weight: 0.22,
    shelf_life: '36 Months',
    application: 'Metal Bonding, Ceramics Repair, Heavy Machinery Grout Fixes',
    brand_id: 'b6',
    category_id: 'c4',
    images: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572883454114-1cf0031ed2a5?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Mix Ratio': '1:1', 'Gel Time': '90 Minutes', 'Tensile Strength': '30 MPa' },
    features: ['Slow curing allows precise adjustments', 'Waterproof, chemical-resistant'],
    is_featured: false,
    is_trending: true,
    is_flash_sale: false,
    discount_percent: 9,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v3_1', pack_size: '180g Combined Pack', sku: 'AR-STD-320', price: 290.00, mrp: 320.00, dealer_price: 240.00, stock: 250, moq: 10, weight: 0.22 }
    ]
  },
  {
    id: 'p4',
    name: 'Dr. Fixit Pidiproof LW+',
    slug: 'dr-fixit-pidiproof-lw-plus',
    description: 'Integral liquid waterproofing compound for concrete and mortar that fills capillary pores.',
    technical_description: 'Modified lignosulfonate liquid admixture. Prevents segregation, decreases permeability.',
    price: 177.97,
    mrp: 210.00,
    dealer_price: 145.00,
    moq: 6,
    stock: 250,
    sku: 'DF-LW-BASE',
    hsn_code: '38244090',
    gst_percent: 18.00,
    pack_size: '1 Litre Can',
    weight: 1.10,
    shelf_life: '24 Months',
    application: 'Integral waterproofing of columns, slabs, basements, water tanks, and plastering mortars',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'Brown Liquid', 'Specific Gravity': '1.08' },
    features: ['Reduces water-cement ratio by 10%', 'Improves concrete durability', 'Prevents efflorescence'],
    is_featured: true,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 14,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v4_1', pack_size: '200 ml Can', sku: 'DF-LW-200ML', price: 55.08, mrp: 65.00, dealer_price: 38.00, stock: 300, moq: 10, weight: 0.22 },
      { id: 'v4_2', pack_size: '1 Litre Can', sku: 'DF-LW-1L', price: 177.97, mrp: 210.00, dealer_price: 145.00, stock: 250, moq: 6, weight: 1.10 },
      { id: 'v4_3', pack_size: '5 Litre Can', sku: 'DF-LW-5L', price: 805.08, mrp: 950.00, dealer_price: 650.00, stock: 120, moq: 2, weight: 5.30 },
      { id: 'v4_4', pack_size: '10 Litre Can', sku: 'DF-LW-10L', price: 1525.42, mrp: 1800.00, dealer_price: 1250.00, stock: 80, moq: 1, weight: 10.50 },
      { id: 'v4_5', pack_size: '20 Litre Can', sku: 'DF-LW-20L', price: 2881.36, mrp: 3400.00, dealer_price: 2350.00, stock: 50, moq: 1, weight: 21.00 },
      { id: 'v4_6', pack_size: '50 Litre Carboy', sku: 'DF-LW-50L', price: 6949.15, mrp: 8200.00, dealer_price: 5800.00, stock: 20, moq: 1, weight: 52.00 },
      { id: 'v4_7', pack_size: '100 Litre Carboy', sku: 'DF-LW-100L', price: 13389.83, mrp: 15800.00, dealer_price: 11200.00, stock: 15, moq: 1, weight: 104.00 }
    ]
  },
  {
    id: 'p5',
    name: 'Ozone Hydraulic Floor Spring (OFS-84)',
    slug: 'ozone-hydraulic-floor-spring-ofs84',
    description: 'Heavy-duty double action hydraulic floor spring designed specifically for frameless glass doors.',
    technical_description: 'Dual-speed adjustable valves. Holds open at 90 degrees.',
    price: 2450.00,
    mrp: 2900.00,
    dealer_price: 2100.00,
    moq: 1,
    stock: 40,
    sku: 'OZ-OFS-84',
    hsn_code: '83024110',
    gst_percent: 18.00,
    pack_size: 'Single Unit Box',
    weight: 5.20,
    shelf_life: '60 Months',
    application: 'Glass Doors, Office Cabins, Showroom Entrances',
    brand_id: 'b5',
    category_id: 'c7',
    images: [
      'https://images.unsplash.com/photo-1502005229762-fc1b2d812ca7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Capacity': '100 Kg', 'Closing Cycle': '500,000 runs', 'Damping Control': 'Dual speed Valve' },
    features: ['Double-action door movement', 'High corrosion resistance body shell'],
    is_featured: true,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 15,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v5_1', pack_size: 'Single Unit Box', sku: 'OZ-OFS-84', price: 2450.00, mrp: 2900.00, dealer_price: 2100.00, stock: 40, moq: 1, weight: 5.20 }
    ]
  },
  {
    id: 'p6',
    name: 'Bostik PU Construction Grade Sealant',
    slug: 'bostik-pu-construction-grade-sealant',
    description: 'High performance, fast curing polyurethane sealant designed for expansion joints.',
    technical_description: 'Moisture-curing, single-component polyurethane formulation.',
    price: 330.50,
    mrp: 390.00,
    dealer_price: 275.00,
    moq: 12,
    stock: 144,
    sku: 'BOS-PU91-GR',
    hsn_code: '32141000',
    gst_percent: 18.00,
    pack_size: '600ml Sausage Roll',
    weight: 0.85,
    shelf_life: '12 Months',
    application: 'Infrastructure Expansion Joints, Pre-cast Concrete Walls',
    brand_id: 'b8',
    category_id: 'c2',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Color': 'Concrete Gray', 'Skin Formation': '45 Minutes' },
    features: ['Permanent elasticity', 'Paintable after cure'],
    is_featured: true,
    is_trending: true,
    is_flash_sale: false,
    discount_percent: 12,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v6_1', pack_size: '600ml Sausage Roll', sku: 'BOS-PU91-GR', price: 330.50, mrp: 390.00, dealer_price: 275.00, stock: 144, moq: 12, weight: 0.85 }
    ]
  },
  {
    id: 'p7',
    name: 'Fevicol Speedx Fast-Setting Glue',
    slug: 'fevicol-speedx-fast-setting',
    description: 'Fast-setting synthetic resin adhesive that offers high bond strength in just 2 hours.',
    technical_description: 'Polyvinyl acetate emulsion designed for high-speed furniture laminations.',
    price: 368.64,
    mrp: 435.00,
    dealer_price: 276.81,
    moq: 5,
    stock: 120,
    sku: 'PID-SPX-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '1 Kg Tub',
    weight: 1.00,
    shelf_life: '12 Months',
    application: 'Fast lamination, frame-making, emergency repairs',
    brand_id: 'b3',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'White Paste', 'Setting Time': '2 Hours' },
    features: ['Sets in 2 hours instead of 24', 'Saves labour costs'],
    is_featured: false,
    is_trending: true,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v7_1', pack_size: '1 Kg Tub', sku: 'PID-SPX-1KG', price: 368.64, mrp: 435.00, dealer_price: 276.81, stock: 120, moq: 5, weight: 1.00 },
      { id: 'v7_2', pack_size: '2 Kg Tub', sku: 'PID-SPX-2KG', price: 673.73, mrp: 795.00, dealer_price: 533.36, stock: 60, moq: 5, weight: 2.00 },
      { id: 'v7_3', pack_size: '5 Kg Tub', sku: 'PID-SPX-5KG', price: 1601.69, mrp: 1890.00, dealer_price: 1282.95, stock: 60, moq: 2, weight: 5.00 },
      { id: 'v7_4', pack_size: '10 Kg Tub', sku: 'PID-SPX-10KG', price: 3063.56, mrp: 3615.00, dealer_price: 2467.00, stock: 40, moq: 1, weight: 10.00 },
      { id: 'v7_5', pack_size: '20 Kg Tub', sku: 'PID-SPX-20KG', price: 5868.64, mrp: 6925.00, dealer_price: 4726.20, stock: 25, moq: 1, weight: 20.00 },
      { id: 'v7_6', pack_size: '30 Kg Tub', sku: 'PID-SPX-30KG', price: 8622.88, mrp: 10175.00, dealer_price: 6976.80, stock: 20, moq: 1, weight: 30.00 },
      { id: 'v7_7', pack_size: '50 Kg Drum', sku: 'PID-SPX-50KG', price: 14050.85, mrp: 16580.00, dealer_price: 11377.50, stock: 10, moq: 1, weight: 50.00 }
    ]
  },
  {
    id: 'p8',
    name: 'Fevicol Marine Waterproof Glue',
    slug: 'fevicol-marine-waterproof',
    description: 'High-performance waterproof wood adhesive that withstands boiling water for hours.',
    technical_description: 'Proprietary copolymer woodworking adhesive meeting D3/D4 waterproof specs.',
    price: 394.07,
    mrp: 465.00,
    dealer_price: 306.08,
    moq: 5,
    stock: 110,
    sku: 'PID-MAR-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '1 Kg Tub',
    weight: 1.00,
    shelf_life: '18 Months',
    application: 'Kitchen fittings, bathroom cabinets, outdoor doors',
    brand_id: 'b3',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Water Resistance': 'Boiling Water Resistant', 'Setting Time': '4-6 Hours' },
    features: ['Boiling water resistant for 7 hours', 'Ideal for kitchens'],
    is_featured: true,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v8_1', pack_size: '1 Kg Tub', sku: 'PID-MAR-1KG', price: 394.07, mrp: 465.00, dealer_price: 306.08, stock: 110, moq: 5, weight: 1.00 },
      { id: 'v8_2', pack_size: '2 Kg Tub', sku: 'PID-MAR-2KG', price: 733.05, mrp: 865.00, dealer_price: 588.02, stock: 60, moq: 5, weight: 2.00 },
      { id: 'v8_3', pack_size: '5 Kg Tub', sku: 'PID-MAR-5KG', price: 1745.76, mrp: 2060.00, dealer_price: 1403.95, stock: 55, moq: 2, weight: 5.00 },
      { id: 'v8_4', pack_size: '10 Kg Tub', sku: 'PID-MAR-10KG', price: 3347.46, mrp: 3950.00, dealer_price: 2716.30, stock: 35, moq: 1, weight: 10.00 },
      { id: 'v8_5', pack_size: '20 Kg Tub', sku: 'PID-MAR-20KG', price: 6453.39, mrp: 7615.00, dealer_price: 5222.40, stock: 20, moq: 1, weight: 20.00 },
      { id: 'v8_6', pack_size: '30 Kg Tub', sku: 'PID-MAR-30KG', price: 9483.05, mrp: 11190.00, dealer_price: 7702.50, stock: 15, moq: 1, weight: 30.00 },
      { id: 'v8_7', pack_size: '50 Kg Drum', sku: 'PID-MAR-50KG', price: 15478.81, mrp: 18265.00, dealer_price: 12553.50, stock: 10, moq: 1, weight: 50.00 },
      { id: 'v8_8', pack_size: '60 Kg Drum', sku: 'PID-MAR-60KG', price: 18262.71, mrp: 21550.00, dealer_price: 14883.60, stock: 8, moq: 1, weight: 60.00 }
    ]
  },
  {
    id: 'p9',
    name: 'Woodgrip Marine Waterproof Glue',
    slug: 'woodgrip-marine-waterproof',
    description: 'Heavy duty, highly competitive waterproof wood adhesive from the Woodgrip collection.',
    technical_description: 'PVA Copolymer meeting standard waterproof specifications.',
    price: 394.07,
    mrp: 465.00,
    dealer_price: 303.00,
    moq: 5,
    stock: 100,
    sku: 'PID-WGM-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '1 Kg Tub',
    weight: 1.00,
    shelf_life: '12 Months',
    application: 'Plywood lamination, moisture-prone furniture panels',
    brand_id: 'b2',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Standard': 'D3 Water resistant' },
    features: ['Excellent price-to-performance ratio', 'Good water resistance'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v9_1', pack_size: '1 Kg Tub', sku: 'PID-WGM-1KG', price: 394.07, mrp: 465.00, dealer_price: 303.00, stock: 100, moq: 5, weight: 1.00 },
      { id: 'v9_2', pack_size: '2 Kg Tub', sku: 'PID-WGM-2KG', price: 771.19, mrp: 910.00, dealer_price: 584.00, stock: 50, moq: 5, weight: 2.00 },
      { id: 'v9_3', pack_size: '5 Kg Tub', sku: 'PID-WGM-5KG', price: 1792.37, mrp: 2115.00, dealer_price: 1405.00, stock: 50, moq: 2, weight: 5.00 },
      { id: 'v9_4', pack_size: '10 Kg Tub', sku: 'PID-WGM-10KG', price: 3415.25, mrp: 4030.00, dealer_price: 2720.00, stock: 30, moq: 1, weight: 10.00 },
      { id: 'v9_5', pack_size: '20 Kg Tub', sku: 'PID-WGM-20KG', price: 6716.10, mrp: 7925.00, dealer_price: 5260.00, stock: 20, moq: 1, weight: 20.00 },
      { id: 'v9_6', pack_size: '50 Kg Drum', sku: 'PID-WGM-50KG', price: 16008.47, mrp: 18890.00, dealer_price: 12750.00, stock: 10, moq: 1, weight: 50.00 }
    ]
  },
  {
    id: 'p10',
    name: 'Terminator Anti-Termite Preservative',
    slug: 'terminator-wood-preservative',
    description: 'Highly active clear anti-termite fluid to protect wood structure before painting.',
    technical_description: 'Synthetic chemical insecticide wood preservative.',
    price: 368.64,
    mrp: 435.00,
    dealer_price: 282.79,
    moq: 6,
    stock: 120,
    sku: 'PID-TMW-BASE',
    hsn_code: '38089190',
    gst_percent: 18.00,
    pack_size: '1 Litre Can',
    weight: 0.90,
    shelf_life: '24 Months',
    application: 'Raw wooden frames, doors, interior structural ply panels',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Active ingredient': 'Cypermethrin formulation' },
    features: ['Kills termites & woodborers', 'Colorless clear penetrant'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v10_1', pack_size: '1 Litre Can', sku: 'PID-TMW-1L', price: 368.64, mrp: 435.00, dealer_price: 282.79, stock: 120, moq: 6, weight: 0.90 },
      { id: 'v10_2', pack_size: '5 Litre Can', sku: 'PID-TMW-5L', price: 1720.34, mrp: 2030.00, dealer_price: 1357.15, stock: 50, moq: 2, weight: 4.50 }
    ]
  },
  {
    id: 'p11',
    name: 'Terminator Wood Preservative Spray',
    slug: 'terminator-wood-preservative-spray',
    description: 'Targeted anti-termite aerosol spray with an extension nozzle for instant termite control.',
    technical_description: 'Targeted chemical aerosol wood protectant spray.',
    price: 271.19,
    mrp: 320.00,
    dealer_price: 200.40,
    moq: 6,
    stock: 140,
    sku: 'PID-TMSP-BASE',
    hsn_code: '38089190',
    gst_percent: 18.00,
    pack_size: '500 ml Spray Can',
    weight: 0.42,
    shelf_life: '18 Months',
    application: 'Injecting in cracks, holes in wood, termite tunnels',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Format': 'Aerosol spray can' },
    features: ['Precision extension spray straw', 'Instant termite action'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v11_1', pack_size: '320 ml Spray', sku: 'PID-TMSP-320ML', price: 211.86, mrp: 250.00, dealer_price: 157.00, stock: 200, moq: 6, weight: 0.28 },
      { id: 'v11_2', pack_size: '500 ml Spray', sku: 'PID-TMSP-500ML', price: 271.19, mrp: 320.00, dealer_price: 200.40, stock: 140, moq: 6, weight: 0.42 },
      { id: 'v11_3', pack_size: '1 Litre Spray', sku: 'PID-TMSP-1L', price: 449.15, mrp: 530.00, dealer_price: 335.30, stock: 80, moq: 4, weight: 0.90 }
    ]
  },
  {
    id: 'p12',
    name: 'Falcofix WR Waterproof Adhesive',
    slug: 'falcofix-wr-waterproof-adhesive',
    description: 'Water-resistant woodworking resin adhesive designed for long-lasting bond integrity in damp conditions.',
    technical_description: 'PVA based emulsion, high solids content. Meets standard D3 water resistance tests.',
    price: 305.08,
    mrp: 360.00,
    dealer_price: 246.40,
    moq: 5,
    stock: 200,
    sku: 'FALCO-WR-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '800 gm PP',
    weight: 0.80,
    shelf_life: '12 Months',
    application: 'Water-resistant woodworking, furniture joinery, veneer laminations',
    brand_id: 'b9',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'White Liquid Paste', 'Viscosity': '280 Poise' },
    features: ['Water resistant', 'High initial tack'],
    is_featured: true,
    is_trending: true,
    is_flash_sale: false,
    discount_percent: 15,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'vf1_1', pack_size: '800 gm PP', sku: 'FALCO-WR-800G', price: 305.08, mrp: 360.00, dealer_price: 246.40, stock: 200, moq: 5, weight: 0.80 },
      { id: 'vf1_2', pack_size: '1 Kg Jar', sku: 'FALCO-WR-1KG', price: 381.36, mrp: 450.00, dealer_price: 296.00, stock: 150, moq: 5, weight: 1.00 },
      { id: 'vf1_3', pack_size: '2 Kg Jar', sku: 'FALCO-WR-2KG', price: 686.44, mrp: 810.00, dealer_price: 580.00, stock: 100, moq: 5, weight: 2.00 },
      { id: 'vf1_4', pack_size: '5 Kg Bucket', sku: 'FALCO-WR-5KG', price: 1728.81, mrp: 2040.00, dealer_price: 1440.00, stock: 80, moq: 2, weight: 5.00 },
      { id: 'vf1_5', pack_size: '10 Kg Bucket', sku: 'FALCO-WR-10KG', price: 3271.19, mrp: 3860.00, dealer_price: 2830.00, stock: 50, moq: 1, weight: 10.00 },
      { id: 'vf1_6', pack_size: '20 Kg Bucket', sku: 'FALCO-WR-20KG', price: 6533.90, mrp: 7710.00, dealer_price: 5600.00, stock: 30, moq: 1, weight: 20.00 },
      { id: 'vf1_7', pack_size: '25 Kg Bucket', sku: 'FALCO-WR-25KG', price: 8474.58, mrp: 10000.00, dealer_price: 7000.00, stock: 20, moq: 1, weight: 25.00 },
      { id: 'vf1_8', pack_size: '50 Kg Carboy', sku: 'FALCO-WR-50KG', price: 16194.92, mrp: 19110.00, dealer_price: 13950.00, stock: 15, moq: 1, weight: 50.00 },
      { id: 'vf1_9', pack_size: '55 Kg Carboy', sku: 'FALCO-WR-55KG', price: 18898.31, mrp: 22300.00, dealer_price: 15290.00, stock: 10, moq: 1, weight: 55.00 },
      { id: 'vf1_10', pack_size: '60 Kg Carboy', sku: 'FALCO-WR-60KG', price: 18983.05, mrp: 22400.00, dealer_price: 16380.00, stock: 8, moq: 1, weight: 60.00 }
    ]
  },
  {
    id: 'p13',
    name: 'Falcofix Ultramarine Premium Wood Adhesive',
    slug: 'falcofix-ultramarine-wood-adhesive',
    description: 'Premium high-bonding woodworking adhesive formulation offering superior tensile strength.',
    technical_description: 'Modified polyvinyl acetate copolymer. Exceptional solids content and joint stress loading capacity.',
    price: 254.24,
    mrp: 300.00,
    dealer_price: 198.00,
    moq: 5,
    stock: 180,
    sku: 'FALCO-ULTRA-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '800 gm PP',
    weight: 0.80,
    shelf_life: '12 Months',
    application: 'Premium furniture lamination, hardwood bonding, partition panels',
    brand_id: 'b9',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'White Liquid Paste', 'Viscosity': '310 Poise' },
    features: ['Extra strong bonding load', 'Fast setting line'],
    is_featured: false,
    is_trending: true,
    is_flash_sale: false,
    discount_percent: 15,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'vf2_1', pack_size: '800 gm PP', sku: 'FALCO-ULTRA-800G', price: 254.24, mrp: 300.00, dealer_price: 198.00, stock: 180, moq: 5, weight: 0.80 },
      { id: 'vf2_2', pack_size: '1 Kg Jar', sku: 'FALCO-ULTRA-1KG', price: 345.76, mrp: 408.00, dealer_price: 271.50, stock: 140, moq: 5, weight: 1.00 },
      { id: 'vf2_3', pack_size: '2 Kg Jar', sku: 'FALCO-ULTRA-2KG', price: 627.12, mrp: 740.00, dealer_price: 517.00, stock: 90, moq: 5, weight: 2.00 },
      { id: 'vf2_4', pack_size: '5 Kg Jar', sku: 'FALCO-ULTRA-5KG', price: 1508.47, mrp: 1780.00, dealer_price: 1242.50, stock: 70, moq: 2, weight: 5.00 },
      { id: 'vf2_5', pack_size: '10 Kg Bucket', sku: 'FALCO-ULTRA-10KG', price: 2881.36, mrp: 3400.00, dealer_price: 2395.00, stock: 45, moq: 1, weight: 10.00 },
      { id: 'vf2_6', pack_size: '20 Kg Bucket', sku: 'FALCO-ULTRA-20KG', price: 5525.42, mrp: 6520.00, dealer_price: 4610.00, stock: 30, moq: 1, weight: 20.00 },
      { id: 'vf2_7', pack_size: '25 Kg Bucket', sku: 'FALCO-ULTRA-25KG', price: 7203.39, mrp: 8500.00, dealer_price: 5687.50, stock: 25, moq: 1, weight: 25.00 },
      { id: 'vf2_8', pack_size: '50 Kg Carboy', sku: 'FALCO-ULTRA-50KG', price: 13474.58, mrp: 15900.00, dealer_price: 11075.00, stock: 10, moq: 1, weight: 50.00 },
      { id: 'vf2_9', pack_size: '55 Kg Carboy', sku: 'FALCO-ULTRA-55KG', price: 15084.75, mrp: 17800.00, dealer_price: 12292.50, stock: 10, moq: 1, weight: 55.00 },
      { id: 'vf2_10', pack_size: '60 Kg Carboy', sku: 'FALCO-ULTRA-60KG', price: 15203.39, mrp: 17940.00, dealer_price: 12990.00, stock: 8, moq: 1, weight: 60.00 }
    ]
  },
  {
    id: 'p14',
    name: 'Falcofix EBS Synthetic Resin Adhesive',
    slug: 'falcofix-ebs-synthetic-resin-adhesive',
    description: 'General purpose cost-efficient synthetic resin adhesive for construction and general timber repairs.',
    technical_description: 'Standard PVA binder, high compatibility with softwood laminations.',
    price: 220.34,
    mrp: 260.00,
    dealer_price: 168.00,
    moq: 5,
    stock: 150,
    sku: 'FALCO-EBS-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '800 gm PP',
    weight: 0.80,
    shelf_life: '12 Months',
    application: 'General repairs, partition boards, wood-to-cardboard lamination',
    brand_id: 'b9',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'White Liquid Paste', 'Viscosity': '250 Poise' },
    features: ['Cost efficient', 'Easy application spread'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 15,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'vf3_1', pack_size: '800 gm PP', sku: 'FALCO-EBS-800G', price: 220.34, mrp: 260.00, dealer_price: 168.00, stock: 150, moq: 5, weight: 0.80 },
      { id: 'vf3_2', pack_size: '1 Kg Jar', sku: 'FALCO-EBS-1KG', price: 296.61, mrp: 350.00, dealer_price: 219.00, stock: 120, moq: 5, weight: 1.00 },
      { id: 'vf3_3', pack_size: '2 Kg Jar', sku: 'FALCO-EBS-2KG', price: 533.90, mrp: 630.00, dealer_price: 416.00, stock: 80, moq: 5, weight: 2.00 },
      { id: 'vf3_4', pack_size: '5 Kg Jar', sku: 'FALCO-EBS-5KG', price: 1254.24, mrp: 1480.00, dealer_price: 995.00, stock: 60, moq: 2, weight: 5.00 },
      { id: 'vf3_5', pack_size: '10 Kg Bucket', sku: 'FALCO-EBS-10KG', price: 2423.73, mrp: 2860.00, dealer_price: 1920.00, stock: 40, moq: 1, weight: 10.00 },
      { id: 'vf3_6', pack_size: '20 Kg Bucket', sku: 'FALCO-EBS-20KG', price: 4567.80, mrp: 5390.00, dealer_price: 3640.00, stock: 25, moq: 1, weight: 20.00 },
      { id: 'vf3_7', pack_size: '50 Kg Carboy', sku: 'FALCO-EBS-50KG', price: 10627.12, mrp: 12540.00, dealer_price: 8750.00, stock: 15, moq: 1, weight: 50.00 },
      { id: 'vf3_8', pack_size: '60 Kg Carboy', sku: 'FALCO-EBS-60KG', price: 12728.81, mrp: 15020.00, dealer_price: 10260.00, stock: 10, moq: 1, weight: 60.00 }
    ]
  },
  {
    id: 'p15',
    name: 'Falcofix IG 88 Premium Adhesive',
    slug: 'falcofix-ig-88-premium-adhesive',
    description: 'Premium grade industrial wood adhesive specifically formulated for heavy pressure lamination.',
    technical_description: 'High-performance polymer dispersion. Excellent temperature stability.',
    price: 194.92,
    mrp: 230.00,
    dealer_price: 121.00,
    moq: 5,
    stock: 140,
    sku: 'FALCO-IG88-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '1 kg PP',
    weight: 1.00,
    shelf_life: '12 Months',
    application: 'High pressure laminations, commercial wood framing',
    brand_id: 'b9',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'Creamy White Paste', 'Viscosity': '290 Poise' },
    features: ['Heat resistant', 'High coverage rate'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 15,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'vf4_1', pack_size: '1 kg PP', sku: 'FALCO-IG88-1KG', price: 194.92, mrp: 230.00, dealer_price: 121.00, stock: 140, moq: 5, weight: 1.00 },
      { id: 'vf4_2', pack_size: '50 kg Carboy', sku: 'FALCO-IG88-50KG', price: 9525.42, mrp: 11240.00, dealer_price: 5850.00, stock: 20, moq: 1, weight: 50.00 }
    ]
  },
  {
    id: 'p16',
    name: 'Falcofix IG 77 Technical Adhesive',
    slug: 'falcofix-ig-77-technical-adhesive',
    description: 'Medium-modulus woodworking adhesive for automatic and manual edge-banding machines.',
    technical_description: 'PVA resin emulsion. Long open time for precise adjustment.',
    price: 186.44,
    mrp: 220.00,
    dealer_price: 110.00,
    moq: 5,
    stock: 130,
    sku: 'FALCO-IG77-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '1 kg PP',
    weight: 1.00,
    shelf_life: '12 Months',
    application: 'Edge-banding, modular kitchen panels, MDF fixing',
    brand_id: 'b9',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'White Liquid', 'Viscosity': '260 Poise' },
    features: ['Extended open time', 'Vibration dampening'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 15,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'vf5_1', pack_size: '1 kg PP', sku: 'FALCO-IG77-1KG', price: 186.44, mrp: 220.00, dealer_price: 110.00, stock: 130, moq: 5, weight: 1.00 },
      { id: 'vf5_2', pack_size: '50 kg Carboy', sku: 'FALCO-IG77-50KG', price: 8949.15, mrp: 10560.00, dealer_price: 5350.00, stock: 15, moq: 1, weight: 50.00 }
    ]
  },
  {
    id: 'p17',
    name: 'Falcofix IG 66 General Adhesive',
    slug: 'falcofix-ig-66-general-adhesive',
    description: 'Standard-grade woodworking glue ideal for manual assembly and craft works.',
    technical_description: 'Standard PVA copolymer. Dries translucent white.',
    price: 169.49,
    mrp: 200.00,
    dealer_price: 102.00,
    moq: 5,
    stock: 120,
    sku: 'FALCO-IG66-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '1 kg PP',
    weight: 1.00,
    shelf_life: '12 Months',
    application: 'General carpentry, packing box joints, laminations',
    brand_id: 'b9',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'Translucent White Paste', 'Viscosity': '220 Poise' },
    features: ['Easy spread', 'Flexible bond line'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 15,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'vf6_1', pack_size: '1 kg PP', sku: 'FALCO-IG66-1KG', price: 169.49, mrp: 200.00, dealer_price: 102.00, stock: 120, moq: 5, weight: 1.00 },
      { id: 'vf6_2', pack_size: '50 kg Carboy', sku: 'FALCO-IG66-50KG', price: 7694.92, mrp: 9080.00, dealer_price: 4800.00, stock: 20, moq: 1, weight: 50.00 }
    ]
  },
  {
    id: 'p18',
    name: 'Falcofix HWR Waterproof Adhesive',
    slug: 'falcofix-hwr-waterproof-adhesive',
    description: 'Specialist heavy-duty waterproof wood adhesive formulated to withstand high humidity.',
    technical_description: 'Copolymer adhesive with cross-linking agents. Meets D3/D4 weather-proof rating.',
    price: 6186.44,
    mrp: 7300.00,
    dealer_price: 3475.00,
    moq: 2,
    stock: 80,
    sku: 'FALCO-HWR-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '25 kg CARBOY',
    weight: 25.00,
    shelf_life: '12 Months',
    application: 'Bathroom cabinetry, external doors, structural joinery',
    brand_id: 'b9',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'Creamy White Paste', 'Viscosity': '320 Poise' },
    features: ['Boiling water resistant', 'High chemical protection'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 15,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'vf7_1', pack_size: '25 kg Carboy', sku: 'FALCO-HWR-25KG', price: 6186.44, mrp: 7300.00, dealer_price: 3475.00, stock: 80, moq: 2, weight: 25.00 },
      { id: 'vf7_2', pack_size: '50 kg Carboy', sku: 'FALCO-HWR-50KG', price: 11694.92, mrp: 13800.00, dealer_price: 6750.00, stock: 40, moq: 1, weight: 50.00 }
    ]
  },
  {
    id: 'p19',
    name: 'Falcobond + Adhesive',
    slug: 'falcobond-plus-adhesive',
    description: 'General purpose economical bonding solution for packaging, wood, and crafts.',
    technical_description: 'PVA latex adhesive designed for quick set-ups.',
    price: 169.49,
    mrp: 200.00,
    dealer_price: 80.00,
    moq: 5,
    stock: 100,
    sku: 'FALCO-BOND-BASE',
    hsn_code: '35069190',
    gst_percent: 18.00,
    pack_size: '1 kg PP',
    weight: 1.00,
    shelf_life: '12 Months',
    application: 'Box manufacturing, manual packaging laminates, raw board joints',
    brand_id: 'b9',
    category_id: 'c1',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'Creamy White Liquid', 'Viscosity': '200 Poise' },
    features: ['Highly economical', 'Quick setting'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 15,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'vf8_1', pack_size: '1 kg PP', sku: 'FALCO-BOND-1KG', price: 169.49, mrp: 200.00, dealer_price: 80.00, stock: 100, moq: 5, weight: 1.00 },
      { id: 'vf8_2', pack_size: '50 kg Carboy', sku: 'FALCO-BOND-50KG', price: 6855.93, mrp: 8090.00, dealer_price: 3475.00, stock: 30, moq: 1, weight: 50.00 }
    ]
  },
  {
    id: 'p20',
    name: 'Dr. Fixit Plaster Master',
    slug: 'dr-fixit-plaster-master',
    description: 'Plasticizing admixture specifically formulated for high-build sand-cement wall plasters.',
    technical_description: 'Active polymeric water reducing plasticizer emulsion. Minimizes rebound loss and cracking.',
    price: 211.86,
    mrp: 250.00,
    dealer_price: 170.00,
    moq: 6,
    stock: 180,
    sku: 'DF-PM-BASE',
    hsn_code: '38244090',
    gst_percent: 18.00,
    pack_size: '1 Litre Can',
    weight: 1.10,
    shelf_life: '24 Months',
    application: 'External plastering, internal ceiling plasters, mortar joints',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'Yellowish Liquid', 'pH': '7.5' },
    features: ['Reduces shrinkage cracks by 80%', 'Improves brick mortar workability', 'Saves labour costs'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v20_1', pack_size: '1 Litre Can', sku: 'DF-PM-1L', price: 211.86, mrp: 250.00, dealer_price: 170.00, stock: 180, moq: 6, weight: 1.10 },
      { id: 'v20_2', pack_size: '5 Litre Can', sku: 'DF-PM-5L', price: 974.58, mrp: 1150.00, dealer_price: 780.00, stock: 100, moq: 2, weight: 5.30 },
      { id: 'v20_3', pack_size: '10 Litre Can', sku: 'DF-PM-10L', price: 1864.41, mrp: 2200.00, dealer_price: 1500.00, stock: 60, moq: 1, weight: 10.50 },
      { id: 'v20_4', pack_size: '20 Litre Can', sku: 'DF-PM-20L', price: 3474.58, mrp: 4100.00, dealer_price: 2850.00, stock: 30, moq: 1, weight: 21.00 }
    ]
  },
  {
    id: 'p21',
    name: 'Dr. Fixit Bitufix',
    slug: 'dr-fixit-bitufix',
    description: 'Rubber modified coal tar emulsion waterproofing coat for below-ground sub-structures.',
    technical_description: 'Cold applied liquid membrane asphalt emulsion. Dries into a seamless black barrier.',
    price: 720.34,
    mrp: 850.00,
    dealer_price: 580.00,
    moq: 2,
    stock: 100,
    sku: 'DF-BF-BASE',
    hsn_code: '27150090',
    gst_percent: 18.00,
    pack_size: '5 Litre Can',
    weight: 5.20,
    shelf_life: '24 Months',
    application: 'Below-ground concrete foundations, retaining walls, basement external waterproof coating',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Color': 'Black', 'Elongation': '> 150%' },
    features: ['Excellent underground chemical resistance', 'Elastic dampproofing barrier', 'Prevents rising capillary water'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v21_1', pack_size: '5 Litre Can', sku: 'DF-BF-5L', price: 720.34, mrp: 850.00, dealer_price: 580.00, stock: 100, moq: 2, weight: 5.20 },
      { id: 'v21_2', pack_size: '20 Litre Can', sku: 'DF-BF-20L', price: 2627.12, mrp: 3100.00, dealer_price: 2100.00, stock: 40, moq: 1, weight: 20.80 }
    ]
  },
  {
    id: 'p22',
    name: 'Dr. Fixit Pidicrete URP',
    slug: 'dr-fixit-pidicrete-urp',
    description: 'Premium styrene-butadiene (SBR) latex modifier for structural repair, bonding, and waterproofing.',
    technical_description: 'High-solids SBR latex copolymer. Promotes adhesion, tensile, and flexural strengths.',
    price: 322.03,
    mrp: 380.00,
    dealer_price: 255.00,
    moq: 10,
    stock: 300,
    sku: 'DF-URP-BASE',
    hsn_code: '39039090',
    gst_percent: 18.00,
    pack_size: '1 Kg Pack',
    weight: 1.05,
    shelf_life: '12 Months',
    application: 'Bonding agent, waterproofing of terraces, toilets, kitchen chajjas, and structural concrete repair mortar',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'Milky White Liquid', 'Solids Content': '44%' },
    features: ['Exceptional flexural bond strength', 'Prevents micro-cracking', 'Eco-friendly non-toxic formulation'],
    is_featured: false,
    is_trending: true,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v22_1', pack_size: '200 g Tub', sku: 'DF-URP-200G', price: 80.51, mrp: 95.00, dealer_price: 62.00, stock: 300, moq: 10, weight: 0.22 },
      { id: 'v22_2', pack_size: '500 g Tub', sku: 'DF-URP-500G', price: 177.97, mrp: 210.00, dealer_price: 140.00, stock: 200, moq: 10, weight: 0.53 },
      { id: 'v22_3', pack_size: '1 Kg Tub', sku: 'DF-URP-1KG', price: 322.03, mrp: 380.00, dealer_price: 255.00, stock: 300, moq: 5, weight: 1.05 },
      { id: 'v22_4', pack_size: '5 Kg Tub', sku: 'DF-URP-5KG', price: 1483.05, mrp: 1750.00, dealer_price: 1180.00, stock: 120, moq: 2, weight: 5.25 },
      { id: 'v22_5', pack_size: '10 Kg Bucket', sku: 'DF-URP-10KG', price: 2796.61, mrp: 3300.00, dealer_price: 2250.00, stock: 80, moq: 1, weight: 10.50 },
      { id: 'v22_6', pack_size: '20 Kg Bucket', sku: 'DF-URP-20KG', price: 5254.24, mrp: 6200.00, dealer_price: 4200.00, stock: 50, moq: 1, weight: 21.00 },
      { id: 'v22_7', pack_size: '50 Kg Drum', sku: 'DF-URP-50KG', price: 12542.37, mrp: 14800.00, dealer_price: 10200.00, stock: 15, moq: 1, weight: 52.00 }
    ]
  },
  {
    id: 'p23',
    name: 'Dr. Fixit All Seal',
    slug: 'dr-fixit-all-seal',
    description: 'Single component high-build elastomeric waterproof coating designed for wet areas.',
    technical_description: 'Liquid applied polyurethane modified acrylic hybrid polymer coating.',
    price: 355.93,
    mrp: 420.00,
    dealer_price: 285.00,
    moq: 4,
    stock: 150,
    sku: 'DF-AS-BASE',
    hsn_code: '32141000',
    gst_percent: 18.00,
    pack_size: '1 Kg Pack',
    weight: 1.05,
    shelf_life: '24 Months',
    application: 'Waterproofing of toilets, kitchen floors, sunken bathroom areas',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Color': 'White/Grey', 'Tensile Strength': '2.5 MPa' },
    features: ['Resists standing water in sunken toilets', 'Bridges cracks up to 1.5mm', '5 Year warranty expectancy'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v23_1', pack_size: '1 Kg Tub', sku: 'DF-AS-1KG', price: 355.93, mrp: 420.00, dealer_price: 285.00, stock: 150, moq: 4, weight: 1.05 },
      { id: 'v23_2', pack_size: '5 Kg Tub', sku: 'DF-AS-5KG', price: 1677.97, mrp: 1980.00, dealer_price: 1350.00, stock: 90, moq: 2, weight: 5.25 },
      { id: 'v23_3', pack_size: '10 Kg Bucket', sku: 'DF-AS-10KG', price: 3177.97, mrp: 3750.00, dealer_price: 2580.00, stock: 60, moq: 1, weight: 10.50 },
      { id: 'v23_4', pack_size: '20 Kg Bucket', sku: 'DF-AS-20KG', price: 6016.95, mrp: 7100.00, dealer_price: 4900.00, stock: 30, moq: 1, weight: 21.00 },
      { id: 'v23_5', pack_size: '50 Kg Drum', sku: 'DF-AS-50KG', price: 14237.29, mrp: 16800.00, dealer_price: 11800.00, stock: 15, moq: 1, weight: 52.00 }
    ]
  },
  {
    id: 'p24',
    name: 'Dr. Fixit Super Latex',
    slug: 'dr-fixit-super-latex',
    description: 'Styrene-butadiene rubber latex dispersion specifically tailored for economy repair repairs.',
    technical_description: 'Tailored SBR latex emulsion. Promotes concrete waterproofing properties.',
    price: 262.71,
    mrp: 310.00,
    dealer_price: 205.00,
    moq: 10,
    stock: 240,
    sku: 'DF-SL-BASE',
    hsn_code: '39039090',
    gst_percent: 18.00,
    pack_size: '1 Kg Pack',
    weight: 1.05,
    shelf_life: '12 Months',
    application: 'Bonding agent, waterproofing additive for masonry mortars',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Appearance': 'Milky White', 'Solids': '37%' },
    features: ['Bonds strongly to concrete and bricks', 'Reduces water absorption in plaster'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v24_1', pack_size: '200 g Tub', sku: 'DF-SL-200G', price: 67.80, mrp: 80.00, dealer_price: 50.00, stock: 300, moq: 10, weight: 0.22 },
      { id: 'v24_2', pack_size: '500 g Tub', sku: 'DF-SL-500G', price: 144.07, mrp: 170.00, dealer_price: 110.00, stock: 240, moq: 10, weight: 0.53 },
      { id: 'v24_3', pack_size: '1 Kg Tub', sku: 'DF-SL-1KG', price: 262.71, mrp: 310.00, dealer_price: 205.00, stock: 240, moq: 5, weight: 1.05 },
      { id: 'v24_4', pack_size: '5 Kg Tub', sku: 'DF-SL-5KG', price: 1203.39, mrp: 1420.00, dealer_price: 950.00, stock: 100, moq: 2, weight: 5.25 },
      { id: 'v24_5', pack_size: '10 Kg Bucket', sku: 'DF-SL-10KG', price: 2288.14, mrp: 2700.00, dealer_price: 1820.00, stock: 60, moq: 1, weight: 10.50 },
      { id: 'v24_6', pack_size: '20 Kg Bucket', sku: 'DF-SL-20KG', price: 4322.03, mrp: 5100.00, dealer_price: 3450.00, stock: 40, moq: 1, weight: 21.00 }
    ]
  },
  {
    id: 'p25',
    name: 'Dr. Fixit Bathseal Select',
    slug: 'dr-fixit-bathseal-select',
    description: 'Advanced 2-component flexible cementitious waterproofing kit for internal wet zones.',
    technical_description: 'Acrylic polymer liquid dispersion with modified dry mortars. Seamless moisture barrier.',
    price: 1144.07,
    mrp: 1350.00,
    dealer_price: 920.00,
    moq: 2,
    stock: 80,
    sku: 'DF-BSS-BASE',
    hsn_code: '32149000',
    gst_percent: 18.00,
    pack_size: '4 Ltr Pack',
    weight: 4.30,
    shelf_life: '12 Months',
    application: 'Waterproofing of bathrooms, toilets, kitchen floors, drywall partition wet areas',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Elongation': '250%', 'Crack Bridging': '2mm' },
    features: ['Flexible, crack bridging up to 2mm', 'Resists heavy positive water pressure', '12 Years expectancy warranty'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v25_1', pack_size: '4 Ltr Pack', sku: 'DF-BSS-4L', price: 1144.07, mrp: 1350.00, dealer_price: 920.00, stock: 80, moq: 2, weight: 4.30 },
      { id: 'v25_2', pack_size: '10 Ltr Pack', sku: 'DF-BSS-10L', price: 2627.12, mrp: 3100.00, dealer_price: 2100.00, stock: 50, moq: 1, weight: 10.60 },
      { id: 'v25_3', pack_size: '20 Ltr Pack', sku: 'DF-BSS-20L', price: 5000.00, mrp: 5900.00, dealer_price: 4100.00, stock: 30, moq: 1, weight: 21.20 }
    ]
  },
  {
    id: 'p26',
    name: 'Dr. Fixit Fastflex',
    slug: 'dr-fixit-fastflex',
    description: 'Two-component polymer-modified elastomeric waterproof membrane for roofs and water tanks.',
    technical_description: 'Liquid acrylic resin and specialized dry mineral mix. Outstanding hydrostatic resistance.',
    price: 2415.25,
    mrp: 2850.00,
    dealer_price: 1950.00,
    moq: 1,
    stock: 90,
    sku: 'DF-FF-BASE',
    hsn_code: '32149000',
    gst_percent: 18.00,
    pack_size: '12 kg Pack',
    weight: 12.00,
    shelf_life: '12 Months',
    application: 'Roof terraces, wet zones, swimming pools, concrete reservoirs',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Elongation': '120%', 'Crack Bridging': '2mm', 'Hydrostatic Resistance': 'Up to 5 bar' },
    features: ['Withstands up to 5 bar water pressure', 'Food grade safe for drinking water', 'Excellent solar weathering stability'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v26_1', pack_size: '12 Kg Pack', sku: 'DF-FF-12KG', price: 2415.25, mrp: 2850.00, dealer_price: 1950.00, stock: 90, moq: 1, weight: 12.00 },
      { id: 'v26_2', pack_size: '48 Kg Pack', sku: 'DF-FF-48KG', price: 8898.31, mrp: 10500.00, dealer_price: 7200.00, stock: 30, moq: 1, weight: 48.00 }
    ]
  },
  {
    id: 'p27',
    name: 'Dr. Fixit Pidifin 2K',
    slug: 'dr-fixit-pidifin-2k',
    description: 'Acrylic cementitious two-component waterproofing coating for terraces and water retaining structures.',
    technical_description: 'Liquid polymer and mineral powder matrix. Forms a tough protective barrier shell.',
    price: 550.85,
    mrp: 650.00,
    dealer_price: 450.00,
    moq: 2,
    stock: 120,
    sku: 'DF-PF-BASE',
    hsn_code: '32149000',
    gst_percent: 18.00,
    pack_size: '3 kg Pack',
    weight: 3.20,
    shelf_life: '12 Months',
    application: 'Waterproofing of balconies, roof slabs, terrace gardens, bathroom linings',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'Elongation': '50%', 'Crack Bridging': '1mm', 'Pot Life': '45 mins' },
    features: ['Tough abrasion-resistant coat', 'Prevents carbonation in concrete slabs', 'Suitable for both positive and negative waterproofing'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v27_1', pack_size: '3 Kg Pack', sku: 'DF-PF-3KG', price: 550.85, mrp: 650.00, dealer_price: 450.00, stock: 120, moq: 2, weight: 3.20 },
      { id: 'v27_2', pack_size: '15 Kg Pack', sku: 'DF-PF-15KG', price: 2372.88, mrp: 2800.00, dealer_price: 1900.00, stock: 80, moq: 1, weight: 15.60 },
      { id: 'v27_3', pack_size: '30 Kg Pack', sku: 'DF-PF-30KG', price: 4406.78, mrp: 5200.00, dealer_price: 3600.00, stock: 50, moq: 1, weight: 31.00 },
      { id: 'v27_4', pack_size: '90 Kg Pack', sku: 'DF-PF-90KG', price: 12542.37, mrp: 14800.00, dealer_price: 10200.00, stock: 15, moq: 1, weight: 92.50 }
    ]
  },
  {
    id: 'p28',
    name: 'Dr. Fixit Raincoat Neo',
    slug: 'dr-fixit-raincoat-neo',
    description: 'Elastomeric exterior wall waterproofing coating paint providing premium crack bridging and insulation.',
    technical_description: 'High-build acrylic emulsion wall coating. Excellent resistance to dynamic weathering.',
    price: 440.68,
    mrp: 520.00,
    dealer_price: 350.00,
    moq: 4,
    stock: 150,
    sku: 'DF-RCN-BASE',
    hsn_code: '32091090',
    gst_percent: 18.00,
    pack_size: '1 Ltr Can',
    weight: 1.20,
    shelf_life: '24 Months',
    application: 'Exterior structural walls, masonry facades, high-rise plaster weatherproofing',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'DFT': '110 Microns', 'Elongation': '100%', 'Crack Bridging': '0.5mm' },
    features: ['2-in-1 paint and waterproof barrier', '100% elastic coating stretches with substrate', 'Provides carbonation barrier protection'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v28_1', pack_size: '1 Ltr Can', sku: 'DF-RCN-1L', price: 440.68, mrp: 520.00, dealer_price: 350.00, stock: 150, moq: 4, weight: 1.20 },
      { id: 'v28_2', pack_size: '4 Ltr Can', sku: 'DF-RCN-4L', price: 1677.97, mrp: 1980.00, dealer_price: 1350.00, stock: 100, moq: 2, weight: 4.80 },
      { id: 'v28_3', pack_size: '10 Ltr Can', sku: 'DF-RCN-10L', price: 3940.68, mrp: 4650.00, dealer_price: 3180.00, stock: 50, moq: 1, weight: 11.80 },
      { id: 'v28_4', pack_size: '20 Ltr Can', sku: 'DF-RCN-20L', price: 7542.37, mrp: 8900.00, dealer_price: 6100.00, stock: 30, moq: 1, weight: 23.40 }
    ]
  },
  {
    id: 'p29',
    name: 'Dr. Fixit Raincoat Star',
    slug: 'dr-fixit-raincoat-star',
    description: 'Ultra high-build elastomeric exterior waterproofing shield offering maximum life expectancy.',
    technical_description: 'Fortified elastomeric acrylic resin polymer coating. Repels solar radiation and dirt.',
    price: 550.85,
    mrp: 650.00,
    dealer_price: 440.00,
    moq: 4,
    stock: 110,
    sku: 'DF-RCS-BASE',
    hsn_code: '32091090',
    gst_percent: 18.00,
    pack_size: '1 Ltr Can',
    weight: 1.20,
    shelf_life: '24 Months',
    application: 'Premium exterior residential walls, structural facades in heavy rainfall zones',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'DFT': '110 Microns', 'Elongation': '100%', 'Crack Bridging': '0.75mm' },
    features: ['Maximum solar reflection reduces wall heat', 'Resists heavy algae and fungus growth', '7 Years warranty life expectancy'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v29_1', pack_size: '1 Ltr Can', sku: 'DF-RCS-1L', price: 550.85, mrp: 650.00, dealer_price: 440.00, stock: 110, moq: 4, weight: 1.20 },
      { id: 'v29_2', pack_size: '4 Ltr Can', sku: 'DF-RCS-4L', price: 2076.27, mrp: 2450.00, dealer_price: 168.00, stock: 80, moq: 2, weight: 4.80 },
      { id: 'v29_3', pack_size: '10 Ltr Can', sku: 'DF-RCS-10L', price: 4915.25, mrp: 5800.00, dealer_price: 3980.00, stock: 40, moq: 1, weight: 11.80 },
      { id: 'v29_4', pack_size: '20 Ltr Can', sku: 'DF-RCS-20L', price: 9491.53, mrp: 11200.00, dealer_price: 7800.00, stock: 20, moq: 1, weight: 23.40 }
    ]
  },
  {
    id: 'p30',
    name: 'Dr. Fixit Roofseal Classic',
    slug: 'dr-fixit-roofseal-classic',
    description: 'High-build liquid applied waterproof coating membrane for concrete roofs.',
    technical_description: 'Elastomeric polyurethane-acrylic hybrid polymer dispersion. Extremely elastic.',
    price: 491.53,
    mrp: 580.00,
    dealer_price: 390.00,
    moq: 2,
    stock: 90,
    sku: 'DF-RS-BASE',
    hsn_code: '32141000',
    gst_percent: 18.00,
    pack_size: '1 Ltr Can',
    weight: 1.20,
    shelf_life: '24 Months',
    application: 'Concrete flat roofs, terrace weathering layers, parapet waterproofing',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'DFT': '450-500 Microns', 'Elongation': '200%', 'Crack Bridging': '2mm' },
    features: ['Withstands standing rainwater pools', 'High solar reflectance reduces roof temperature', 'Bridges cracks up to 2mm easily'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v30_1', pack_size: '1 Ltr Can', sku: 'DF-RS-1L', price: 491.53, mrp: 580.00, dealer_price: 390.00, stock: 90, moq: 4, weight: 1.20 },
      { id: 'v30_2', pack_size: '4 Ltr Can', sku: 'DF-RS-4L', price: 1864.41, mrp: 2200.00, dealer_price: 1500.00, stock: 60, moq: 2, weight: 4.80 },
      { id: 'v30_3', pack_size: '10 Ltr Can', sku: 'DF-RS-10L', price: 4322.03, mrp: 5100.00, dealer_price: 3500.00, stock: 40, moq: 1, weight: 11.80 },
      { id: 'v30_4', pack_size: '16 Ltr Can', sku: 'DF-RS-16L', price: 5762.71, mrp: 6800.00, dealer_price: 4650.00, stock: 20, moq: 1, weight: 18.80 },
      { id: 'v30_5', pack_size: '20 Ltr Can', sku: 'DF-RS-20L', price: 6233.05, mrp: 7355.00, dealer_price: 5150.00, stock: 15, moq: 1, weight: 23.40 }
    ]
  },
  {
    id: 'p31',
    name: 'Dr. Fixit Roofseal Select',
    slug: 'dr-fixit-roofseal-select',
    description: 'Fiber reinforced heavy duty waterproofing system for flat concrete roofs.',
    technical_description: 'Polymer coating with embedded micro-fibers. Forms a strong elastic mesh blanket.',
    price: 2372.88,
    mrp: 2800.00,
    dealer_price: 1900.00,
    moq: 2,
    stock: 70,
    sku: 'DF-RSS-BASE',
    hsn_code: '32141000',
    gst_percent: 18.00,
    pack_size: '4 Ltr Can',
    weight: 4.80,
    shelf_life: '24 Months',
    application: 'Highly stressed roof slabs, old terrace re-waterproofing, complex roof details',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'DFT': '1000 Microns', 'Elongation': '200%', 'Crack Bridging': '2mm' },
    features: ['Fiber-mesh structure resists tearing', 'Eliminates separate micro-fiber mesh layers', 'Excellent weathering and foot traffic resistance'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v31_1', pack_size: '4 Ltr Can', sku: 'DF-RSS-4L', price: 2372.88, mrp: 2800.00, dealer_price: 1900.00, stock: 70, moq: 2, weight: 4.80 },
      { id: 'v31_2', pack_size: '20 Ltr Can', sku: 'DF-RSS-20L', price: 7457.63, mrp: 8800.00, dealer_price: 6150.00, stock: 30, moq: 1, weight: 23.40 }
    ]
  },
  {
    id: 'p32',
    name: 'Dr. Fixit Roofseal Ultra',
    slug: 'dr-fixit-roofseal-ultra',
    description: 'Premium hybrid polyurethane liquid membrane system for ultra-long lifespan waterproofing.',
    technical_description: 'Aliphatic polyurethane-acrylic hybrid. Completely UV stable.',
    price: 9601.69,
    mrp: 11330.00,
    dealer_price: 7950.00,
    moq: 1,
    stock: 50,
    sku: 'DF-RSU-20L',
    hsn_code: '32141000',
    gst_percent: 18.00,
    pack_size: '20 Ltr Can',
    weight: 23.40,
    shelf_life: '24 Months',
    application: 'High value structures, exposed roofs, heavy water-logged terraces',
    brand_id: 'b2',
    category_id: 'c5',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    specifications: { 'DFT': '1000 Microns', 'Elongation': '300%', 'Crack Bridging': '3mm' },
    features: ['Elite crack bridging up to 3mm', 'Highest UV and thermal protection durability', '15 Years warranty performance'],
    is_featured: false,
    is_trending: false,
    is_flash_sale: false,
    discount_percent: 10,
    tds_url: '#',
    msds_url: '#',
    variants: [
      { id: 'v32_1', pack_size: '20 Ltr Can', sku: 'DF-RSU-20L', price: 9601.69, mrp: 11330.00, dealer_price: 7950.00, stock: 50, moq: 1, weight: 23.40 }
    ]
  }
];

const SEED_BLOGS = [
  { id: 'bl1', title: 'Why 3M VHB Tapes are Replacing Rivets in Modern Metal Framing', slug: 'why-3m-vhb-tapes-replace-rivets', summary: 'Explore how acrylic foam tapes are changing architecture by eliminating drilling and distribution stress.', content: '<p>For decades, welding, rivets, and screws were the only options to secure structural metal sheets. However, 3M VHB Tapes have completely revolutionized this. Through its viscoelastic acrylic foam core, VHB tape distributes load evenly along the entire joint joint boundary rather than focusing stress at a single screw point.</p><p>This leads to superior vibration damping, corrosion protection (as there are no drilled holes to accumulate moisture), and a clean, screwless, modern finish favored by contemporary architectural designers.</p>', image_url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=800&auto=format&fit=crop&q=80', author: 'Dr. Vivek Sharma (Technical Lead)', tags: ['Industrial Tapes', 'Construction', '3M'], created_at: '2026-07-10T12:00:00Z' },
  { id: 'bl2', title: 'A Complete Guide to Waterproofing Basements: Dr. Fixit LW+ Admixtures', slug: 'guide-to-basement-waterproofing-dr-fixit', summary: 'Learn the proper dosing ratios and application tips to ensure seamless water-resistant foundations.', content: '<p>Basement leakages are a nightmare for building integrity. Utilizing a standard plaster is never enough because water capillary suction forces liquid through tiny concrete pores. Using Dr. Fixit LW+ alters this by reducing cement permeability by up to 20%.</p><p>Always maintain a dosage of 200ml per bag of 50Kg cement. Ensure thorough dry-mixing of aggregate before adding the wet admixture to achieve consistent dispersion and avoid dry spots.</p>', image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80', author: 'Ramesh Krishnan (Structure Engineer)', tags: ['Waterproofing', 'Concrete', 'Pidilite'], created_at: '2026-07-12T09:30:00Z' }
];

const SEED_COUPONS = [
  { id: 'cp1', code: 'IND10', discount_value: 10, type: 'percent', min_order_value: 500, is_active: true },
  { id: 'cp2', code: 'BULK5000', discount_value: 5000, type: 'fixed', min_order_value: 50000, is_active: true }
];

export const initLocalDb = () => {
  if (!localStorage.getItem('aditya_brands') || !localStorage.getItem('aditya_products_v4')) {
    localStorage.setItem('aditya_brands', JSON.stringify(SEED_BRANDS));
  }
  if (!localStorage.getItem('aditya_categories')) {
    localStorage.setItem('aditya_categories', JSON.stringify(SEED_CATEGORIES));
  }
  if (!localStorage.getItem('aditya_products') || !localStorage.getItem('aditya_products_v4')) {
    localStorage.setItem('aditya_products', JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem('aditya_products_v4', 'true');
  }
  if (!localStorage.getItem('aditya_blogs')) {
    localStorage.setItem('aditya_blogs', JSON.stringify(SEED_BLOGS));
  }
  if (!localStorage.getItem('aditya_coupons')) {
    localStorage.setItem('aditya_coupons', JSON.stringify(SEED_COUPONS));
  }
  if (!localStorage.getItem('aditya_orders')) {
    localStorage.setItem('aditya_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('aditya_payments')) {
    localStorage.setItem('aditya_payments', JSON.stringify([]));
  }
  if (!localStorage.getItem('aditya_rfqs')) {
    localStorage.setItem('aditya_rfqs', JSON.stringify([]));
  }
  if (!localStorage.getItem('aditya_wishlist')) {
    localStorage.setItem('aditya_wishlist', JSON.stringify([]));
  }
  if (!localStorage.getItem('aditya_reviews')) {
    localStorage.setItem('aditya_reviews', JSON.stringify([]));
  }
  if (!localStorage.getItem('aditya_users')) {
    // Initial users (one customer, one dealer, one admin)
    const initialUsers = [
      { id: 'u1', email: 'customer@example.com', password: 'password', full_name: 'Rahul Mehta', company_name: 'Mehta Fabrication', gst_number: '27AAAAA1111A1Z1', role: 'customer', phone: '+91 9876543210', is_approved: true },
      { id: 'u2', email: 'dealer@example.com', password: 'password', full_name: 'Aditya Gupta', company_name: 'Aditya Hardware & Adhesives', gst_number: '27BBBBB2222B2Z2', role: 'dealer', phone: '+91 9123456789', is_approved: true },
      { id: 'u3', email: 'admin@example.com', password: 'password', full_name: 'System Admin', company_name: 'Aditya Enterprises HQ', gst_number: '27CCCCC3333C3Z3', role: 'admin', phone: '+91 9000000000', is_approved: true }
    ];
    localStorage.setItem('aditya_users', JSON.stringify(initialUsers));
  }
};

// Initialize right away
initLocalDb();

// Database Query APIs
export const db = {
  // Authentication
  login: async (email, password) => {
    const users = JSON.parse(localStorage.getItem('aditya_users'));
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  register: async (userData) => {
    const users = JSON.parse(localStorage.getItem('aditya_users'));
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email is already registered');
    }
    const newUser = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      ...userData,
      is_approved: userData.role === 'customer' ? true : false, // B2B requires approval in real production
    };
    users.push(newUser);
    localStorage.setItem('aditya_users', JSON.stringify(users));
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  getUsers: async () => {
    return JSON.parse(localStorage.getItem('aditya_users') || '[]');
  },

  approveDealer: async (userId) => {
    const users = JSON.parse(localStorage.getItem('aditya_users'));
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].is_approved = true;
      localStorage.setItem('aditya_users', JSON.stringify(users));
    }
    return true;
  },

  // Products CRUD
  getProducts: async () => {
    return JSON.parse(localStorage.getItem('aditya_products'));
  },

  getProductBySlug: async (slug) => {
    const products = JSON.parse(localStorage.getItem('aditya_products'));
    return products.find(p => p.slug === slug);
  },

  saveProduct: async (productData) => {
    const products = JSON.parse(localStorage.getItem('aditya_products'));
    if (productData.id) {
      const idx = products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...productData, updated_at: new Date().toISOString() };
      }
    } else {
      const newProduct = {
        id: 'p_' + Math.random().toString(36).substr(2, 9),
        slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        images: productData.images || ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'],
        specifications: productData.specifications || {},
        features: productData.features || [],
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      products.push(newProduct);
    }
    localStorage.setItem('aditya_products', JSON.stringify(products));
    return true;
  },

  deleteProduct: async (id) => {
    let products = JSON.parse(localStorage.getItem('aditya_products'));
    products = products.filter(p => p.id !== id);
    localStorage.setItem('aditya_products', JSON.stringify(products));
    return true;
  },

  // Categories & Brands
  getCategories: async () => {
    return JSON.parse(localStorage.getItem('aditya_categories'));
  },
  createCategory: async (data) => {
    const cats = JSON.parse(localStorage.getItem('aditya_categories'));
    const newCat = { ...data, id: 'c' + Date.now() };
    cats.push(newCat);
    localStorage.setItem('aditya_categories', JSON.stringify(cats));
    return newCat;
  },
  updateCategory: async (id, data) => {
    const cats = JSON.parse(localStorage.getItem('aditya_categories'));
    const idx = cats.findIndex(c => c.id === id);
    if (idx !== -1) {
      cats[idx] = { ...cats[idx], ...data };
      localStorage.setItem('aditya_categories', JSON.stringify(cats));
      return cats[idx];
    }
    return null;
  },
  deleteCategory: async (id) => {
    const cats = JSON.parse(localStorage.getItem('aditya_categories'));
    localStorage.setItem('aditya_categories', JSON.stringify(cats.filter(c => c.id !== id)));
    return true;
  },

  getBrands: async () => {
    return JSON.parse(localStorage.getItem('aditya_brands'));
  },
  createBrand: async (data) => {
    const brands = JSON.parse(localStorage.getItem('aditya_brands'));
    const newBrand = { ...data, id: 'b' + Date.now() };
    brands.push(newBrand);
    localStorage.setItem('aditya_brands', JSON.stringify(brands));
    return newBrand;
  },
  updateBrand: async (id, data) => {
    const brands = JSON.parse(localStorage.getItem('aditya_brands'));
    const idx = brands.findIndex(b => b.id === id);
    if (idx !== -1) {
      brands[idx] = { ...brands[idx], ...data };
      localStorage.setItem('aditya_brands', JSON.stringify(brands));
      return brands[idx];
    }
    return null;
  },
  deleteBrand: async (id) => {
    const brands = JSON.parse(localStorage.getItem('aditya_brands'));
    localStorage.setItem('aditya_brands', JSON.stringify(brands.filter(b => b.id !== id)));
    return true;
  },

  // Orders
  getOrders: async (userId = null) => {
    const orders = JSON.parse(localStorage.getItem('aditya_orders') || '[]');
    if (userId) {
      return orders.filter(o => o.user_id === userId);
    }
    return orders;
  },

  getOrderById: async (orderId) => {
    const orders = JSON.parse(localStorage.getItem('aditya_orders') || '[]');
    return orders.find(o => o.id === orderId);
  },

  saveOrder: async (orderData) => {
    const orders = JSON.parse(localStorage.getItem('aditya_orders') || '[]');
    const newOrder = {
      id: 'ord_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: 'Order Placed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...orderData
    };
    orders.push(newOrder);
    localStorage.setItem('aditya_orders', JSON.stringify(orders));

    // Reduce inventory
    const products = JSON.parse(localStorage.getItem('aditya_products'));
    newOrder.items.forEach(item => {
      const prod = products.find(p => p.id === item.product_id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    localStorage.setItem('aditya_products', JSON.stringify(products));

    return newOrder;
  },

  updateOrderStatus: async (orderId, status) => {
    const orders = JSON.parse(localStorage.getItem('aditya_orders') || '[]');
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      orders[idx].updated_at = new Date().toISOString();
      localStorage.setItem('aditya_orders', JSON.stringify(orders));
    }
    return true;
  },

  // Payments (Manual Verify)
  getPayments: async () => {
    return JSON.parse(localStorage.getItem('aditya_payments') || '[]');
  },

  submitPayment: async (paymentData) => {
    const payments = JSON.parse(localStorage.getItem('aditya_payments') || '[]');
    const newPayment = {
      id: 'pay_' + Math.random().toString(36).substr(2, 9),
      status: 'Pending Verification',
      created_at: new Date().toISOString(),
      ...paymentData
    };
    payments.push(newPayment);
    localStorage.setItem('aditya_payments', JSON.stringify(payments));

    // Set order status to Payment Pending (waiting verification)
    await db.updateOrderStatus(paymentData.order_id, 'Payment Pending');
    return newPayment;
  },

  verifyPayment: async (paymentId, isApproved, adminRemarks = '') => {
    const payments = JSON.parse(localStorage.getItem('aditya_payments') || '[]');
    const idx = payments.findIndex(p => p.id === paymentId);
    if (idx !== -1) {
      const status = isApproved ? 'Approved' : 'Rejected';
      payments[idx].status = status;
      payments[idx].admin_remarks = adminRemarks;
      payments[idx].verified_at = new Date().toISOString();
      localStorage.setItem('aditya_payments', JSON.stringify(payments));

      // Update Order Status accordingly
      const orderId = payments[idx].order_id;
      const orderStatus = isApproved ? 'Payment Verified' : 'Cancelled';
      await db.updateOrderStatus(orderId, orderStatus);
    }
    return true;
  },

  // RFQ Bulk Quotes
  getRFQs: async (userId = null) => {
    const rfqs = JSON.parse(localStorage.getItem('aditya_rfqs') || '[]');
    if (userId) {
      return rfqs.filter(r => r.user_id === userId);
    }
    return rfqs;
  },

  submitRFQ: async (rfqData) => {
    const rfqs = JSON.parse(localStorage.getItem('aditya_rfqs') || '[]');
    const newRfq = {
      id: 'rfq_' + Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      created_at: new Date().toISOString(),
      ...rfqData
    };
    rfqs.push(newRfq);
    localStorage.setItem('aditya_rfqs', JSON.stringify(rfqs));
    return newRfq;
  },

  respondRFQ: async (rfqId, responseQuotation) => {
    const rfqs = JSON.parse(localStorage.getItem('aditya_rfqs') || '[]');
    const idx = rfqs.findIndex(r => r.id === rfqId);
    if (idx !== -1) {
      rfqs[idx].status = 'Responded';
      rfqs[idx].response_quotation = responseQuotation;
      rfqs[idx].responded_at = new Date().toISOString();
      localStorage.setItem('aditya_rfqs', JSON.stringify(rfqs));
    }
    return true;
  },

  // Coupons
  getCoupons: async () => {
    return JSON.parse(localStorage.getItem('aditya_coupons'));
  },

  // Reviews
  getReviews: async (productId) => {
    const reviews = JSON.parse(localStorage.getItem('aditya_reviews') || '[]');
    return reviews.filter(r => r.product_id === productId);
  },

  submitReview: async (reviewData) => {
    const reviews = JSON.parse(localStorage.getItem('aditya_reviews') || '[]');
    const existingIdx = reviews.findIndex(r => r.user_id === reviewData.user_id && r.product_id === reviewData.product_id);
    const newReview = {
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      ...reviewData
    };
    if (existingIdx !== -1) {
      reviews[existingIdx] = newReview;
    } else {
      reviews.push(newReview);
    }
    localStorage.setItem('aditya_reviews', JSON.stringify(reviews));
    return newReview;
  },

  // Blogs
  getBlogs: async () => {
    return JSON.parse(localStorage.getItem('aditya_blogs'));
  },

  // Admin Dashboard Statistics & Reports
  getDashboardStats: async () => {
    const orders = JSON.parse(localStorage.getItem('aditya_orders') || '[]');
    const payments = JSON.parse(localStorage.getItem('aditya_payments') || '[]');
    const rfqs = JSON.parse(localStorage.getItem('aditya_rfqs') || '[]');
    const users = JSON.parse(localStorage.getItem('aditya_users') || '[]');
    const products = JSON.parse(localStorage.getItem('aditya_products') || '[]');

    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled' && o.status !== 'Order Placed')
      .reduce((sum, o) => sum + parseFloat(o.grand_total), 0);

    const totalGst = orders
      .filter(o => o.status !== 'Cancelled' && o.status !== 'Order Placed')
      .reduce((sum, o) => sum + parseFloat(o.gst_amount), 0);

    const lowStockCount = products.filter(p => p.stock < 15).length;

    return {
      revenue: totalRevenue,
      gstCollected: totalGst,
      ordersCount: orders.length,
      pendingPayments: payments.filter(p => p.status === 'Pending Verification').length,
      pendingRfqs: rfqs.filter(r => r.status === 'Pending').length,
      dealersCount: users.filter(u => u.role === 'dealer' || u.role === 'distributor').length,
      lowStockCount
    };
  },

  getGSTReport: async () => {
    const orders = JSON.parse(localStorage.getItem('aditya_orders') || '[]');
    const verifiedOrders = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Order Placed');
    
    // Group by HSN
    const hsnSummary = {};
    verifiedOrders.forEach(o => {
      o.items.forEach(item => {
        const hsn = item.hsn_code || '35069190';
        if (!hsnSummary[hsn]) {
          hsnSummary[hsn] = { hsn, taxableValue: 0, cgst: 0, sgst: 0, totalGst: 0, totalSales: 0 };
        }
        const itemTaxable = (item.price * item.quantity);
        const itemGst = item.gst_amount;
        hsnSummary[hsn].taxableValue += itemTaxable;
        hsnSummary[hsn].cgst += itemGst / 2;
        hsnSummary[hsn].sgst += itemGst / 2;
        hsnSummary[hsn].totalGst += itemGst;
        hsnSummary[hsn].totalSales += item.total;
      });
    });

    return Object.values(hsnSummary);
  }
};
