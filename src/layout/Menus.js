import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { getCartItemCount } from "../../services/cartServices";
import { getWishlist } from "../../services/wishlistService";

export const Home = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/">
        Home
      </Link>
    </li>
    {/* <li>
      <Link legacyBehavior href="/index2">
        Home Two
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/index3">
        Home Three
      </Link>
    </li> */}
  </Fragment>
);

export const PagesDasktop = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/about">
        Our Story
      </Link>
    </li>
    {/* <li className="dropdown">
      <a href="#">services</a>
      <ul>
        <li>
          <Link legacyBehavior href="/services">
            all services
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="/service-details">
            service details
          </Link>
        </li>
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <li>
      <Link legacyBehavior href="/faqs">
        faqs
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/farmers">
        Farmers
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/404">
        404 error
      </Link>
    </li> */}
  </Fragment>
);
export const PagesMobile = () => (
  <Fragment>
    
  </Fragment>
);
// export const Portfolio = () => (
//   <Fragment>
    
//   </Fragment>
// );
export const Blog = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/blog-grid">
        blog
      </Link>
    </li>
    {/* <li>
      <Link legacyBehavior href="/blog-standard">
        blog Standard
      </Link>
    </li> */}
    {/* <li>
      <Link legacyBehavior href="/blog-details">
        blog details
      </Link>
    </li> */}
  </Fragment>
);
export const Shop = () => (
  <Fragment>
    {/* <li>
      <Link legacyBehavior href="/shop-grid">
        shop Grid
      </Link>
    </li> */}
    {/* <li>
      <Link legacyBehavior href="/shop-left-sidebar">
        shop left sidebar
      </Link>
    </li> */}
    {/* <li>
      <Link legacyBehavior href="/shop-right-sidebar">
        shop right sidebar
      </Link>
    </li> */}
    <li className="shop-highlight-only">
      <Link legacyBehavior href="/product-details">
        Shop
      </Link>
    </li>
    {/* <li>
      <Link legacyBehavior href="/cart">
        cart page
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/checkout">
        checkout
      </Link>
    </li> */}
    {/* <li>
      <Link legacyBehavior href="/Login">
        Login
      </Link>
    </li> */}
  </Fragment>
);
export const Contact = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/contact">
        Contact
      </Link>
    </li>
  </Fragment>
);

export const MegaMenu = ({ categories = [] }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState(null);

  const fetchData = async () => {
    const uid = sessionStorage.getItem("uid");
    const name = sessionStorage.getItem("name");
    
    if (uid) {
      setUser({ uid, name });
      try {
        const cartC = await getCartItemCount(uid);
        setCartCount(cartC);
        
        const wishlistData = await getWishlist(uid);
        setWishlistCount(wishlistData.length || 0);
      } catch (err) {
        console.error("MegaMenu data fetch error:", err);
      }
    } else {
      setUser(null);
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener("cartUpdated", handleUpdate);
    window.addEventListener("wishlistUpdated", handleUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
      window.removeEventListener("wishlistUpdated", handleUpdate);
    };
  }, []);

  // Limit categories to first 8 for the menu
  const displayCategories = categories.slice(0, 8);

  return (
    <li className="mega-menu dropdown">
      <Link legacyBehavior href="/product-details">
        <a>Shop <i className="fas fa-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }} /></a>
      </Link>
      <ul>
        {/* Column 1: Categories */}
        <div className="mega-menu-column">
          <span className="mega-menu-title">
            <i className="fas fa-th-large" /> Categories
          </span>
          <ul>
            {displayCategories.map((cat) => {
              const categoryName = cat.categoryName || cat.category;
              const getIcon = (name) => {
                const lowerName = name.toLowerCase();
                if (lowerName.includes("health")) return "fas fa-heartbeat";
                if (lowerName.includes("podi")) return "fas fa-mortar-pestle";
                if (lowerName.includes("flour")) return "fas fa-seedling";
                if (lowerName.includes("masala")) return "fas fa-pepper-hot";
                return "fas fa-leaf";
              };
              return (
                <li key={cat.id}>
                  <Link
                    legacyBehavior
                    href={{
                      pathname: "/product-details",
                      query: { category: cat.category },
                    }}
                  >
                    <a className="category-item">
                      <i className={`${getIcon(categoryName)} category-icon`} /> 
                      {categoryName}
                    </a>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link legacyBehavior href="/product-details">
                <a style={{ fontWeight: '700', color: 'var(--primary-green)' }}>
                  <i className="fas fa-arrow-right" style={{ marginRight: '8px' }} />
                  View All Categories
                </a>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Quick Links / Account */}
        <div className="mega-menu-column">
          <span className="mega-menu-title">
            <i className="fas fa-user-circle" /> My Shopping
          </span>
          <div className="quick-actions">
            <Link legacyBehavior href={user ? "/profile" : "/Login"}>
              <a>
                <div className="quick-action-item">
                  <div className="icon-box">
                    <i className="fas fa-user" />
                  </div>
                  <div className="action-info">
                    <span className="label">Account</span>
                    <span className="val">{user ? user.name : "Login / Register"}</span>
                  </div>
                </div>
              </a>
            </Link>

            <Link legacyBehavior href="/wishlist">
              <a>
                <div className="quick-action-item">
                  <div className="icon-box">
                    <i className="fas fa-heart" />
                  </div>
                  <div className="action-info">
                    <span className="label">Favorites</span>
                    <span className="val">{wishlistCount} Items</span>
                  </div>
                  {wishlistCount > 0 && <div className="badge-dot" />}
                </div>
              </a>
            </Link>

            <Link legacyBehavior href="/cart">
              <a>
                <div className="quick-action-item">
                  <div className="icon-box">
                    <i className="fas fa-shopping-basket" />
                  </div>
                  <div className="action-info">
                    <span className="label">Your Cart</span>
                    <span className="val">{cartCount} Items</span>
                  </div>
                  {cartCount > 0 && <div className="badge-dot" />}
                </div>
              </a>
            </Link>
          </div>
        </div>

        {/* Column 3: Promo Poster 1 */}
        <div className="mega-menu-column d-none d-xl-block">
          <Link legacyBehavior href="/product-details">
            <a>
              <div className="mega-menu-banner">
                <img src="/assets/images/banner/mega-banner-1.png" alt="Spices" />
                <div className="banner-overlay">
                  <h4>Artisanal Spices</h4>
                  <p>Pure, Handcrafted & Organic</p>
                </div>
              </div>
            </a>
          </Link>
        </div>

        {/* Column 4: Promo Poster 2 */}
        <div className="mega-menu-column d-none d-xl-block">
          <Link legacyBehavior href="/product-details">
            <a>
              <div className="mega-menu-banner">
                <img src="/assets/images/banner/mega-banner-2.png" alt="Snacks" />
                <div className="banner-overlay">
                  <h4>Healthy Snacks</h4>
                  <p>Homemade with Love</p>
                </div>
              </div>
            </a>
          </Link>
        </div>
      </ul>
    </li>
  );
};
