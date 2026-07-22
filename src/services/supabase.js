import { createClient } from '@supabase/supabase-js';
import { db } from './db';
import CryptoJS from 'crypto-js';

// Supabase environment variables (can be added to a .env file later)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if real Supabase configuration is present
export const isSupabaseConfigured = supabaseUrl && supabaseKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase keys are missing. The Aditya Enterprises platform is running in simulated offline mode using LocalStorage database!'
  );
}

// Fallback-friendly SHA-256 password hashing helper
export async function hashPassword(password) {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
}

// Unified API Service Layer (Repository Pattern)
export const api = {
  auth: {
    login: async (identifier, password) => {
      if (isSupabaseConfigured) {
        const hashedPassword = await hashPassword(password);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`email.eq.${identifier},username.eq.${identifier}`)
          .eq('password', hashedPassword)
          .single();
          
        if (error || !data) throw new Error('Invalid credentials');
        return data;
      } else {
        return await db.login(identifier, password);
      }
    },

    updateProfile: async (userId, updateData) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId);
        if (error) throw error;
        return true;
      }
      return false;
    },

    register: async (email, password, fullName, companyName = '', gstNumber = '', role = 'customer', phone = '') => {
      if (isSupabaseConfigured) {
        const hashedPassword = await hashPassword(password);
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            email,
            password: hashedPassword,
            full_name: fullName,
            company_name: companyName,
            gst_number: gstNumber,
            role,
            phone,
            is_approved: role === 'customer'
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        return await db.register({
          email,
          password,
          full_name: fullName,
          company_name: companyName,
          gst_number: gstNumber,
          role,
          phone
        });
      }
    },

    getCurrentUser: () => {
      const stored = localStorage.getItem('aditya_current_user');
      return stored ? JSON.parse(stored) : null;
    },

    getSessionUser: async () => {
      // In custom table credentials mode, we restore the cached profile session from localStorage
      const stored = localStorage.getItem('aditya_current_user');
      return stored ? JSON.parse(stored) : null;
    },

    logout: async () => {
      localStorage.removeItem('aditya_current_user');
      return true;
    }
  },

  products: {
    list: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('products')
          .select('*, brand:brands(*), category:categories(*), variants:product_variants(*)');
        if (error) throw error;
        return data;
      } else {
        const prods = await db.getProducts();
        const brands = await db.getBrands();
        const cats = await db.getCategories();
        
        return prods.map(p => ({
          ...p,
          variants: p.variants || [],
          brand: brands.find(b => b.id === p.brand_id),
          category: cats.find(c => c.id === p.category_id)
        }));
      }
    },

    getBySlug: async (slug) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('products')
          .select('*, brand:brands(*), category:categories(*), variants:product_variants(*)')
          .eq('slug', slug)
          .single();
        if (error) throw error;
        return data;
      } else {
        const p = await db.getProductBySlug(slug);
        if (!p) return null;
        const brands = await db.getBrands();
        const cats = await db.getCategories();
        return {
          ...p,
          variants: p.variants || [],
          brand: brands.find(b => b.id === p.brand_id),
          category: cats.find(c => c.id === p.category_id)
        };
      }
    },

    save: async (productData) => {
      if (isSupabaseConfigured) {
        const { variants, ...prodFields } = productData;
        // Strip out relational fields to avoid DB columns error
        delete prodFields.brand;
        delete prodFields.category;
        delete prodFields.variants;

        const { data, error } = await supabase
          .from('products')
          .upsert(prodFields)
          .select()
          .single();
        if (error) throw error;

        if (variants && Array.isArray(variants)) {
          // Clean delete of existing child variants
          await supabase.from('product_variants').delete().eq('product_id', data.id);

          if (variants.length > 0) {
            const variantsToInsert = variants.map(v => ({
              product_id: data.id,
              pack_size: v.pack_size,
              sku: v.sku,
              price: parseFloat(v.price),
              mrp: parseFloat(v.mrp),
              dealer_price: v.dealer_price ? parseFloat(v.dealer_price) : null,
              stock: parseInt(v.stock || 0),
              moq: parseInt(v.moq || 1),
              weight: parseFloat(v.weight || 0)
            }));
            const { error: varError } = await supabase.from('product_variants').insert(variantsToInsert);
            if (varError) throw varError;
          }
        }
        return data;
      } else {
        return await db.saveProduct(productData);
      }
    },

    delete: async (id) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return true;
      } else {
        return await db.deleteProduct(id);
      }
    }
  },

  categories: {
    list: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return data;
      } else {
        return await db.getCategories();
      }
    },
    create: async (categoryData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('categories')
          .insert(categoryData)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      return await db.createCategory?.(categoryData) || categoryData;
    },
    update: async (id, categoryData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      return await db.updateCategory?.(id, categoryData) || categoryData;
    },
    delete: async (id) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      }
      await db.deleteCategory?.(id);
      return true;
    }
  },

  brands: {
    list: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('brands').select('*');
        if (error) throw error;
        return data;
      } else {
        return await db.getBrands();
      }
    },
    create: async (brandData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('brands')
          .insert(brandData)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      return await db.createBrand?.(brandData) || brandData;
    },
    update: async (id, brandData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('brands')
          .update(brandData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      return await db.updateBrand?.(id, brandData) || brandData;
    },
    delete: async (id) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('brands')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      }
      await db.deleteBrand?.(id);
      return true;
    }
  },

  catalogues: {
    list: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('catalogues').select('*');
        if (error) throw error;
        return data;
      } else {
        return await db.getCatalogues();
      }
    },
    create: async (catalogueData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('catalogues')
          .insert(catalogueData)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      return await db.createCatalogue?.(catalogueData) || catalogueData;
    },
    update: async (id, catalogueData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('catalogues')
          .update(catalogueData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      return await db.updateCatalogue?.(id, catalogueData) || catalogueData;
    },
    delete: async (id) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('catalogues').delete().eq('id', id);
        if (error) throw error;
        return true;
      }
      return await db.deleteCatalogue?.(id) || true;
    }
  },

  orders: {
    list: async (userId = null) => {
      if (isSupabaseConfigured) {
        let query = supabase.from('orders').select('*, items:order_items(*, product:products(*)), user:profiles(*)');
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } else {
        const ords = await db.getOrders(userId);
        const products = await db.getProducts();
        
        return ords.map(o => ({
          ...o,
          items: o.items.map(item => ({
            ...item,
            product: products.find(p => p.id === item.product_id)
          }))
        })).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      }
    },

    getById: async (id) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*, product:products(*))')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } else {
        const order = await db.getOrderById(id);
        if (!order) return null;
        const products = await db.getProducts();
        return {
          ...order,
          items: order.items.map(item => ({
            ...item,
            product: products.find(p => p.id === item.product_id)
          }))
        };
      }
    },

    create: async (orderData) => {
      if (isSupabaseConfigured) {
        // Core order insertion
        const { data: order, error } = await supabase
          .from('orders')
          .insert({
            user_id: orderData.user_id,
            subtotal: orderData.subtotal,
            discount: orderData.discount,
            gst_amount: orderData.gst_amount,
            cgst: orderData.cgst,
            sgst: orderData.sgst,
            shipping: orderData.shipping,
            grand_total: orderData.grand_total,
            company_name: orderData.company_name,
            gst_number: orderData.gst_number,
            billing_address: orderData.billing_address,
            shipping_address: orderData.shipping_address,
            delivery_notes: orderData.delivery_notes
          })
          .select();

        if (error) throw error;
        
        if (!order || order.length === 0) {
          throw new Error("Order was inserted but could not be retrieved. Please check RLS policies.");
        }
        const createdOrder = order[0];

        // Insert items
        const itemsToInsert = orderData.items.map(item => ({
          order_id: createdOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          gst_percent: item.gst_percent,
          gst_amount: item.gst_amount,
          total: item.total
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
        if (itemsError) throw itemsError;

        return createdOrder;
      } else {
        return await db.saveOrder(orderData);
      }
    },

    updateStatus: async (orderId, status) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
        if (error) throw error;
        return true;
      } else {
        return await db.updateOrderStatus(orderId, status);
      }
    }
  },

  payments: {
    list: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('payments')
          .select('*, order:orders(*)');
        if (error) throw error;
        return data;
      } else {
        const payments = await db.getPayments();
        const orders = await db.getOrders();
        return payments.map(p => ({
          ...p,
          order: orders.find(o => o.id === p.order_id)
        })).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      }
    },

    submit: async (paymentData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('payments')
          .insert(paymentData)
          .select()
          .single();
        if (error) throw error;
        // Update order status to Payment Pending
        await supabase.from('orders').update({ status: 'Payment Pending' }).eq('id', paymentData.order_id);
        return data;
      } else {
        return await db.submitPayment(paymentData);
      }
    },

    verify: async (paymentId, approved, remarks = '', adminId = null) => {
      if (isSupabaseConfigured) {
        const status = approved ? 'Approved' : 'Rejected';
        const { data: payment, error } = await supabase
          .from('payments')
          .update({
            status,
            admin_remarks: remarks,
            verified_by: adminId,
            verified_at: new Date().toISOString()
          })
          .eq('id', paymentId)
          .select()
          .single();
        if (error) throw error;

        const orderStatus = approved ? 'Payment Verified' : 'Cancelled';
        await supabase.from('orders').update({ status: orderStatus }).eq('id', payment.order_id);
        return true;
      } else {
        return await db.verifyPayment(paymentId, approved, remarks);
      }
    }
  },

  rfqs: {
    list: async (userId = null) => {
      if (isSupabaseConfigured) {
        let query = supabase.from('rfqs').select('*, product:products(*)');
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } else {
        const rfqs = await db.getRFQs(userId);
        const products = await db.getProducts();
        return rfqs.map(r => ({
          ...r,
          product: products.find(p => p.id === r.product_id)
        })).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      }
    },

    submit: async (rfqData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('rfqs').insert(rfqData).select().single();
        if (error) throw error;
        return data;
      } else {
        return await db.submitRFQ(rfqData);
      }
    },

    respond: async (rfqId, responseQuotation) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('rfqs')
          .update({
            status: 'Responded',
            response_quotation: responseQuotation,
            responded_at: new Date().toISOString()
          })
          .eq('id', rfqId);
        if (error) throw error;
        return true;
      } else {
        return await db.respondRFQ(rfqId, responseQuotation);
      }
    }
  },

  blogs: {
    list: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } else {
        return await db.getBlogs();
      }
    }
  },

  coupons: {
    list: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('coupons').select('*').eq('is_active', true);
        if (error) throw error;
        return data;
      } else {
        return await db.getCoupons();
      }
    }
  },

  reviews: {
    list: async (productId) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*, user:profiles(full_name)')
          .eq('product_id', productId);
        if (error) throw error;
        return data;
      } else {
        const reviews = await db.getReviews(productId);
        const users = await db.getUsers();
        return reviews.map(r => ({
          ...r,
          user: { full_name: (users.find(u => u.id === r.user_id)?.full_name || 'Anonymous') }
        }));
      }
    },

    submit: async (reviewData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('reviews').upsert(reviewData).select().single();
        if (error) throw error;
        return data;
      } else {
        return await db.submitReview(reviewData);
      }
    }
  },

  admin: {
    getStats: async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: orders } = await supabase.from('orders').select('*');
          const { data: products } = await supabase.from('products').select('stock');
          const { data: rfqs } = await supabase.from('rfqs').select('status');
          const { data: payments } = await supabase.from('payments').select('status');
          const { data: profiles } = await supabase.from('profiles').select('role, is_approved');
          const { data: visitors } = await supabase.from('visitors').select('created_at');
          
          const totalRevenue = orders?.reduce((acc, curr) => acc + parseFloat(curr.grand_total || 0), 0) || 0;
          const gstCollected = orders?.reduce((acc, curr) => acc + parseFloat(curr.gst_amount || 0), 0) || 0;
          const pendingPayments = payments?.filter(p => p.status === 'Pending Verification').length || 0;
          const pendingRfqs = rfqs?.filter(r => r.status === 'Pending').length || 0;
          const dealersCount = profiles?.filter(p => (p.role === 'dealer' || p.role === 'distributor') && p.is_approved).length || 0;
          const lowStockCount = products?.filter(p => p.stock < 15).length || 0;
          const totalVisitors = visitors?.length || 0;
          
          return {
            revenue: totalRevenue,
            gstCollected,
            pendingPayments,
            pendingRfqs,
            dealersCount,
            lowStockCount,
            totalVisitors,
            totalOrders: orders?.length || 0,
            recentSales: orders?.slice(0, 5).map(o => ({
              id: o.id,
              date: new Date(o.created_at).toLocaleDateString('en-IN'),
              customer: o.company_name || 'Retail Client',
              amount: parseFloat(o.grand_total),
              status: o.status
            })) || []
          };
        } catch (err) {
          console.error('Error fetching live stats from Supabase:', err);
        }
      }
      return await db.getDashboardStats();
    },

    getGSTReport: async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: items, error } = await supabase
            .from('order_items')
            .select('*, product:products(hsn_code)');
            
          if (!error && items) {
            const hsnGroups = {};
            items.forEach(item => {
              const hsn = item.product?.hsn_code || '35069190';
              const price = parseFloat(item.price);
              const qty = parseInt(item.quantity);
              const gstPercent = parseFloat(item.gst_percent);
              
              const taxable = price * qty;
              const gstAmt = taxable * (gstPercent / 100);
              const totalVal = taxable + gstAmt;
              
              if (!hsnGroups[hsn]) {
                hsnGroups[hsn] = { hsn, taxableValue: 0, cgst: 0, sgst: 0, totalGst: 0, totalSales: 0 };
              }
              hsnGroups[hsn].taxableValue += taxable;
              hsnGroups[hsn].cgst += (gstAmt / 2);
              hsnGroups[hsn].sgst += (gstAmt / 2);
              hsnGroups[hsn].totalGst += gstAmt;
              hsnGroups[hsn].totalSales += totalVal;
            });
            return Object.values(hsnGroups);
          }
        } catch (err) {
          console.error('Error fetching live GST report:', err);
        }
      }
      return await db.getGSTReport();
    },

    getUsersList: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      }
      return await db.getUsers();
    },

    approveUserDealerStatus: async (userId) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .update({ is_approved: true })
          .eq('id', userId)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      return await db.approveDealer(userId);
    }
  },

  leads: {
    submit: async (data) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('leads').insert(data);
        if (error) throw error;
        return true;
      }
      return true;
    },
    getAll: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      }
      return [];
    }
  },

  visitors: {
    record: async (path) => {
      if (isSupabaseConfigured) {
        // Debounce or filter can be done on frontend
        const { error } = await supabase.from('visitors').insert({ path });
        if (error) console.error("Visitor track err", error);
      }
    },
    getStats: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('visitors').select('*');
        if (error) return [];
        return data;
      }
      return [];
    }
  },

  siteSettings: {
    get: async (key) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).single();
        if (error) return null;
        return data?.value;
      }
      return null;
    },
    update: async (key, value) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
        if (error) throw error;
        return true;
      }
      return true;
    }
  },

  storage: {
    uploadFile: async (file, path = '') => {
      if (isSupabaseConfigured) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = path ? `${path}/${fileName}` : fileName;

        const { data, error } = await supabase.storage
          .from('aditya-assets')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('aditya-assets')
          .getPublicUrl(filePath);

        return publicUrl;
      }
      return URL.createObjectURL(file);
    }
  },

  offerPosters: {
    list: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('offer_posters').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      }
      return [];
    },
    getActive: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('offer_posters').select('*').eq('active', true);
        if (error) throw error;
        return data;
      }
      return [];
    },
    save: async (poster) => {
      if (isSupabaseConfigured) {
        if (poster.id && poster.id !== 'new') {
          const { data, error } = await supabase.from('offer_posters').update(poster).eq('id', poster.id).select().single();
          if (error) throw error;
          return data;
        } else {
          delete poster.id;
          const { data, error } = await supabase.from('offer_posters').insert(poster).select().single();
          if (error) throw error;
          return data;
        }
      }
      return poster;
    },
    delete: async (id) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('offer_posters').delete().eq('id', id);
        if (error) throw error;
        return true;
      }
      return true;
    }
  }
};
