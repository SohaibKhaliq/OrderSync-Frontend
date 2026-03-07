import React, { createContext, useContext, useState } from "react";

const CART_KEY = "cafe_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function persistCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

const CafeCartContext = createContext(null);

export function CafeCartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  function addItem(menuItem, quantity = 1, variant = null, addons = []) {
    setCartItems((prev) => {
      const key = `${menuItem.id}-${variant?.id ?? "base"}-${addons.map((a) => a.id).join(",")}`;
      const existing = prev.find((i) => i._key === key);
      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i._key === key ? { ...i, quantity: i.quantity + quantity } : i,
        );
      } else {
        const price = variant ? variant.price : menuItem.price;
        const addonTotal = addons.reduce((s, a) => s + (a.price || 0), 0);
        updated = [
          ...prev,
          {
            _key: key,
            id: menuItem.id,
            title: menuItem.title,
            price,
            addonTotal,
            variant,
            addons,
            tax_rate: menuItem.tax_rate || 0,
            tax_type: menuItem.tax_type || "percentage",
            category_title: menuItem.category_title || "",
            quantity,
          },
        ];
      }
      persistCart(updated);
      return updated;
    });
  }

  function removeItem(key) {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i._key !== key);
      persistCart(updated);
      return updated;
    });
  }

  function updateQuantity(key, quantity) {
    if (quantity < 1) {
      removeItem(key);
      return;
    }
    setCartItems((prev) => {
      const updated = prev.map((i) =>
        i._key === key ? { ...i, quantity } : i,
      );
      persistCart(updated);
      return updated;
    });
  }

  function clearCart() {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  }

  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cartItems.reduce(
    (s, i) => s + (i.price + i.addonTotal) * i.quantity,
    0,
  );
  const taxTotal = cartItems.reduce((s, i) => {
    const lineNet = (i.price + i.addonTotal) * i.quantity;
    return (
      s +
      (i.tax_type === "percentage"
        ? lineNet * (i.tax_rate / 100)
        : (i.tax_rate || 0) * i.quantity)
    );
  }, 0);
  const total = subtotal + taxTotal;

  return (
    <CafeCartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        taxTotal,
        total,
      }}
    >
      {children}
    </CafeCartContext.Provider>
  );
}

export function useCafeCart() {
  return useContext(CafeCartContext);
}
