import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/layout/Layout";
import PageBanner from "../src/components/PageBanner";
import { fetchItemById, getAverageRating, addReview, getProductReviewsPaged, checkCanReview } from "../services/itemServices";
import { addToCart } from "../services/cartServices";

const DetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [guestId, setGuestId] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [price, setPrice] = useState(0);
  const [userId, setUserId] = useState(null);
  // Review states
  const [reviews, setReviews] = useState([]);
  const [nextCursor, setNextCursor] = useState(null); 
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false); // New state
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    customerName: "",
    customerEmail: ""
  });
  const [activeTab, setActiveTab] = useState("details"); // React-managed tabs

  // Sort state for reviews (client-side)
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'highest' | 'lowest'
  // Client-side sorted reviews (no backend change needed)
  const sortedReviews = React.useMemo(() => {
    const arr = [...reviews];
    if (sortBy === "highest") {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "lowest") {
      arr.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else {
      // newest
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return arr;
  }, [reviews, sortBy]);

  useEffect(() => {
    if (!id) return;

    setReviews([]);
    setNextCursor(null);

    (async () => {
      try {
        const { items, nextCursor } = await getProductReviewsPaged(id, { limit: 5, sortBy });
        setReviews(items);
        setNextCursor(nextCursor || null);
      } catch (err) {
        console.error("Failed to fetch paged reviews", err);
      }
    })();

    // product + avg rating
    fetchItemById(id).then(setProduct).catch(e => console.error(e));
    loadAverageRating();
  }, [id, sortBy]);

  // Set userId once and check review status
  useEffect(() => {
    const uid = sessionStorage.getItem('uid');
    setUserId(uid);

    let storedGuestId = sessionStorage.getItem("guestId");
    if (!storedGuestId) {
      storedGuestId = `guest_${Date.now()}`;
      sessionStorage.setItem("guestId", storedGuestId);
    }
    setGuestId(storedGuestId);

    if (uid && id) {
      checkCanReview(id, uid).then(setCanReview);
    }
  }, [id]);

  // When product loads or changes, set initial selected size and price
  useEffect(() => {
    if (product?.sizes?.length > 0) {
      const activeSizes = product.sizes.filter((s) => s.isActive);
      if (activeSizes.length > 0) {
        setSelectedSize(activeSizes[0].sizeLabel);
        setPrice(activeSizes[0].price);
      } else {
        setSelectedSize("");
        setPrice(product.price || 0);
      }
    } else if (product) {
      setSelectedSize("");
      setPrice(product.price || 0);
    }
  }, [product]);

  // Update price when selectedSize changes
  useEffect(() => {
    if (product?.sizes?.length > 0 && selectedSize) {
      const sizeObj = product.sizes.find((s) => s.sizeLabel === selectedSize && s.isActive);
      if (sizeObj) {
        setPrice(sizeObj.price);
      }
    }
  }, [selectedSize, product]);

  const loadReviews = async () => {
    try {
      // For now, use the paged endpoint with newest
      const { items } = await getProductReviewsPaged(id, { limit: 10, sortBy: 'newest' });
      setReviews(items);
      setNextCursor(null); 
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  const loadMore = async () => {
    if (!nextCursor) return;
    try {
      const prevCursor = nextCursor;
      const { items, nextCursor: nc } = await getProductReviewsPaged(id, {
        limit: 5,
        cursor: prevCursor,
        sortBy,
      });

      // De-duplicate by id
      setReviews((prev) => {
        const map = new Map(prev.map(r => [r.id, r]));
        for (const it of items) map.set(it.id, it);
        return Array.from(map.values());
      });

      // If backend returns same cursor or no cursor, stop
      setNextCursor(nc && nc !== prevCursor ? nc : null);
    } catch (err) {
      console.error("Failed to load more reviews", err);
    }
  };

  const loadAverageRating = async () => {
    try {
      const ratingData = await getAverageRating(id);
      setAverageRating(ratingData.averageRating || 0);
      setTotalReviews(ratingData.totalReviews || 0);
    } catch (error) {
      console.error("Failed to load average rating:", error);
    }
  };

  const buildCartPayload = () => {
    const sizeObj = product.sizes?.find(s => s.sizeLabel === selectedSize && s.isActive)
      || product.sizes?.[0]
      || null;
    return {
      productId: product.id,
      name: product.name,
      image: product.image || "",
      category: product.category,
      sizeId: sizeObj?.id || selectedSize,
      sizeLabel: selectedSize || sizeObj?.sizeLabel || "",
      unitQuantity: sizeObj?.quantity || null,
      unitPrice: Number(price),
      cartQty: Number(quantity),
      lineTotal: Number(price) * Number(quantity),
    };
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(userId, buildCartPayload());
      alert("Item added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert(error.message || "Failed to add to cart.");
    }
  };

  const buyNow = async () => {
    try {
      await addToCart(userId, buildCartPayload());
      router.push("/checkout");
    } catch (error) {
      console.error("Buy now failed:", error);
      alert(error.message || "Failed to add to cart.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        ...newReview,
        productId: id,
        guestId: userId
      };

      await addReview(reviewData);
      setNewReview({ rating: 0, comment: "", customerName: "", customerEmail: "" });
      setShowReviewForm(false);
      alert("Review submitted successfully. It will appear after admin approval.");
    } catch (error) {
      alert(error.message || "Failed to add review. Please try again.");
    }
  };

  // StarRating component used for read-only and interactive ratings
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
                background: 'none',
                border: 'none',
                padding: '0 2px'
              }}
            >
              ★
            </button>
          );
        })}
      </div>
    );
  }

  if (!product) {
    return (
      <Layout>
        <PageBanner pageName={"Product Details"} />
        <div className="product-page-container product-detail-page">
          <div className="container">
            <div className="page-state-shell">
              <div className="page-state-card">
                <div className="page-state-icon">
                  <i className="fas fa-box-open" />
                </div>
                <h4 className="page-state-title">Loading product details</h4>
                <p className="page-state-copy">
                  We&apos;re bringing in the latest pricing, sizes, and product information for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Filter active sizes for dropdown
  const activeSizes = product.sizes?.filter((s) => s.isActive) || [];

  return (
    <Layout>
      <PageBanner pageName={"Product Details"} />
      <div className="product-page-container product-detail-page pt-50 pb-50">
        <div className="container product-detail-shell">
          <section className="product-detail-stage">
            <div className="row align-items-start">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="product-image-wrapper product-gallery-card">
                  <div className="product-visual-header">
                    <span className="product-category-pill">{product.category}</span>
                    {activeSizes.length > 0 && (
                      <span className="product-meta-pill">{activeSizes.length} size options</span>
                    )}
                  </div>
                  <div className="product-image-stage">
                    <img
                      src={product.image || "/assets/images/products/masala.jpg"}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                  <div className="product-visual-footer">
                    <div className="visual-footer-item">
                      <i className="fas fa-leaf" />
                      <span>Pure ingredients</span>
                    </div>
                    <div className="visual-footer-item">
                      <i className="fas fa-shield-alt" />
                      <span>Freshly packed</span>
                    </div>
                    <div className="visual-footer-item">
                      <i className="fas fa-truck" />
                      <span>Ships across India</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="product-content product-summary-card">
                  <div className="product-summary-kicker">Small-batch essentials</div>
                  <h2 className="product-title-main">{product.name}</h2>

                  <div className="rating-section product-rating-row">
                    <StarRating value={Math.round(averageRating)} readOnly size={18} />
                    <span className="rating-copy">{averageRating.toFixed(1)} average rating</span>
                    <span className="rating-divider">•</span>
                    <span className="rating-copy">{totalReviews} review{totalReviews === 1 ? "" : "s"}</span>
                  </div>

                  <div className="product-price-band">
                    <div className="price price-display">₹{Number(price).toFixed(0)}</div>
                    <div className="price-note">Inclusive of carefully packed freshness and quality assurance.</div>
                  </div>

                  <p className="product-short-description">
                    {product.description || product.story || "A handcrafted pantry staple designed to bring bold, natural flavor to everyday cooking."}
                  </p>

                  <div className="product-purchase-panel">
                    <div className="product-selector-grid">
                      <div className="product-option-field">
                        <label className="product-field-label">Select Size</label>
                        <select
                          className="form-select product-select"
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        >
                          {activeSizes.length > 0 ? (
                            activeSizes.map(({ id, sizeLabel }) => (
                              <option key={id} value={sizeLabel}>
                                {sizeLabel}
                              </option>
                            ))
                          ) : (
                            <option value="">Default</option>
                          )}
                        </select>
                      </div>

                      <div className="product-option-field quantity-field">
                        <label className="product-field-label">Quantity</label>
                        <div className="product-qty-control">
                          <button
                            type="button"
                            className="qty-stepper"
                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <input
                            className="form-control product-qty-input"
                            type="number"
                            value={quantity}
                            min={1}
                            max={20}
                            onChange={(e) => setQuantity(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                          />
                          <button
                            type="button"
                            className="qty-stepper"
                            onClick={() => setQuantity((prev) => Math.min(20, prev + 1))}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="product-cta-row">
                      <button className="theme-btn product-cta-primary" onClick={handleAddToCart}>
                        <i className="fas fa-shopping-basket me-2"></i> Add to Cart
                      </button>
                      <button className="theme-btn btn-black product-cta-secondary" onClick={buyNow}>
                        Buy Now
                      </button>
                    </div>
                  </div>

                  <div className="product-highlights-grid">
                    <div className="product-highlight-card">
                      <span className="highlight-label">Shipping Fee</span>
                      <strong>₹{product.shippingFee || 0}</strong>
                    </div>
                    <div className="product-highlight-card">
                      <span className="highlight-label">Availability</span>
                      <strong>{activeSizes.length > 0 ? "Ready to order" : "Standard pack"}</strong>
                    </div>
                    <div className="product-highlight-card">
                      <span className="highlight-label">Review Access</span>
                      <strong>Verified buyers only</strong>
                    </div>
                  </div>

                  {product.story && (
                    <div className="product-story-panel">
                      <h6>Why customers love it</h6>
                      <p>{product.story}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="product-details-extra product-detail-tabs-shell mb-50">
            <ul className="nav custom-premium-tabs" id="productTab" role="tablist">
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')} type="button">Details</button>
              </li>
              {product.nutrition?.length > 0 && (
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'nutrition' ? 'active' : ''}`} onClick={() => setActiveTab('nutrition')} type="button">Nutrition</button>
                </li>
              )}
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')} type="button">Reviews ({totalReviews})</button>
              </li>
            </ul>

            <div className="tab-content-modern product-detail-content-card" id="productTabContent">
              {activeTab === 'details' && (
                <div className="tab-pane-modern fade-in">
                  <div className="row g-4">
                    {product.benefits?.length > 0 && (
                      <div className="col-lg-6">
                        <div className="product-info-panel">
                          <h6 className="fw-bold">Key Benefits</h6>
                          <ul>
                            {product.benefits.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                    {product.howToUse?.length > 0 && (
                      <div className="col-lg-6">
                        <div className="product-info-panel">
                          <h6 className="fw-bold">How to Use</h6>
                          <ol className="product-steps-list">
                            {product.howToUse.map((step, i) => <li key={i}>{step}</li>)}
                          </ol>
                        </div>
                      </div>
                    )}
                    {!product.benefits?.length && !product.howToUse?.length && (
                      <div className="col-12">
                        <div className="product-info-panel">
                          <h6 className="fw-bold">Product Details</h6>
                          <p className="mb-0">{product.description || product.story}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div className="tab-pane-modern fade-in">
                  <div className="product-info-panel">
                    {product.nutrition?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-bordered table-sm nutrition-table">
                          <thead>
                            <tr><th>Nutrient</th><th>Value</th></tr>
                          </thead>
                          <tbody>
                            {product.nutrition.map((n, i) => (
                              <tr key={i}><td>{n.name}</td><td>{n.value}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {product.nutritionNote && <p className="small text-muted mt-3 mb-0">*{product.nutritionNote}</p>}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-pane-modern fade-in">
                  <div className="reviews-hero">
                    <div className="reviews-summary-card">
                      <span className="reviews-summary-label">Average Rating</span>
                      <strong>{averageRating.toFixed(1)}</strong>
                      <StarRating value={Math.round(averageRating)} readOnly size={18} />
                      <p>{totalReviews} approved review{totalReviews === 1 ? "" : "s"} from verified shoppers.</p>
                    </div>
                    <div className="reviews-summary-card reviews-summary-note">
                      <span className="reviews-summary-label">Review Policy</span>
                      <p>Only logged-in verified purchasers can post one review per product, and every review is published after admin approval.</p>
                      {canReview ? (
                        <button className="theme-btn btn-sm" onClick={() => setShowReviewForm(!showReviewForm)}>
                          {showReviewForm ? "Hide Review Form" : "Write a Review"}
                        </button>
                      ) : (
                        <div className="text-muted small">
                          <i className="fas fa-info-circle me-1"></i> Review access unlocks after a valid purchase on your account.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="review-toolbar">
                    <div className="review-toolbar-copy">Sort customer feedback</div>
                    <select
                      className="form-select review-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest first</option>
                      <option value="highest">Highest rating</option>
                      <option value="lowest">Lowest rating</option>
                    </select>
                  </div>

                  {showReviewForm && (
                    <form className="review-form review-form-card" onSubmit={handleReviewSubmit}>
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label className="fw-bold d-block">Rating</label>
                          <StarRating value={newReview.rating} onChange={(rating) => setNewReview({ ...newReview, rating })} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input type="text" className="form-control" placeholder="Your Name" value={newReview.customerName} onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })} required />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input type="email" className="form-control" placeholder="Email Address" value={newReview.customerEmail} onChange={(e) => setNewReview({ ...newReview, customerEmail: e.target.value })} required />
                        </div>
                        <div className="col-md-12 mb-3">
                          <textarea className="form-control" rows="4" placeholder="Share your experience..." value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} required />
                        </div>
                        <div className="col-12 review-form-actions">
                          <button type="submit" className="theme-btn me-2">Submit Review</button>
                          <button type="button" className="theme-btn btn-black" onClick={() => setShowReviewForm(false)}>Cancel</button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="reviews-list">
                    {sortedReviews.length > 0 ? (
                      sortedReviews.map((review) => (
                        <div key={review.id} className="review-item review-card">
                          <div className="review-card-header">
                            <div>
                              <strong className="d-block review-author">{review.customerName}</strong>
                              {review.isVerified && (
                                <span className="review-verified-tag"><i className="fas fa-check-circle me-1"></i> Verified Purchase</span>
                              )}
                            </div>
                            <div className="text-end review-meta">
                              <StarRating value={review.rating} readOnly size={16} />
                              <span className="text-muted small d-block mt-1">
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                              </span>
                            </div>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="product-info-panel empty-reviews-panel">
                        <h6 className="fw-bold">No approved reviews yet</h6>
                        <p className="mb-0">Once verified customers start sharing their experience, the feedback will appear here.</p>
                      </div>
                    )}
                  </div>

                  {nextCursor && (
                    <div className="reviews-load-more">
                      <button type="button" className="theme-btn" onClick={loadMore}>
                        Load more reviews
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default DetailsPage;
