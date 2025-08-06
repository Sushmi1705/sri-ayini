import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/layout/Layout";
import PageBanner from "../src/components/PageBanner";
import { fetchItemById } from "../services/itemServices";
import { addToCart } from "../services/cartServices";

const DetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [guestId, setGuestId] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (id) {
      fetchItemById(id)
        .then((data) => setProduct(data))
        .catch((err) => console.error("Failed to fetch product", err));
    }
  }, [id]);

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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetailsPage;