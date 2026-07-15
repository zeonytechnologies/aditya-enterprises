import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/supabase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('aditya_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    // Load coupons list
    const fetchCoupons = async () => {
      try {
        const list = await api.coupons.list();
        setCoupons(list);
      } catch (err) {
        console.error('Failed to load coupons:', err);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    localStorage.setItem('aditya_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Determine actual unit price based on user role and variant
  const getProductUnitPrice = (product, variant = null) => {
    const target = variant || product;
    if (user && (user.role === 'dealer' || user.role === 'distributor') && target.dealer_price) {
      return parseFloat(target.dealer_price);
    }
    return parseFloat(target.price);
  };

  const addToCart = (product, quantity = 1, variant = null) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        (variant ? item.variant?.id === variant.id : !item.variant)
      );
      
      const target = variant || product;
      const minQty = (user && (user.role === 'dealer' || user.role === 'distributor')) ? (target.moq || 1) : 1;
      const qtyToAdd = Math.max(quantity, minQty);

      if (existingIdx > -1) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity: qtyToAdd, variant }];
    });
  };

  const removeFromCart = (productId, variantId = null) => {
    setCartItems(prev => prev.filter(item => 
      !(item.product.id === productId && (variantId ? item.variant?.id === variantId : !item.variant))
    ));
  };

  const updateQuantity = (productId, quantity, variantId = null) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.product.id === productId && (variantId ? item.variant?.id === variantId : !item.variant)) {
          const target = item.variant || item.product;
          const minQty = (user && (user.role === 'dealer' || user.role === 'distributor')) ? (target.moq || 1) : 1;
          const finalQty = Math.max(quantity, minQty);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { success: false, message: 'Invalid coupon code' };
    
    const subtotal = getSubtotal();
    if (subtotal < coupon.min_order_value) {
      return { 
        success: false, 
        message: `Minimum order value of ₹${coupon.min_order_value} required for this coupon.` 
      };
    }
    
    setAppliedCoupon(coupon);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = getProductUnitPrice(item.product, item.variant);
      return sum + (price * item.quantity);
    }, 0);
  };

  const getGstAmount = () => {
    return cartItems.reduce((sum, item) => {
      const price = getProductUnitPrice(item.product, item.variant);
      const taxable = price * item.quantity;
      const gstRate = item.product.gst_percent || 18;
      return sum + (taxable * (gstRate / 100));
    }, 0);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getSubtotal();
    if (appliedCoupon.type === 'percent') {
      return subtotal * (appliedCoupon.discount_value / 100);
    }
    return parseFloat(appliedCoupon.discount_value);
  };

  const getCartTotals = () => {
    const subtotal = getSubtotal();
    const gstTotal = getGstAmount();
    const discount = getDiscount();
    
    // Free shipping above ₹5000, otherwise ₹250 flat B2B delivery charge
    const shipping = (subtotal > 5000 || subtotal === 0) ? 0 : 250; 
    
    const grandTotal = Math.max(0, subtotal + gstTotal - discount + shipping);
    
    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      gst: gstTotal.toFixed(2),
      cgst: (gstTotal / 2).toFixed(2),
      sgst: (gstTotal / 2).toFixed(2),
      shipping: shipping.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      appliedCoupon,
      getCartTotals,
      getProductUnitPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
