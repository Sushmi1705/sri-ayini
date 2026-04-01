import { useState, useEffect } from "react";
import Link from "next/link";
import { Blog, Contact, Home, PagesMobile, Portfolio, Shop, PagesDasktop } from "./Menus";

const MobileMenu = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    const uid = sessionStorage.getItem("uid");
    if (uid) setUser({ name, uid });
  }, []);

  return (
    <div className="mobile-app-menu">
      <div className="mobile-menu-header">
        <div className="user-profile-section">
          <div className="avatar-circle">
            <i className="fas fa-user" />
          </div>
          <div className="user-info">
            <span className="welcome-text">Welcome back,</span>
            <span className="user-name">{user ? user.name : "Guest Explorer"}</span>
          </div>
        </div>
      </div>

      <div className="mobile-menu-body">
        <div className="menu-group">
          <span className="group-label">Quick Access</span>
          <ul className="mobile-nav-list">
            <li><Link href="/" legacyBehavior><a><i className="fal fa-home" /> Home</a></Link></li>
            <li><Link href="/product-details" legacyBehavior><a><i className="fal fa-th-large" /> All Products</a></Link></li>
            <li><Link href="/about" legacyBehavior><a><i className="fal fa-leaf" /> Our Story</a></Link></li>
          </ul>
        </div>

        <div className="menu-group">
          <span className="group-label">Customer Support</span>
          <ul className="mobile-nav-list">
             <li><Link href="/contact" legacyBehavior><a><i className="fal fa-envelope" /> Contact Us</a></Link></li>
             <li><Link href="/faqs" legacyBehavior><a><i className="fal fa-question-circle" /> FAQs</a></Link></li>
          </ul>
        </div>

        {!user && (
          <div className="menu-footer-actions">
            <Link href="/Login" legacyBehavior>
              <a className="theme-btn w-100 text-center">Login / Register</a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
