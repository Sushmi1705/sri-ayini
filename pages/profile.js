import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // your firebase config
import PageBanner from '../src/components/PageBanner';
import Layout from "../src/layout/Layout";
import { addAddress, fetchAddresses, deleteAddress, updateAddress } from "../services/loginServices";
import { signOut } from 'firebase/auth';
import { getWishlist, removeFromWishlist } from '../services/wishlistService';
import { getOrdersByUserId } from '../services/itemServices';
import Link from "next/link";


function AccountPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    country: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    defaultAddress: false,
    uId: null,
  });

  const handleEditClick = (address) => {
    setAddressForm({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      address: address.address || '',
      apartment: address.apartment || '',
      city: address.city || '',
      country: address.country || '',
      postalCode: address.postalCode || '',
      phone: address.phone || '',
      email: address.email || '',
      state: address.state || '',
      defaultAddress: address.defaultAddress || false,
      uId: user.uid,
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleRowClick = (order) => {
    console.log('order-----', order);
    setSelectedOrder(order);
  };

  const closePopup = () => {
    setSelectedOrder(null);
  };

  const handleDeleteClick = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      // Call your delete API here
      await deleteAddress(user.uid, addressId);
      // Refresh addresses
      fetchAllAddresses(userId);
    } catch (err) {
      console.error('Failed to delete address:', err);
      alert('Failed to delete address');
    }
  };


  useEffect(() => {
    const userId = localStorage.getItem('uid');
    setUserId(userId);
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is logged in
        setUser(user);
        setAddressForm(prev => ({ ...prev, uId: user.uid }));
        fetchAllAddresses(user.uid);
        fetchWishlist(user.uid);
      } else {
        // User is logged out
        setUser(null);
        // Optionally redirect to login page
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      getOrdersByUserId(userId)
        .then((res) => {
          console.log("Orders fetched:", res);
          setOrders(res.order);
        })
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [userId]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // ✅ removes all items from localStorage
      alert('Logged out!');
      window.location.href = '/';
      // Optionally, redirect to login page or reset state
      // e.g., window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout');
    }
  };

  const fetchWishlist = async (guestId) => {
    try {
      const data = await getWishlist(guestId);
      setWishlist(data || []); // fallback to empty array if no data
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  const fetchAllAddresses = async (userId) => {
    setLoadingAddresses(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');

      // const token = await currentUser.getIdToken();

      const data = await fetchAddresses(userId);  // Use service function
      console.log('address--------', data);
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddAddressSubmit = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');

      if (editingAddressId) {
        // Update existing address
        await updateAddress(user.uid, editingAddressId, addressForm);
      } else {
        // Add new address
        await addAddress(addressForm);
      }
      // console.log('144-----');
      setShowAddressForm(false);
      setEditingAddressId(null);
      // console.log('147-----');
      setAddressForm({
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        apartment: '',
        city: '',
        country: '',
        state: '',
        postalCode: '',
        phone: '',
        email: '',
        defaultAddress: false,
        uId: user.uid,
      });
      // console.log('161-----');
      fetchAllAddresses(userId); // Refresh list
      // console.log('163-----');
    } catch (err) {
      console.error(err);
      alert('Failed to save address');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(user.uid, productId);
      alert('Item removed from wishlist!');
      fetchWishlist(user.uid); // Refresh list
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  return (
    <Layout>
      <PageBanner pageName={"Profile Page"} />
      <div className="account-page">
        {/* Sidebar */}
        <nav className="sidebar">
          <ul >
            <li
              className="active"
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'dashboard' ? 'rgb(116 216 120)' : '',
                fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
              }}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </li>
            <li
              className="active"
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'addresses' ? 'rgb(116 216 120)' : '',
                fontWeight: activeTab === 'addresses' ? 'bold' : 'normal',
              }}
              onClick={() => setActiveTab('addresses')}
            >
              Addresses ({addresses.length})
            </li>
            <li
              className="active"
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'wishlist' ? 'rgb(116 216 120)' : '',
                fontWeight: activeTab === 'wishlist' ? 'bold' : 'normal',
              }}
              onClick={() => setActiveTab('wishlist')}
            >
              Wishlist ({wishlist.length})
            </li>
            <li
              className="logout"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </nav>

        {/* Content */}
        <section className="content">
          {activeTab === 'dashboard' && (
            <>
              {addresses && addresses.length > 0 ? (
                (() => {
                  const defaultAddress = addresses.find(addr => addr.defaultAddress) || addresses[0];
                  return (
                    <div className="account-details-container">
                      <h5>Account details :</h5>
                      <table className="account-details-table">
                        <tbody>
                          <tr><th>Name:</th><td>{defaultAddress.firstName}</td></tr>
                          <tr><th>Phone:</th><td>{defaultAddress.phone}</td></tr>
                          <tr><th>Address:</th><td>{defaultAddress.address}</td></tr>
                          <tr><th>Country:</th><td>{defaultAddress.country}</td></tr>
                          <tr><th>Zip:</th><td>{defaultAddress.postalCode}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              ) : (
                <p>No addresses available.</p>
              )}

              {/* User Orders Section */}
              <div className="orders-container">
                <h5>My Orders :</h5>
                {orders.length > 0 ? (
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        {/* <th>Date</th> */}
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} onClick={() => handleRowClick(order)} style={{ cursor: "pointer" }}>
                          <td>{order.id}</td>
                          {/* <td>{new Date(order.createdAt).toLocaleDateString()}</td> */}
                          <td>{order.status}</td>
                          <td>{order.total} {order.currency || "₹"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No orders found.</p>
                )}

                {/* Popup */}
                {selectedOrder && (
                  <div className="order-popup">
                    <div className="order-popup-content">
                      <button className="close" onClick={closePopup}>
                        <span aria-hidden="true">×</span>
                      </button>

                      <h3>Order Details</h3>

                      <div className="container cartList">
                        <div className="cart-item-wrap mb-35">
                          {selectedOrder.cart?.map((item, i) => {
                            // Find matching cart entry for this item
                            const cartItem = selectedOrder.cart?.find(
                              (c) => c.productId === item.productId
                            );

                            const quantity = cartItem?.cartQty || 0;
                            const price = item.unitPrice || 0;
                            const total = quantity * price;

                            return (
                              <div className="cart-single-item" key={i}>
                                <div className="cart-img">
                                  <img
                                    src={item.image || "/placeholder.png"}
                                    alt={item.name}
                                    width="60"
                                    height="60"
                                  />
                                </div>

                                <h5 className="product-name">{item.name}</h5>

                                <span className="product-price">
                                  {price.toFixed(2)} {selectedOrder.currency || "₹"}
                                </span>

                                <div className="quantity-input">
                                  <input
                                    className="quantity"
                                    type="text"
                                    value={quantity}
                                    readOnly
                                  />
                                </div>

                                <span className="product-total-price">
                                  {total.toFixed(2)} {selectedOrder.currency || "₹"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Totals */}
                        <div className="payment-cart-total pt-25">
                          <div className="row justify-content-end">
                            <div className="col-lg-6">
                              <div className="shoping-cart-total mt-45">
                                <h4 className="form-title m-25">Order Totals</h4>
                                <table>
                                  <tbody>
                                    <tr>
                                      <td>Cart Subtotal</td>
                                      <td className="sub-total-price">
                                        {selectedOrder.cartSubtotal || "0.00"}{" "}
                                        {selectedOrder.currency || "₹"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Shipping Fee</td>
                                      <td className="shipping-price">
                                        {selectedOrder.shipping?.toFixed(2) || "0.00"}{" "}
                                        {selectedOrder.currency || "₹"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Tax</td>
                                      <td>
                                        {selectedOrder.vat || "0.00"}{" "}
                                        {selectedOrder.currency || "₹"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <strong>Order Total</strong>
                                      </td>
                                      <td>
                                        <strong className="total-price">
                                          {selectedOrder.total || "0.00"}{" "}
                                          {selectedOrder.currency || "₹"}
                                        </strong>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                {/* optional repeat order button */}
                                {/* <Link legacyBehavior href="/shop-grid">
                                  <a className="theme-btn style-two mt-25 w-100">
                                    Reorder <i className="fas fa-angle-double-right" />
                                  </a>
                                </Link> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* end container */}
                    </div>
                  </div>
                )}


              </div>
            </>
          )}


          {activeTab === 'addresses' && (
            <>
              <h2>Addresses</h2>
              {loadingAddresses ? (
                <p>Loading addresses...</p>
              ) : addresses.length === 0 && !showAddressForm ? (
                <button onClick={() => setShowAddressForm(true)}>Add Address</button>
              ) : null}

              {addresses.length > 0 && !showAddressForm && (
                <>
                  <ul>
                    {addresses.map((addr) => (
                      <li key={addr.id} className="address-item">
                        <div className="address-text">
                          <div>{addr.firstName} {addr.lastName}</div>
                          <div>{addr.company}</div>
                          <div>{addr.address}</div>
                          <div>{addr.apartment}</div>
                          <div>{addr.city}, {addr.country} - {addr.postalCode}</div>
                          <div>Phone: {addr.phone}</div>
                        </div>
                        <span className="address-icons">
                          <i
                            className="fas fa-edit edit-icon"
                            title="Edit"
                            onClick={() => handleEditClick(addr)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => { if (e.key === 'Enter') handleEditClick(addr); }}
                          />
                          <i
                            className="fas fa-trash delete-icon"
                            title="Delete"
                            onClick={() => handleDeleteClick(addr.id)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => { if (e.key === 'Enter') handleDeleteClick(addr.id); }}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setShowAddressForm(true)}>Add New Address</button>
                </>
              )}

              {showAddressForm && (
                <div>
                  <h3>{editingAddressId ? 'Edit Address' : 'Add a New Address'}</h3>
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={addressForm.firstName}
                    onChange={handleInputChange}

                  />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={addressForm.lastName}
                    onChange={handleInputChange}

                  />
                  <input
                    name="company"
                    placeholder="Company"
                    value={addressForm.company}
                    onChange={handleInputChange}

                  />
                  <input
                    name="address"
                    placeholder="Address"
                    value={addressForm.address}
                    onChange={handleInputChange}

                  />
                  <input
                    name="apartment"
                    placeholder="Apartment, suite, etc."
                    value={addressForm.apartment}
                    onChange={handleInputChange}

                  />
                  <input
                    name="city"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={handleInputChange}

                  />
                  <input
                    name="state"
                    placeholder="State"
                    value={addressForm.state}
                    onChange={handleInputChange}

                  />
                  <input
                    name="country"
                    placeholder="Country/Region"
                    value={addressForm.country}
                    onChange={handleInputChange}

                  />
                  <input
                    name="postalCode"
                    placeholder="Postal/Zip Code"
                    value={addressForm.postalCode}
                    onChange={handleInputChange}
                  />
                  <input
                    name="phone"
                    placeholder="Phone"
                    value={addressForm.phone}
                    onChange={handleInputChange}
                  />
                  <input
                    name="email"
                    placeholder="Email"
                    value={addressForm.email}
                    onChange={handleInputChange}

                  />
                  <label>
                    <input
                      type="checkbox"
                      name="defaultAddress"
                      checked={addressForm.defaultAddress}
                      onChange={handleInputChange}
                    />{' '}
                    Set as default address
                  </label>
                  <br />
                  <button onClick={handleAddAddressSubmit} className="mr-5">
                    {editingAddressId ? 'Update Address' : 'Add Address'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddressForm(false);
                      setEditingAddressId(null);
                      setAddressForm({
                        firstName: '',
                        lastName: '',
                        company: '',
                        address: '',
                        apartment: '',
                        city: '',
                        country: '',
                        postalCode: '',
                        phone: '',
                        defaultAddress: false,
                        uId: user.uid,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'wishlist' && (
            <div className="wishlist-section">
              <h2 className="wishlist-title">Wishlist</h2>

              {wishlist.length > 0 ? (
                <div className="wishlist-grid">
                  {wishlist.map((item) => (
                    <div key={item.id} className="wishlist-card">
                      <div className="wishlist-image-container">
                        <img
                          src={item.image || "assets/images/products/masala.jpg"}
                          alt={item.name}
                          className="wishlist-img"
                        />
                        {/* Remove from wishlist icon */}
                        <button
                          className="btn-remove-wishlist"
                          title="Remove from Wishlist"
                          aria-label="Remove from Wishlist"
                          onClick={() => handleRemove(item.id)}
                        >
                          <i className="fas fa-times" />
                        </button>
                      </div>
                      <div className="wishlist-info">
                        <h4 className="wishlist-name">{item.name}</h4>
                        <p className="wishlist-category">{item.category || "Category"}</p>
                        <p className="wishlist-price">₹{item.price}</p>
                        <button
                          className="btn btn-primary btn-add-to-cart"
                          onClick={() => addToCart(item.id)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-wishlist-message">
                  <img src="/assets/images/empty-wishlist.png" alt="Empty Wishlist" />
                  <p>Your wishlist is empty.</p>
                </div>
              )}
            </div>
          )}

        </section>
      </div>
    </Layout>

  );
}

export default AccountPage;