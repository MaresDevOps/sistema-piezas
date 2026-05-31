import React, { createContext, useState, useContext } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { products } = useProducts();
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [justAddedProduct, setJustAddedProduct] = useState(null);
  const [newOrderSuccess, setNewOrderSuccess] = useState(null);

  const getCartSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    setJustAddedProduct(product.id);
    
    // HMR timer for cart add animations (handled in component usually, but can stay in state)
    setTimeout(() => setJustAddedProduct(null), 1000);
  };

  const updateCartQuantity = (productId, amount) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + amount;
        const product = products.find(p => p.id === productId);
        return newQty > 0 && newQty <= (product?.stock || 99)
          ? { ...item, quantity: newQty }
          : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const handleCheckoutSuccess = async (checkoutForm) => {
    if (!currentUser) return;
    
    // Generate tracking code: NEX-XXXXXX
    const randomHex = Math.floor(16777215 + Math.random() * 8388607).toString(16).toUpperCase();
    const trackingCode = `NEX-${randomHex}`;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const subtotal = getCartSubtotal();
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    const newOrder = {
      id: trackingCode,
      buyerUid: currentUser.uid,
      buyerName: currentUser.name,
      email: currentUser.email,
      address: checkoutForm.address,
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, category: item.category })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      createdAt: formattedDate,
      status: 1,
      history: [
        { step: 1, title: 'Pedido Recibido', desc: 'Pago aprobado. Su orden está lista para el taller de ensamblaje.', time: formattedDate, location: 'Taller de Ensamblaje Central', completed: true },
        { step: 2, title: 'En Ensamblaje / Empaque', desc: 'Aún sin iniciar.', time: '--', location: '--', completed: false },
        { step: 3, title: 'En Tránsito', desc: 'Pendiente de recolección de transportista.', time: '--', location: '--', completed: false },
        { step: 4, title: 'Entregado', desc: 'Pendiente de envío.', time: '--', location: '--', completed: false }
      ]
    };

    try {
      await setDoc(doc(db, 'orders', trackingCode), newOrder);
      setCart([]);
      setShowCheckoutModal(false);
      setIsCartOpen(false);
      setNewOrderSuccess(newOrder);
      return { success: true, order: newOrder };
    } catch (err) {
      console.error("Firestore order creation error:", err);
      return { success: false, error: err.message };
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      isCartOpen,
      setIsCartOpen,
      showCheckoutModal,
      setShowCheckoutModal,
      justAddedProduct,
      newOrderSuccess,
      setNewOrderSuccess,
      getCartSubtotal,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      handleCheckoutSuccess
    }}>
      {children}
    </CartContext.Provider>
  );
};
