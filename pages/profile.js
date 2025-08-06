import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // your firebase config
import PageBanner from '../src/components/PageBanner';
import Layout from "../src/layout/Layout";
import { addAddress, fetchAddresses, deleteAddress, updateAddress } from "../services/loginServices";
import { signOut } from 'firebase/auth';
import { getWishlist, removeFromWishlist } from '../services/wishlistService';

function AccountPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const [addressForm, setAddressForm] = useState({
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
      defaultAddress: address.defaultAddress || false,
      uId: user.uid,
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleDeleteClick = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      // Call your delete API here
      await deleteAddress(user.uid, addressId);
      // Refresh addresses
      fetchAllAddresses();
    } catch (err) {
      console.error('Failed to delete address:', err);
      alert('Failed to delete address');
    }
  };


  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out!');
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

      fetchAllAddresses(); // Refresh list
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

  console.log('179-------', wishlist);
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
              {/* Determine default address */}
              {addresses && addresses.length > 0 ? (
                (() => {
                  const defaultAddress = addresses.find(addr => addr.defaultAddress) || addresses[0];
                  return (
                    <div className="account-details-container">
                      <h5>Account details :</h5>
                      <table className="account-details-table">
                        <tbody>
                          <tr>
                            <th>Name:</th>
                            <td>{defaultAddress.firstName}</td>
                          </tr>
                          <tr>
                            <th>Phone:</th>
                            <td>{defaultAddress.phone}</td>
                          </tr>
                          <tr>
                            <th>Address:</th>
                            <td>{defaultAddress.address}</td>
                          </tr>
                          <tr>
                            <th>Country:</th>
                            <td>{defaultAddress.country}</td>
                          </tr>
                          <tr>
                            <th>Zip:</th>
                            <td>{defaultAddress.postalCode}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              ) : (
                <p>No addresses available.</p>
              )}
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