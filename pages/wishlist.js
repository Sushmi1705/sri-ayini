import Link from "next/link";
import { useState, useEffect } from "react";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { getWishlist, removeFromWishlist } from '../services/wishlistService';
import { addToCart } from '../services/cartServices';
import { auth } from '../firebase';
import { useRouter } from 'next/router';

const WishlistPage = () => {
  const [wishList, setwishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const sessionUid = sessionStorage.getItem('uid');
    if (sessionUid && isMounted) setUserId(sessionUid);

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!isMounted) return;
      if (firebaseUser) {
        setUserId(firebaseUser.uid);
      } else if (!sessionUid) {
        setUserId(null);
      }
      setAuthChecked(true);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authChecked) {
      if (userId) {
        getWishlist(userId)
          .then(data => {
            setwishList(data);
            setLoading(false);
          })
          .catch(err => {
            console.error("Failed to load wishlist", err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [authChecked, userId]);

  const handleRemove = async (productId) => {
    if (!userId) return;
    try {
      await removeFromWishlist(userId, productId);
      setwishList(wishList.filter((item) => item.id !== productId));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const getFirstSize = (p) => {
    if (Array.isArray(p?.sizes) && p.sizes.length > 0) {
      return p.sizes[0];
    }
    return {
      id: p.sizeId || "default_size",
      sizeLabel: p.sizeLabel || "Standard",
      price: p.price || p.unitPrice || 0
    };
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    if (!userId) {
      router.push("/Login");
      return;
    }
    const first = getFirstSize(product);
    if (!first || !first.price) {
      return alert("Invalid product data, no price found.");
    }
    try {
      await addToCart(userId, {
        productId: product.id,
        name: product.name || "Product",
        image: product.image || "",
        category: product.category || "",
        sizeId: first.id,
        sizeLabel: first.sizeLabel,
        unitPrice: Number(first.price) || 0,
        cartQty: 1,
      });
      alert("Added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <Layout>
      <PageBanner pageName={"Wishlist Page"} />
      <div className="wishlist-area py-130 rpy-100">
        <div className="container">
          <div className="cart-item-wrap wow fadeInUp delay-0-2s">
            {loading ? (
              <div className="text-center py-50">
                <h4>Loading your wishlist...</h4>
              </div>
            ) : !userId ? (
              <div className="text-center py-50">
                <i className="far fa-heart mb-3" style={{ fontSize: '48px', color: '#89C74A' }}></i>
                <h3 className="mb-20">Please log in to view your wishlist</h3>
                <p className="mb-30">Save your favorite handcrafted spice blends and access them anytime.</p>
                <Link legacyBehavior href="/Login">
                  <a className="theme-btn">Log In</a>
                </Link>
              </div>
            ) : wishList.length === 0 ? (
              <div className="text-center py-50">
                <h3 className="mb-20">Your wishlist is empty</h3>
                <p className="mb-30">Looks like you haven't added any spice blends yet.</p>
                <Link legacyBehavior href="/">
                  <a className="theme-btn">Explore Blends</a>
                </Link>
              </div>
            ) : (
              wishList.map((w, i) => {
                const priceToDisplay = w.price ? w.price : getFirstSize(w)?.price;
                const hasActiveSize = Array.isArray(w?.sizes)
                  ? w.sizes.some((size) => size.isActive)
                  : Boolean(priceToDisplay);
                return (
                  <div className="cart-single-item" key={w.id || i}>
                    <button
                      type="button"
                      className="close"
                      onClick={() => handleRemove(w.id)}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                    <div className="cart-img">
                      <img src={w.image || "assets/images/products/default.jpg"} alt={w.name || w.title} />
                    </div>
                    <h5 className="product-name">{w.name || w.title}</h5>
                    <span className="product-price">₹{Number(priceToDisplay || 0).toFixed(2)}</span>
                    <strong className="stock">{hasActiveSize ? "In Stock" : "Unavailable"}</strong>
                    <button onClick={(e) => handleAddToCart(w, e)} className="theme-btn style-two border-0" disabled={!hasActiveSize}>
                      Add to Cart
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {/* Wishlist Area End */}
      {/* Client Logo Section Start */}
      <div className="client-logo-section text-center bg-light-green py-60">
        <div className="container">
          {/* <ClientLogoSlider /> */}
        </div>
        <div className="client-logo-shapes">
          <img
            className="shape-one"
            src="assets/images/shapes/cl-shape1.png"
            alt="Shape"
          />
          <img
            className="shape-two"
            src="assets/images/shapes/cl-shape2.png"
            alt="Shape"
          />
          <img
            className="shape-three"
            src="assets/images/shapes/cl-shape3.png"
            alt="Shape"
          />
          <img
            className="shape-four"
            src="assets/images/shapes/cl-shape4.png"
            alt="Shape"
          />
          <img
            className="shape-five"
            src="assets/images/shapes/cl-shape5.png"
            alt="Shape"
          />
          <img
            className="shape-six"
            src="assets/images/shapes/cl-shape6.png"
            alt="Shape"
          />
        </div>
      </div>
    </Layout>
  );
};
export default WishlistPage;
