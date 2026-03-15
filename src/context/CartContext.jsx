import { createContext, useContext, useState, useEffect } from "react";
import CartService from "../services/cartService";
import { getUserId, isLoggedIn } from "../services/AuthHelper";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartCount, setCartCount] = useState(0);

  const loadCart = async () => {
    try {
      if (!isLoggedIn()) {
        setCartCount(0);
        return;
      }

      const userId = getUserId();
      const res = await CartService.getCart(userId);

      const items = res.data.cartItems || [];

      const totalQty = items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalQty);

    } catch (error) {
      console.error("Failed to load cart count", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);