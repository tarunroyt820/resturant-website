import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('biteswift_cart');
    const storedRestaurantId = localStorage.getItem('biteswift_cart_restaurant');
    
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('biteswift_cart', JSON.stringify(cartItems));
    if (restaurantId) {
      localStorage.setItem('biteswift_cart_restaurant', restaurantId);
    } else {
      localStorage.removeItem('biteswift_cart_restaurant');
    }
  }, [cartItems, restaurantId]);

  const addToCart = (item, newRestaurantId) => {
    // If the cart already has items from another restaurant, confirm clearing the cart
    if (cartItems.length > 0 && restaurantId && String(restaurantId) !== String(newRestaurantId)) {
      const confirmClear = window.confirm("You already have items from another restaurant in your cart. Would you like to clear your cart and add this item instead?");
      if (!confirmClear) return false;
      
      setCartItems([{ ...item, quantity: 1 }]);
      setRestaurantId(newRestaurantId);
      return true;
    }

    setRestaurantId(newRestaurantId);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    return true;
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((i) => i.id !== itemId);
      if (updated.length === 0) {
        setRestaurantId(null);
      }
      return updated;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    localStorage.removeItem('biteswift_cart');
    localStorage.removeItem('biteswift_cart_restaurant');
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    restaurantId,
    totalPrice,
    totalQuantity,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
