import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import PageBanner from '../src/components/PageBanner';
import Layout from "../src/layout/Layout";
import { addAddress, fetchAddresses, deleteAddress, updateAddress } from "../services/loginServices";
import { signOut } from 'firebase/auth';
import { getWishlist, removeFromWishlist } from '../services/wishlistService';
import { getOrdersByUserId } from '../services/itemServices';
import { addToCart } from '../services/cartServices';
import Link from "next/link";

const ORDER_STATUS_STYLES = {
  Completed:  { bg: '#d4edda', color: '#155724', icon: 'fas fa-check-circle' },
  Delivered:  { bg: '#d4edda', color: '#155724', icon: 'fas fa-check-circle' },
  Processing: { bg: '#fff3cd', color: '#856404', icon: 'fas fa-spinner' },
  Pending:    { bg: '#fff3cd', color: '#856404', icon: 'fas fa-clock' },
  Shipped:    { bg: '#cce5ff', color: '#004085', icon: 'fas fa-shipping-fast' },
  Cancelled:  { bg: '#f8d7da', color: '#721c24', icon: 'fas fa-times-circle' },
};

const StatusBadge = ({ status }) => {
  const s = ORDER_STATUS_STYLES[status] || { bg: '#e9ecef', color: '#495057', icon: 'fas fa-info-circle' };
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <i className={s.icon} style={{ fontSize: '11px' }} />
      {status || 'Unknown'}
    </span>
  );
};

const UserAvatar = ({ name, email }) => {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (email ? email[0].toUpperCase() : 'U');
  return (
    <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#89C74A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 700, color: '#fff', margin: '0 auto 12px', boxShadow: '0 4px 12px rgba(137,199,74,0.35)' }}>
      {initials}
    </div>
  );
};

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
    firstName: '', lastName: '', company: '', address: '',
    apartment: '', city: '', country: '', state: '',
    postalCode: '', phone: '', email: '', defaultAddress: false, uId: null,
  });

  const resetAddressForm = (uid) => setAddressForm({
    firstName: '', lastName: '', company: '', address: '',
    apartment: '', city: '', country: '', state: '',
    postalCode: '', phone: '', email: '', defaultAddress: false, uId: uid || null,
  });

  const handleEditClick = (address) => {
    setAddressForm({
      firstName: address.firstName || '', lastName: address.lastName || '',
      company: address.company || '', address: address.address || '',
      apartment: address.apartment || '', city: address.city || '',
      country: address.country || '', postalCode: address.postalCode || '',
      phone: address.phone || '', email: address.email || '',
      state: address.state || '', defaultAddress: address.defaultAddress || false,
      uId: user.uid,
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleDeleteClick = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await deleteAddress(user.uid, addressId);
      fetchAllAddresses(userId);
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  useEffect(() => {
    const uid = sessionStorage.getItem('uid');
    setUserId(uid);
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
        setAddressForm(prev => ({ ...prev, uId: u.uid }));
        fetchAllAddresses(u.uid);
        fetchWishlist(u.uid);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      getOrdersByUserId(userId)
        .then(res => setOrders(res.order || []))
        .catch(err => console.error('Error fetching orders:', err));
    }
  }, [userId]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchWishlist = async (guestId) => {
    try {
      const data = await getWishlist(guestId);
      setWishlist(data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    }
  };

  const fetchAllAddresses = async (uid) => {
    setLoadingAddresses(true);
    try {
      const data = await fetchAddresses(uid);
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddAddressSubmit = async () => {
    try {
      if (!auth.currentUser) throw new Error('Not logged in');
      if (editingAddressId) {
        await updateAddress(user.uid, editingAddressId, addressForm);
      } else {
        await addAddress(addressForm);
      }
      setShowAddressForm(false);
      setEditingAddressId(null);
      resetAddressForm(user.uid);
      fetchAllAddresses(userId);
    } catch (err) {
      console.error(err);
      alert('Failed to save address');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(user.uid, productId);
      fetchWishlist(user.uid);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleReorder = async (order) => {
    try {
      await Promise.all(
        (order.cart || []).map((item) =>
          addToCart(userId, {
            productId: item.productId,
            name: item.name,
            image: item.image,
            category: item.category,
            sizeId: item.sizeId || "default_size",
            sizeLabel: item.sizeLabel || "Standard",
            unitPrice: Number(item.unitPrice || 0),
            cartQty: Number(item.cartQty || item.quantity || 1),
          })
        )
      );
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Items added back to cart.");
    } catch (error) {
      console.error("Failed to reorder:", error);
      alert("Unable to reorder these items right now.");
    }
  };

  const handleAddToCartFromWishlist = async (product, e) => {
    if (e) e.preventDefault();
    const sizes = Array.isArray(product?.sizes) ? product.sizes : [];
    const first = sizes.length ? sizes[0] : null;
    if (!first) return alert('Select a size on the product page.');
    try {
      await addToCart(userId, {
        productId: product.id, name: product.name, image: product.image,
        category: product.category, sizeId: first.id, sizeLabel: first.sizeLabel,
        unitPrice: Number(first.price), cartQty: 1,
      });
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    }
  };

  const displayName = user?.displayName || (addresses[0] ? `${addresses[0].firstName} ${addresses[0].lastName}` : 'User');

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
    { key: 'orders',    label: 'Orders',    icon: 'fas fa-box-open',  badge: orders.length },
    { key: 'addresses', label: 'Addresses', icon: 'fas fa-map-marker-alt', badge: addresses.length },
    { key: 'wishlist',  label: 'Wishlist',  icon: 'fas fa-heart',     badge: wishlist.length },
  ];

  return (
    <Layout>
      <PageBanner pageName="My Account" />

      <style>{`
        .profile-sidebar { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.07); overflow:hidden; }
        .profile-sidebar-header { background: linear-gradient(135deg,#89C74A,#5a9c22); padding:28px 20px 24px; text-align:center; }
        .profile-sidebar-header h5 { color:#fff; margin:0 0 4px; font-size:17px; font-weight:700; }
        .profile-sidebar-header p { color:rgba(255,255,255,0.85); margin:0; font-size:13px; }
        .profile-nav-list { padding:12px 0; margin:0; list-style:none; }
        .profile-nav-item { display:flex; align-items:center; gap:12px; padding:13px 24px; cursor:pointer; font-size:14px; font-weight:500; color:#555; border-left:3px solid transparent; transition:all 0.2s; }
        .profile-nav-item:hover { background:#f8fdf2; color:#89C74A; }
        .profile-nav-item.active { background:#f1faeb; color:#5a9c22; border-left-color:#89C74A; font-weight:700; }
        .profile-nav-item i { width:18px; text-align:center; font-size:15px; }
        .nav-badge { background:#89C74A; color:#fff; font-size:10px; font-weight:700; border-radius:20px; padding:2px 7px; margin-left:auto; }
        .logout-item { display:flex; align-items:center; gap:12px; padding:13px 24px; cursor:pointer; font-size:14px; font-weight:500; color:#dc3545; border-top:1px solid #f0f0f0; margin-top:8px; transition:all 0.2s; }
        .logout-item:hover { background:#fff5f5; }

        .stat-card { background:#fff; border-radius:14px; padding:24px 20px; text-align:center; border:1px solid #eef5e4; box-shadow:0 2px 12px rgba(137,199,74,0.08); transition:all 0.25s; }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 6px 20px rgba(137,199,74,0.18); }
        .stat-card .stat-icon { width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,#f1faeb,#d4f0a0); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
        .stat-card .stat-icon i { font-size:20px; color:#5a9c22; }
        .stat-card h3 { font-size:28px; font-weight:800; color:#2d2d2d; margin:0 0 4px; }
        .stat-card p { font-size:13px; color:#888; margin:0; }

        .profile-content-box { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.07); padding:32px; min-height:500px; }
        .section-title { font-size:20px; font-weight:700; color:#2d2d2d; margin-bottom:24px; padding-bottom:12px; border-bottom:2px solid #f0f0f0; }
        .section-title span { color:#89C74A; }

        .order-row { background:#fff; border:1px solid #eee; border-radius:10px; padding:16px 20px; margin-bottom:12px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; transition:box-shadow 0.2s; }
        .order-row:hover { box-shadow:0 4px 16px rgba(0,0,0,0.08); }
        .order-id { font-size:13px; font-weight:700; color:#89C74A; min-width:120px; }
        .order-meta { font-size:13px; color:#888; flex:1; }
        .order-total { font-size:15px; font-weight:700; color:#2d2d2d; }

        .address-card { border:1px solid #eee; border-radius:12px; padding:20px; height:100%; position:relative; transition:all 0.2s; }
        .address-card:hover { border-color:#89C74A; box-shadow:0 4px 16px rgba(137,199,74,0.15); }
        .address-card.default-addr { border-color:#89C74A; background:#f8fdf2; }
        .address-card h6 { font-weight:700; color:#2d2d2d; margin-bottom:4px; }
        .address-card p { font-size:13px; color:#666; margin-bottom:3px; }
        .default-badge { position:absolute; top:12px; right:12px; background:#89C74A; color:#fff; font-size:10px; font-weight:700; padding:3px 9px; border-radius:20px; }
        .addr-actions { display:flex; gap:8px; margin-top:14px; padding-top:12px; border-top:1px solid #f0f0f0; }
        .btn-edit { background:#f1faeb; color:#5a9c22; border:none; border-radius:8px; padding:6px 14px; font-size:12px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:5px; }
        .btn-delete { background:#fff5f5; color:#dc3545; border:none; border-radius:8px; padding:6px 14px; font-size:12px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:5px; }

        .wishlist-item { background:#fff; border:1px solid #eee; border-radius:12px; overflow:hidden; transition:all 0.2s; }
        .wishlist-item:hover { box-shadow:0 4px 16px rgba(0,0,0,0.1); transform:translateY(-2px); }
        .wishlist-img { width:100%; height:160px; object-fit:cover; }
        .wishlist-body { padding:14px; }
        .wishlist-name { font-size:14px; font-weight:600; color:#2d2d2d; margin-bottom:6px; }
        .wishlist-price { font-size:16px; font-weight:800; color:#89C74A; margin-bottom:10px; }
        .wishlist-actions { display:flex; gap:8px; }
        .btn-cart { flex:1; background:#89C74A; color:#fff; border:none; border-radius:8px; padding:8px; font-size:12px; font-weight:600; cursor:pointer; }
        .btn-remove { background:#fff0f0; color:#dc3545; border:none; border-radius:8px; padding:8px 12px; font-size:12px; cursor:pointer; }

        .form-label-sm { font-size:13px; font-weight:600; color:#555; margin-bottom:5px; display:block; }
        .form-input { border:1px solid #e0e0e0; border-radius:8px; padding:10px 14px; width:100%; font-size:14px; outline:none; transition:border 0.2s; }
        .form-input:focus { border-color:#89C74A; box-shadow:0 0 0 3px rgba(137,199,74,0.12); }
        .btn-primary-green { background:#89C74A; color:#fff; border:none; border-radius:8px; padding:11px 28px; font-weight:600; cursor:pointer; font-size:14px; }
        .btn-secondary-outline { background:#fff; color:#666; border:1px solid #ddd; border-radius:8px; padding:11px 28px; font-weight:600; cursor:pointer; font-size:14px; }

        .modal-overlay { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; }
        .modal-box { background:#fff; border-radius:16px; width:90%; max-width:680px; max-height:90vh; overflow-y:auto; padding:32px; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.2); }
        .modal-close { position:absolute; top:16px; right:20px; background:none; border:none; font-size:22px; color:#999; cursor:pointer; }
        .modal-close:hover { color:#333; }
        .receipt-header { text-align:center; margin-bottom:24px; padding-bottom:20px; border-bottom:2px dashed #eee; }
        .receipt-header img { max-width:120px; margin-bottom:12px; }
        .receipt-table { width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px; }
        .receipt-table th { background:#f8fdf2; color:#5a9c22; padding:10px 14px; text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; }
        .receipt-table td { padding:10px 14px; border-bottom:1px solid #f5f5f5; color:#444; }
        .receipt-totals { margin-left:auto; width:260px; font-size:14px; }
        .receipt-totals tr td { padding:6px 8px; }
        .receipt-totals .grand-total td { font-size:16px; font-weight:800; color:#89C74A; border-top:2px solid #eee; padding-top:10px; }

        .empty-state { text-align:center; padding:60px 20px; }
        .empty-state i { font-size:52px; color:#ddd; margin-bottom:16px; display:block; }
        .empty-state h5 { color:#555; margin-bottom:8px; }
        .empty-state p { color:#aaa; font-size:14px; margin-bottom:20px; }

        .default-addr-info { background:#f8fdf2; border:1px solid #d4edb0; border-radius:12px; padding:20px 24px; }
        .default-addr-info h6 { font-weight:700; color:#2d2d2d; margin-bottom:8px; display:flex; align-items:center; gap:8px; }
        .default-addr-info p { margin-bottom:4px; color:#555; font-size:14px; }

        @media (max-width:768px) {
          .profile-content-box { padding:20px 16px; }
          .order-row { flex-direction:column; align-items:flex-start; gap:8px; }
          .receipt-totals { width:100%; }
        }
      `}</style>

      <div className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4 mb-4">
            <div className="profile-sidebar">
              <div className="profile-sidebar-header">
                <UserAvatar name={displayName} email={user?.email} />
                <h5>{displayName}</h5>
                <p>{user?.email}</p>
              </div>
              <ul className="profile-nav-list">
                {navItems.map(item => (
                  <li key={item.key} className={`profile-nav-item${activeTab === item.key ? ' active' : ''}`} onClick={() => setActiveTab(item.key)}>
                    <i className={item.icon} />
                    {item.label}
                    {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                  </li>
                ))}
              </ul>
              <div className="logout-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt" />
                Logout
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-9 col-md-8">
            <div className="profile-content-box">

              {/* ── Dashboard ── */}
              {activeTab === 'dashboard' && (
                <>
                  <h4 className="section-title">Welcome back, <span>{displayName.split(' ')[0]}</span>!</h4>
                  <div className="row mb-4">
                    {[
                      { icon: 'fas fa-box-open', value: orders.length, label: 'Total Orders', tab: 'orders' },
                      { icon: 'fas fa-heart', value: wishlist.length, label: 'Wishlist Items', tab: 'wishlist' },
                      { icon: 'fas fa-map-marker-alt', value: addresses.length, label: 'Saved Addresses', tab: 'addresses' },
                    ].map(s => (
                      <div className="col-md-4 mb-3" key={s.label} style={{ cursor: 'pointer' }} onClick={() => setActiveTab(s.tab)}>
                        <div className="stat-card">
                          <div className="stat-icon"><i className={s.icon} /></div>
                          <h3>{s.value}</h3>
                          <p>{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h6 style={{ fontWeight: 700, marginBottom: 14, color: '#555' }}>
                    <i className="fas fa-map-marker-alt mr-2" style={{ color: '#89C74A' }} />Default Address
                  </h6>
                  {addresses.length > 0 ? (() => {
                    const a = addresses.find(x => x.defaultAddress) || addresses[0];
                    return (
                      <div className="default-addr-info">
                        <h6><i className="fas fa-user" style={{ color: '#89C74A' }} />{a.firstName} {a.lastName}</h6>
                        <p>{a.address}{a.apartment ? `, ${a.apartment}` : ''}</p>
                        <p>{a.city}, {a.state} {a.postalCode}</p>
                        <p>{a.country}</p>
                        {a.phone && <p><i className="fas fa-phone mr-2" style={{ color: '#89C74A' }} />{a.phone}</p>}
                      </div>
                    );
                  })() : (
                    <div className="alert" style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 10, fontSize: 14 }}>
                      No addresses saved. <span style={{ color: '#89C74A', cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveTab('addresses')}>Add one →</span>
                    </div>
                  )}
                </>
              )}

              {/* ── Orders ── */}
              {activeTab === 'orders' && (
                <>
                  <h4 className="section-title">My <span>Orders</span></h4>
                  {orders.length > 0 ? orders.map((order, i) => (
                    <div className="order-row" key={order.id || i}>
                      <div>
                        <div className="order-id">#{order.id}</div>
                        <div className="order-meta">{order.createdAt ? new Date(order.createdAt._seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="order-total">₹{order.total}</div>
                      <button onClick={() => setSelectedOrder(order)} style={{ background: '#f1faeb', color: '#5a9c22', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="fas fa-receipt" />View
                      </button>
                      <button onClick={() => handleReorder(order)} style={{ background: '#89C74A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="fas fa-redo" />Reorder
                      </button>
                    </div>
                  )) : (
                    <div className="empty-state">
                      <i className="fas fa-box-open" />
                      <h5>No orders yet</h5>
                      <p>Looks like you haven't placed any orders.</p>
                      <Link legacyBehavior href="/product-details"><a className="theme-btn style-two">Start Shopping</a></Link>
                    </div>
                  )}

                  {/* Order receipt popup */}
                  {selectedOrder && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}>
                      <div className="modal-box">
                        <button className="modal-close" onClick={() => setSelectedOrder(null)}>&times;</button>
                        <div className="receipt-header">
                          <img src="/assets/images/logos/logo.png" alt="Sri Ayini" onError={e => e.target.style.display = 'none'} />
                          <h5 style={{ fontWeight: 800, margin: '8px 0 6px' }}>Order Receipt</h5>
                          <p style={{ color: '#888', margin: '0 0 10px', fontSize: 13 }}>#{selectedOrder.id}</p>
                          <StatusBadge status={selectedOrder.status} />
                        </div>

                        <table className="receipt-table">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th style={{ textAlign: 'center' }}>Qty</th>
                              <th style={{ textAlign: 'right' }}>Price</th>
                              <th style={{ textAlign: 'right' }}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(selectedOrder.cart || []).map((item, idx) => {
                              const qty = Number(item.cartQty || item.quantity || 1);
                              const price = Number(item.unitPrice || 0);
                              return (
                                <tr key={idx}>
                                  <td>{item.name}{item.sizeLabel ? ` (${item.sizeLabel})` : ''}</td>
                                  <td style={{ textAlign: 'center' }}>{qty}</td>
                                  <td style={{ textAlign: 'right' }}>₹{price.toFixed(2)}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{(qty * price).toFixed(2)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        <table className="receipt-totals">
                          <tbody>
                            <tr>
                              <td style={{ color: '#888' }}>Subtotal</td>
                              <td style={{ textAlign: 'right' }}>₹{selectedOrder.cartSubtotal || '0.00'}</td>
                            </tr>
                            <tr>
                              <td style={{ color: '#888' }}>Shipping</td>
                              <td style={{ textAlign: 'right' }}>₹{(selectedOrder.shipping || 0).toFixed(2)}</td>
                            </tr>
                            <tr className="grand-total">
                              <td style={{ fontWeight: 800 }}>Total</td>
                              <td style={{ textAlign: 'right', fontWeight: 800, color: '#89C74A' }}>₹{selectedOrder.total || '0.00'}</td>
                            </tr>
                          </tbody>
                        </table>

                        <div style={{ textAlign: 'center', marginTop: 24 }}>
                          <button className="theme-btn" onClick={() => window.print()}>
                            <i className="fas fa-print mr-2" />Print Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── Addresses ── */}
              {activeTab === 'addresses' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h4 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>My <span>Addresses</span></h4>
                    {!showAddressForm && (
                      <button onClick={() => setShowAddressForm(true)} style={{ background: '#89C74A', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="fas fa-plus" />Add Address
                      </button>
                    )}
                  </div>

                  {loadingAddresses && (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                      <div className="spinner-border text-success" role="status" />
                    </div>
                  )}

                  {!loadingAddresses && addresses.length === 0 && !showAddressForm && (
                    <div className="empty-state">
                      <i className="fas fa-map-marked-alt" />
                      <h5>No addresses yet</h5>
                      <p>Add a delivery address to speed up checkout.</p>
                      <button onClick={() => setShowAddressForm(true)} className="theme-btn">Add Address</button>
                    </div>
                  )}

                  {!loadingAddresses && addresses.length > 0 && !showAddressForm && (
                    <div className="row">
                      {addresses.map(addr => (
                        <div className="col-md-6 mb-4" key={addr.id}>
                          <div className={`address-card${addr.defaultAddress ? ' default-addr' : ''}`}>
                            {addr.defaultAddress && <span className="default-badge">Default</span>}
                            <h6>{addr.firstName} {addr.lastName}</h6>
                            {addr.company && <p style={{ color: '#888' }}>{addr.company}</p>}
                            <p>{addr.address}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
                            <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                            <p>{addr.country}</p>
                            {addr.phone && <p><i className="fas fa-phone mr-1" style={{ color: '#89C74A', fontSize: 12 }} /> {addr.phone}</p>}
                            <div className="addr-actions">
                              <button className="btn-edit" onClick={() => handleEditClick(addr)}><i className="fas fa-pen" />Edit</button>
                              <button className="btn-delete" onClick={() => handleDeleteClick(addr.id)}><i className="fas fa-trash" />Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddressForm && (
                    <div style={{ background: '#f8fdf2', borderRadius: 12, padding: 24, border: '1px solid #d4edb0' }}>
                      <h5 style={{ fontWeight: 700, marginBottom: 20 }}>{editingAddressId ? 'Edit Address' : 'New Address'}</h5>
                      <div className="row">
                        {[
                          { label: 'First Name', name: 'firstName', col: 6 },
                          { label: 'Last Name', name: 'lastName', col: 6 },
                          { label: 'Company (Optional)', name: 'company', col: 12 },
                          { label: 'Street Address', name: 'address', col: 12 },
                          { label: 'Apartment / Suite (Optional)', name: 'apartment', col: 6 },
                          { label: 'City', name: 'city', col: 6 },
                          { label: 'State / Region', name: 'state', col: 4 },
                          { label: 'Postal Code', name: 'postalCode', col: 4 },
                          { label: 'Country', name: 'country', col: 4 },
                          { label: 'Phone Number', name: 'phone', col: 6, type: 'tel' },
                          { label: 'Email Address', name: 'email', col: 6, type: 'email' },
                        ].map(f => (
                          <div className={`col-md-${f.col}`} style={{ marginBottom: 16 }} key={f.name}>
                            <label className="form-label-sm">{f.label}</label>
                            <input type={f.type || 'text'} className="form-input" name={f.name} value={addressForm[f.name]} onChange={handleInputChange} />
                          </div>
                        ))}
                        <div className="col-12" style={{ marginBottom: 20 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                            <input type="checkbox" name="defaultAddress" checked={addressForm.defaultAddress} onChange={handleInputChange} />
                            Set as default address
                          </label>
                        </div>
                        <div className="col-12" style={{ display: 'flex', gap: 12 }}>
                          <button className="btn-primary-green" onClick={handleAddAddressSubmit}>
                            {editingAddressId ? 'Update Address' : 'Save Address'}
                          </button>
                          <button className="btn-secondary-outline" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); resetAddressForm(user?.uid); }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── Wishlist ── */}
              {activeTab === 'wishlist' && (
                <>
                  <h4 className="section-title">My <span>Wishlist</span></h4>
                  {wishlist.length > 0 ? (
                    <div className="row">
                      {wishlist.map(item => {
                        const price = item.price || (Array.isArray(item.sizes) ? item.sizes[0]?.price : 0);
                        return (
                          <div className="col-sm-6 col-lg-4 mb-4" key={item.id}>
                            <div className="wishlist-item">
                              <img src={item.image || '/assets/images/products/default.jpg'} alt={item.name} className="wishlist-img" onError={e => { e.target.src = '/assets/images/products/default.jpg'; }} />
                              <div className="wishlist-body">
                                <p className="wishlist-name">{item.name}</p>
                                <p className="wishlist-price">₹{price}</p>
                                <div className="wishlist-actions">
                                  <button className="btn-cart" onClick={e => handleAddToCartFromWishlist(item, e)}>
                                    <i className="fas fa-cart-plus mr-1" />Add to Cart
                                  </button>
                                  <button className="btn-remove" onClick={() => handleRemove(item.id)} title="Remove">
                                    <i className="fas fa-trash" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="far fa-heart" />
                      <h5>Your wishlist is empty</h5>
                      <p>Save your favourite products here!</p>
                      <Link legacyBehavior href="/product-details"><a className="theme-btn style-two">Explore Products</a></Link>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AccountPage;
