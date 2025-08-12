import Link from "next/link";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { fetchItems, fetchCategory } from "../services/itemServices";
import React, { useEffect, useState } from "react";
import { addToCart } from "../services/cartServices";
import { useRouter } from "next/router";
import { addToWishlist, getWishlist, removeFromWishlist } from '../services/wishlistService';
import { auth } from '../firebase'; // your firebase config


const ProductList = () => {

  const router = useRouter();
  const { category } = router.query;

  const [items, setProducts] = useState([]);
  const [guestId, setGuestId] = useState("");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is logged in
        setUser(user);
        setUserId(user.uid);
      } else {
        // User is logged out
        setUser(null);
        // Optionally redirect to login page
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchItems()
      .then(data => {
        if (category) {
          const filteredItems = data.filter(
            item => item.category === decodeURIComponent(category)
          );
          setProducts(filteredItems);
        } else {
          setProducts(data);
        }
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, [category]); // <- run this effect whenever category changes

  useEffect(() => {
    fetchCategory()
      .then(data => {
        // Remove duplicates by category name
        const uniqueCategories = Array.from(
          new Map(data.map(cat => [cat.category, cat])).values()
        );
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, []);


  useEffect(() => {
    let storedGuestId = localStorage.getItem("guestId");
    if (!storedGuestId) {
      storedGuestId = `guest_${Date.now()}`;
      localStorage.setItem("guestId", storedGuestId);
    }
    setGuestId(storedGuestId);
  }, []);

  const handleAddToCart = async (item, quantity) => {
    const productId = item.id;
    try {
      setLoading(true); // show loader
      await addToCart(guestId, productId, quantity);
      alert("Item added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false); // hide loader
    }
  };

  // Load wishlist once when userId is available
  useEffect(() => {
    if (userId) {
      getWishlist(userId).then(setWishlistItems).catch(console.error);
    }
  }, [userId]);

  // Check if product is already in wishlist
  const isInWishlist = (productId) => {
    console.log('103-------', wishlistItems);
    return wishlistItems.some((item) => item.id === productId);
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

  console.log('125--------', categories);
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

        {/* <div className="mb-4 text-center">
          <select
            style={{ marginLeft: '1000px' }}
            className="form-select w-auto d-inline-block"
            value={category || ""}
            onChange={(e) => {
              const selected = e.target.value;
              router.push({
                pathname: "/product-details",
                query: selected ? { category: selected } : {},
              });
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div> */}

        <div className="category-scrollbar container mb-4 ">
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
                    {/* Image clickable */}
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

                      {/* Move Wishlist button outside the <a> */}
                      <button
                        className="btn-wishlist"
                        title="Add to Wishlist"
                        aria-label="Add to Wishlist"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default just in case
                          e.stopPropagation(); // Stop event from reaching Link
                          handleAddToWishlist(item.id);
                        }}
                        style={{ position: "absolute", top: 10, right: 10 }}
                      >
                        <i className={`fas fa-heart ${isInWishlist(item.id) ? 'active' : ''}`} />
                      </button>
                    </div>


                    <div className="card-body">
                      {/* Title clickable */}
                      <Link href={`/detailsPage?id=${item.id}`} legacyBehavior>
                        <a style={{ textDecoration: "none", color: "inherit" }}>
                          <h5 className="card-title mb-1">{item.name}</h5>
                        </a>
                      </Link>

                      <p className="text-muted small mb-2">{item.category}</p>
                      <p className="card-text text-danger fw-bold">₹{item.price}</p>

                      {/* Optional static rating */}
                      <p className="mb-2">
                        <span className="text-warning">★ ★ ★ ★ ☆</span>{" "}
                        <span className="text-muted">({item.reviews || "1,000+"})</span>
                      </p>

                      {/* Quantity & Add to Cart */}
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
                          // className="form-control form-control-sm"
                          style={{ width: "auto", height: "20px", marginRight: "10px" }}
                        />

                        <button
                          className="btn btn-primary btn-sm btn-add-to-cart"
                          onClick={() => handleAddToCart(item, quantities[item.id] || 1)}
                        >
                          Add to Cart
                        </button>
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
