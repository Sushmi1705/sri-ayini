// components/CartButton.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartItemCount, getGuestId } from "../../services/cartServices";

const CartButton = () => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    const guestId = getGuestId();
    const count = await getCartItemCount(guestId); // ✅ await here
    setCartCount(count);
  };

  useEffect(() => {
    fetchCartCount();

    const handleCartUpdated = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);
  

  return (
    <Link legacyBehavior href="/cart">
      <button className="cart">
        <i className="far fa-shopping-basket" />
        <span>{cartCount}</span>
      </button>
    </Link>
  );
};

export default CartButton;
