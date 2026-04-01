import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getCartItemCount, getCartOwnerId, getSessionUserId } from "../../services/cartServices";

const MobileBottomNav = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(null);

  const fetchCartCount = async () => {
    const uid = getSessionUserId();
    const cartOwnerId = getCartOwnerId();
    setUserId(uid);

    if (cartOwnerId) {
      try {
        const count = await getCartItemCount(cartOwnerId);
        setCartCount(count);
      } catch (err) {
        console.error("Cart count error:", err);
      }
    }
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, []);

  const navItems = [
    { label: "Home", icon: "fas fa-home", path: "/" },
    { label: "Shop", icon: "fas fa-th-large", path: "/product-details" },
    { label: "Search", icon: "fas fa-search", path: "/product-details" },
    { label: "Cart", icon: "fas fa-shopping-basket", path: "/cart", badge: cartCount },
    { label: "Profile", icon: "fas fa-user", path: userId ? "/profile" : "/Login" },
  ];

  return (
    <div className="mobile-bottom-nav d-lg-none">
      <div className="nav-container">
        {navItems.map((item) => (
          <Link key={item.label} href={item.path} legacyBehavior>
            <a className={`nav-item ${router.pathname === item.path ? "active" : ""}`}>
              <div className="icon-wrapper">
                <i className={item.icon} />
                {item.badge > 0 && <span className="nav-badge pulse">{item.badge}</span>}
              </div>
              <span className="nav-label">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
