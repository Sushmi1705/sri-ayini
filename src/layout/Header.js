import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { sidebarToggle } from "../utils";
import { Blog, Contact, Home, PagesDasktop, Shop } from "./Menus";
import MobileMenu from "./MobileMenu";
import CartButton from "./CartButton"; // Add this import at the top
import { auth } from '../../firebase';
import { searchItems } from '../../services/itemServices';
import { signOut } from 'firebase/auth';

// import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();

const Header = ({ header }) => {
  switch (header) {
    case 1:
      return <Header1 />;
    case 2:
      return <Header2 />;
    case 3:
      return <Header3 />;

    default:
      return <DefaultHeader />;
  }
};
export default Header;

const SearchBtn = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <Fragment>
      {/* <button className="far fa-search" onClick={() => setToggle(!toggle)} /> */}
      <form
        onSubmit={(e) => e.preventDefault()}
        action="#"
        className={`${toggle ? "" : "hide"}`}
      >
        <input
          type="text"
          placeholder="Search"
          className="searchbox"
          required=""
        />
        <button type="submit" className="searchbutton far fa-search" />
      </form>
    </Fragment>
  );
};
const DaskTopMenu = () => (
  <ul className="navigation clearfix d-none d-lg-flex">
    {/* <li className="dropdown">
      <a href="#">Home</a>
      <ul>
        <Home />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>  
    </li> */}
    <Home />
    {/* <li className="dropdown">
      <a href="#">pages</a>
      <ul>
        <PagesDasktop />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li> */}
    <PagesDasktop />
    <Blog />
    <Shop />
    {/* <li className="dropdown">
      <a href="#">blog</a>
      <ul>
        <Blog />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li> */}
    {/* <li className="dropdown">
      <a href="#">shop</a>
      <ul>
        <Shop />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li> */}
    <Contact />
  </ul>
);

const Nav = () => {
  const [nav, setNav] = useState(false);
  return (
    <nav className="main-menu navbar-expand-lg mobile-nav">
      <div className="navbar-header">
        <div className="mobile-logo my-15">
          <Link legacyBehavior href="/">
            <a>
              <img src="assets/images/logos/logo.png" alt="Logo" title="Logo" />
              <img
                src="assets/images/logos/logo-white.png"
                alt="Logo"
                title="Logo"
              />
            </a>
          </Link>
        </div>
        {/* Toggle Button */}
        <button
          type="button"
          className="navbar-toggle"
          data-toggle="collapse"
          data-target=".navbar-collapse"
          onClick={() => setNav(!nav)}
        >
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
      </div>
      <div className={`navbar-collapse collapse clearfix ${nav ? "show" : ""}`}>
        <DaskTopMenu />
        <MobileMenu />
      </div>
    </nav>
  );
};

const DefaultHeader = () => {

  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // new
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem('uid'));
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true); // mark auth check complete
      console.log('139-------', firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        searchItems(searchQuery).then(setResults);
      } else {
        setResults([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

    const handleLogout = async () => {
      try {
        await signOut(auth);
        alert('Logged out!');
        window.location.href = '/';
        // Optionally, redirect to login page or reset state
        // e.g., window.location.href = '/login';
      } catch (error) {
        console.error('Logout failed:', error);
        alert('Failed to logout');
      }
    };
    console.log('174-----', userId);
  // const navigate = useNavigate();
  return (
    <header className="main-header">
      <div className="header-top-wrap bg-light-green text-white py-10">
        <div className="container-fluid">
          <div className="header-top">
            <div className="row">
              <div className="col-xl-7 col-lg-6">
                <div className="top-left">
                  <ul>
                    <li>
                      <i className="far fa-envelope" /> <b>Email Us :</b>{" "}
                      <a href="mailto:support@gmail.com">sriayini@gmail.com</a>
                    </li>
                    <li>
                      <i className="far fa-clock" /> <b>Fssai No :</b> 22425474000281
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-5 col-lg-6">
                <div className="top-right text-lg-right">
                  <ul>
                    <li>
                      <i className="far fa-phone" /> <b>Call :</b>{" "}
                      <a href="callto:+012(345)67899">+91 9363489242
                      </a>
                    </li>
                    <li>
                      <div className="social-style-one">
                        <a href="#">
                          <i className="fab fa-facebook-f" />
                        </a>
                        <a href="#">
                          <i className="fab fa-twitter" />
                        </a>
                        <a href="#">
                          <i className="fab fa-youtube" />
                        </a>
                        <a href="#">
                          <i className="fab fa-instagram" />
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Header-Upper*/}
      <div className="header-upper">
        <div className="container-fluid clearfix">
          <div className="header-inner d-flex align-items-center">
            <div className="logo-outer">
              <div className="logo">
                <Link legacyBehavior href="/">
                  <a>
                    <img
                      src="assets/images/logos/logo.png"
                      alt="Logo"
                      title="Logo"
                    />
                  </a>
                </Link>
              </div>
            </div>
            <div className="nav-outer clearfix">
              {/* Main Menu */}
              <Nav />
              {/* Main Menu End*/}
            </div>
            {/* Menu Button */}
            <div className="menu-icons">
              {/* Nav Search */}
              <div className="nav-search py-15">
                <div className="header-search">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    className="header-search-input"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: "8px", width: "250px" }}
                  />

                  {results.length > 0 && (
                    <ul className="header-search-dropdown">
                      {results.map((item) => (
                        <li className="dropdown-item" key={item.id}>
                          <Link href={`/detailsPage?id=${item.id}`} legacyBehavior>
                            <a className="dropdown-link">
                              <img src={item.image} alt={item.name} className="item-img" />
                              <div className="item-info">
                                <div className="item-name">{item.name}</div>
                                <div className="item-price">₹{item.price}</div>
                              </div>
                            </a>
                          </Link>
                        </li>

                      ))}
                    </ul>
                  )}
                </div>
                <SearchBtn />
              </div>
              <CartButton />
              {/* 
              <button className="user">
                <i className="far fa-user-circle" onClick={() => navigate('/login')} />
              </button> */}
              {/* <Link legacyBehavior href="/Login">
                  <i className="far fa-user-circle" />
              </Link > */}

              {authChecked ? (
                user ? (
                  <Link legacyBehavior href="/profile">
                    <a>
                      <i className="far fa-user-circle" />
                    </a>
                  </Link>
                ) : (
                  <Link legacyBehavior href="/Login">
                    <a>
                      <i className="far fa-user-circle" />
                    </a>
                  </Link>
                )
              ) : (
                // Optionally render nothing or a placeholder while checking
                <i className="far fa-user-circle" style={{ opacity: 0.5 }} />
              )}

              {!userId ? (
                <Link legacyBehavior href="/Login">
                  <a className="theme-btn">
                    Login <i className="fas fa-angle-double-right" />
                  </a>
                </Link>
              ) : (
                // <Link legacyBehavior href="/Login">
                  <a className="theme-btn"  onClick={handleLogout}>
                    Logout <i className="fas fa-angle-double-right" />
                  </a>
                // </Link>
              )}

              {/* menu sidbar */}
              <div className="menu-sidebar" onClick={() => sidebarToggle()}>
                <button>
                  <i className="far fa-ellipsis-h" />
                  <i className="far fa-ellipsis-h" />
                  <i className="far fa-ellipsis-h" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*End Header Upper*/}
    </header>
  )
};
const Header1 = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        searchItems(searchQuery).then(setResults);
      } else {
        setResults([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // const navigate = useNavigate();
  return (
    <header className="main-header menu-absolute">
      <div className="header-top-wrap bg-light-green text-white py-10">
        <div className="container-fluid">
          <div className="header-top">
            <div className="row">
              <div className="col-xl-7 col-lg-6">
                <div className="top-left">
                  <ul>
                    <li>
                      <i className="far fa-envelope" /> <b>Email Us :</b>{" "}
                      <a href="mailto:support@gmail.com">sriayini@gmail.com</a>
                    </li>
                    <li>
                      <i className="far fa-clock" /> <b>Fssai No :</b> 22425474000281
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-5 col-lg-6">
                <div className="top-right text-lg-right">
                  <ul>
                    <li>
                      <i className="far fa-phone" /> <b>Call :</b>{" "}
                      <a href="callto:+012(345)67899">+91 9363489242
                      </a>
                    </li>
                    <li>
                      <div className="social-style-one">
                        <a href="#">
                          <i className="fab fa-facebook-f" />
                        </a>
                        <a href="#">
                          <i className="fab fa-twitter" />
                        </a>
                        <a href="#">
                          <i className="fab fa-youtube" />
                        </a>
                        <a href="#">
                          <i className="fab fa-instagram" />
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Header-Upper*/}
      <div className="header-upper">
        <div className="container-fluid clearfix">
          <div className="header-inner d-flex align-items-center">
            <div className="logo-outer">
              <div className="logo">
                <Link legacyBehavior href="/">
                  <a>
                    <img
                      src="assets/images/logos/logo.png"
                      alt="Logo"
                      title="Logo"
                    />
                  </a>
                </Link>
              </div>
            </div>
            <div className="nav-outer clearfix">
              {/* Main Menu */}
              <Nav />
              {/* Main Menu End*/}
            </div>
            {/* Menu Button */}
            <div className="menu-icons">
              {/* Nav Search */}
              <div className="nav-search py-15">
                <div className="header-search">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    className="header-search-input"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: "8px", width: "300px" }}
                  />

                  {results.length > 0 && (
                    <ul className="header-search-dropdown">
                      {results.map((item) => (
                        <li className="dropdown-item" key={item.id}>
                          <Link href={`/detailsPage?id=${item.id}`} legacyBehavior>
                            <a className="dropdown-link">
                              <img src={item.image} alt={item.name} className="item-img" />
                              <div className="item-info">
                                <div className="item-name">{item.name}</div>
                                <div className="item-price">₹{item.price}</div>
                              </div>
                            </a>
                          </Link>
                        </li>

                      ))}
                    </ul>
                  )}
                </div>
                <SearchBtn />
              </div>
              {/* <button className="cart">
              <i className="far fa-shopping-basket" />
              <span>5</span>
            </button> */}
              {/* <button className="user">
                <i className="far fa-user-circle" onClick={() => navigate('/login')} />
              </button> */}
              <Link legacyBehavior href="/Login">
                <i className="far fa-user-circle" />
              </Link >
              <Link legacyBehavior href="/Login">
                <a className="theme-btn">
                  Login <i className="fas fa-angle-double-right" />
                </a>
              </Link>
              {/* menu sidbar */}
              <div className="menu-sidebar" onClick={() => sidebarToggle()}>
                <button>
                  <i className="far fa-ellipsis-h" />
                  <i className="far fa-ellipsis-h" />
                  <i className="far fa-ellipsis-h" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*End Header Upper*/}
    </header>
  )
};
const Header2 = () => (
  <header className="main-header header-two">
    <div className="header-top-wrap">
      <div className="container">
        <div className="header-top bg-light-green text-white py-10">
          <div className="row">
            <div className="col-xl-7 col-lg-6">
              <div className="top-left">
                <ul>
                  <li>
                    <i className="far fa-envelope" /> <b>Email Us :</b>{" "}
                    <a href="mailto:support@gmail.com">sriayini@gmail.com</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6">
              <div className="top-right text-lg-right">
                <ul>
                  <li>
                    <i className="far fa-phone" /> <b>Call :</b>{" "}
                    <a href="callto:+012(345)67899">+91 9363489242
                    </a>
                  </li>
                  <li>
                    <div className="social-style-one">
                      <a href="#">
                        <i className="fab fa-facebook-f" />
                      </a>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                      <a href="#">
                        <i className="fab fa-youtube" />
                      </a>
                      <a href="#">
                        <i className="fab fa-instagram" />
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/*Header-Upper*/}
    <div className="header-upper">
      <div className="container rel clearfix">
        <div className="header-inner d-flex align-items-center">
          <div className="logo-outer">
            <div className="logo">
              <Link legacyBehavior href="/">
                <a>
                  <img
                    src="assets/images/logos/logo.png"
                    alt="Logo"
                    title="Logo"
                  />
                  <img
                    src="assets/images/logos/logo-white.png"
                    alt="Logo"
                    title="Logo"
                  />
                </a>
              </Link>
            </div>
          </div>
          <div className="nav-outer clearfix">
            {/* Main Menu */}
            <Nav />
            {/* Main Menu End*/}
          </div>
          {/* Menu Button */}
          <div className="menu-icons">
            {/* Nav Search */}
            <div className="nav-search py-15">
              <button className="far fa-search" />
              <form
                onSubmit={(e) => e.preventDefault()}
                action="#"
                className="hide"
              >
                <input
                  type="text"
                  placeholder="Search"
                  className="searchbox"
                  required=""
                />
                <button type="submit" className="searchbutton far fa-search" />
              </form>
            </div>
            <button className="cart">
              <i className="far fa-shopping-basket" />
            </button>
            {/* menu sidbar */}
            <div className="menu-sidebar" onClick={() => sidebarToggle()}>
              <button>
                <i className="far fa-ellipsis-h" />
                <i className="far fa-ellipsis-h" />
                <i className="far fa-ellipsis-h" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/*End Header Upper*/}
  </header>
);
const Header3 = () => {
  // const navigate = useNavigate();
  return (
    <header className="main-header header-three menu-absolute">
      <div className="header-top-wrap bgc-primary py-10">
        <div className="container-fluid">
          <div className="header-top px-0">
            <ul>
              <li>25% OFF Upcoming Product</li>
              <li>100% Fresh &amp; natural foods</li>
              <li>free shipping over $99</li>
              <li>money back guarantee</li>
              <li>cash on delivery</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="header-middle py-15">
        <div className="container-fluid">
          <div className="header-middle-inner">
            <div className="menu-middle-left">
              <select name="currentcy" id="currentcy">
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
                <option value="EURO">EURO</option>
              </select>

              <select name="language" id="language">
                <option value="English">English</option>
                <option value="Bengali">Bengali</option>
                <option value="Arabic">Arabic</option>
              </select>

              <div className="follower">
                <i className="fab fa-facebook" />
                <a href="#">250k+ Followers</a>
              </div>
            </div>
            <div className="logo-outer">
              <div className="logo">
                <Link legacyBehavior href="/">
                  <a>
                    <img
                      src="assets/images/logos/logo-two.png"
                      alt="Logo"
                      title="Logo"
                    />
                  </a>
                </Link>
              </div>
            </div>
            {/* Menu Button */}
            <div className="menu-icons">
              {/* Nav Search */}
              <form
                onSubmit={(e) => e.preventDefault()}
                action="#"
                className="nav-search"
              >
                <input
                  type="text"
                  placeholder="Search here"
                  className="searchbox"
                  required=""
                />
                <button type="submit" className="searchbutton far fa-search" />
              </form>
              <button className="cart">
                <i className="far fa-shopping-basket" />
                <span>5</span>
              </button>
              {/* <button className="user">
                <i className="far fa-user-circle" onClick={() => navigate('/login')} />
              </button> */}
              <Link legacyBehavior href="/Login">
                <i className="far fa-user-circle" />
              </Link >
              <button className="heart">
                <i className="far fa-heart" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*Header-Upper*/}
      <div className="header-upper px-0">
        <div className="container-fluid clearfix">
          <div className="header-inner d-flex align-items-center">
            <div className="nav-outer clearfix">
              {/* Main Menu */}
              <Nav />
              {/* Main Menu End*/}
            </div>
            {/* menu sidbar */}
            <div className="menu-sidebar" onClick={() => sidebarToggle()}>
              <button>
                <i className="far fa-ellipsis-h" />
                <i className="far fa-ellipsis-h" />
                <i className="far fa-ellipsis-h" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*End Header Upper*/}
    </header>
  )
};
