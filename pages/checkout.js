import { useEffect, useMemo, useRef, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { fetchCartItems, getCartOwnerId } from "../services/cartServices";
import { createRazorpayOrder, getTax, savePaymentDetails } from "../services/checkoutServices";
import { fetchAddresses } from "../services/loginServices";

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  country: "India",
  city: "",
  state: "",
  zip: "",
  address: "",
  apartment: "",
  orderNote: "",
};

const mapAddressToForm = (address = {}) => ({
  firstName: address.firstName || "",
  lastName: address.lastName || "",
  phone: address.phone || "",
  email: address.email || "",
  country: address.country || "India",
  city: address.city || "",
  state: address.state || "",
  zip: address.postalCode || address.zip || "",
  address: address.address || address.streetName || "",
  apartment: address.apartment || address.apartmentName || "",
  orderNote: "",
});

const Checkout = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const [cartOwnerId, setCartOwnerId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [tax, setTax] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const activeUserId = sessionStorage.getItem("uid");
    const activeCartOwnerId = getCartOwnerId();

    setUserId(activeUserId);
    setCartOwnerId(activeCartOwnerId);

    if (!activeCartOwnerId) {
      setLoading(false);
      return;
    }

    const loadCheckout = async () => {
      try {
        const [cartResponse, taxResponse] = await Promise.all([
          fetchCartItems(activeCartOwnerId),
          getTax().catch(() => ({ value: 0 })),
        ]);

        setCartData(cartResponse || []);
        setTax(Number(taxResponse?.value || 0));

        if (activeUserId) {
          const addressResponse = await fetchAddresses(activeUserId).catch(() => ({ addresses: [] }));
          const savedAddresses = addressResponse?.addresses || [];
          setAddresses(savedAddresses);

          if (savedAddresses.length > 0) {
            const preferredAddress =
              savedAddresses.find((address) => address.defaultAddress || address.isDefault) ||
              savedAddresses[0];
            setDefaultAddress(preferredAddress);
            setFormData((prev) => ({ ...prev, ...mapAddressToForm(preferredAddress) }));
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, []);

  const subTotal = useMemo(
    () => cartData.reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.cartQty || 0), 0),
    [cartData]
  );

  const shipping = useMemo(() => {
    if (cartData.length === 0) return 0;
    return cartData.reduce((sum, item) => sum + Number(item.shippingFee || item.productDetails?.shippingFee || 0), 0);
  }, [cartData]);

  const vat = useMemo(() => Number(((subTotal * tax) / 100).toFixed(2)), [subTotal, tax]);
  const orderTotal = useMemo(() => Number((subTotal + shipping + vat).toFixed(2)), [shipping, subTotal, vat]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (address) => {
    setDefaultAddress(address);
    setFormData((prev) => ({ ...prev, ...mapAddressToForm(address), orderNote: prev.orderNote }));
  };

  const buildBillingDetails = () => ({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    country: formData.country.trim(),
    city: formData.city.trim(),
    state: formData.state.trim(),
    streetName: formData.address.trim(),
    apartmentName: formData.apartment.trim(),
    orderNote: formData.orderNote.trim(),
    zip: formData.zip.trim(),
    phone: formData.phone.trim(),
    email: formData.email.trim().toLowerCase(),
  });

  const finalizeOrder = (result) => {
    const customerId = result?.customerId;
    if (!sessionStorage.getItem("uid") && customerId) {
      sessionStorage.setItem("uid", customerId);
    }
    window.dispatchEvent(new Event("cartUpdated"));
    router.push({
      pathname: "/order-success",
      query: {
        orderId: result?.orderId || "",
        total: orderTotal.toFixed(2),
      },
    });
  };

  const placeOrder = async () => {
    const form = formRef.current;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!cartOwnerId || cartData.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const billingDetails = buildBillingDetails();
    setSubmitting(true);

    try {
      if (selectedMethod === "Razorpay") {
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
          throw new Error("Razorpay key is missing.");
        }

        const orderResponse = await createRazorpayOrder(orderTotal);
        if (!orderResponse?.success || !orderResponse?.order) {
          throw new Error(orderResponse?.error || "Unable to create Razorpay order.");
        }

        const razorpay = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderResponse.order.amount,
          currency: orderResponse.order.currency,
          name: "Sri Ayini",
          description: "Order Payment",
          order_id: orderResponse.order.id,
          prefill: {
            name: `${billingDetails.firstName} ${billingDetails.lastName}`.trim(),
            email: billingDetails.email,
            contact: billingDetails.phone,
          },
          theme: { color: "#89C74A" },
          handler: async (response) => {
            const savedOrder = await savePaymentDetails(
              {
                orderId: orderResponse.order.id,
                userId,
                cartOwnerId,
                amount: orderTotal,
                status: "Completed",
                transactionId: response.razorpay_payment_id,
                createdAt: new Date().toISOString(),
                paymentMethod: "Razorpay",
                paymentGateway: "Razorpay",
                email: billingDetails.email,
                mobile: billingDetails.phone,
                currency: orderResponse.order.currency,
                razorpaySignature: response.razorpay_signature,
              },
              orderTotal,
              shipping,
              vat,
              billingDetails
            );
            alert("Payment successful. Your order has been placed.");
            finalizeOrder(savedOrder);
          },
        });

        razorpay.open();
        return;
      }

      const savedOrder = await savePaymentDetails(
        {
          orderId: `manual_${Date.now()}`,
          userId,
          cartOwnerId,
          amount: orderTotal,
          status: "Pending",
          transactionId: `manual_${Date.now()}`,
          createdAt: new Date().toISOString(),
          paymentMethod: selectedMethod,
          paymentGateway: selectedMethod === "COD" ? "Cash" : "Bank Transfer",
          email: billingDetails.email,
          mobile: billingDetails.phone,
          currency: "INR",
          razorpaySignature: null,
        },
        orderTotal,
        shipping,
        vat,
        billingDetails
      );

      alert(`Order placed successfully using ${selectedMethod}.`);
      finalizeOrder(savedOrder);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error.message || "Unable to place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageBanner pageName={"Checkout"} />
      <div className="checkout-form-area modern-checkout-page py-130 rpy-100">
        {loading ? (
          <div className="page-state-shell">
            <div className="page-state-card">
              <div className="page-state-icon">
                <i className="fas fa-receipt" />
              </div>
              <h4 className="page-state-title">Preparing checkout</h4>
              <p className="page-state-copy">
                We&apos;re loading your billing details, saved addresses, and current order summary.
              </p>
            </div>
          </div>
        ) : cartData.length === 0 ? (
          <div className="page-state-shell">
            <div className="page-state-card">
              <div className="page-state-icon">
                <i className="fas fa-store" />
              </div>
              <h4 className="page-state-title">Your checkout is empty right now</h4>
              <p className="page-state-copy">
                Add products to your cart first, and we&apos;ll bring you back here to complete the order.
              </p>
              <Link legacyBehavior href="/product-details">
                <a className="theme-btn">
                  Explore products <i className="fas fa-angle-double-right" />
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <div className="container checkout-page-shell">
            <h4 className="form-title mt-50 mb-25">Billing Details</h4>
            <form ref={formRef} className="checkout-billing-card">
              <div className="row">
                <div className="col-lg-12">
                  {addresses.length > 0 && (
                    <div className="col-lg-12 mb-3">
                      <label className="form-label d-block mb-2">Choose Saved Address</label>
                      <div className="address-cards">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`address-card ${defaultAddress?.id === address.id ? "selected" : ""}`}
                            onClick={() => handleAddressSelect(address)}
                          >
                            <div className="address-header">
                              <strong>{address.firstName} {address.lastName}</strong>
                              {(address.defaultAddress || address.isDefault) && <span className="badge">Default</span>}
                            </div>
                            <p>{address.address}, {address.city}, {address.state} - {address.postalCode}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <h6>Personal Information</h6>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
                  </div>
                </div>

                <div className="col-lg-12">
                  <h6>Your Address</h6>
                </div>

                <div className="col-md-6 mb-30">
                  <div className="form-group">
                    <select name="country" value={formData.country} onChange={handleChange} className="form-control" required>
                      <option value="">Select Country</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} placeholder="City" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} placeholder="State" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" name="zip" className="form-control" value={formData.zip} onChange={handleChange} placeholder="Zip" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} placeholder="House, street name" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" name="apartment" className="form-control" value={formData.apartment} onChange={handleChange} placeholder="Apartment, suite, unit etc. (optional)" />
                  </div>
                </div>
                <div className="col-lg-12">
                  <h6>Order Notes (optional)</h6>
                </div>
                <div className="col-md-12">
                  <div className="form-group mb-0">
                    <textarea name="orderNote" placeholder="Order Notes" value={formData.orderNote} onChange={handleChange} className="form-control" rows={4} />
                  </div>
                </div>
              </div>
            </form>

            <div className="payment-cart-total pt-25">
              <div className="row justify-content-between">
                <div className="col-lg-6">
                  <div className="payment-method checkout-panel mt-45 wow fadeInUp delay-0-2s">
                    <h4 className="form-title my-25">Payment Method</h4>
                    <Accordion defaultActiveKey="collapseTwo" as="ul" id="paymentMethod" className="mb-30">
                      <li className="custom-control custom-radio">
                        <input type="radio" className="custom-control-input" id="methodone" name="defaultExampleRadios" checked={selectedMethod === "BankTransfer"} onChange={() => setSelectedMethod("BankTransfer")} />
                        <Accordion.Toggle as="label" className="custom-control-label" htmlFor="methodone" eventKey="collapseOne">
                          Direct Bank Transfer <i className="fas fa-money-check" />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="collapseOne">
                          <p>Make your payment directly into our bank account. Use your order ID as the payment reference.</p>
                        </Accordion.Collapse>
                      </li>
                      <li className="custom-control custom-radio">
                        <input type="radio" className="custom-control-input" id="methodtwo" name="defaultExampleRadios" checked={selectedMethod === "COD"} onChange={() => setSelectedMethod("COD")} />
                        <Accordion.Toggle as="label" className="custom-control-label collapsed" htmlFor="methodtwo" eventKey="collapseTwo">
                          Cash On Delivery <i className="fas fa-truck" />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="collapseTwo">
                          <p>Pay with cash when your order is delivered.</p>
                        </Accordion.Collapse>
                      </li>
                      <li className="custom-control custom-radio">
                        <input type="radio" className="custom-control-input" id="methodthree" name="defaultExampleRadios" checked={selectedMethod === "Razorpay"} onChange={() => setSelectedMethod("Razorpay")} />
                        <Accordion.Toggle as="label" className="custom-control-label collapsed" htmlFor="methodthree" eventKey="collapseThree">
                          Razorpay <i className="fab fa-cc-paypal" />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="collapseThree">
                          <p>Pay securely via Razorpay using UPI, card, or net banking.</p>
                        </Accordion.Collapse>
                      </li>
                    </Accordion>
                    <p>
                      Your personal data will be used to process your order and support your experience throughout this website.
                    </p>
                    <button type="button" className="theme-btn checkout-submit-btn mt-15" onClick={placeOrder} disabled={submitting}>
                      {submitting ? "Processing..." : "Place order"}
                    </button>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="shoping-cart-total checkout-summary-card mt-45 wow fadeInUp delay-0-4s">
                    <h4 className="form-title m-25">Cart Totals</h4>
                    <table>
                      <tbody>
                        {cartData.map((item) => (
                          <tr key={item.id}>
                            <td>
                              {item.name}
                              {item.sizeLabel ? ` (${item.sizeLabel})` : ""} <strong>× {item.cartQty}</strong>
                            </td>
                            <td>₹{(Number(item.cartQty || 0) * Number(item.unitPrice || 0)).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td>Subtotal</td>
                          <td>₹{subTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Shipping Fee</td>
                          <td>₹{shipping.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Vat</td>
                          <td>₹{vat.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td><strong>Order Total</strong></td>
                          <td><strong>₹{orderTotal.toFixed(2)}</strong></td>
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
