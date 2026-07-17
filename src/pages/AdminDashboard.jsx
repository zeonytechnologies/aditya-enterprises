import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, ShieldCheck, ShoppingBag, FileSpreadsheet, 
  Layers, Package, AlertCircle, FileText, CheckCircle2, XCircle, Plus, Edit, Trash2, Printer 
} from 'lucide-react';
import { api } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'payments', 'products', 'rfqs', 'gst', 'orders', 'users'
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [gstReport, setGstReport] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic lists for specifications and features UI
  const [specItems, setSpecItems] = useState([{ key: '', value: '' }]);
  const [featureItems, setFeatureItems] = useState(['']);
  const [variantItems, setVariantItems] = useState([]);

  // Remarks for payment verifications
  const [verificationRemarks, setVerificationRemarks] = useState({});

  // Brand Form State
  const [brandForm, setBrandForm] = useState({ name: '', slug: '', description: '', logo_url: '' });
  const [editingBrandId, setEditingBrandId] = useState(null);
  
  // Category Form State
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', icon: 'Layers', image_url: '' });
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Catalogue Form State
  const [catalogueForm, setCatalogueForm] = useState({ title: '', description: '', file_url: '' });
  const [editingCatalogueId, setEditingCatalogueId] = useState(null);

  // Upload States
  const [productImages, setProductImages] = useState([]);
  const [uploadingProductImg, setUploadingProductImg] = useState(false);
  const [uploadingBrandImg, setUploadingBrandImg] = useState(false);
  const [uploadingCategoryImg, setUploadingCategoryImg] = useState(false);
  const [uploadingCatalogue, setUploadingCatalogue] = useState(false);

  // Product Edit Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: 0, mrp: 0, dealer_price: 0, moq: 1, stock: 10,
    sku: '', hsn_code: '', gst_percent: 18, pack_size: '', weight: 1,
    shelf_life: '', application: '', brand_id: '', category_id: '',
    description: ''
  });

  // RFQ Response Form State
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [activeRfq, setActiveRfq] = useState(null);
  const [rfqResponse, setRfqResponse] = useState({
    offeredPrice: 0,
    validTill: '30 Days from issue',
    remarks: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadAdminData();
  }, [user, navigate]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const statsData = await api.admin.getStats();
      setStats(statsData);

      const pays = await api.payments.list();
      setPayments(pays);

      const prods = await api.products.list();
      setProducts(prods);

      const quotes = await api.rfqs.list();
      setRfqs(quotes);

      const gstData = await api.admin.getGSTReport();
      setGstReport(gstData);

      const brandList = await api.brands.list();
      setBrands(brandList);

      const catList = await api.categories.list();
      setCategories(catList);

      const catalogList = await api.catalogues.list();
      setCatalogues(catalogList);

      const ordList = await api.orders.list();
      setOrders(ordList);

      const profiles = await api.admin.getUsersList();
      setUsersList(profiles);

    } catch (err) {
      console.error('Failed loading admin database:', err);
    } finally {
      setLoading(false);
    }
  };

  // Brand & Category Actions
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: brandForm.name,
        slug: brandForm.slug || brandForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: brandForm.description,
        logo_url: brandForm.logo_url || 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=200'
      };
      
      if (editingBrandId) {
        await api.brands.update(editingBrandId, payload);
      } else {
        await api.brands.create(payload);
      }
      
      setBrandForm({ name: '', slug: '', description: '', logo_url: '' });
      setEditingBrandId(null);
      loadAdminData();
    } catch (err) {
      console.error('Error saving brand:', err);
      alert('Error saving brand: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEditBrand = (brand) => {
    setBrandForm({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logo_url: brand.logo_url || ''
    });
    setEditingBrandId(brand.id);
    setActiveTab('products'); // Optional, to make sure we are on the right tab if called from somewhere else, but usually we already are.
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand? This might affect products associated with it.')) return;
    try {
      await api.brands.delete(id);
      loadAdminData();
    } catch (err) {
      console.error('Error deleting brand:', err);
      alert('Error deleting brand: ' + (err.message || 'Unknown error'));
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: categoryForm.name,
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: categoryForm.description,
        icon: categoryForm.icon,
        image_url: categoryForm.image_url || 'https://images.unsplash.com/photo-1572883454114-1cf0031ed2a5?w=500'
      };
      
      if (editingCategoryId) {
        await api.categories.update(editingCategoryId, payload);
      } else {
        await api.categories.create(payload);
      }
      
      setCategoryForm({ name: '', slug: '', description: '', icon: 'Layers', image_url: '' });
      setEditingCategoryId(null);
      loadAdminData();
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Error saving category: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEditCategory = (category) => {
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || 'Layers',
      image_url: category.image_url || ''
    });
    setEditingCategoryId(category.id);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This might affect products associated with it.')) return;
    try {
      await api.categories.delete(id);
      loadAdminData();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Error deleting category: ' + (err.message || 'Unknown error'));
    }
  };

  // Catalogue Actions
  const handleCatalogueSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploadingCatalogue(true);
      let finalFileUrl = catalogueForm.file_url || '#';

      if (catalogueForm.fileObj) {
        finalFileUrl = await api.storage.uploadFile(catalogueForm.fileObj, 'catalogues');
      }

      const payload = {
        title: catalogueForm.title,
        description: catalogueForm.description,
        file_url: finalFileUrl
      };
      
      if (editingCatalogueId) {
        await api.catalogues.update(editingCatalogueId, payload);
      } else {
        await api.catalogues.create(payload);
      }
      
      setCatalogueForm({ title: '', description: '', file_url: '', fileObj: null });
      setEditingCatalogueId(null);
      loadAdminData();
    } catch (err) {
      console.error('Error saving catalogue:', err);
      alert('Error saving catalogue: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingCatalogue(false);
    }
  };

  const handleEditCatalogue = (cat) => {
    setCatalogueForm({
      title: cat.title,
      description: cat.description || '',
      file_url: cat.file_url || ''
    });
    setEditingCatalogueId(cat.id);
    setActiveTab('catalogues');
  };

  const handleDeleteCatalogue = async (id) => {
    if (!window.confirm('Are you sure you want to delete this catalogue?')) return;
    try {
      await api.catalogues.delete(id);
      loadAdminData();
    } catch (err) {
      console.error('Error deleting catalogue:', err);
      alert('Error deleting catalogue: ' + (err.message || 'Unknown error'));
    }
  };

  const handleCatalogueFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCatalogueForm(prev => ({ ...prev, fileObj: e.target.files[0] }));
    }
  };

  // Order Actions
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      loadAdminData();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Dealer Approval Actions
  const handleApproveDealer = async (userId) => {
    try {
      await api.admin.approveUserDealerStatus(userId);
      loadAdminData();
    } catch (err) {
      console.error('Error approving dealer status:', err);
    }
  };

  // Payment Actions
  const handleVerifyPayment = async (paymentId, approved) => {
    try {
      const remarks = verificationRemarks[paymentId] || '';
      await api.payments.verify(paymentId, approved, remarks, user.id);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // File Upload Handlers
  const handleProductImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingProductImg(true);
      try {
        const files = Array.from(e.target.files);
        const uploadedUrls = [];
        for (const file of files) {
          const url = await api.storage.uploadFile(file, 'products');
          uploadedUrls.push(url);
        }
        setProductImages(prev => [...prev, ...uploadedUrls]);
      } catch (err) {
        console.error('Product image upload failed:', err);
        alert('Failed to upload image: ' + (err.message || err));
      } finally {
        setUploadingProductImg(false);
      }
    }
  };

  const handleBrandLogoUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingBrandImg(true);
      try {
        const url = await api.storage.uploadFile(file, 'brands');
        setBrandForm(prev => ({ ...prev, logo_url: url }));
      } catch (err) {
        console.error('Brand logo upload failed:', err);
        alert('Failed to upload brand logo: ' + (err.message || err));
      } finally {
        setUploadingBrandImg(false);
      }
    }
  };

  const handleCategoryBannerUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingCategoryImg(true);
      try {
        const url = await api.storage.uploadFile(file, 'categories');
        setCategoryForm(prev => ({ ...prev, image_url: url }));
      } catch (err) {
        console.error('Category banner upload failed:', err);
        alert('Failed to upload category banner: ' + (err.message || err));
      } finally {
        setUploadingCategoryImg(false);
      }
    }
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', price: 0, mrp: 0, dealer_price: 0, moq: 1, stock: 10,
      sku: 'SKU-' + Math.floor(1000 + Math.random()*9000), hsn_code: '35069190', gst_percent: 18, 
      pack_size: '1 Kg Tub', weight: 1, shelf_life: '12 Months', application: 'Furniture, Woodworking',
      brand_id: brands[0]?.id || '', category_id: categories[0]?.id || '',
      description: ''
    });
    setSpecItems([{ key: 'Appearance', value: 'White Paste' }, { key: 'Viscosity', value: '300 Poise' }]);
    setFeatureItems(['Water resistant', 'Eco-friendly']);
    setVariantItems([]);
    setProductImages([]);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name, price: prod.price, mrp: prod.mrp, dealer_price: prod.dealer_price || 0,
      moq: prod.moq || 1, stock: prod.stock, sku: prod.sku, hsn_code: prod.hsn_code,
      gst_percent: prod.gst_percent, pack_size: prod.pack_size || '', weight: prod.weight || 1,
      shelf_life: prod.shelf_life || '', application: prod.application || '',
      brand_id: prod.brand_id || '', category_id: prod.category_id || '',
      description: prod.description
    });
    
    // Convert specifications object to key-value list items
    const initialSpecs = Object.entries(prod.specifications || {}).map(([key, value]) => ({ key, value }));
    setSpecItems(initialSpecs.length > 0 ? initialSpecs : [{ key: '', value: '' }]);

    // Set features array list
    setFeatureItems(prod.features?.length > 0 ? [...prod.features] : ['']);
    setVariantItems(prod.variants?.length > 0 ? [...prod.variants] : []);
    setProductImages(prod.images || []);
    
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build specifications JSON object from dynamic items
      const specifications = {};
      specItems.forEach(item => {
        if (item.key.trim()) {
          specifications[item.key.trim()] = item.value.trim();
        }
      });

      // Build features list
      const features = featureItems.map(f => f.trim()).filter(Boolean);

      // Generate slug from name
      const slug = (editingProduct?.slug) || productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Synchronize master product prices/specs with first variant if variants exist
      let price = parseFloat(productForm.price);
      let mrp = parseFloat(productForm.mrp);
      let dealer_price = productForm.dealer_price ? parseFloat(productForm.dealer_price) : null;
      let stock = parseInt(productForm.stock);
      let moq = parseInt(productForm.moq);
      let sku = productForm.sku;
      let pack_size = productForm.pack_size;
      let weight = parseFloat(productForm.weight);

      if (variantItems && variantItems.length > 0) {
        const firstVar = variantItems[0];
        price = parseFloat(firstVar.price) || price;
        mrp = parseFloat(firstVar.mrp) || mrp;
        dealer_price = firstVar.dealer_price ? parseFloat(firstVar.dealer_price) : dealer_price;
        stock = parseInt(firstVar.stock || 0) || stock;
        moq = parseInt(firstVar.moq || 1) || moq;
        sku = firstVar.sku || sku;
        pack_size = firstVar.pack_size || pack_size;
        weight = parseFloat(firstVar.weight || 0) || weight;
      }

      const payload = {
        name: productForm.name,
        slug,
        price,
        mrp,
        dealer_price,
        moq,
        stock,
        sku,
        hsn_code: productForm.hsn_code,
        gst_percent: parseFloat(productForm.gst_percent),
        pack_size,
        weight,
        shelf_life: productForm.shelf_life,
        application: productForm.application,
        brand_id: productForm.brand_id || null, // Map empty strings to null for UUID schema validation
        category_id: productForm.category_id || null, // Map empty strings to null for UUID schema validation
        description: productForm.description,
        specifications,
        features,
        images: productImages,
        variants: variantItems
      };

      if (editingProduct) {
        payload.id = editingProduct.id;
      }

      await api.products.save(payload);
      setShowProductModal(false);
      loadAdminData();
    } catch (err) {
      console.error('Error saving product formulation:', err);
      alert('Failed to save product: ' + (err.message || JSON.stringify(err)));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.products.delete(id);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // RFQ Quoting Handlers
  const handleOpenRfqQuote = (rfq) => {
    setActiveRfq(rfq);
    setRfqResponse({
      offeredPrice: rfq.product ? rfq.product.price * rfq.quantity * 0.90 : rfq.quantity * 100, // Prefill with 10% discount
      validTill: '30 Days from issue',
      remarks: 'Bulk wholesale price quote prepared by procurements.'
    });
    setShowRfqModal(true);
  };

  const handleRfqResponseSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.rfqs.respond(activeRfq.id, {
        offeredPrice: parseFloat(rfqResponse.offeredPrice),
        validTill: rfqResponse.validTill,
        remarks: rfqResponse.remarks
      });
      setShowRfqModal(false);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen skeleton rounded-3xl" />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white print:bg-white print:text-black">
      
      {/* Overview Headings - Hide on print */}
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-extrabold uppercase tracking-widest">Administrative Panel</span>
          <h1 className="text-3xl font-extrabold font-display mt-0.5">Aditya Enterprises Dashboard</h1>
        </div>
        <div className="text-xs text-slate-450 font-bold">
          System Time: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* 1. Analytics Widget Cards - Hide on print */}
      <section className="print:hidden grid grid-cols-2 lg:grid-cols-6 gap-5 mb-10 text-xs">
        <div className="bg-white dark:bg-slate-900 border p-4.5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-slate-400 font-semibold block uppercase text-[9px]">Sales Revenue</span>
          <span className="text-lg font-extrabold font-display text-slate-900 dark:text-white">₹{(stats?.revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border p-4.5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-slate-400 font-semibold block uppercase text-[9px]">GST Tax Pool</span>
          <span className="text-lg font-extrabold font-display text-slate-900 dark:text-white">₹{(stats?.gstCollected || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border p-4.5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-slate-400 font-semibold block uppercase text-[9px]">Unverified payments</span>
          <span className="text-lg font-extrabold font-display text-amber-600">{stats?.pendingPayments || 0} Orders</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border p-4.5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-slate-400 font-semibold block uppercase text-[9px]">Pending RFQs</span>
          <span className="text-lg font-extrabold font-display text-blue-600 dark:text-cyan-400">{stats?.pendingRfqs || 0} Quotes</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border p-4.5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-slate-400 font-semibold block uppercase text-[9px]">Verified B2B Accounts</span>
          <span className="text-lg font-extrabold font-display text-slate-900 dark:text-white">{stats?.dealersCount || 0} Dealers</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border p-4.5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-slate-400 font-semibold block uppercase text-[9px]">Low Stock warnings</span>
          <span className={`text-lg font-extrabold font-display ${(stats?.lowStockCount || 0) > 0 ? 'text-red-500 font-black animate-pulse' : 'text-slate-900'}`}>{stats?.lowStockCount || 0} Items</span>
        </div>
      </section>

      {/* 2. Menu Navigation Tabs - Hide on print */}
      <div className="print:hidden flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto gap-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <BarChart3 className="h-4.5 w-4.5" /> Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
            activeTab === 'orders' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <ShoppingBag className="h-4.5 w-4.5" /> Order Processing ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
            activeTab === 'payments' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <ShieldCheck className="h-4.5 w-4.5" /> Verify Receipts ({stats?.pendingPayments || 0})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
            activeTab === 'products' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Package className="h-4.5 w-4.5" /> Catalog Editor
        </button>
        <button
          onClick={() => setActiveTab('rfqs')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
            activeTab === 'rfqs' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <FileSpreadsheet className="h-4.5 w-4.5" /> Respond RFQs ({stats?.pendingRfqs || 0})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
            activeTab === 'users' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <ShieldCheck className="h-4.5 w-4.5" /> B2B Approvals ({usersList.filter(u => (u.role === 'dealer' || u.role === 'distributor') && !u.is_approved).length})
        </button>
        <button
          onClick={() => setActiveTab('gst')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
            activeTab === 'gst' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <FileText className="h-4.5 w-4.5" /> HSN/GST Reports
        </button>
        <button
          onClick={() => setActiveTab('brands')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
            activeTab === 'brands' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Layers className="h-4.5 w-4.5" /> Brands & Categories
        </button>
        <button
          onClick={() => setActiveTab('catalogues')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
            activeTab === 'catalogues' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <FileText className="h-4.5 w-4.5" /> Catalogues
        </button>
      </div>

      {/* 3. Tab Contents */}
      
      {/* TAB A: Overview summary */}
      {activeTab === 'overview' && (
        <div className="print:hidden grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-display border-b pb-3">Procurements Alert Monitor</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-xs leading-normal">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <strong className="text-slate-800 dark:text-white font-bold block">Inventory Warning levels</strong>
                  Currently, we have {stats?.lowStockCount || 0} items below safety thresholds. Check catalogs and place refill orders soon.
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs leading-normal">
                <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <strong className="text-slate-800 dark:text-white font-bold block">Pending Manual Audits</strong>
                  There are {stats?.pendingPayments || 0} offline payment transfers awaiting screenshot validation. Verify bank records soon.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-display border-b pb-3">Dealers/Distributors Registrations</h3>
            <div className="space-y-3.5 text-xs">
              <p className="text-slate-500">Dealers registration automatically unlocks special B2B wholesale item rates and volume MOQs. Click below to inspect list.</p>
              <button 
                onClick={() => setActiveTab('users')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
              >
                Open B2B Accounts Directory
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB B: Verify Payments (Screenshots / UTR) */}
      {activeTab === 'payments' && (
        <div className="print:hidden space-y-4">
          <h2 className="text-xl font-bold font-display">Pending Manual payment audit desk</h2>
          
          {payments.filter(p => p.status === 'Pending Verification').length > 0 ? (
            <div className="space-y-6">
              {payments.filter(p => p.status === 'Pending Verification').map(pay => (
                <div 
                  key={pay.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  {/* UTR coordinates */}
                  <div className="lg:col-span-4 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">Order ID Reference</span>
                      <strong className="text-sm font-extrabold text-blue-600 dark:text-cyan-400">{pay.order_id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">UTR / Reference Number</span>
                      <strong className="text-slate-800 dark:text-white">{pay.utr_number}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">Amount Submitted (₹)</span>
                      <strong className="text-slate-800 dark:text-white text-base">₹{pay.amount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">Transaction Date</span>
                      <span className="font-semibold text-slate-650">{new Date(pay.transaction_date).toLocaleDateString()}</span>
                    </div>
                    {pay.notes && (
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">User notes</span>
                        <p className="text-slate-500 italic">"{pay.notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Receipt screenshot */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 border rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Screenshot proof submitted</span>
                    {pay.screenshot_url ? (
                      <div className="h-44 w-full overflow-hidden rounded-xl border bg-white flex items-center justify-center relative group">
                        <img 
                          src={pay.screenshot_url} 
                          alt="Transaction screenshot" 
                          className="max-h-full max-w-full object-contain" 
                        />
                        <button
                          onClick={() => {
                            const win = window.open();
                            win.document.write(`<img src="${pay.screenshot_url}" style="max-width:100%; height:auto;" />`);
                          }}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold"
                        >
                          View Full Size
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">No receipt proof uploaded.</div>
                    )}
                  </div>

                  {/* Actions column */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Audit Remarks</label>
                      <textarea
                        rows="2"
                        placeholder="e.g. UTR verified in bank credit panel."
                        value={verificationRemarks[pay.id] || ''}
                        onChange={(e) => setVerificationRemarks(prev => ({ ...prev, [pay.id]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVerifyPayment(pay.id, true)}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve Payment
                      </button>
                      <button
                        onClick={() => handleVerifyPayment(pay.id, false)}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                      >
                        <XCircle className="h-4 w-4" /> Reject & Cancel
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border rounded-2xl text-xs text-slate-400 italic">
              All payment submissions are verified and audited. No pending items.
            </div>
          )}
        </div>
      )}

      {/* TAB C: Product CRUD list */}
      {activeTab === 'products' && (
        <div className="print:hidden space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-display">Inventory Catalog Management</h2>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="h-4.5 w-4.5" /> Add Product Formulation
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3">SKU</th>
                  <th className="py-3">Product Name</th>
                  <th className="py-3 text-center">Stock</th>
                  <th className="py-3 text-right">Standard Price</th>
                  <th className="py-3 text-right">Dealer Price</th>
                  <th className="py-3 text-center">GST</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id} className="border-b last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                    <td className="py-4 font-bold text-slate-450">{prod.sku}</td>
                    <td className="py-4 font-bold text-slate-950 dark:text-white max-w-xs truncate">{prod.name}</td>
                    <td className="py-4 text-center font-bold">
                      <span className={prod.stock < 15 ? 'text-red-500 font-black animate-pulse' : 'text-slate-800 dark:text-slate-200'}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="py-4 text-right font-semibold">₹{parseFloat(prod.price).toFixed(2)}</td>
                    <td className="py-4 text-right font-semibold text-emerald-600 dark:text-emerald-450">
                      {prod.dealer_price ? `₹${parseFloat(prod.dealer_price).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="py-4 text-center text-slate-400 font-semibold">{prod.gst_percent}%</td>
                    <td className="py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-650 hover:text-blue-700 rounded transition"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-650 hover:text-red-700 rounded transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB D: Review/Respond RFQs */}
      {activeTab === 'rfqs' && (
        <div className="print:hidden space-y-4">
          <h2 className="text-xl font-bold font-display">B2B Bulk Quotation desk</h2>

          {rfqs.length > 0 ? (
            <div className="space-y-6">
              {rfqs.map(rfq => (
                <div 
                  key={rfq.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">RFQ reference ID</span>
                      <strong className="font-extrabold text-slate-800 dark:text-white">{rfq.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">Corporate coordinates</span>
                      <strong className="text-slate-800 dark:text-white">{rfq.company_name} {rfq.gst_number && `(GST: ${rfq.gst_number})`}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">Contact info</span>
                      <span className="text-slate-500 font-semibold">{rfq.contact_email} · {rfq.contact_phone}</span>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${
                      rfq.status === 'Responded' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {rfq.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block mb-0.5">Procurement Details Filed:</span>
                      <p className="text-slate-650 dark:text-slate-350 p-4 bg-slate-50 dark:bg-slate-950 border rounded-xl italic">"{rfq.requirement}"</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Targeted quantity counts:</span> <strong className="text-slate-850 dark:text-white">{rfq.quantity} Packs</strong>
                    </div>
                  </div>

                  {rfq.status === 'Pending' ? (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleOpenRfqQuote(rfq)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-750 text-white text-xs font-bold rounded-xl transition"
                      >
                        Respond Quote Price proposal
                      </button>
                    </div>
                  ) : (
                    rfq.response_quotation && (
                      <div className="bg-slate-50 dark:bg-slate-950 p-3.5 border rounded-xl text-xs space-y-1.5">
                        <strong className="text-emerald-600 font-bold uppercase tracking-wider block text-[10px]">Your Response Quoted contract details:</strong>
                        <div className="flex gap-6">
                          <span>Offered Quote Total: <strong>₹{parseFloat(rfq.response_quotation.offeredPrice).toLocaleString('en-IN')}</strong></span>
                          <span>Validity Period: <strong>{rfq.response_quotation.validTill}</strong></span>
                        </div>
                      </div>
                    )
                  )}

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border rounded-2xl text-xs text-slate-400 italic">
              No pending B2B Bulk RFQ inquiries.
            </div>
          )}
        </div>
      )}

      {/* TAB E: HSN/GST Reports (Tax invoice summaries) */}
      {activeTab === 'gst' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center print:hidden">
            <h2 className="text-xl font-bold font-display">Sales Tax & HSN Summaries</h2>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" /> Print Tax Report
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 md:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
            <div className="border-b pb-4 space-y-1">
              <h3 className="text-lg font-bold font-display text-slate-950 dark:text-white print:text-black">GST/HSN Sales Reconciliation Report</h3>
              <p className="text-xs text-slate-500">Summary of central and state tax distributions for the current accounting cycle.</p>
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase text-[10px] pb-2">
                  <th className="py-2.5">HSN Code</th>
                  <th className="py-2.5 text-right">Total Taxable Value (₹)</th>
                  <th className="py-2.5 text-right">CGST Share (9%) (₹)</th>
                  <th className="py-2.5 text-right">SGST Share (9%) (₹)</th>
                  <th className="py-2.5 text-right">Combined GST Amount (₹)</th>
                  <th className="py-2.5 text-right">Grand Sales Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                {gstReport.map((row, idx) => (
                  <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50/50">
                    <td className="py-3 font-bold text-slate-850 dark:text-white print:text-black">{row.hsn}</td>
                    <td className="py-3 text-right font-semibold">₹{row.taxableValue.toFixed(2)}</td>
                    <td className="py-3 text-right font-semibold text-slate-500">₹{row.cgst.toFixed(2)}</td>
                    <td className="py-3 text-right font-semibold text-slate-500">₹{row.sgst.toFixed(2)}</td>
                    <td className="py-3 text-right font-bold text-slate-700 dark:text-slate-350">₹{row.totalGst.toFixed(2)}</td>
                    <td className="py-3 text-right font-extrabold text-slate-950 dark:text-white print:text-black">₹{row.totalSales.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB H: Brands & Categories Manager */}
      {activeTab === 'brands' && (
        <div className="space-y-8">
          
          {/* Section 1: Add Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Add Brand Card */}
            <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display border-b pb-3 flex items-center gap-1.5">
                <Package className="h-5 w-5 text-blue-600" /> {editingBrandId ? 'Edit Brand' : 'Add New Brand / Manufacturer'}
              </h3>
              <form onSubmit={handleBrandSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fevicol, 3M"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">URL Slug (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. fevicol, 3m"
                    value={brandForm.slug}
                    onChange={(e) => setBrandForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                  <textarea
                    rows="2"
                    placeholder="Brief description of the manufacturer..."
                    value={brandForm.description}
                    onChange={(e) => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Logo Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={brandForm.logo_url}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, logo_url: e.target.value }))}
                      className="flex-1 px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white"
                    />
                    <label className="px-3 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl cursor-pointer font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      {uploadingBrandImg ? '...' : 'Upload'}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleBrandLogoUpload}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-xl transition"
                  >
                    {editingBrandId ? 'Update Brand' : 'Save Brand'}
                  </button>
                  {editingBrandId && (
                    <button
                      type="button"
                      onClick={() => {
                        setBrandForm({ name: '', slug: '', description: '', logo_url: '' });
                        setEditingBrandId(null);
                      }}
                      className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Add Category Card */}
            <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display border-b pb-3 flex items-center gap-1.5">
                <Layers className="h-5 w-5 text-indigo-600" /> {editingCategoryId ? 'Edit Category' : 'Add New Product Category'}
              </h3>
              <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Epoxy Resins, Double-Sided Tapes"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">URL Slug (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. epoxy-resins"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                  <textarea
                    rows="2"
                    placeholder="Brief description of category..."
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Lucide Icon Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Layers, Wrench, Droplets"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Banner Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://..."
                        value={categoryForm.image_url}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, image_url: e.target.value }))}
                        className="flex-1 px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white"
                      />
                      <label className="px-3 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl cursor-pointer font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                        {uploadingCategoryImg ? '...' : 'Upload'}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleCategoryBannerUpload}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl transition"
                  >
                    {editingCategoryId ? 'Update Category' : 'Save Category'}
                  </button>
                  {editingCategoryId && (
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryForm({ name: '', slug: '', description: '', icon: 'Layers', image_url: '' });
                        setEditingCategoryId(null);
                      }}
                      className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

          </div>

          {/* Section 2: Grid lists of current brands & categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            
            {/* Brands List */}
            <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display border-b pb-3">Existing Brands ({brands.length})</h3>
              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                {brands.map(b => (
                  <div key={b.id} className="flex gap-4 items-center p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl relative group">
                    <img src={b.logo_url} alt={b.name} className="h-10 w-10 object-contain rounded-lg border bg-white p-1" />
                    <div className="flex-1">
                      <strong className="text-slate-950 dark:text-white font-bold text-sm block">{b.name}</strong>
                      <span className="text-slate-400 block font-mono text-[10px]">Slug: {b.slug}</span>
                      <p className="text-slate-500 mt-1">{b.description || 'No description provided.'}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3">
                      <button onClick={() => handleEditBrand(b)} className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50" title="Edit Brand">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteBrand(b.id)} className="p-1.5 text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50" title="Delete Brand">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display border-b pb-3">Existing Categories ({categories.length})</h3>
              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                {categories.map(c => (
                  <div key={c.id} className="flex gap-4 items-center p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl relative group">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-650 dark:text-indigo-400 font-bold border shrink-0">
                      {c.icon ? c.icon.substring(0, 2).toUpperCase() : 'CA'}
                    </div>
                    <div className="flex-1">
                      <strong className="text-slate-950 dark:text-white font-bold text-sm block">{c.name}</strong>
                      <span className="text-slate-400 block font-mono text-[10px]">Slug: {c.slug}</span>
                      <p className="text-slate-500 mt-1">{c.description || 'No description provided.'}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3">
                      <button onClick={() => handleEditCategory(c)} className="p-1.5 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50" title="Edit Category">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteCategory(c.id)} className="p-1.5 text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50" title="Delete Category">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB I: Catalogues Manager */}
      {activeTab === 'catalogues' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold mb-4 font-display flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                {editingCatalogueId ? 'Edit Catalogue' : 'Add New Catalogue (PDF)'}
              </h3>
              <form onSubmit={handleCatalogueSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Title *</label>
                  <input required type="text" value={catalogueForm.title} onChange={e => setCatalogueForm({...catalogueForm, title: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" placeholder="e.g. 2024 Product Catalog" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Description</label>
                  <textarea rows="3" value={catalogueForm.description} onChange={e => setCatalogueForm({...catalogueForm, description: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" placeholder="Details about this catalogue" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">PDF File *</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">
                      <span className="text-slate-600 dark:text-slate-300 font-semibold">Choose PDF File</span>
                      <input type="file" accept=".pdf" className="hidden" onChange={handleCatalogueFileChange} />
                    </label>
                  </div>
                  {catalogueForm.fileObj && !uploadingCatalogue && (
                    <p className="text-blue-500 mt-2 text-xs font-semibold truncate">
                      Selected: {catalogueForm.fileObj.name}
                    </p>
                  )}
                  {uploadingCatalogue && <p className="text-blue-500 mt-2 text-xs font-semibold">Uploading to Supabase...</p>}
                  {catalogueForm.file_url && !catalogueForm.fileObj && !uploadingCatalogue && (
                    <p className="text-green-500 mt-2 text-xs font-semibold truncate">
                      Current File: {catalogueForm.file_url}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button disabled={uploadingCatalogue} type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {editingCatalogueId ? 'Update Catalogue' : 'Save Catalogue'}
                  </button>
                  {editingCatalogueId && (
                    <button type="button" onClick={() => { setEditingCatalogueId(null); setCatalogueForm({ title: '', description: '', file_url: '', fileObj: null }); }} className="flex-1 py-2.5 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[600px]">
              <h3 className="text-lg font-bold mb-4 font-display flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                Existing Catalogues ({catalogues.length})
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {catalogues.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{c.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{c.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditCatalogue(c)} className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50" title="Edit Catalogue">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteCatalogue(c.id)} className="p-1.5 text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50" title="Delete Catalogue">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB F: Order Processing */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-display">Order Processing Desk</h2>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase text-[10px] pb-2">
                  <th className="py-2.5">Order ID</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Client / Company</th>
                  <th className="py-2.5 text-right">Items</th>
                  <th className="py-2.5 text-right">Grand Total (₹)</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                    <td className="py-4 font-bold text-blue-600 dark:text-cyan-400 font-mono truncate max-w-[120px]">{order.id}</td>
                    <td className="py-4 font-semibold text-slate-550">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-4 font-bold text-slate-950 dark:text-white">
                      {order.company_name || 'Retail Customer'}
                    </td>
                    <td className="py-4 text-right font-semibold text-slate-650">{order.items?.length || 0}</td>
                    <td className="py-4 text-right font-extrabold text-slate-950 dark:text-white">₹{parseFloat(order.grand_total || 0).toLocaleString('en-IN')}</td>
                    <td className="py-4 text-center">
                      <span className={`px-2.5 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        className="px-2 py-1.5 border rounded-lg bg-slate-50 dark:bg-slate-950 text-[11px] font-bold"
                      >
                        {['Order Placed', 'Payment Pending', 'Payment Verified', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB G: B2B Approvals & User Accounts */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-display">B2B Accounts & Registration Registry</h2>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase text-[10px] pb-2">
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Company Name</th>
                  <th className="py-2.5">GSTIN</th>
                  <th className="py-2.5">Role</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(usr => (
                  <tr key={usr.id} className="border-b last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                    <td className="py-4 font-bold text-slate-950 dark:text-white">{usr.full_name}</td>
                    <td className="py-4 font-semibold text-slate-500">{usr.email}</td>
                    <td className="py-4 font-semibold text-slate-800 dark:text-slate-200">{usr.company_name || 'N/A'}</td>
                    <td className="py-4 font-mono text-slate-450 uppercase">{usr.gst_number || 'N/A'}</td>
                    <td className="py-4 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wide ${
                        usr.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        usr.role === 'dealer' ? 'bg-blue-100 text-blue-700' :
                        usr.role === 'distributor' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`px-2.5 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider ${
                        usr.is_approved ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {usr.is_approved ? 'Approved' : 'Pending Verification'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {(usr.role === 'dealer' || usr.role === 'distributor') && !usr.is_approved && (
                        <button
                          onClick={() => handleApproveDealer(usr.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition"
                        >
                          Approve Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD MODAL FORM popup */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 space-y-5 relative my-8 border max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-extrabold font-display border-b pb-3">
              {editingProduct ? 'Edit Catalog Formulation' : 'Create New Product Record'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Retail Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">MRP Catalog (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.mrp}
                    onChange={(e) => setProductForm(prev => ({ ...prev, mrp: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Dealer B2B Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.dealer_price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, dealer_price: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>

              {variantItems.length > 0 && (
                <p className="text-[10px] text-blue-600 dark:text-cyan-400 font-semibold mt-1">
                  💡 Note: Base prices, stock, and MOQ will automatically sync with the first variant you define below.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Stock Level *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">B2B MOQ *</label>
                  <input
                    type="number"
                    required
                    value={productForm.moq}
                    onChange={(e) => setProductForm(prev => ({ ...prev, moq: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">HSN Code *</label>
                  <input
                    type="text"
                    required
                    value={productForm.hsn_code}
                    onChange={(e) => setProductForm(prev => ({ ...prev, hsn_code: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">GST Slab (%) *</label>
                  <select
                    value={productForm.gst_percent}
                    onChange={(e) => setProductForm(prev => ({ ...prev, gst_percent: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  >
                    {[5, 12, 18, 28].map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Brand Association *</label>
                  <select
                    value={productForm.brand_id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, brand_id: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  >
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Category Association *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Description Details *</label>
                <textarea
                  required
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              {/* Product Images Manager */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Product Formulation Images</label>
                  <label className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1">
                    + Upload Image
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handleProductImageUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                {uploadingProductImg && (
                  <p className="text-[10px] text-blue-500 font-bold animate-pulse">Uploading new images to Supabase storage...</p>
                )}
                {productImages.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-semibold italic">No formulation images uploaded yet. Default fallback will render on checkout/details.</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {productImages.map((url, idx) => (
                      <div key={idx} className="relative group h-16 w-16 border rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex-shrink-0">
                        <img src={url} alt={`Formulation Image ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProductImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-red-650/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Specifications & Features UI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                
                {/* Specifications Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Technical Specifications</label>
                    <button
                      type="button"
                      onClick={() => setSpecItems(prev => [...prev, { key: '', value: '' }])}
                      className="text-blue-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1 text-[10px]"
                    >
                      + Add Specification
                    </button>
                  </div>
                  <div className="space-y-2">
                    {specItems.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Name (e.g. Viscosity)"
                          value={item.key}
                          onChange={(e) => {
                            const updated = [...specItems];
                            updated[idx].key = e.target.value;
                            setSpecItems(updated);
                          }}
                          className="flex-1 px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 300 Poise)"
                          value={item.value}
                          onChange={(e) => {
                            const updated = [...specItems];
                            updated[idx].value = e.target.value;
                            setSpecItems(updated);
                          }}
                          className="flex-1 px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-xs"
                        />
                        {specItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setSpecItems(prev => prev.filter((_, i) => i !== idx))}
                            className="p-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Key Product Features</label>
                    <button
                      type="button"
                      onClick={() => setFeatureItems(prev => [...prev, ''])}
                      className="text-blue-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1 text-[10px]"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {featureItems.map((feature, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Feature (e.g. Water resistant)"
                          value={feature}
                          onChange={(e) => {
                            const updated = [...featureItems];
                            updated[idx] = e.target.value;
                            setFeatureItems(updated);
                          }}
                          className="flex-1 px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-xs"
                        />
                        {featureItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setFeatureItems(prev => prev.filter((_, i) => i !== idx))}
                            className="p-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Variants Section */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Product Variants (Flipkart-Style Sizing)</label>
                  <button
                    type="button"
                    onClick={() => setVariantItems(prev => [...prev, {
                      pack_size: '',
                      sku: 'SKU-' + Math.floor(1000 + Math.random()*9000),
                      mrp: 0,
                      price: 0,
                      dealer_price: 0,
                      stock: 10,
                      moq: 1,
                      weight: 1
                    }])}
                    className="text-blue-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1 text-[10px]"
                  >
                    + Add Variant
                  </button>
                </div>
                {variantItems.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-semibold italic">No package size variants defined. Default product specifications and pricing will be used.</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {variantItems.map((variant, idx) => (
                      <div key={idx} className="p-3 border rounded-2xl bg-slate-50 dark:bg-slate-950 space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => setVariantItems(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg text-xs font-bold"
                          title="Remove Variant"
                        >
                          ✕ Remove
                        </button>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">Pack Size *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 5 Kg Tub"
                              value={variant.pack_size}
                              onChange={(e) => {
                                const updated = [...variantItems];
                                updated[idx].pack_size = e.target.value;
                                setVariantItems(updated);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">SKU *</label>
                            <input
                              type="text"
                              required
                              placeholder="SKU"
                              value={variant.sku}
                              onChange={(e) => {
                                const updated = [...variantItems];
                                updated[idx].sku = e.target.value;
                                setVariantItems(updated);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">Weight (Kg) *</label>
                            <input
                              type="number"
                              step="any"
                              required
                              value={variant.weight}
                              onChange={(e) => {
                                const updated = [...variantItems];
                                updated[idx].weight = parseFloat(e.target.value) || 0;
                                setVariantItems(updated);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">Stock *</label>
                            <input
                              type="number"
                              required
                              value={variant.stock}
                              onChange={(e) => {
                                const updated = [...variantItems];
                                updated[idx].stock = parseInt(e.target.value) || 0;
                                setVariantItems(updated);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">MRP (INR) *</label>
                            <input
                              type="number"
                              required
                              value={variant.mrp}
                              onChange={(e) => {
                                const updated = [...variantItems];
                                updated[idx].mrp = parseFloat(e.target.value) || 0;
                                setVariantItems(updated);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">Retail Price *</label>
                            <input
                              type="number"
                              required
                              value={variant.price}
                              onChange={(e) => {
                                const updated = [...variantItems];
                                updated[idx].price = parseFloat(e.target.value) || 0;
                                setVariantItems(updated);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">Dealer Price *</label>
                            <input
                              type="number"
                              required
                              value={variant.dealer_price}
                              onChange={(e) => {
                                const updated = [...variantItems];
                                updated[idx].dealer_price = parseFloat(e.target.value) || 0;
                                setVariantItems(updated);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">MOQ (Units) *</label>
                            <input
                              type="number"
                              required
                              value={variant.moq}
                              onChange={(e) => {
                                const updated = [...variantItems];
                                updated[idx].moq = parseInt(e.target.value) || 0;
                                setVariantItems(updated);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-xl text-xs transition"
              >
                Commit Product formulation
              </button>

            </form>
          </div>
        </div>
      )}

      {/* RFQ QUOTE MODAL FORM */}
      {showRfqModal && activeRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 space-y-5 border relative">
            <button 
              onClick={() => setShowRfqModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-extrabold font-display border-b pb-3">Construct Price Contract</h3>
            
            <form onSubmit={handleRfqResponseSubmit} className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block font-bold text-[9px] uppercase">Client Inquired detail</span>
                <p className="font-bold text-slate-800 dark:text-white leading-relaxed">{activeRfq.company_name} requests {activeRfq.quantity} units of {activeRfq.product?.name || 'custom formulation'}</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Total Offered Quote Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={rfqResponse.offeredPrice}
                  onChange={(e) => setRfqResponse(prev => ({ ...prev, offeredPrice: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Quote Contract Validity Period</label>
                <input
                  type="text"
                  required
                  value={rfqResponse.validTill}
                  onChange={(e) => setRfqResponse(prev => ({ ...prev, validTill: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Technical Remarks / Special terms</label>
                <textarea
                  rows="3"
                  value={rfqResponse.remarks}
                  onChange={(e) => setRfqResponse(prev => ({ ...prev, remarks: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-xl transition"
              >
                Send Wholesale Price Quote
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
