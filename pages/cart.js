import Link from "next/link";
import { useEffect, useState } from "react";
import ClientLogoSlider from "../src/components/ClientLogoSlider";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { fetchCartItems, updateCartItems } from "../services/cartServices";
import { getTax } from "../services/checkoutServices";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);

  // total price
  const [subTotal, setSubTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [vat, setVat] = useState();
  const [tax, setTax] = useState();
  const [guestId, setGuestId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState(0);
  const [userId, setUserId] = useState(null);


  // let shipping = 10;

  useEffect(() => {
  const shippingVal = parseFloat(calculateShipping(cartData));
  const sub = parseFloat(subTotal_());
  const vatVal = Number(((sub * Number(tax || 0)) / 100).toFixed(2));
  const total = Number((sub + vatVal + shippingVal).toFixed(2));

  setShipping(shippingVal);
  setSubTotal(sub.toFixed(2));
  setVat(vatVal);
  setTotalPrice(total);

  sessionStorage.setItem("munfirm", JSON.stringify({
    subTotal: sub.toFixed(2),
    totalPrice: total,
    shipping: shippingVal,
    vat: vatVal,
    cartData
  }));
}, [cartData, tax]);

  // useEffect(() => {
  //   const shipping = parseFloat(calculateShipping(cartData));
  //   setSubTotal(subTotal_());
  //   console.log('tax', tax);
  //   setVat(Number((subTotal_() * tax) / 100).toFixed(2));
  //   setTotalPrice(
  //     (Number(subTotal_()) + Number(vat) + Number(shipping)).toFixed(2)
  //   );

  //   console.log("hii");
  //   setShipping(shipping);
  //   sessionStorage.setItem(
  //     "munfirm",
  //     JSON.stringify({ subTotal, totalPrice, shipping, vat, cartData })
  //   );
  // });

  useEffect(() => {
    const userId = sessionStorage.getItem('uid');
    setUserId(userId);

    console.log('45------');

    if (!userId) {
      setLoading(false); // No guest ID, stop loading
      return;
    }

    setLoading(true); // Start loading

    getTax()
      .then((items) => {
        console.log('57---------', items);
        setTax(items.value)
      })
      .catch((error) => {
        console.error("Error", error);
      });
    fetchCartItems(userId)
      .then((items) => {
        setCartData(items);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading after fetch
      });

  }, []);

  // const calculateShipping = (cartItems, shippingSettings) => {
  //   const subTotal = cartItems.reduce(
  //     (sum, item) => sum + item.productDetails.price * item.quantity,
  //     0
  //   );

  //   // Single product (only one type)
  //   if (cartItems.length === 1) {
  //     const shipping = cartItems[0].productDetails.shippingFee || 0;
  //     return shipping; // charged once
  //   }

  //   // Multiple products
  //   if (!shippingSettings?.enableOrderShipping) {
  //     // fallback: sum each product's shippingFee once
  //     const total = cartItems.reduce((sum, item) => {
  //       const shipping = parseFloat(item.productDetails.shippingFee || "0");
  //       return sum + shipping;
  //     }, 0);
  //     return total.toFixed(2);
  //   }

  //   const freeLimit = parseFloat(shippingSettings.freeShippingAbove || "0");
  //   const shippingCap = parseFloat(shippingSettings.shippingCap || "999");

  //   if (subTotal >= freeLimit) {
  //     return (0).toFixed(2);
  //   }

  //   // Sum each product’s shippingFee once
  //   const totalShipping = cartItems.reduce((sum, item) => {
  //     return sum + (item.productDetails.shippingFee || 0);
  //   }, 0);

  //   const cappedShipping = Math.min(totalShipping, shippingCap);
  //   return cappedShipping.toFixed(2);
  // };

  const calculateShipping = (cartItems, shippingSettings) => {
    const subTotal = cartItems.reduce(
      (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.cartQty || 0),
      0
    );

    if (cartItems.length === 1) {
      const shipping = parseFloat(cartItems[0].shippingFee || 0);
      return shipping; // charged once
    }

    if (!shippingSettings?.enableOrderShipping) {
      const total = cartItems.reduce((sum, item) => {
        const fee = parseFloat(item.shippingFee || "0");
        return sum + fee;
      }, 0);
      return total.toFixed(2);
    }

    const freeLimit = parseFloat(shippingSettings.freeShippingAbove || "0");
    const shippingCap = parseFloat(shippingSettings.shippingCap || "999");

    if (subTotal >= freeLimit) return (0).toFixed(2);

    const totalShipping = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.shippingFee || 0);
    }, 0);

    const capped = Math.min(totalShipping, shippingCap);
    return capped.toFixed(2);
  };

  const subTotal_ = () => {
    return cartData
      .reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.cartQty || 0), 0)
      .toFixed(2);
  };

 const updateAllQuantities = async () => {
  setLoading(true);
  try {
    await Promise.all(
      cartData.map(item =>
        // include sizeId (and maybe cart line id if you have it)
        updateCartItems(userId, {
          productId: item.productId,
          sizeId: item.sizeId,
          cartQty: Number(item.cartQty || 1),
        })
      )
    );
    alert("Cart updated successfully!");
  } catch (error) {
    console.error("Error updating all quantities:", error);
    alert("Failed to update cart.");
  } finally {
    setLoading(false);
  }
};

  const updateQuantity = async (index, type) => {
    setCartData(prev => {
      const next = prev.map((item, i) => {
        if (i !== index) return item;

        const current = Number(item.cartQty || 1);
        const newQty = type === "-" ? Math.max(1, current - 1) : current + 1;

        // Recompute line total if you store it
        const unitPrice = Number(item.unitPrice || 0);

        return {
          ...item,
          cartQty: newQty,
          lineTotal: unitPrice * newQty,
        };
      });
      return next;
    });
  };
  console.log("cartData----", tax);
  return (
    <Layout>
      <PageBanner pageName={"Cart Page"} />
      <div className="cart-area py-130 rpy-100">
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <p>Loading cart...</p>
          </div>
        ) : cartData.length === 0 ?
          (
            <div className="redirectPage" style={{ textAlign: "center" }}>
              <Link legacyBehavior href="/product-details">
                <a className="theme-btn">
                  Go to product page <i className="fas fa-angle-double-right" />
                </a>
              </Link>
            </div>
          ) :
          (
            <div className="container cartList">
              <div className="cart-item-wrap mb-35 wow fadeInUp delay-0-2s">
                {cartData.map((cart, i) => (
                  <div className="cart-single-item" key={i}>
                    <button
                      type="button"
                      className="close"
                      onClick={() =>
                        setCartData(cartData.filter((c) => c.id !== cart.id))
                      }
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                    <div className="cart-img">
                      <img src={cart.image} alt="Product Image" />
                    </div>
                    <h5 className="product-name">{cart.name}</h5>
                    <span className="product-price">{cart.unitPrice}</span>
                    <div className="quantity-input">
                      <button
                        className="quantity-down"
                        onClick={() => updateQuantity(i, "-")}
                      >
                        -
                      </button>
                      <input
                        className="quantity"
                        type="text"
                        defaultValue={cart.cartQty}
                        value={cart.cartQty}
                        name="quantity"
                      />
                      <button
                        className="quantity-up"
                        onClick={() => updateQuantity(i, "+")}
                      >
                        +
                      </button>
                    </div>
                    <span className="product-total-price">
                      {cart.cartQty * cart.unitPrice}
                    </span>
                  </div>
                ))}
              </div>
              <div className="row text-center text-lg-left align-items-center wow fadeInUp delay-0-2s">
                <div className="col-lg-6">
                  <div className="discount-wrapper rmb-30">
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      action="#"
                      className="d-sm-flex justify-content-center justify-content-lg-start"
                    >
                      {/* <input type="text" placeholder="Coupon Code" required="" />
                      <button className="theme-btn flex-none" type="submit">
                        apply Coupon <i className="fas fa-angle-double-right" />
                      </button> */}
                    </form>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="update-shopping text-lg-right">
                    {/* <Link legacyBehavior href="/shop-grid">
                    <a className="theme-btn style-two">
                      shopping <i className="fas fa-angle-double-right" />
                    </a>
                  </Link> */}
                    {/* <Link legacyBehavior>
                    <a className="theme-btn"
                      onClick={async (e) => {
                        e.preventDefault(); // prevent immediate navigation
                        await updateAllQuantities(); // call your update function
                        window.location.href = "/shop-grid"; // then navigate
                      }}>
                      update cart <i className="fas fa-angle-double-right" />
                    </a>
                  </Link> */}
                    <button className="theme-btn" onClick={updateAllQuantities}>
                      update cart <i className="fas fa-angle-double-right" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="payment-cart-total pt-25 wow fadeInUp delay-0-2s">
                <div className="row justify-content-end">
                  <div className="col-lg-5">
                    <div className="shoping-cart-total mt-45">
                      <h4 className="form-title m-25">Cart Totals</h4>
                      <table>
                        <tbody>
                          <tr>
                            <td>Cart Subtotal</td>
                            <td className="sub-total-price">{subTotal}</td>
                          </tr>
                          <tr>
                            <td>Shipping Fee</td>
                            <td className="shipping-price">
                              {shipping.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td>Vat</td>
                            <td>₹{vat}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Order Total</strong>
                            </td>
                            <td>
                              <strong className="total-price">
                                {Number(totalPrice)}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Link legacyBehavior href="/checkout">
                        <a className="theme-btn style-two mt-25 w-100">
                          Proceed to checkout
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

      </div>
      {/* Cart Area End */}
      {/* Client Logo Section Start */}
      {/* <div className="client-logo-section text-center bg-light-green py-60">
        <div className="container">
          <ClientLogoSlider />
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
      </div> */}
    </Layout>
  );
};
export default CartPage;
