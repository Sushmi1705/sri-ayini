import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/layout/Layout";
import PageBanner from "../src/components/PageBanner";
import { fetchItemById, getAverageRating, addReview, getProductReviewsPaged } from "../services/itemServices";
import { addToCart } from "../services/cartServices";

const DetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [guestId, setGuestId] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [price, setPrice] = useState(0);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [nextCursor, setNextCursor] = useState(null); // <- Add this line
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    customerName: "",
    customerEmail: ""
  });

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

  // Set guestId once
  useEffect(() => {
    let storedGuestId = localStorage.getItem("guestId");
    if (!storedGuestId) {
      storedGuestId = `guest_${Date.now()}`;
      localStorage.setItem("guestId", storedGuestId);
    }
    setGuestId(storedGuestId);
  }, []);

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
      // For now, use the old endpoint until you implement pagination backend
      const reviewsData = await getProductReviews(id);
      setReviews(reviewsData);
      setNextCursor(null); // No pagination yet
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  // const loadMore = async () => {
  //   if (!nextCursor) return;
  //   try {
  //     // This will work once you implement the paginated backend
  //     const { items, nextCursor: nc } = await getProductReviewsPaged(id, { limit: 5, cursor: nextCursor, sortBy });
  //     setReviews(prev => [...prev, ...items]);
  //     setNextCursor(nc);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

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

  const handleAddToCart = async () => {
    await addToCart(guestId, product.id, quantity);
    alert("Item added to cart!");
  };

  const buyNow = async () => {
    await addToCart(guestId, product.id, quantity);
    const buyNowProduct = {
      id: product.id,
      quantity: quantity,
      guestId: guestId,
      size: selectedSize,
      price: price,
    };
    localStorage.setItem("buyNowProduct", JSON.stringify(buyNowProduct));
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        ...newReview,
        productId: id,
        guestId: guestId
      };

      await addReview(reviewData);
      setNewReview({ rating: 0, comment: "", customerName: "", customerEmail: "" });
      setShowReviewForm(false);
      loadReviews();
      loadAverageRating();
      alert("Review added successfully!");
    } catch (error) {
      console.error("Failed to add review:", error);
      alert("Failed to add review. Please try again.");
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
                fontSize: `${size}px}`,
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

  if (!product) {
    return (
      <Layout>
        <PageBanner pageName={"Product Details"} />
        <div className="product-page-container">
          <p>Loading product details...</p>
        </div>
      </Layout>
    );
  }

  // Filter active sizes for dropdown
  const activeSizes = product.sizes?.filter((s) => s.isActive) || [];

  return (
    <Layout>
      <PageBanner pageName={"Product Details"} />
      <div className="product-page-container">
        <div className="product-grid product-detail-grid">
          <div className="product-image-wrapper">
            <img
              src={product.image || "/assets/images/products/masala.jpg"}
              alt={product.name}
              className="product-image"
            />
          </div>

          <div className="product-content scrollable-content">
            <h2>{product.name}</h2>
            <p className="category">Category: {product.category}</p>

            {/* Rating Display */}
            <div className="rating-section">
              <StarRating value={Math.round(averageRating)} readOnly size={20} />
              <span className="rating-text">
                {averageRating.toFixed(1)} ({totalReviews} reviews)
              </span>
            </div>

            <div className="price">₹{price}</div>

            <div className="action-row">
              <select
                className="size-select"
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

              <input
                type="number"
                value={quantity}
                min={1}
                max={20}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />

              <button onClick={handleAddToCart}>Add to Cart</button>
              <button onClick={buyNow}>Buy Now</button>
            </div>

            <p>Quantity: {product.quantity} pcs</p>
            <p>Shipping Fee: ₹{product.shippingFee}</p>

            {product.description && <p>{product.description}</p>}
            {product.story && (
              <p>
                <strong>Story:</strong> {product.story}
              </p>
            )}

            {product.howToUse?.length > 0 && (
              <>
                <p>
                  <strong>How to Use:</strong>
                </p>
                <ul>
                  {product.howToUse.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </>
            )}

            {product.benefits?.length > 0 && (
              <>
                <p>
                  <strong>Benefits:</strong>
                </p>
                <ul>
                  {product.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </>
            )}

            {product.nutrition?.length > 0 && (
              <>
                <p>
                  <strong>Nutrition (per 100g):</strong>
                </p>
                <table className="nutrition-table">
                  <thead>
                    <tr>
                      <th>Nutrient</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.nutrition.map((n, i) => (
                      <tr key={i}>
                        <td>{n.name}</td>
                        <td>{n.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {product.nutritionNote && (
              <p>
                <strong>Nutrition Note:</strong> {product.nutritionNote}
              </p>
            )}

            {product.customerSupport && (
              <div className="support-section">
                <h5>Customer Support</h5>
                {product.customerSupport.email && <p>Email: {product.customerSupport.email}</p>}
                {product.customerSupport.phone && <p>Phone: {product.customerSupport.phone}</p>}
                {product.customerSupport.whatsapp && <p>WhatsApp: {product.customerSupport.whatsapp}</p>}
                {product.customerSupport.website && <p>Website: {product.customerSupport.website}</p>}
              </div>
            )}

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h4>Customer Reviews</h4>
                <button
                  className="btn-write-review"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  Write a Review
                </button>
              </div>

              {/* Sort controls (client-side) */}
              <div className="reviews-controls">
                <div>
                  {/* <p>Sort by:</p> */}
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Most recent</option>
                    <option value="highest">Highest rating</option>
                    <option value="lowest">Lowest rating</option>
                  </select>
                </div>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label>Rating:</label>
                    <StarRating
                      value={newReview.rating}
                      onChange={(rating) => setNewReview({ ...newReview, rating })}
                      size={22}
                    />
                  </div>

                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={newReview.customerName}
                      onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={newReview.customerEmail}
                      onChange={(e) => setNewReview({ ...newReview, customerEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Review:</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-submit">Submit Review</button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="reviews-list">
                {sortedReviews.length > 0 ? (
                  sortedReviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info" data-initial={(review.customerName || '?')[0]}>
                          <strong>{review.customerName}</strong>
                          <span className="review-date">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <StarRating value={review.rating} readOnly size={18} />
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to review this product!</p>
                )}
              </div>

              {nextCursor && (
                <div className="reviews-load-more">
                  <button onClick={loadMore}>Load more reviews</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetailsPage;