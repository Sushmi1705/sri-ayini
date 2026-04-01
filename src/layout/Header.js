import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { sidebarToggle } from "../utils";
import { Blog, Contact, Home, PagesDasktop, Shop, MegaMenu } from "./Menus";
import MobileMenu from "./MobileMenu";
import CartButton from "./CartButton"; // Add this import at the top
import { auth } from '../../firebase';
import { searchItems } from '../../services/itemServices';
import { getWishlist } from '../../services/wishlistService';

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
      {/* <button className="fas fa-search" onClick={() => setToggle(!toggle)} /> */}
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
        <button type="submit" className="searchbutton fas fa-search" />
      </form>
    </Fragment>
  );
};
const DaskTopMenu = ({ categories = [] }) => (
  <ul className="navigation clearfix d-none d-lg-flex">
    <Home />
    <MegaMenu categories={categories} />
    <PagesDasktop />
    <Blog />
    <Contact />
  </ul>
);

const Nav = ({ categories = [] }) => {
  const [nav, setNav] = useState(false);

  useEffect(() => {
    if (nav) {
      document.querySelector("body").classList.add("side-content-visible");
    } else {
      document.querySelector("body").classList.remove("side-content-visible");
    }
  }, [nav]);

  return (
    <nav className="main-menu navbar-expand-lg mobile-nav">
      <div className="navbar-header">
        <div className="mobile-logo my-15">
          <Link legacyBehavior href="/">
            <a>
              <img src="/assets/images/logos/logo.png" alt="Logo" title="Logo" />
              <img
                src="/assets/images/logos/logo-white.png"
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
        <DaskTopMenu categories={categories} />
        <div className="d-lg-none">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

const DefaultHeader = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    import('../../services/itemServices').then(({ fetchCategory }) => {
      fetchCategory().then(setCategories).catch(console.error);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    // 1️⃣ Check sessionStorage first
    const sessionUid = sessionStorage.getItem('uid');
    if (sessionUid && isMounted) {
      setUserId(sessionUid);
    }

    // 2️⃣ Listen to Firebase auth (Google/Facebook login)
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!isMounted) return;

      if (firebaseUser) {
        setUserId(firebaseUser.uid); // overwrite if Firebase login
      } else if (!sessionUid) {
        // only clear if no OTP session either
        setUserId(null);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 3️⃣ Scroll effect for glassmorphism
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  useEffect(() => {
    const refreshWishlistCount = async () => {
      const activeUid = sessionStorage.getItem("uid");
      setUserId(activeUid);
      if (!activeUid) {
        setWishlistCount(0);
        return;
      }
      try {
        const items = await getWishlist(activeUid);
        setWishlistCount(items.length);
      } catch (error) {
        console.error("Wishlist count error:", error);
      }
    };

    refreshWishlistCount();
    window.addEventListener("storage", refreshWishlistCount);
    window.addEventListener("wishlistUpdated", refreshWishlistCount);

    return () => {
      window.removeEventListener("storage", refreshWishlistCount);
      window.removeEventListener("wishlistUpdated", refreshWishlistCount);
    };
  }, []);

  return (
    <header className={`main-header modern-layout ${isScrolled ? "is-scrolled" : ""}`}>
      {/*Header-Upper*/}
      <div className="header-upper">
        <div className="container-fluid clearfix">
          <div className="header-inner d-flex align-items-center justify-content-between">
            <div className="logo-outer">
              <Link legacyBehavior href="/">
                <a className="logo-text">Sri Ayini</a>
              </Link>
            </div>
            
            <div className="nav-outer clearfix">
              {/* Main Menu */}
              <Nav categories={categories} />
              {/* Main Menu End*/}
            </div>

            <div className="menu-icons d-flex align-items-center">
              {/* Modern Search Bar */}
              <div className="modern-search-container">
                <i className="fas fa-search" />
                <input
                  type="text"
                  placeholder="Search blends..."
                  value={searchQuery}
                  className="modern-search-input"
                  onChange={(e) => setSearchQuery(e.target.value)}
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

              <div className="header-action-icons">
                {userId ? (
                  <Link legacyBehavior href="/profile">
                    <a className="header-icon-link" aria-label="Profile"><i className="fas fa-user" /></a>
                  </Link>
                ) : (
                  <Link legacyBehavior href="/Login">
                    <a className="header-icon-link" aria-label="Login"><i className="fas fa-user" /></a>
                  </Link>
                )}
                
                <Link legacyBehavior href="/wishlist">
                  <a className="header-icon-link has-badge" aria-label="Wishlist">
                    <i className="fas fa-heart" />
                    {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
                  </a>
                </Link>

                <CartButton />
              </div>

              <Link legacyBehavior href={userId ? "/profile" : "/Login"}>
                <a className="join-btn">{userId ? "Account" : "Join"}</a>
              </Link>

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
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    import('../../services/itemServices').then(({ fetchCategory }) => {
      fetchCategory().then(setCategories).catch(console.error);
    });
    setUserId(sessionStorage.getItem('uid'));
  }, []);

  useEffect(() => {
    const refreshWishlistCount = async () => {
      const activeUid = sessionStorage.getItem("uid");
      setUserId(activeUid);
      if (!activeUid) {
        setWishlistCount(0);
        return;
      }
      try {
        const items = await getWishlist(activeUid);
        setWishlistCount(items.length);
      } catch (error) {
        console.error("Wishlist count error:", error);
      }
    };

    refreshWishlistCount();
    window.addEventListener("storage", refreshWishlistCount);
    window.addEventListener("wishlistUpdated", refreshWishlistCount);

    return () => {
      window.removeEventListener("storage", refreshWishlistCount);
      window.removeEventListener("wishlistUpdated", refreshWishlistCount);
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        import('../../services/itemServices').then(({ searchItems }) => {
          searchItems(searchQuery).then(setResults);
        });
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`main-header modern-layout ${isScrolled ? "is-scrolled" : ""}`}>
      {/*Header-Upper*/}
      <div className="header-upper">
        <div className="container-fluid clearfix">
          <div className="header-inner d-flex align-items-center justify-content-between">
            <div className="logo-outer">
              <Link legacyBehavior href="/">
                <a className="logo-text">Sri Ayini</a>
              </Link>
            </div>
            
            <div className="nav-outer clearfix">
              <Nav categories={categories} />
            </div>

            <div className="menu-icons d-flex align-items-center">
              <div className="modern-search-container">
                <i className="fas fa-search" />
                <input
                  type="text"
                  placeholder="Search blends..."
                  value={searchQuery}
                  className="modern-search-input"
                  onChange={(e) => setSearchQuery(e.target.value)}
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

              <div className="header-action-icons">
                <Link legacyBehavior href={userId ? "/profile" : "/Login"}>
                  <a className="header-icon-link" aria-label={userId ? "Profile" : "Login"}><i className="fas fa-user" /></a>
                </Link>
                
                <Link legacyBehavior href="/wishlist">
                  <a className="header-icon-link has-badge" aria-label="Wishlist">
                    <i className="fas fa-heart" />
                    {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
                  </a>
                </Link>

                <CartButton />
              </div>

              <Link legacyBehavior href={userId ? "/profile" : "/Login"}>
                <a className="join-btn">{userId ? "Account" : "Join"}</a>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
const Header2 = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    import('../../services/itemServices').then(({ fetchCategory }) => {
      fetchCategory().then(setCategories).catch(console.error);
    });
  }, []);

  return (
    <header className="main-header header-two">
      <div className="header-top-wrap">
        <div className="container">
          <div className="header-top text-white py-10" style={{ background: 'var(--secondary-accent)' }}>
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
              <Nav categories={categories} />
              {/* Main Menu End*/}
            </div>
            {/* Menu Button */}
            <div className="menu-icons">
              {/* Nav Search */}
              <div className="nav-search py-15">
                <button className="fas fa-search" />
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
                  <button type="submit" className="searchbutton fas fa-search" />
                </form>
              </div>
              <button className="cart">
                <i className="fas fa-shopping-basket" />
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
};
const Header3 = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    import('../../services/itemServices').then(({ fetchCategory }) => {
      fetchCategory().then(setCategories).catch(console.error);
    });
  }, []);

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
                <button type="submit" className="searchbutton fas fa-search" />
              </form>
              <button className="cart">
                <i className="fas fa-shopping-basket" />
                <span>5</span>
              </button>
              {/* <button className="user">
                <i className="far fa-user-circle" onClick={() => navigate('/login')} />
              </button> */}
              <Link legacyBehavior href="/Login">
                <a className="header-icon-link" aria-label="Login">
                  <i className="fas fa-user-circle" />
                </a>
              </Link>
              <button className="heart">
                <i className="fas fa-heart" />
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
              <Nav categories={categories} />
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
  );
};
