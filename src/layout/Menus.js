import Link from "next/link";
import { Fragment } from "react";

export const Home = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/">
        Home
      </Link>
    </li>
    {/* <li>
      <Link legacyBehavior href="/index2">
        Home Two
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/index3">
        Home Three
      </Link>
    </li> */}
  </Fragment>
);

export const PagesDasktop = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/about">
        About us
      </Link>
    </li>
    {/* <li className="dropdown">
      <a href="#">services</a>
      <ul>
        <li>
          <Link legacyBehavior href="/services">
            all services
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="/service-details">
            service details
          </Link>
        </li>
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <li>
      <Link legacyBehavior href="/faqs">
        faqs
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/farmers">
        Farmers
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/404">
        404 error
      </Link>
    </li> */}
  </Fragment>
);
export const PagesMobile = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/about">
        About us
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/services">
        all services
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/service-details">
        service details
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/faqs">
        faqs
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/farmers">
        Farmers
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/404">
        404 error
      </Link>
    </li>
  </Fragment>
);
export const Portfolio = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/portfolio-grid">
        Portfolio grid
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/portfolio-fluid">
        Portfolio Fluid
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/portfolio-details">
        Portfolio details
      </Link>
    </li>
  </Fragment>
);
export const Blog = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/blog-grid">
        blog Grid
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/blog-standard">
        blog Standard
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/blog-details">
        blog details
      </Link>
    </li>
  </Fragment>
);
export const Shop = () => (
  <Fragment>
    {/* <li>
      <Link legacyBehavior href="/shop-grid">
        shop Grid
      </Link>
    </li> */}
    {/* <li>
      <Link legacyBehavior href="/shop-left-sidebar">
        shop left sidebar
      </Link>
    </li> */}
    {/* <li>
      <Link legacyBehavior href="/shop-right-sidebar">
        shop right sidebar
      </Link>
    </li> */}
    <li>
      <Link legacyBehavior href="/product-details">
        Product details
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/cart">
        cart page
      </Link>
    </li>
    <li>
      <Link legacyBehavior href="/checkout">
        checkout
      </Link>
    </li>
    {/* <li>
      <Link legacyBehavior href="/wishlist">
        wishlist
      </Link>
    </li> */}
  </Fragment>
);
export const Contact = () => (
  <Fragment>
    <li>
      <Link legacyBehavior href="/contact">
        Contact
      </Link>
    </li>
  </Fragment>
);
