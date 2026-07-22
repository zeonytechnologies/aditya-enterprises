import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, ShieldCheck, ShoppingBag, FileSpreadsheet, 
  Layers, Package, AlertCircle, FileText, CheckCircle2, XCircle, Plus, Edit, Trash2, Printer, Tag, Search, ChevronLeft, ChevronRight, MessageCircle, Users, ShoppingCart, X
} from 'lucide-react';
import { api } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { sendEmail } from '../services/mailer';
import OfferPosterManager from '../components/OfferPosterManager';

function useTablePagination(data, searchFields = ['name']) {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when search or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const filtered = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => 
      searchFields.some(field => String(item[field] || '').toLowerCase().includes(lowerSearch))
    );
  }, [data, searchTerm, searchFields]);

  const totalPages = Math.ceil(filtered.length / (itemsPerPage === 'All' ? filtered.length || 1 : itemsPerPage));
  
  // If itemsPerPage is 'All', return everything
  const currentData = itemsPerPage === 'All' 
    ? filtered 
    : filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return {
    searchTerm, setSearchTerm,
    itemsPerPage, setItemsPerPage,
    currentPage, setCurrentPage,
    totalPages,
    currentData,
    totalItems: filtered.length
  };
}

const TableControls = ({ pagination, placeholder = "Search..." }) => {
  const { searchTerm, setSearchTerm, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, totalPages } = pagination;
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-white dark:bg-slate-900 p-4 border rounded-2xl shadow-sm print:hidden">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">Show:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="text-sm border rounded-lg px-2 py-1 bg-slate-50 dark:bg-slate-950 outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="All">All</option>
          </select>
        </div>
        {itemsPerPage !== 'All' && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-slate-500">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  
  const [leads, setLeads] = useState([]);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [resetPasswordNew, setResetPasswordNew] = useState('');
  const [resettingPasswordUserId, setResettingPasswordUserId] = useState(null);
  
  const handleResetUserPassword = async (userId) => {
    if (!resetPasswordNew || resetPasswordNew.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    try {
      await api.admin.updateUserPassword(userId, resetPasswordNew);
      alert("Password updated successfully.");
      setResetPasswordNew('');
      setResettingPasswordUserId(null);
    } catch (err) {
      alert("Failed to update password");
      console.error(err);
    }
  };

  // --- Pagination Hooks ---
  const productsPagination = useTablePagination(products, ['name', 'sku', 'hsn_code']);
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'All') return orders;
    return orders.filter(o => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  const offersPagination = useTablePagination(products, ['name', 'sku']);
  const cataloguesPagination = useTablePagination(catalogues, ['title']);
  const rfqsPagination = useTablePagination(rfqs, ['company_name', 'contact_person', 'status', 'email']);
  const ordersPagination = useTablePagination(filteredOrders, ['id', 'status', 'shipping_name', 'shipping_phone']);
  const pendingPayments = useMemo(() => payments.filter(p => p.status === 'Pending Verification'), [payments]);
  const paymentsPagination = useTablePagination(pendingPayments, ['utr_number', 'status', 'order_id']);
  const usersPagination = useTablePagination(usersList, ['name', 'full_name', 'email', 'company_name', 'role']);
  const leadsPagination = useTablePagination(leads, ['name', 'email', 'mobile']);

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
  const [localOffers, setLocalOffers] = useState({}); // Stores temporary offer % inputs
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: 0, mrp: 0, dealer_price: 0, moq: 1, stock: 10,
    sku: '', hsn_code: '', gst_percent: 18, pack_size: '', weight: 1,
    shelf_life: '', application: '', brand_id: '', category_id: '',
    description: '', is_featured: false, is_flash_sale: false, discount_percent: 0
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

      const allLeads = await api.leads.getAll();
      setLeads(allLeads);

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

  const handleBulkCatalogueUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingCatalogue(true);
      try {
        const files = Array.from(e.target.files);
        let count = 0;
        for (const file of files) {
          const title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          const fileUrl = await api.storage.uploadFile(file, 'catalogues');
          await api.catalogues.create({
            title: title,
            description: 'Bulk uploaded catalogue',
            file_url: fileUrl
          });
          count++;
        }
        alert(`Successfully uploaded ${count} catalogues.`);
        loadAdminData();
      } catch (err) {
        console.error('Error during bulk upload:', err);
        alert('Bulk upload failed: ' + (err.message || 'Unknown error'));
      } finally {
        setUploadingCatalogue(false);
        e.target.value = ''; // clear input
      }
    }
  };

  // Order Actions
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      
      // Find the user for this order and send email
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const user = usersList.find(u => u.id === order.user_id);
        if (user && user.email) {
          sendEmail({
            to: user.email,
            subject: `Order Update: ${order.display_id || order.id.substring(0,8)} is now ${newStatus}`,
            html: `
              <div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px;">
                <h2 style="color: #0f172a;">Order Status Update</h2>
                <p>Hi ${user.name},</p>
                <p>The status of your order <strong>${order.display_id || order.id.substring(0,8)}</strong> has been updated to:</p>
                <h3 style="color: #2563eb; background: #eff6ff; padding: 10px; display: inline-block; border-radius: 6px;">${newStatus}</h3>
                <p>Thank you for shopping with Aditya Enterprises.</p>
              </div>
            `
          }).catch(e => console.error("Mail send failed", e));
        }
      }

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
      description: '', is_featured: false, is_flash_sale: false, discount_percent: 0
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
      description: prod.description, is_featured: !!prod.is_featured, is_flash_sale: !!prod.is_flash_sale, discount_percent: prod.discount_percent || 0
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

  const handleQuickOfferUpdate = async (product, field, value) => {
    try {
      let parsedValue = value;
      if (field === 'discount_percent') {
        parsedValue = parseFloat(value) || 0;
      }
      
      const payload = {
        name: product.name,
        slug: product.slug,
        price: product.price,
        mrp: product.mrp,
        dealer_price: product.dealer_price,
        moq: product.moq,
        stock: product.stock,
        sku: product.sku,
        hsn_code: product.hsn_code,
        gst_percent: product.gst_percent,
        pack_size: product.pack_size,
        weight: product.weight,
        shelf_life: product.shelf_life,
        application: product.application,
        brand_id: product.brand_id,
        category_id: product.category_id,
        description: product.description,
        is_featured: product.is_featured,
        is_flash_sale: product.is_flash_sale,
        discount_percent: product.discount_percent,
        specifications: product.specifications,
        features: product.features,
        images: product.images,
        // Omit variants so we don't trigger a delete/insert cycle in the DB
        id: product.id,
        [field]: parsedValue // Override with new value
      };

      await api.products.save(payload);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, [field]: parsedValue } : p));
    } catch (err) {
      console.error('Error updating offer/featured status:', err);
      alert('Failed to update: ' + (err.message || JSON.stringify(err)));
    }
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
        price = firstVar.price !== undefined && firstVar.price !== '' ? parseFloat(firstVar.price) : price;
        mrp = firstVar.mrp !== undefined && firstVar.mrp !== '' ? parseFloat(firstVar.mrp) : mrp;
        dealer_price = firstVar.dealer_price ? parseFloat(firstVar.dealer_price) : dealer_price;
        stock = firstVar.stock !== undefined && firstVar.stock !== '' ? parseInt(firstVar.stock) : stock;
        moq = firstVar.moq !== undefined && firstVar.moq !== '' ? parseInt(firstVar.moq) : moq;
        sku = firstVar.sku || sku;
        pack_size = firstVar.pack_size || pack_size;
        weight = firstVar.weight !== undefined && firstVar.weight !== '' ? parseFloat(firstVar.weight) : weight;
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
        is_featured: productForm.is_featured,
        is_flash_sale: productForm.is_flash_sale,
        discount_percent: parseFloat(productForm.discount_percent) || 0,
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
        <div className="bg-white dark:bg-slate-900 border p-4.5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-slate-400 font-semibold block uppercase text-[9px]">Total Visitors</span>
          <span className="text-lg font-extrabold font-display text-blue-600">{stats?.totalVisitors || 0}</span>
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
        {false && (
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors ${
              activeTab === 'payments' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
            }`}
          >
            <ShieldCheck className="h-4.5 w-4.5" /> Verify Receipts ({stats?.pendingPayments || 0})
          </button>
        )}
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
            <ShieldCheck className="h-4.5 w-4.5" /> Users Registry ({usersList.length})
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
        <button
          onClick={() => setActiveTab('offers')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors whitespace-nowrap ${
            activeTab === 'offers' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Tag className="h-4.5 w-4.5" /> Offers & Featured
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-4 text-xs font-bold border-b-2 flex items-center gap-1.5 px-3 transition-colors whitespace-nowrap ${
            activeTab === 'leads' ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Users className="h-4.5 w-4.5" /> Leads Capture
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

          <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-display border-b pb-3">Security Settings</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const newPassword = e.target.newPassword.value;
              if (newPassword.length < 6) return alert('Password too short!');
              try {
                await api.admin.updateAdminPassword(user?.id, newPassword);
                alert('Password updated successfully!');
                e.target.reset();
              } catch (err) {
                alert('Failed to update password');
              }
            }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                <input type="password" name="newPassword" required className="w-full mt-1 px-3 py-2 border rounded-xl text-sm bg-slate-50 dark:bg-slate-950" placeholder="Enter new password" />
              </div>
              <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800">Change Password</button>
            </form>
          </div>

        </div>
      )}

      {/* TAB J: Leads */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-display">Captured Leads</h2>
          </div>
          
          <TableControls pagination={leadsPagination} placeholder="Search by Name, Email, Mobile..." />
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase text-[10px] pb-2">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Mobile</th>
                  <th className="py-2.5">Email</th>
                </tr>
              </thead>
              <tbody>
                {leadsPagination.currentData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500">No leads captured yet.</td>
                  </tr>
                ) : (
                  leadsPagination.currentData.map(lead => (
                    <tr key={lead.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                      <td className="py-2.5 whitespace-nowrap text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">{lead.name}</td>
                      <td className="py-2.5 font-mono">{lead.mobile}</td>
                      <td className="py-2.5">{lead.email || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Modals --- */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedUserForDetails(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">{selectedUserForDetails.name || selectedUserForDetails.full_name}</h3>
                <p className="text-sm text-slate-500">{selectedUserForDetails.company_name} | {selectedUserForDetails.email} | {selectedUserForDetails.mobile}</p>
              </div>
              <button onClick={() => setSelectedUserForDetails(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4">
              <button onClick={() => setResettingPasswordUserId(selectedUserForDetails.id)} className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200">
                Reset Password
              </button>
              {resettingPasswordUserId === selectedUserForDetails.id && (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={resetPasswordNew} 
                    onChange={e => setResetPasswordNew(e.target.value)} 
                    placeholder="New Password (min 6)" 
                    className="text-xs px-2 py-1.5 border dark:border-slate-700 bg-transparent rounded outline-none" 
                  />
                  <button onClick={() => handleResetUserPassword(selectedUserForDetails.id)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded font-bold hover:bg-blue-700">Save</button>
                  <button onClick={() => setResettingPasswordUserId(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                </div>
              )}
            </div>

            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              <div>
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-blue-500" /> Order History</h4>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="p-3 font-bold text-slate-500">Order ID</th>
                        <th className="p-3 font-bold text-slate-500">Date</th>
                        <th className="p-3 font-bold text-slate-500">Amount</th>
                        <th className="p-3 font-bold text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(o => o.user_id === selectedUserForDetails.id).length === 0 ? (
                        <tr><td colSpan="4" className="p-4 text-center text-slate-500">No orders found.</td></tr>
                      ) : (
                        orders.filter(o => o.user_id === selectedUserForDetails.id).map(o => (
                          <tr key={o.id} className="border-t border-slate-100 dark:border-slate-800">
                            <td className="p-3 font-mono font-bold">{o.display_id || o.id.substring(0,8)}</td>
                            <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                            <td className="p-3">₹{o.total_amount?.toLocaleString('en-IN')}</td>
                            <td className="p-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">{o.status}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-emerald-500" /> Quotation (RFQ) History</h4>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="p-3 font-bold text-slate-500">Date</th>
                        <th className="p-3 font-bold text-slate-500">Products</th>
                        <th className="p-3 font-bold text-slate-500">Status</th>
                        <th className="p-3 font-bold text-slate-500">Offered Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfqs.filter(r => r.user_id === selectedUserForDetails.id).length === 0 ? (
                        <tr><td colSpan="4" className="p-4 text-center text-slate-500">No RFQs found.</td></tr>
                      ) : (
                        rfqs.filter(r => r.user_id === selectedUserForDetails.id).map(r => (
                          <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800">
                            <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                            <td className="p-3 truncate max-w-[200px]">{r.items?.map(i => i.name).join(', ')}</td>
                            <td className="p-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">{r.status}</span></td>
                            <td className="p-3">{r.offered_price ? `₹${r.offered_price.toLocaleString('en-IN')}` : '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrderDetails(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Order: {selectedOrderDetails.display_id || selectedOrderDetails.id.substring(0,8)}</h3>
                <p className="text-sm text-slate-500">Date: {new Date(selectedOrderDetails.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Customer Details</h4>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800 space-y-1">
                    <p><strong>Name:</strong> {selectedOrderDetails.user?.full_name || selectedOrderDetails.user?.name || selectedOrderDetails.shipping_address?.firstName || 'Retail Customer'}</p>
                    <p><strong>Email:</strong> {selectedOrderDetails.user?.email || '-'}</p>
                    <p><strong>Phone:</strong> {selectedOrderDetails.user?.phone || selectedOrderDetails.billing_address?.phone || '-'}</p>
                    <p><strong>Company:</strong> {selectedOrderDetails.company_name || 'N/A'}</p>
                    <p><strong>GST:</strong> {selectedOrderDetails.gst_number || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Shipping Details</h4>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800 space-y-1">
                    <p>{selectedOrderDetails.shipping_address?.line1}</p>
                    <p>{selectedOrderDetails.shipping_address?.line2}</p>
                    <p>{selectedOrderDetails.shipping_address?.city}, {selectedOrderDetails.shipping_address?.state} {selectedOrderDetails.shipping_address?.postalCode}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Order Items</h4>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="p-3 font-bold text-slate-500">Product</th>
                        <th className="p-3 font-bold text-slate-500 text-center">Qty</th>
                        <th className="p-3 font-bold text-slate-500 text-right">Price</th>
                        <th className="p-3 font-bold text-slate-500 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrderDetails.items?.map((item, idx) => (
                        <tr key={idx} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="p-3 font-semibold">{item.product?.name || 'Unknown Product'}</td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-right">₹{item.price?.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800 space-y-2">
                  <div className="flex justify-between"><span>Subtotal:</span> <strong>₹{selectedOrderDetails.subtotal?.toLocaleString('en-IN')}</strong></div>
                  <div className="flex justify-between"><span>GST:</span> <strong>₹{selectedOrderDetails.total_gst?.toLocaleString('en-IN')}</strong></div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-lg">
                    <span>Grand Total:</span> <strong className="text-blue-600 dark:text-cyan-400">₹{selectedOrderDetails.grand_total?.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB B: Verify Payments (Screenshots / UTR) */}
      {activeTab === 'payments' && (
        <div className="print:hidden space-y-4">
          <h2 className="text-xl font-bold font-display">Pending Manual payment audit desk</h2>
          <TableControls pagination={paymentsPagination} placeholder="Search by UTR, Order ID..." />

          {pendingPayments.length > 0 ? (
            <div className="space-y-6">
              {paymentsPagination.currentData.map(pay => (
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

          <TableControls pagination={productsPagination} placeholder="Search catalog by Name, SKU, HSN..." />

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
                {productsPagination.currentData.map(prod => (
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
          <TableControls pagination={rfqsPagination} placeholder="Search by Company, Email, Status..." />

          {rfqs.length > 0 ? (
            <div className="space-y-6">
              {rfqsPagination.currentData.map(rfq => (
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
                  <div className="flex gap-3 pt-2">
                    <button disabled={uploadingCatalogue} type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {editingCatalogueId ? 'Update Catalogue' : 'Save Catalogue'}
                    </button>
                    {!editingCatalogueId && (
                      <label className="flex-1 py-2.5 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition flex items-center justify-center cursor-pointer">
                        {uploadingCatalogue ? 'Uploading...' : 'Bulk Upload PDFs'}
                        <input type="file" multiple accept=".pdf" className="hidden" onChange={handleBulkCatalogueUpload} disabled={uploadingCatalogue} />
                      </label>
                    )}
                    {editingCatalogueId && (
                      <button type="button" onClick={() => { setEditingCatalogueId(null); setCatalogueForm({ title: '', description: '', file_url: '', fileObj: null }); }} className="flex-1 py-2.5 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[600px]">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
                Existing Catalogues ({catalogues.length})
              </h3>
              <TableControls pagination={cataloguesPagination} placeholder="Search catalogues..." />
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {cataloguesPagination.currentData.map(c => (
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

      {/* TAB: Offers & Featured */}
      {activeTab === 'offers' && (
        <div className="space-y-6 print:hidden">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-display">Offers & Featured Management</h2>
              <p className="text-xs text-slate-500 mt-1">Quickly toggle Flash Deals, Featured items, and update Discount percentages.</p>
            </div>
          </div>
          
          <OfferPosterManager />
          
          <TableControls pagination={offersPagination} placeholder="Search by Product Name, SKU..." />

          <div className="bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Product</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Feature on Homepage</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Include in Flash Deals</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase w-32">Offer %</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {offersPagination.currentData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-400 text-sm italic font-semibold">No products found.</td>
                  </tr>
                ) : (
                  offersPagination.currentData.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400 font-bold">NO IMG</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-slate-500 font-semibold">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={!!product.is_featured} 
                            onChange={(e) => handleQuickOfferUpdate(product, 'is_featured', e.target.checked)}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </td>
                      <td className="p-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={!!product.is_flash_sale} 
                            onChange={(e) => handleQuickOfferUpdate(product, 'is_flash_sale', e.target.checked)}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-red-500"></div>
                        </label>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="relative w-24">
                            <input 
                              type="number" 
                              value={localOffers[product.id] !== undefined ? localOffers[product.id] : (product.discount_percent || 0)} 
                              onChange={(e) => setLocalOffers(prev => ({ ...prev, [product.id]: e.target.value }))}
                              className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900 text-sm pr-6"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">%</span>
                          </div>
                          <button
                            onClick={() => {
                              const val = localOffers[product.id] !== undefined ? localOffers[product.id] : product.discount_percent;
                              handleQuickOfferUpdate(product, 'discount_percent', val);
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shrink-0"
                          >
                            Done
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB F: Order Processing */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold font-display">Order Processing Desk</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Status:</span>
              <select 
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-bold"
              >
                <option value="All">All Orders</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Payment Pending">Payment Pending</option>
                <option value="Payment Verified">Payment Verified</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <TableControls pagination={ordersPagination} placeholder="Search by Order ID, Status, Name..." />

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase text-[10px] pb-2">
                  <th className="py-2.5">Order ID</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Client / Company</th>
                  <th className="py-2.5">Contact</th>
                  <th className="py-2.5 text-right">Items</th>
                  <th className="py-2.5 text-right">Grand Total (₹)</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersPagination.currentData.map(order => (
                  <tr key={order.id} className="border-b last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                    <td className="py-4 font-bold text-blue-600 dark:text-cyan-400 font-mono truncate max-w-[120px]">
                      {order.display_id || order.id.substring(0,8)}
                    </td>
                    <td className="py-4 font-semibold text-slate-550">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-4 font-bold text-slate-950 dark:text-white">
                      {order.company_name || order.user?.full_name || order.user?.name || order.shipping_address?.firstName || 'Retail Customer'}
                    </td>
                    <td className="py-4 text-slate-500 text-[10px]">
                      <div>{order.user?.email || '-'}</div>
                      <div className="font-mono">{order.user?.phone || order.billing_address?.phone || '-'}</div>
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
                    <td className="py-4 text-right flex items-center justify-end gap-2">
                      <button
                        title="View Order Details"
                        onClick={() => setSelectedOrderDetails(order)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-bold text-[10px]"
                      >
                        View
                      </button>
                      <button
                        title="Message Customer on WhatsApp"
                        onClick={() => {
                          const itemsText = order.items?.map(i => `${i.product?.name} x ${i.quantity}`).join('%0A') || '';
                          const customerName = order.user?.full_name || order.user?.name || order.company_name || 'Customer';
                          const msg = `Hello ${customerName},%0A%0AHere are the details for your order ${order.display_id || order.id.substring(0,8)}.%0ACurrent Status: ${order.status}.%0A%0AItems:%0A${itemsText}%0A%0AThank you for shopping with Aditya Enterprises!`;
                          const phone = order.user?.phone || order.billing_address?.phone || '';
                          if (phone) {
                            window.open(`https://wa.me/91${phone.replace(/[^0-9]/g, '').slice(-10)}?text=${msg}`, '_blank');
                          } else {
                            alert("Customer phone number not available.");
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-[#25D366] transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
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
            <h2 className="text-xl font-bold font-display">User Accounts & B2B Registry</h2>
          </div>

          <TableControls pagination={usersPagination} placeholder="Search by Name, Company, Email..." />

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
                {usersPagination.currentData.map(usr => (
                  <tr key={usr.id} 
                      onClick={() => setSelectedUserForDetails(usr)}
                      className="border-b last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 cursor-pointer">
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
                          onClick={(e) => { e.stopPropagation(); handleApproveDealer(usr.id); }}
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

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Basic Price (₹) *</label>
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
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Offer % (Flash Sale)</label>
                  <input
                    type="number"
                    value={productForm.discount_percent}
                    onChange={(e) => setProductForm(prev => ({ ...prev, discount_percent: e.target.value }))}
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

              <div className="flex flex-col sm:flex-row gap-4 border-t pt-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Feature on Homepage</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_flash_sale}
                    onChange={(e) => setProductForm(prev => ({ ...prev, is_flash_sale: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Include in Flash Deals</span>
                </label>
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
