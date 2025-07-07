import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { fetchItems } from "../services/itemServices";
import React, { useEffect, useState } from "react";
import { addToCart } from "../services/cartServices";

const ProductDetails = () => {
  const [items, setProducts] = useState([]);
  const [guestId, setGuestId] = useState("");
  const [quantities, setQuantities] = useState({});

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
    await addToCart(guestId, productId, quantity);
    alert("Item added to cart!");
    // window.location.href = '/cart';
  };

  return (
    <Layout>
      <PageBanner pageName={"Product Details"} />
      <section className="product-details-area pt-130 rpt-100">
        <div className="container">
          {items.length > 0 ? (
            items.map((item) => (
              <div className="row align-items-center justify-content-between mb-5" key={item.id}>
                {/* Left: Image */}
                <div className="col-lg-6">
                  <div className="product-preview-images rmb-55">
                    <a href={item.image || "assets/images/products/masala.jpg"}>
                      <img
                        src={item.image || "assets/images/products/masala.jpg"}
                        alt={item.name}
                      />
                    </a>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="col-xl-5 col-lg-6">
                  <div className="product-details-content mb-30">
                    <div className="section-title mb-20">
                      <h2>{item.name}</h2>
                    </div>
                    <p>{item.description}</p>
                    <span className="price mb-20">₹{item.price}</span>
                    <hr />
                    <form onSubmit={(e) => e.preventDefault()} className="add-to-cart mt-40 mb-40">
                      <input
                        type="number"
                        value={quantities[item.id] || 1}
                        min={1}
                        max={20}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [item.id]: Number(e.target.value),
                          })
                        }
                      />
                      <button
                        type="submit"
                        className="theme-btn"
                        onClick={() => handleAddToCart(item, quantities[item.id] || 1)}
                      >
                        Add to Cart <i className="fas fa-angle-double-right" />
                      </button>
                    </form>
                    <hr />
                    <ul className="category-tags pt-10">
                      <li>
                        <b>Category</b> <span>:</span>{" "}
                        <a href="#">{item.category}</a>
                      </li>
                    </ul>
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
      </section>
    </Layout>
  );
};

export default ProductDetails;
