"use client";
import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // State is now an object: { "productId": { product: { ... }, quantity: 2 } }
  const [cart, setCart] = useState<{ [key: string]: any }>({});

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev[product._id];
      return {
        ...prev,
        [product._id]: {
          product,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const item = prev[productId];
      if (!item) return prev;

      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest; // Remove item if quantity hits 0
      }

      return {
        ...prev,
        [productId]: { ...item, quantity: newQuantity },
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
    toast.error("Item removed");
  };

  const clearCart = () => {
    setCart({});
    toast("Cart cleared");
  };

  // Helper to get cart as an array for the UI
  const getCartItems = () => Object.values(cart);

  return (
    <CartContext.Provider value={{ cart, getCartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);