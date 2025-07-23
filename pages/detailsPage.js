import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/layout/Layout";
import PageBanner from "../src/components/PageBanner";
import { fetchItemById } from "../services/itemServices";
import { addToCart } from "../services/cartServices";
// import "../styles/product-details.scss";

const DetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [guestId, setGuestId] = useState("");

  useEffect(() => {
    if (id) {
      fetchItemById(id)
        .then((data) => setProduct(data))
        .catch((err) => console.error("Failed to fetch product", err));
    }
  }, [id]);

  useEffect(() => {
    let storedGuestId = localStorage.getItem("guestId");
    if (!storedGuestId) {
      storedGuestId = `guest_${Date.now()}`;
      localStorage.setItem("guestId", storedGuestId);
    }
    setGuestId(storedGuestId);
  }, []);

  const handleAddToCart = async () => {
    await addToCart(guestId, product.id, quantity);
    alert("Item added to cart!");
  };

  return (
    <Layout>
      <PageBanner pageName={"Product Details"} />
      <div className="product-page-container">
        {product ? (
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
              <div className="price">₹{product.price}</div>
              <div className="action-row">
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={20}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button onClick={handleAddToCart}>Add to Cart</button>
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
                  <p><strong>How to Use:</strong></p>
                  <ul>
                    {product.howToUse.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </>
              )}

              {product.benefits?.length > 0 && (
                <>
                  <p><strong>Benefits:</strong></p>
                  <ul>
                    {product.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </>
              )}

              {product.nutrition?.length > 0 && (
                <>
                  <p><strong>Nutrition (per 100g):</strong></p>
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
                <p><strong>Nutrition Note:</strong> {product.nutritionNote}</p>
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
            </div>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
    </Layout>
  );
};

export default DetailsPage;
