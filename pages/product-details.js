import Link from "next/link";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { fetchItems, fetchCategory, getAverageRating } from "../services/itemServices";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { addToCart } from "../services/cartServices";
import { useRouter } from "next/router";
import { addToWishlist, getWishlist, removeFromWishlist } from '../services/wishlistService';
import { auth } from '../firebase';

const ProductList = () => {
  const router = useRouter();
  const { category } = router.query;

  // Refs to prevent multiple API calls
  const itemsFetchedRef = useRef(false);
  const categoriesFetchedRef = useRef(false);

  const [items, setProducts] = useState([]);
  const [guestId, setGuestId] = useState("");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  function Sizes({ sizes = [], onSelect }) {
    const hasOne = sizes.filter(s => s.isActive).length === 1;
    const safe = hasOne
      ? sizes
      : sizes.map((s, i) => ({ ...s, isActive: i === 0 }));

    return (
      <div className="variants d-flex flex-wrap gap-2">
        {safe.map((s) => {
          const price = Number(s.price || 0).toLocaleString('en-IN');
          return (
            <button
              key={s.id}
              type="button"
              className={`variant ${s.isActive ? 'active' : ''}`}
              onClick={() => onSelect?.(s)}
              title={`₹${price} — ${s.sizeLabel}${s.quantity ? ` (Qty: ${s.quantity})` : ''}`}
            >
              <span className="variant-price">₹{price}</span>
              <span className="variant-dot">•</span>
              <span className="variant-size">{s.sizeLabel}</span>
              {s.quantity ? <span className="variant-qty">Qty {s.quantity}</span> : null}
            </button>
          );
        })}
      </div>
    );
  }

  // Auth effect with cleanup
  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!isMounted) return;
      
      if (user) {
        setUser(user);
        setUserId(user.uid);
      } else {
        setUser(null);
        setUserId(null);
      }
      setAuthLoading(false);
    });
    
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Fetch items with proper cleanup and loading state
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const data = await fetchItems();
        console.log('88-----', data);
        if (!isMounted) return;

        const filtered = category
          ? data.filter(it => it.category === decodeURIComponent(category))
          : data;

        const normalized = filtered.map(p => {
          const sizes = Array.isArray(p.sizes) ? p.sizes : [];
          const hasSingleActive = sizes.filter(s => s.isActive).length === 1;

          const fixed = sizes.map((s, idx) => ({
            ...s,
            isActive: hasSingleActive ? !!s.isActive : idx === 0,
          }));

          return { ...p, sizes: fixed };
        });
        console.log('105--------', normalized);
        setProducts(normalized);
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching items:', err);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [category]);

  // Fetch categories only once
  useEffect(() => {
    if (categoriesFetchedRef.current) return;
    
    let isMounted = true;
    categoriesFetchedRef.current = true;

    const fetchCategoriesData = async () => {
      try {
        const data = await fetchCategory();
        console.log('130------',data);
        // if (!isMounted) return;

        const uniqueCategories = Array.from(
          new Map(data.map(cat => [cat.category, cat])).values()
        );
        console.log('136---------', uniqueCategories);
        setCategories(uniqueCategories);
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching categories:", error);
        }
      }
    };

    fetchCategoriesData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Guest ID setup
  useEffect(() => {
    let storedGuestId = localStorage.getItem("guestId");
    if (!storedGuestId) {
      storedGuestId = `guest_${Date.now()}`;
      localStorage.setItem("guestId", storedGuestId);
    }
    setGuestId(storedGuestId);
  }, []);

  // Wishlist effect
  useEffect(() => {
    if (!userId) return;
    
    let isMounted = true;
    
    getWishlist(userId)
      .then(data => {
        if (isMounted) {
          setWishlistItems(data);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Error fetching wishlist:', err);
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Debug effect for categories (only logs when categories actually change)
  useEffect(() => {
    if (categories.length > 0) {
      console.log('Categories updated:', categories.length, 'items');
    }
  }, [categories]);

  // Memoized functions
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some((item) => item.id === productId);
  }, [wishlistItems]);

  const getActiveSize = useCallback((item) => {
    return (item?.sizes || []).find(s => s.isActive) || item?.sizes?.[0] || null;
  }, []);

  const handleAddToCart = async (item, qtyToAdd, e) => {
    if (e) e.preventDefault();

    if (!userId) {
      await router.push("/login");
      return;
    }

    const size = getActiveSize(item);
    if (!size) {
      alert("Please select a size.");
      return;
    }

    const payload = {
      productId: item.id,
      name: item.name,
      image: item.image || "",
      category: item.category,
      sizeId: size.id,
      sizeLabel: size.sizeLabel,
      unitQuantity: size.quantity,
      unitPrice: Number(size.price),
      cartQty: Number(qtyToAdd || 1),
      lineTotal: Number(size.price) * Number(qtyToAdd || 1),
    };

    try {
      setLoading(true);
      await addToCart(userId, payload);
      alert("Item added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(userId, productId);
        alert("Item removed from wishlist!");
      } else {
        await addToWishlist(userId, productId);
        alert("Item added to wishlist!");
      }

      const updated = await getWishlist(userId);
      setWishlistItems(updated);
    } catch (err) {
      console.error('Wishlist operation failed', err);
    }
  };

  function StarRating({ value = 0, onChange, size = 22, readOnly = false }) {
    const [hover, setHover] = React.useState(0);
    const display = hover || value;

    return (
      <div className="star-rating" role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = display >= star;
          return (
            <button
              key={star}
              type="button"
              className={`star-btn ${isActive ? 'active' : ''} ${readOnly ? 'read-only' : ''}`}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              aria-pressed={!readOnly && value === star}
              onMouseEnter={readOnly ? undefined : () => setHover(star)}
              onMouseLeave={readOnly ? undefined : () => setHover(0)}
              onFocus={readOnly ? undefined : () => setHover(star)}
              onBlur={readOnly ? undefined : () => setHover(0)}
              onClick={readOnly ? undefined : () => onChange?.(star)}
              style={{
                fontSize: `${size}px`,
                color: isActive ? '#ffc107' : '#ddd',
                transition: 'color 0.15s ease-in-out, transform 0.1s ease-in-out',
              }}
            >
              ★
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <Layout>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div className="custom-loader" />
          <span style={{ marginTop: 16, fontSize: 18, color: '#2e7d32' }}>Loading...</span>
        </div>
      )}

      <PageBanner pageName={"Products"} />
      <section className="product-list-area pt-100 pb-100">
        <div className="category-scrollbar container mb-4">
          <div className="category-list">
            <div
              className={`category-item ${!category ? "active" : ""}`}
              onClick={() => router.push("/product-details")}
            >
              <img src="/assets/images/category/masala powder.jpeg" alt="All" />
              <span>All</span>
            </div>

            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`category-item ${decodeURIComponent(category || "") === cat.category ? "active" : ""}`}
                onClick={() =>
                  router.push({
                    pathname: "/product-details",
                    query: { category: cat.category },
                  })
                }
              >
                <img src={cat.image || "/assets/images/categories/default.png"} alt={cat.category} />
                <span>{cat.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="row">
            {items.length > 0 ? (
              items.map((item) => (
                <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={item.id}>
                  <div className="card h-100 shadow-sm border-0 product-card">
                    <div className="image-container" style={{ position: 'relative' }}>
                      <Link href={`/detailsPage?id=${item.id}`} legacyBehavior>
                        <a>
                          <img
                            src={item.image || "assets/images/products/masala.jpg"}
                            className="card-img-top p-3 card-img-top product-image"
                            alt={item.name}
                            style={{ height: "200px", objectFit: "contain" }}
                          />
                        </a>
                      </Link>

                      {userId ? (
                        <button
                          className="btn-wishlist"
                          title="Add to Wishlist"
                          aria-label="Add to Wishlist"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToWishlist(item.id);
                          }}
                          style={{ position: "absolute", top: 10, right: 10 }}
                        >
                          <i className={`fas fa-heart ${isInWishlist(item.id) ? 'active' : ''}`} />
                        </button>
                      ) : (
                        <Link legacyBehavior href="/Login">
                          <button
                            className="btn-wishlist"
                            title="Add to Wishlist"
                            aria-label="Add to Wishlist"
                            style={{ position: "absolute", top: 10, right: 10 }}
                          >
                            <i className={`fas fa-heart ${isInWishlist(item.id) ? 'active' : ''}`} />
                          </button>
                        </Link>
                      )}
                    </div>

                    <div className="card-body">
                      <Link href={`/detailsPage?id=${item.id}`} legacyBehavior>
                        <a style={{ textDecoration: "none", color: "inherit" }}>
                          <h5 className="card-title mb-1">{item.name}</h5>
                        </a>
                      </Link>

                      <p className="text-muted small mb-2">{item.category}</p>
                      
                      <Sizes
                        sizes={item.sizes || []}
                        onSelect={(selected) => {
                          setProducts(prev =>
                            prev.map(p =>
                              p.id === item.id
                                ? {
                                  ...p,
                                  sizes: (p.sizes || []).map(s => ({
                                    ...s,
                                    isActive: s.id === selected.id,
                                  })),
                                }
                                : p
                            )
                          );
                        }}
                      />

                      <p className="mb-2 flex items-center gap-2">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={index < item.rating ? "text-warning" : "text-muted"}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-muted">({item.reviewsCount || "0"})</span>
                      </p>

                      <div className="d-flex align-items-center gap-2 quantity-cart-section">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={quantities[item.id] !== undefined ? quantities[item.id] : 1}
                          onChange={(e) => {
                            const parsed = parseInt(e.target.value);
                            setQuantities((prev) => ({
                              ...prev,
                              [item.id]: isNaN(parsed) || parsed < 0 ? 0 : parsed,
                            }));
                          }}
                          style={{ width: "auto", height: "20px", marginRight: "10px" }}
                        />

                        {userId ? (
                          <button
                            className="btn btn-primary btn-sm btn-add-to-cart"
                            onClick={(e) => handleAddToCart(item, quantities[item.id] || 1, e)}
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <Link legacyBehavior href="/Login">
                            <button className="btn btn-primary btn-sm btn-add-to-cart">
                              Add to Cart
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductList;