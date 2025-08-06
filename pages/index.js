import dynamic from "next/dynamic";
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import Slider from "react-slick";
import ClientLogoSlider from "../src/components/ClientLogoSlider";
import { HomeSlider1 } from "../src/components/HomeSlider";
import CustomerReviews from "../src/components/slider/CustomerReviews";
import PhotoGallery from "../src/components/slider/PhotoGallery";
import Layout from "../src/layout/Layout";
import { productActive } from "../src/sliderProps";
import React, { useEffect, useState } from "react";
import { fetchItems, fetchCategory } from "../services/itemServices";

const MunfimCountdown = dynamic(
  () => import("../src/components/MunfimCountdown"),
  {
    ssr: false,
  }
);
const Index = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItems()
      .then(data => {
        // console.log('28-----', data);
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, []);


  useEffect(() => {
    fetchCategory()
      .then(data => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

// console.log('42--------',products);
  return (
    <Layout header={1}>
      {/*End Hidden Sidebar */}
      {/* Slider Section Start */}
      <section className="slider-section bg-lighter">
        <div className="main-slider-active">
          <HomeSlider1 />
        </div>
        <img
          className="bg-leaf"
          src="assets/images/slider/slider-bg-leaf.png"
          alt="Shape"
        />
        <img
          className="bg-shape"
          src="assets/images/slider/slider-bg-shape.png"
          alt="Shape"
        />
      </section>
      {/* Slider Section End */}
      {/* Category Section Start */}
      <section className="product-section pt-100 rpt-70 rpb-100">
        <div className="container-fluid">
          <div className="section-title text-center mb-60">
            {/* <span className="sub-title mb-20">
              Our Signature Product Collection
            </span> */}
            <h2>Bestsellers</h2>
          </div>

          <Slider {...productActive} className="product-active">
            {products.slice(0, 5).map((product, index) => (
              <div className="product-item wow fadeInUp delay-0-3s" key={product.id || index}>
                <Link href="/product-details">
                  <div className="image">
                    <img
                      src={product.image || "assets/images/products/default.jpg"}
                      alt={product.name}
                    />
                  </div>
                  <div className="content">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category || "Uncategorized"}</p>
                    <span className="price">
                      {product.originalPrice && <del>{product.originalPrice}</del>}
                      <span>{product.price}</span> ({product.weight || "100g"})
                    </span>
                  </div>
                </Link>
                {/* <button
                  className="btn btn-primary btn-sm btn-add-to-cart"
                  onClick={() => handleAddToCart(product)}
                  type="button"
                >
                  Add to Cart
                </button> */}
              </div>
            ))}
          </Slider>

        </div>
      </section>

      {/* New Category Grid Section */}
      <section className="category-section pb-100">
        <div className="container-fluid">
          <div className="section-title text-center mb-60">
            <h2>Shop by Category</h2>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => (
              <Link
                key={category.id || index}
                href={{
                  pathname: '/product-details',
                  query: { category: category.category }
                }}
                passHref
              >
                <div className="category-item" role="button" tabIndex={0}>
                  <img
                    src={category.image || "assets/images/slider/banner2.png"}
                    alt={category.categoryName || category.category}
                    className="category-image"
                  />
                  <h4 className="category-name">{category.categoryName || category.category}</h4>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      <section className="category-section pt-130 rpt-100">
        <div className="container">
          <div className="row align-items-end pb-35">
            <div className="col-lg-7 wow fadeInUp delay-0-2s">
              <div className="section-title mb-20">
                <span className="sub-title mb-20">
                  Popular Spice Powders
                </span>
                <h2>Authentic Homemade Spice Blends</h2>
              </div>
            </div>
            <div className="col-lg-5 wow fadeInUp delay-0-4s">
              <div className="text mb-20">
                <p>
                  At Sri Ayini, we bring you traditional, handcrafted spice powders that enhance the flavor of your dishes. Our carefully selected ingredients and time-tested recipes ensure purity, taste, and health benefits.<br></br>
                  🌿 100% Homemade & Natural <br></br> 🌶️ Rich Aroma & Flavor <br></br> 🏡 Traditional Recipes
                </p>
              </div>
            </div>
          </div>
          <div className="category-wrap">
            <div className="category-item wow fadeInUp delay-0-3s">
              <div className="icon">
                <img src="assets/images/category/mappilai samba mix.png" alt="Icon" />
              </div>
              {/* <h5>
                <Link legacyBehavior href="/services">
                  Organic Fruits
                </Link>
              </h5> */}
              {/* <img src="assets/images/category/arrow.png" alt="Arrow" /> */}
            </div>
            <div className="category-item wow fadeInUp delay-0-4s">
              <div className="icon">
                <img src="assets/images/category/paruppu podi.png" alt="Icon" />
              </div>
              {/* <h5>
                <Link legacyBehavior href="/services">
                  Vegetables
                </Link>
              </h5> */}
              {/* <img src="assets/images/category/arrow.png" alt="Arrow" /> */}
            </div>
            <div className="category-item wow fadeInUp delay-0-5s">
              <div className="icon">
                <img src="assets/images/category/fish fry masala.png" alt="Icon" />
              </div>
              {/* <h5>
                <Link legacyBehavior href="/services">
                  Sea Fish’s
                </Link>
              </h5>
              <img src="assets/images/category/arrow.png" alt="Arrow" /> */}
            </div>
            <div className="category-item wow fadeInUp delay-0-6s">
              <div className="icon">
                <img src="assets/images/category/ragi podi.png" alt="Icon" />
              </div>
              {/* <h5>
                <Link legacyBehavior href="/services">
                  Crisp Bakery
                </Link>
              </h5>
              <img src="assets/images/category/arrow.png" alt="Arrow" /> */}
            </div>
            <div className="category-item wow fadeInUp delay-0-7s">
              <div className="icon">
                <img src="assets/images/category/turmaric podi.png" alt="Icon" />
              </div>
              {/* <h5>
                <Link legacyBehavior href="/services">
                  Chiken Egg
                </Link>
              </h5>
              <img src="assets/images/category/arrow.png" alt="Arrow" /> */}
            </div>
          </div>
        </div>
      </section>
      {/* Category Section End */}
      {/* About Section Start */}
      <section className="about-section pt-85 rpt-55 pb-130 rpb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-images wow fadeInLeft delay-0-2s">
                <div className="row align-items-center">
                  <div className="col-6">
                    <img src="assets/images/about/about1.jpg" alt="About" />
                  </div>
                  <div className="col-6">
                    <img src="assets/images/about/about2.jpg" alt="About" />
                    <img src="assets/images/about/about3.jpg" alt="About" />
                  </div>
                </div>
                <div className="offer">
                  <img src="assets/images/shapes/organic.png" alt="Offer" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content rpt-65 wow fadeInRight delay-0-2s">
                <div className="section-title mb-35">
                  <span className="sub-title mb-20">About Sri Ayini</span>
                  <h2>Authentic Homemade Spice Powder Provider</h2>
                </div>
                <Tab.Container defaultActiveKey={"agriculture"}>
                  <Nav className="nav jusctify-content-between">
                    <li>
                      <Nav.Link
                        eventKey="agriculture"
                        className="nav-link"
                        data-toggle="tab"
                        href="#agriculture"
                      >
                        <i className="flaticon-spa" />
                        <h4>
                          Our Promise
                        </h4>
                      </Nav.Link>
                    </li>
                  </Nav>
                  <Tab.Content className="tab-content pt-25">
                    <Tab.Pane className="tab-pane fade" eventKey="agriculture">
                      <p>
                        At Sri Ayini, we are passionate about bringing authentic, homemade spice powders to your kitchen. Using time-honored recipes and handpicked ingredients, we ensure that every spice blend is pure, fresh, and full of rich flavors.
                        <br></br>
                        We believe in quality, tradition, and authenticity, making sure that every pinch of our spice powders enhances the taste of your favorite dishes.
                        <br></br>
                        ✅ 100% Homemade & Natural<br></br>
                        ✅ No Artificial Preservatives<br></br>
                        ✅ Perfect for Everyday Cooking
                      </p>
                      {/* <div className="author-wrap">
                        <img
                          src="assets/images/about/author.jpg"
                          alt="Authro"
                        />
                        <div className="title">
                          <h4>Michael D. Foreman</h4>
                          <span>CEO &amp; Founder</span>
                        </div>
                        <img
                          src="assets/images/about/signature.png"
                          alt="Signature"
                        />
                      </div> */}
                    </Tab.Pane>
                    {/* <Tab.Pane className="tab-pane fade" eventKey="vegetables">
                      <p>
                        Charms of pleasure of the moment so blinded by desire,
                        that they cannot foresee the pain On the other hand we
                        denounce with righteous indignation and dislike men who
                        are beguiled and demoralized by the
                      </p>
                      <div className="author-wrap">
                        <img
                          src="assets/images/about/author.jpg"
                          alt="Authro"
                        />
                        <div className="title">
                          <h4>Russell J. Knoll</h4>
                          <span>CEO &amp; Founder</span>
                        </div>
                        <img
                          src="assets/images/about/signature.png"
                          alt="Signature"
                        />
                      </div>
                    </Tab.Pane> */}
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Section End */}
      {/* Offer Banners Start */}
      {/* <section className="offer-banners-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-4 col-md-6">
              <div className="offer-banner-item color-two wow fadeInUp delay-0-2s">
                <div className="content">
                  <span className="sub-title">35% Off Foods</span>
                  <h4>Organic Vegetables</h4>
                  <p>Best Foods For Your Family</p>
                  <Link legacyBehavior href="/shop-grid">
                    <a className="theme-btn style-two">
                      Shop Now <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
                <div className="image">
                  <img
                    src="assets/images/offers/offer-banner1.png"
                    alt="Offer Banner"
                  />
                </div>
                <img
                  className="offer-bg"
                  src="assets/images/offers/offer-baner-bg1.png"
                  alt="Offer BG"
                />
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="offer-banner-item wow fadeInUp delay-0-4s">
                <div className="content">
                  <span className="sub-title">35% Off Foods</span>
                  <h4>Fresh Organic Fruits</h4>
                  <p>Best Foods For Your Family</p>
                  <Link legacyBehavior href="/shop-grid">
                    <a className="theme-btn style-two">
                      Shop Now <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
                <div className="image">
                  <img
                    src="assets/images/offers/offer-banner2.png"
                    alt="Offer Banner"
                  />
                </div>
                <img
                  className="offer-bg"
                  src="assets/images/offers/offer-baner-bg2.png"
                  alt="Offer BG"
                />
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="offer-banner-item color-three wow fadeInUp delay-0-6s">
                <div className="content">
                  <span className="sub-title">35% Off Foods</span>
                  <h4>Ripe Strawberries</h4>
                  <p>Best Foods For Your Family</p>
                  <Link legacyBehavior href="/shop-grid">
                    <a className="theme-btn style-two">
                      Shop Now <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
                <div className="image">
                  <img
                    src="assets/images/offers/offer-banner3.png"
                    alt="Offer Banner"
                  />
                </div>
                <img
                  className="offer-bg"
                  src="assets/images/offers/offer-baner-bg3.png"
                  alt="Offer BG"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* Offer Banners End */}
      {/* Product Section Start */}

      {/* Product Section End */}
      {/* Video Area Start */}
      {/* <div className="video-area">
        <div className="container">
          <div
            className="video-inner wow fadeInUp delay-0-2s"
            style={{ backgroundImage: "url(assets/images/video/video-bg.jpg)" }}
          >
            <i className="flaticon-leaf-1" />
            <span className="video-text">Watch Videos</span>
            <a
              href="https://www.youtube.com/watch?v=9Y7ma241N8k"
              className="mfp-iframe video-play"
            >
              <i className="fas fa-play" />
            </a>
          </div>
        </div>
      </div> */}
      {/* Video Area End */}
      {/* Special Offer Start */}
      {/* <section className="special-offer bg-lighter pt-250 pb-80">
        <div className="special-offer-content text-center py-130 rpy-100 wow fadeInUp delay-0-2s">
          <div className="section-title mb-30">
            <span className="sub-title mb-20">Exclusive 35% Off on Spices!</span>
            <h2>This Week’s Special: Freshly Ground Spices</h2>
          </div>
          <p>
          Experience the richness of homemade spice powders, crafted with care for authentic flavors in every dish.
          </p>
          <MunfimCountdown />
          <div className="count-down-btns mt-10">
            <Link legacyBehavior href="/shop-grid">
              <a className="theme-btn">
                Shop Now <i className="fas fa-angle-double-right" />
              </a>
            </Link>
            <Link legacyBehavior href="/about">
              <a className="theme-btn style-two">
                use code <i className="fas fa-angle-double-right" />
              </a>
            </Link>
          </div>
        </div>
        <img
          className="offer-bg"
          src="assets/images/offers/special-offer-bg.png"
          alt="Offer BG"
        />
        <img
          className="munakoiso"
          src="assets/images/shapes/munakoiso.png"
          alt="Munakoiso"
        />
        <img
          className="litchi"
          src="assets/images/shapes/litchi.png"
          alt="Litchi"
        />
        <img
          className="special-offer-left"
          src="assets/images/offers/offer-left.png"
          alt="Offer"
        />
        <img
          className="special-offer-right"
          src="assets/images/offers/offer-right.png"
          alt="Offer"
        />
      </section> */}
      {/* Special Offer End */}
      {/* Call To Action Area Start */}
      <section className="cta-area">
        <div className="container">
          <div
            className="cta-inner overlay text-white wow fadeInUp delay-0-2s"
            style={{
              backgroundImage: "url(assets/images/background/cta-bg.jpg)",
            }}
          >
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="section-title mt-20 mb-15">
                  <span className="sub-title mb-15">Need Any Supports</span>
                  <h3>Get Our Quality Foods</h3>
                </div>
              </div>
              <div className="col-lg-4 text-lg-right">
                <Link legacyBehavior href="/contact">
                  <a className="theme-btn btn-white my-15">
                    Get In Touch <i className="fas fa-angle-double-right" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call To Action Area End */}
      {/* Gallery Area Start */}
      {/* <section className="gallery-area pt-130 rpt-100">
        <PhotoGallery />
      </section> */}
      {/* Gallery Area End */}
      {/* Feedback Section Start */}
      {/* <section className="feedback-section pt-50 rpt-20">
        <div className="container">
          <div className="row large-gap">
            <div className="col-lg-6">
              <CustomerReviews />
            </div>
            <div className="col-lg-6">
              <div className="feedback-images wow fadeInRight delay-0-2s">
                <img
                  className="first-image"
                  src="assets/images/reviews/feedback-right.jpg"
                  alt="Feedback"
                />
                <img
                  className="last-image"
                  src="assets/images/reviews/feedback-right.png"
                  alt="Feedback"
                />
                <img
                  className="bg-image"
                  src="assets/images/shapes/feedback-bg.png"
                  alt="Feedback"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* Feedback Section End */}
      {/* News Section Start */}
      <section className="news-section pt-130 rpt-100 pb-70 rpb-40">
        <div className="container">
          <div className="section-title text-center mb-60">
            <span className="sub-title mb-20">Read Article Tips</span>
            <h2>Latest News &amp; Blog</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-4 col-md-6">
              <div className="news-item wow fadeInUp delay-0-2s">
                <div className="image">
                  <img src="assets/images/news/sambar.jpg" alt="News" />
                  <span className="date">
                    <b>25</b> July
                  </span>
                </div>
                <div className="content">
                  <span className="sub-title">Spices</span>
                  <h4>
                    <Link legacyBehavior href="/blog-details1">
                      Why Homemade Sambar Powder Tastes Better Than Store-Bought
                    </Link>
                  </h4>
                  <Link legacyBehavior href="/blog-details1">
                    <a className="read-more">
                      Read More <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="news-item wow fadeInUp delay-0-4s">
                <div className="image">
                  <img src="assets/images/news/idly podi.jpg" alt="News" />
                  <span className="date">
                    <b>25</b> July
                  </span>
                </div>
                <div className="content">
                  <span className="sub-title">Usage Tips</span>
                  <h4>
                    <Link legacyBehavior href="/blog-details2">
                      5 Easy Ways to Use Idli Podi Beyond Idli & Dosa
                    </Link>
                  </h4>
                  <Link legacyBehavior href="/blog-details2">
                    <a className="read-more">
                      Read More <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="news-item wow fadeInUp delay-0-6s">
                <div className="image">
                  <img src="assets/images/news/moringa powder.jpg" alt="News" />
                  <span className="date">
                    <b>25</b> July
                  </span>
                </div>
                <div className="content">
                  <span className="sub-title">Health</span>
                  <h4>
                    <Link legacyBehavior href="/blog-details3">
                      The Health Benefits of Moringa Powder in Tamil Cooking
                    </Link>
                  </h4>
                  <Link legacyBehavior href="/blog-details3">
                    <a className="read-more">
                      Read More <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="news-shapes">
          <img
            className="onion"
            src="assets/images/shapes/onion.png"
            alt="Onion"
          />
          <img
            className="two-leaf"
            src="assets/images/slider/two-lear.png"
            alt="Leaf"
          />
          <img
            className="half-leaf"
            src="assets/images/slider/half-leaf.png"
            alt="Leaf"
          />
          <img
            className="leaf-two"
            src="assets/images/shapes/leaf-three.png"
            alt="Leaf"
          />
          <img
            className="leaf-three"
            src="assets/images/shapes/leaf-four.png"
            alt="Leaf"
          />
        </div>
      </section>
      {/* News Section End */}
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
export default Index;
