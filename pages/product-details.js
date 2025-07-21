import Link from "next/link";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { fetchItems } from "../services/itemServices";
import React, { useEffect, useState } from "react";
import { addToCart } from "../services/cartServices";

const ProductList = () => {
  const [items, setProducts] = useState([]);
  const [guestId, setGuestId] = useState("");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchItems()
      .then(data => {
        setProducts(data.items);
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
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false); // hide loader
    }
  };

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
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <PageBanner pageName={"Products"} />
      <section className="product-list-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {items.length > 0 ? (
              items.map((item) => (
                <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={item.id}>
                  <div className="card h-100 shadow-sm border-0">
                    {/* Image clickable */}
                    <Link href={`/detailsPage?id=${item.id}`} legacyBehavior>
                      <a>
                        <img
                          src={item.image || "assets/images/products/masala.jpg"}
                          className="card-img-top p-3"
                          alt={item.name}
                          style={{ height: "200px", objectFit: "contain" }}
                        />
                      </a>
                    </Link>

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
                      {/* <p className="mb-2">
                        <span className="text-warning">★ ★ ★ ★ ☆</span>{" "}
                        <span className="text-muted">({item.reviews || "1,000+"})</span>
                      </p> */}

                      {/* Quantity & Add to Cart */}
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={quantities[item.id] !== undefined ? quantities[item.id] : 1}
                          onChange={(e) => {
                            const parsed = parseInt(e.target.value);
                            setQuantities((prev) => ({
                              ...prev,
                              [item.id]: isNaN(parsed) || parsed < 1 ? 1 : parsed,
                            }));
                          }}
                          // className="form-control form-control-sm"
                          style={{ width: "auto", height: "20px", marginRight: "10px" }}
                        />

                        <button
                          className="btn btn-primary btn-sm"
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
