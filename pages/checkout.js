import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Accordion } from "react-bootstrap";
import { auth } from '../firebase'; // your firebase config
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { checkout } from "../services/cartServices";
import { fetchCartItems } from "../services/cartServices";
import { fetchItemById } from "../services/itemServices";
import { createRazorpayOrder, savePaymentDetails } from "../services/checkoutServices";
import { fetchAddresses } from "../services/loginServices";

const Checkout = () => {
  const [guestId, setGuestId] = useState(null);
  const formRef = useRef(null);

  // const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
  // console.log(razorpayKey);
  // const totalAmount = useRef(null);
  const [cartData, setCartData] = useState([]);
  const [vat, setVat] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [tax, setTax] = useState();
  const [subTotal, setSubTotal] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("BankTransfer");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    companyName: "",
    companyAddress: "",
    country: "",
    city: "",
    state: "",
    zip: "",
    streetName: "",
    apartmentName: "",
    orderNote: "",
    paymentMethod: "Direct Bank Transfer", // default selected
  });

  // Add this in useEffect or at app level
  useEffect(() => {
    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {

    const shippingVal = parseFloat(calculateShipping(cartData));
    const sub = parseFloat(subTotal_());
    const vatVal = Number(((sub * Number(tax || 0)) / 100).toFixed(2));
    const total = Number((sub + vatVal + shippingVal).toFixed(2));

    setShipping(shippingVal);
    setSubTotal(sub.toFixed(2));
    setVat(vatVal);
    setTotalPrice(total);

    const userId = localStorage.getItem('uid');
    setUserId(userId);
    const storedGuestId = localStorage.getItem("guestId");
    setGuestId(storedGuestId);

    if (!userId) {
      setLoading(false); // No guest ID, stop loading
      return;
    }
    setLoading(true); // Start loading

    let localStorageData = JSON.parse(localStorage.getItem("munfirm"));
    console.log(localStorageData);
    if (localStorageData) {
      setTotalPrice(localStorageData.totalPrice);
      // setShipping(localStorageData.shipping);
      setVat(localStorageData.vat);
    }

    const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));

    if (buyNowProduct) {
      // 👇 You can fetch the product details by ID if needed
      fetchItemById(buyNowProduct.id)
        .then((product) => {
          setCartData([
            {
              ...product,
              quantity: buyNowProduct.quantity,
            },
          ]);
          localStorage.removeItem("buyNowProduct");
        })
        .catch((err) => {
          console.error("Buy Now product fetch failed:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Load full cart
      fetchCartItems(userId)
        .then((items) => {
          setCartData(items);
        })
        .catch((err) => {
          console.error("Fetch cart failed:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  // Fetch addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await fetchAddresses(userId); // API call
        if (res?.addresses?.length > 0) {
          setAddresses(res.addresses);

          // Pick default if exists, else first one
          const def = res.addresses.find(a => a.isDefault) || res.addresses[0];
          setDefaultAddress(def);
          setFormData(prev => ({ ...prev, ...def }));
        }
      } catch (err) {
        console.error("Failed to load addresses:", err);
      }
    };

    if (userId) loadAddresses();
  }, [userId]);

  const subTotal_ = () => {
    return cartData
      .reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.cartQty || 0), 0)
      .toFixed(2);
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = () => {
    const form = formRef.current;

    // Extract form values
    const formData = new FormData(form);
    console.log('88----------', formData);
    const billingDetails = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      country: formData.get("country"),
      city: formData.get("city"),
      state: formData.get("state"),
      streetName: formData.get("streetName"),
      apartmentName: formData.get("apartmentName"),
      orderNote: formData.get("orderNote"),
      zip: formData.get("zip"),
      phone: formData.get("phone"),
      email: formData.get("email")
      // Add other fields as needed
    };
    // console.log('103-----', billingDetails);

    // Native HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity(); // shows browser messages
      return;
    }
    const selectedMethod = document.querySelector(
      'input[name="defaultExampleRadios"]:checked'
    )?.id;

    let paymentMethod = "";
    if (selectedMethod === "methodone") paymentMethod = "BankTransfer";
    else if (selectedMethod === "methodtwo") paymentMethod = "COD";
    else if (selectedMethod === "methodthree") paymentMethod = "Razorpay";

    if (paymentMethod === "Razorpay") {
      handleRazorpayPayment(); // Call Razorpay popup logic
    } else {
      const manualPayment = {
        orderId: cartData[0].id, // You should generate/get this from backend
        userId: userId,
        amount: totalPrice,
        status: "Pending",
        transactionId: `manual_${Date.now()}`,
        createdAt: new Date().toISOString(),
        paymentMethod,
        paymentGateway: paymentMethod === "BankTransfer" ? "Bank Transfer" : "Cash",
        email: billingDetails.email,
        mobile: billingDetails.phone,
        currency: "INR",
        razorpaySignature: null,
      };
      // console.log('totalPrice----', totalPrice);
      // console.log('shipping----', shipping);
      // console.log('vat----', vat);
      savePaymentDetails(manualPayment, totalPrice, shipping, vat, billingDetails);
      alert("Order placed successfully using " + paymentMethod);
      window.dispatchEvent(new Event("cartUpdated"));
      setCartData([]);
    }
  }


  const handleRazorpayPayment = async () => {

    try {
      const { order } = await createRazorpayOrder(totalPrice);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Make sure it's in your .env file
        amount: order.amount,
        currency: order.currency,
        name: "Sri Ayini",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          console.log("Payment success:", response);

          const paymentData = {
            orderId: order.id,
            userId: userId, // or actual user ID if logged in
            amount: order.amount, // from Razorpay order
            status: "Completed",
            transactionId: response.razorpay_payment_id,
            createdAt: new Date().toISOString(),
            paymentMethod: "UPI", // Or dynamically detect
            paymentGateway: "Razorpay",
            email: "customer@example.com", // from prefill or user info
            mobile: "9999999999",
            currency: order.currency,
            razorpaySignature: response.razorpay_signature,
          };

          await savePaymentDetails(paymentData);
          alert("Payment successful! Order placed.");
          window.dispatchEvent(new Event("cartUpdated"));
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };
      console.log('107-------', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in Razorpay payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  console.log('222====', cartData);

  const toNumber = (val) => {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    // remove currency symbols, commas, spaces
    const cleaned = val.replace(/[^\d.-]/g, '');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

  // At the top of your component (or just before return):
  const itemTotal = cartData.reduce((acc, card) => {
    console.log('307----', toNumber(card.unitPrice));
    const price = toNumber(card.unitPrice) || 0;
    return acc + price * toNumber(card.cartQty);
  }, 0);

  const orderTotal = itemTotal + toNumber(shipping) + toNumber(vat);

  return (
    <Layout>
      <PageBanner pageName={"Checkout"} />
      <div className="checkout-form-area py-130 rpy-100">
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <p>Loading cart...</p>
          </div>
        ) :
          cartData.length == 0 ?
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
              <div className="container">
                {/* <Accordion
            className="checkout-faqs wow fadeInUp delay-0-2s"
            id="checkout-faqs"
          >
            <div className="alert bg-lighter">
              <h6>
                Returning customer?{" "}
                <Accordion.Toggle
                  as={"a"}
                  className="collapsed card-header c-cursor"
                  data-toggle="collapse"
                  data-target="#collapse0"
                  aria-expanded="false"
                  eventKey="collapse0"
                >
                  Click here to login
                </Accordion.Toggle>
              </h6>
              <Accordion.Collapse eventKey="collapse0" className="content">
                <form onSubmit={(e) => e.preventDefault()} action="#">
                  <p>Please login your accont.</p>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="email"
                          id="email-address"
                          name="email-address"
                          className="form-control"
                          defaultValue=""
                          placeholder="Your Email Address"
                          required=""
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control"
                          defaultValue=""
                          placeholder="Your Password"
                          required=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-footer">
                    <button type="submit" className="theme-btn style-two">
                      login <i className="fas fa-angle-double-right" />
                    </button>
                    <input
                      type="checkbox"
                      name="loss-passowrd"
                      id="loss-passowrd"
                      required=""
                    />
                    <label htmlFor="loss-passowrd">Remember me</label>
                  </div>
                  <a href="#">Lost your password?</a>
                </form>
              </Accordion.Collapse>
            </div>
            <div className="alert bg-lighter">
              <h6>
                Have a coupon?{" "}
                <Accordion.Toggle
                  as={"a"}
                  className="collapsed card-header c-cursor"
                  data-toggle="collapse"
                  data-target="#collapse3"
                  aria-expanded="false"
                  eventKey="collapse3"
                >
                  Click here to enter your code
                </Accordion.Toggle>
              </h6>
              <Accordion.Collapse eventKey="collapse3" className="content">
                <form onSubmit={(e) => e.preventDefault()} action="#">
                  <p>If you have a coupon code, please apply it below.</p>
                  <div className="form-group">
                    <input
                      type="text"
                      id="coupon-code"
                      name="coupon-code"
                      className="form-control"
                      defaultValue=""
                      placeholder="Coupon Code"
                      required=""
                    />
                  </div>
                  <button type="submit" className="theme-btn style-two">
                    apply coupon <i className="fas fa-angle-double-right" />
                  </button>
                </form>
              </Accordion.Collapse>
            </div>
          </Accordion> */}
                <h4 className="form-title mt-50 mb-25">Billing Details</h4>
                <form ref={formRef}>
                  <div className="row">
                    <div className="col-lg-12">
                      {/* 🏠 Saved Addresses Dropdown */}
                      {addresses.length > 0 && (
                        <div className="col-lg-12 mb-3">
                          <label className="form-label d-block mb-2">Choose Saved Address</label>
                          <div className="address-cards">
                            {addresses.map((addr) => (
                              <div
                                key={addr.id}
                                className={`address-card ${defaultAddress?.id === addr.id ? "selected" : ""}`}
                                onClick={() => {
                                  setDefaultAddress(addr);

                                  setFormData((prev) => {
                                    const updated = {
                                      ...prev,
                                      ...addr,
                                    };

                                    // Clear fields if not present
                                    if (!addr.email) updated.email = "";
                                    if (!addr.city) updated.city = "";
                                    if (!addr.postalCode) updated.postalCode = "";
                                    if (!addr.address) updated.address = "";
                                    if (!addr.firstName) updated.firstName = "";
                                    if (!addr.lastName) updated.lastName = "";
                                    if (!addr.state) updated.state = "";
                                    if (!addr.country) updated.country = "";

                                    return updated;
                                  });
                                }}
                              >
                                <div className="address-header">
                                  <strong>{addr.firstName} {addr.lastName}</strong>
                                  {addr.defaultAddress && <span className="badge">Default</span>}
                                </div>
                                <p>{addr.address}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                                {/* <p>{addr.country}</p> */}
                                {/* {addr.email && <small>Email: {addr.email}</small>} */}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}



                      <h6>Personal Information</h6>
                    </div>

                    {/* First & Last Name */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="firstName"
                          className="form-control"
                          value={formData.firstName || ''}
                          onChange={handleChange}
                          placeholder="First Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="lastName"
                          className="form-control"
                          value={formData.lastName || ''}
                          onChange={handleChange}
                          placeholder="Last Name"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData?.email || ''}
                          onChange={handleChange}
                          placeholder="Email Address"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <h6>Your Address</h6>
                    </div>

                    {/* Country */}
                    <div className="col-md-6 mb-30">
                      <div className="form-group">
                        <select
                          name="country"
                          value={formData.country || ''}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="">Select Country</option>
                          <option value="Australia">Australia</option>
                          <option value="Canada">Canada</option>
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                    </div>

                    {/* City & State */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="city"
                          className="form-control"
                          value={formData.city || ''}
                          onChange={handleChange}
                          placeholder="City"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="state"
                          className="form-control"
                          value={formData.state || ''}
                          onChange={handleChange}
                          placeholder="State"
                          required
                        />
                      </div>
                    </div>

                    {/* Zip & Street */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="zip"
                          className="form-control"
                          value={formData.postalCode || formData.zip} // handle both cases
                          onChange={handleChange}
                          placeholder="Zip"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="address"
                          className="form-control"
                          value={formData.address || ''}
                          onChange={handleChange}
                          placeholder="House, street name"
                          required
                        />
                      </div>
                    </div>

                    {/* Apartment */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="apartment"
                          className="form-control"
                          value={formData.apartment || ''}
                          onChange={handleChange}
                          placeholder="Apartment, suite, unit etc. (optional)"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="col-lg-12">
                      <h6>Order Notes (optional)</h6>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group mb-0">
                        <textarea
                          name="orderNote"
                          placeholder="Order Notes"
                          value={formData.orderNote || ''}
                          onChange={handleChange}
                          className="form-control"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </form>

                <div className="payment-cart-total pt-25">
                  <div className="row justify-content-between">
                    <div className="col-lg-6">
                      <div className="payment-method mt-45 wow fadeInUp delay-0-2s">
                        <h4 className="form-title my-25">Payment Method</h4>
                        <Accordion
                          defaultActiveKey="collapseOne"
                          as="ul"
                          id="paymentMethod"
                          className="mb-30"
                        >
                          {/* Default unchecked */}
                          <li className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="methodone"
                              name="defaultExampleRadios"
                              defaultChecked
                            />
                            <Accordion.Toggle
                              as="label"
                              className="custom-control-label"
                              htmlFor="methodone"
                              data-toggle="collapse"
                              data-target="#collapseOne"
                              eventKey="collapseOne"
                            >
                              Direct Bank Transfer{" "}
                              <i className="fas fa-money-check" />
                            </Accordion.Toggle>
                            <Accordion.Collapse
                              eventKey="collapseOne"
                              data-parent="#paymentMethod"
                              style={{}}
                            >
                              <p>
                                Make your payment directly into our bank account.
                                Please use your Order ID as the payment reference.
                                Your order will not be shipped our account.
                              </p>
                            </Accordion.Collapse>
                          </li>
                          {/* Default unchecked */}
                          <li className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="methodtwo"
                              name="defaultExampleRadios"
                            />
                            <Accordion.Toggle
                              as="label"
                              className="custom-control-label collapsed"
                              htmlFor="methodtwo"
                              data-toggle="collapse"
                              data-target="#collapseTwo"
                              eventKey="collapseTwo"
                            >
                              Cash On Delivery <i className="fas fa-truck" />
                            </Accordion.Toggle>
                            <Accordion.Collapse
                              eventKey="collapseTwo"
                              data-parent="#paymentMethod"
                              style={{}}
                            >
                              <p>Pay with cash upon delivery.</p>
                            </Accordion.Collapse>
                          </li>
                          {/* Default unchecked */}
                          <li className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="methodthree"
                              name="defaultExampleRadios"
                            />
                            <Accordion.Toggle
                              as="label"
                              className="custom-control-label collapsed"
                              htmlFor="methodthree"
                              data-toggle="collapse"
                              data-target="#collapsethree"
                              eventKey="collapsethree"
                            >
                              Razorpay <i className="fab fa-cc-paypal" />
                            </Accordion.Toggle>
                            <Accordion.Collapse
                              eventKey="collapsethree"
                              data-parent="#paymentMethod"
                              style={{}}
                            >
                              <p>
                                Pay via Razorpay; you can pay with your credit card if
                                you don’t have a Razorpay account.
                              </p>
                            </Accordion.Collapse>
                          </li>
                        </Accordion>
                        <p>
                          Your personal data will be used to process your order,
                          support your experience throughout this website, and for
                          other purposes described in our privacy policy.
                        </p>
                        <button type="button" className="theme-btn mt-15" onClick={placeOrder}>
                          Place order
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="shoping-cart-total mt-45 wow fadeInUp delay-0-4s">
                        <h4 className="form-title m-25">Cart Totals</h4>
                        <table>
                          <tbody>
                            {cartData.map((card) => (
                              <tr key={card.id}>
                                <td>
                                  {card.name} <strong>× {card.cartQty}</strong>
                                </td>
                                <td>₹{(card.cartQty * (card.unitPrice)).toFixed(2)}</td>
                              </tr>
                            ))}

                            <tr>
                              <td>Shipping Fee</td>
                              <td>₹{shipping.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>Vat</td>
                              <td>₹{Number(vat).toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Order Total</strong>
                              </td>
                              <td>
                                <strong>
                                  ₹{orderTotal.toFixed(2)}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

      </div>
    </Layout>
  );
};
export default Checkout;
