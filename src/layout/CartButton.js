// components/CartButton.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartItemCount, getCartOwnerId } from "../../services/cartServices";

const CartButton = () => {
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(null);

  const updateCount = async () => {
    const currentId = getCartOwnerId();

    if (currentId) {
      const count = await getCartItemCount(currentId);
      setCartCount(count || 0);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCount();

    const handleCartUpdated = () => {
      updateCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    // Listen for storage changes (login/logout)
    window.addEventListener("storage", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
    };
  }, []);
  

  return (
    <Link legacyBehavior href="/cart">
      <a className="cart cart-trigger" aria-label={`Cart with ${cartCount} items`}>
        <i className="fas fa-shopping-basket" />
        {cartCount > 0 && <span>{cartCount}</span>}
      </a>
    </Link>
  );
};

export default CartButton;
