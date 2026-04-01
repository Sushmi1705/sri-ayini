import Link from "next/link";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { fetchItems, fetchCategory, getAverageRating } from "../services/itemServices";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { addToCart } from "../services/cartServices";
import { useRouter } from "next/router";
import { addToWishlist, getWishlist, removeFromWishlist } from '../services/wishlistService';
import { auth } from '../firebase';
import VariantDropdown from "../src/components/VariantDropdown";
import QuantitySelector from "../src/components/QuantitySelector";

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
  const [sortBy, setSortBy] = useState("featured");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Auth effect with cleanup
useEffect(() => {
  let isMounted = true;

  // 1️⃣ Get session UID (for OTP login)
  const sessionUid = sessionStorage.getItem('uid');
  if (sessionUid && isMounted) {
    console.log('Session UID:', sessionUid);
    setUserId(sessionUid);
  }

  // 2️⃣ Optional: Firebase auth listener (for Google/Facebook login)
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (!isMounted) return;

    if (user) {
      console.log('Firebase user:', user);
      setUser(user);
      setUserId(user.uid); // overwrite if authenticated via Firebase
    } else {
      console.log('No Firebase user found');
      setUser(null);
      // Don't clear sessionStorage-based UID here unless you want logout
    }

    setAuthLoading(false);
  });

  // 3️⃣ Debug: print all sessionStorage key-value pairs
  console.log('All sessionStorage:', Object.fromEntries(Object.entries(sessionStorage)));

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
    let storedGuestId = sessionStorage.getItem("guestId");
    if (!storedGuestId) {
      storedGuestId = `guest_${Date.now()}`;
      sessionStorage.setItem("guestId", storedGuestId);
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
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error('Wishlist operation failed', err);
    }
  };

  const displayedItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    let nextItems = [...items];

    if (normalizedSearch) {
      nextItems = nextItems.filter((item) =>
        item.name?.toLowerCase().includes(normalizedSearch) ||
        item.category?.toLowerCase().includes(normalizedSearch)
      );
    }

    if (showInStockOnly) {
      nextItems = nextItems.filter((item) => Boolean(getActiveSize(item)));
    }

    switch (sortBy) {
      case "price-low":
        nextItems.sort((a, b) => Number(getActiveSize(a)?.price || 0) - Number(getActiveSize(b)?.price || 0));
        break;
      case "price-high":
        nextItems.sort((a, b) => Number(getActiveSize(b)?.price || 0) - Number(getActiveSize(a)?.price || 0));
        break;
      case "rating":
        nextItems.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case "reviews":
        nextItems.sort((a, b) => Number(b.reviewsCount || b.totalReviews || 0) - Number(a.reviewsCount || a.totalReviews || 0));
        break;
      default:
        break;
    }

    return nextItems;
  }, [getActiveSize, items, searchTerm, showInStockOnly, sortBy]);

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
        <div className="container mb-40 text-center">
           <div className="header-centered">
             <span className="sub-title mb-10" style={{ color: 'var(--primary-green)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px', display: 'block' }}>The Ayini Collection</span>
             <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '36px', margin: '10px 0' }}>Shop by Category</h2>
             <div className="title-divider" style={{ width: '60px', height: '3px', background: 'var(--primary-green)', margin: '15px auto' }}></div>
           </div>
        </div>
        <div className="category-scrollbar container mb-4">
          <div className="category-list">
            <div
              className={`category-item ${!category ? "active" : ""}`}
              onClick={() => router.push("/product-details", undefined, { scroll: false })}
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
                  }, undefined, { scroll: false })
                }
              >
                <img src={cat.image || "/assets/images/categories/default.png"} alt={cat.category} />
                <span>{cat.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col-lg-4 mb-3 mb-lg-0">
              <input
                type="text"
                className="form-control"
                placeholder="Search products in this collection"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-lg-5 mb-3 mb-lg-0">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <select
                  className="form-control"
                  style={{ maxWidth: "220px" }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
                <label className="mb-0 d-flex align-items-center" style={{ gap: "8px" }}>
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                  />
                  In-stock only
                </label>
              </div>
            </div>
            <div className="col-lg-3 text-lg-right">
              <span className="text-muted small">{displayedItems.length} products</span>
            </div>
          </div>
          <div className="row">
            {displayedItems.length > 0 ? (
              displayedItems.map((item) => (
                <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={item.id}>
                  <div className="product-item wow fadeInUp delay-0-2s">
                    <div className="image">
                      <Link href={`/detailsPage?id=${item.id}`} legacyBehavior>
                        <a>
                          <img
                            src={item.image || "assets/images/products/masala.jpg"}
                            alt={item.name}
                          />
                        </a>
                      </Link>

                      <div className="floating-wishlist">
                        <button
                          className={`action-btn ${isInWishlist(item.id) ? 'active' : ''}`}
                          title="Add to Wishlist"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (userId) {
                              handleAddToWishlist(item.id);
                            } else {
                              router.push('/Login');
                            }
                          }}
                        >
                          <i className={isInWishlist(item.id) ? "fas fa-heart" : "far fa-heart"} />
                        </button>
                      </div>
                    </div>

                    <div className="content">
                      <h5>
                        <Link href={`/detailsPage?id=${item.id}`} legacyBehavior>
                          <a>{item.name}</a>
                        </Link>
                      </h5>

                      <div className="main-price">
                        ₹{getActiveSize(item)?.price || 0}
                      </div>

                      <div className="variant-select-container">
                        <VariantDropdown
                          sizes={item.sizes || []}
                          selectedSizeIndex={
                            (() => {
                              const sArray = item.sizes || [];
                              const hasOne = sArray.filter(s => s.isActive).length === 1;
                              const safe = hasOne ? sArray : sArray.map((s, i) => ({ ...s, isActive: i === 0 }));
                              const idx = safe.findIndex(s => s.isActive);
                              return Math.max(0, idx);
                            })()
                          }
                          onSelect={(idx) => {
                            setProducts(prev =>
                              prev.map(p =>
                                p.id === item.id
                                  ? {
                                    ...p,
                                    sizes: (p.sizes || []).map((s, i) => ({
                                      ...s,
                                      isActive: i === idx,
                                    })),
                                  }
                                  : p
                              )
                            );
                          }}
                        />
                      </div>

                      <div className="d-flex align-items-center w-100">
                        <QuantitySelector
                          value={quantities[item.id] !== undefined ? quantities[item.id] : 1}
                          onChange={(val) => {
                            setQuantities((prev) => ({
                              ...prev,
                              [item.id]: val,
                            }));
                          }}
                        />
                        <button
                          className="theme-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(item, quantities[item.id] || 1, e);
                          }}
                        >
                          <i className="fas fa-shopping-basket me-2"></i>
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="ratting">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`fas fa-star ${index < Math.round(Number(item.rating || 0)) ? "text-warning" : "text-muted"}`}
                        />
                      ))}
                      <span className="ml-2 small text-muted">({Number(item.reviewsCount || item.totalReviews || 0)})</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>{items.length === 0 ? "Loading..." : "No products matched your filters."}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductList;
