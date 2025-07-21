import Link from "next/link";
import ClientLogoSlider from "../src/components/ClientLogoSlider";
import FeedbackTwoSlider from "../src/components/FeedbackTwoSlider";
import PageBanner from "../src/components/PageBanner";
import ExperienceTeam from "../src/components/slider/ExperienceTeam";
import PhotoGallery from "../src/components/slider/PhotoGallery";
import Layout from "../src/layout/Layout";
const About = () => {
  return (
    <Layout>
      <PageBanner pageName={"about us"} />
      {/* Page Banner End */}
      {/* About Section Start */}
      <section className="about-page-section rel z-1 py-130 rpy-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-three-content rmb-35 wow fadeInLeft delay-0-2s">
                <div className="section-title mb-20">
                  <span className="sub-title mb-20">About Us</span>
                  <h2>Bringing Authentic South Indian Flavors to Your Home</h2>
                </div>
                <p>
                At Sri Ayini, we are passionate about preserving the rich culinary traditions of South India. Our homemade Sambar and Kulambu Milagai Podi are crafted with love, ensuring that every meal you prepare is infused with the true essence of South Indian flavors.
                </p>
                {/* <div className="row mt-30">
                  <div className="col-md-6">
                    <div className="about-feature-two">
                      <div className="icon">
                        <i className="flaticon-wheat-sack" />
                      </div>
                      <h4>
                        <Link legacyBehavior href="/service-details">
                          Agriculture &amp; Foods
                        </Link>
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="about-feature-two">
                      <div className="icon">
                        <i className="flaticon-fruits" />
                      </div>
                      <h4>
                        <Link legacyBehavior href="/service-details">
                          Vegetables &amp; Fruits
                        </Link>
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="about-feature-two">
                      <div className="icon">
                        <i className="flaticon-eggs-1" />
                      </div>
                      <h4>
                        <Link legacyBehavior href="/service-details">
                          Farming products
                        </Link>
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="about-feature-two">
                      <div className="icon">
                        <i className="flaticon-social-care" />
                      </div>
                      <h4>
                        <Link legacyBehavior href="/service-details">
                          Crisp Bread &amp; Cake’s
                        </Link>
                      </h4>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col-lg-6 text-lg-right">
              <div className="about-video wow fadeInRight delay-0-2s">
                <img
                  className="image"
                  src="assets/images/about/masala powder.jpg"
                  alt="About"
                />
                {/* <a
                  href="https://www.youtube.com/watch?v=9Y7ma241N8k"
                  className="mfp-iframe video-play"
                >
                  <i className="fas fa-play" />
                </a> */}
                <img
                  className="bg-shape"
                  src="assets/images/about/about-bg-shape.png"
                  alt="Shape"
                />
              </div>
            </div>
          </div>
        </div>
        <img
          src="assets/images/shapes/about-page.png"
          alt="Shape"
          className="shape"
        />
      </section>
      {/* About Section End */}
      {/* Features Section Start */}
      <section className="feature-section pb-100 rpb-70 rel z-1">
        <div className="container">
          <h2>Our Story</h2>
          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="feature-item wow fadeInUp delay-0-2s">
                <div className="content">
                  <span className="number">01</span>
                  {/* <div className="image">
                    <img
                      src="assets/images/features/feature1.png"
                      alt="Feature"
                    />
                  </div> */}
                  <h4>Homemade Goodness</h4>
                  <p>
                  Every batch of our Sambar/Kulambu Milagai Podi is carefully crafted at home with love and tradition. We ensure the finest quality, maintaining the authentic taste of South Indian cuisine.
                  </p>
                </div>
                {/* <Link legacyBehavior href="/service-details">
                  <a className="read-more">
                    Read More <i className="fas fa-angle-double-right" />
                  </a>
                </Link> */}
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="feature-item color-two wow fadeInUp delay-0-4s">
                <div className="content">
                  <span className="number">02</span>
                  {/* <div className="image">
                    <img
                      src="assets/images/features/feature2.png"
                      alt="Feature"
                    />
                  </div> */}
                  <h4>No Preservatives & Additives</h4>
                  <p>
                  Our spice powders are 100% pure, made with natural ingredients, and completely free from preservatives and artificial additives—just like how it’s made in traditional kitchens.
                  </p>
                </div>
                {/* <Link legacyBehavior href="/service-details">
                  <a className="read-more">
                    Read More <i className="fas fa-angle-double-right" />
                  </a>
                </Link> */}
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="feature-item color-three wow fadeInUp delay-0-6s">
                <div className="content">
                  <span className="number">03</span>
                  {/* <div className="image">
                    <img
                      src="assets/images/features/feature3.png"
                      alt="Feature"
                    />
                  </div> */}
                  <h4>Authentic South Indian Taste</h4>
                  <p>
                  Bringing you the essence of home-cooked flavors, our Sambar/Kulambu Milagai Podi is prepared using age-old recipes passed down through generations. Experience the rich, aromatic taste of South Indian cuisine in every spoonful.
                  </p>
                </div>
                {/* <Link legacyBehavior href="/service-details">
                  <a className="read-more">
                    Read More <i className="fas fa-angle-double-right" />
                  </a>
                </Link> */}
              </div>
            </div>
                        <div className="col-xl-3 col-md-6">
              <div className="feature-item color-three wow fadeInUp delay-0-6s">
                <div className="content">
                  <span className="number">04</span>
                  {/* <div className="image">
                    <img
                      src="assets/images/features/feature3.png"
                      alt="Feature"
                    />
                  </div> */}
                  <h4>Handpicked Spices</h4>
                  <p>
                  We source only the finest quality spices from trusted farms, ensuring freshness and rich flavors. Every ingredient is carefully selected and blended to bring out the best in your dishes.


                  </p>
                </div>
                {/* <Link legacyBehavior href="/service-details">
                  <a className="read-more">
                    Read More <i className="fas fa-angle-double-right" />
                  </a>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section End */}
      {/* Gallery Area Start */}
      {/* <section className="gallery-area">
        <PhotoGallery noHeader />
      </section> */}
      {/* Gallery Area End */}
      {/* Team Area Start */}
      {/* <section className="team-area pt-50 rpt-20 pb-95 rpb-65">
        <div className="container">
          <ExperienceTeam />
        </div>
      </section> */}
      {/* Team Area End */}
      {/* About Section Start */}

      <section className="about-page-section rel z-1 py-130 rpy-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-three-content rmb-35 wow fadeInLeft delay-0-2s">
                <div className="section-title mb-20">
                  <span className="sub-title mb-20">Join Our Journey</span>
                </div>
                <p>
                We invite you to experience the magic of our homemade Sambar & Kulambu Milagai Podi. Whether you’re a home cook or a food enthusiast, our spice blends will elevate your meals with a touch of tradition and nostalgia.
                </p>
                
              </div>
            </div>
            <div className="col-lg-6 text-lg-right">
              <div className="about-video wow fadeInRight delay-0-2s">
                <img
                  className="image"
                  src="assets/images/about/masala powder2.jpg"
                  alt="About"
                />
                {/* <a
                  href="https://www.youtube.com/watch?v=9Y7ma241N8k"
                  className="mfp-iframe video-play"
                >
                  <i className="fas fa-play" />
                </a> */}
                <img
                  className="bg-shape"
                  src="assets/images/about/about-bg-shape.png"
                  alt="Shape"
                />
              </div>
            </div>
          </div>
        </div>
        <img
          src="assets/images/shapes/about-page.png"
          alt="Shape"
          className="shape"
        />
      </section>


      <section className="about-section-two rel z-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="about-two-image not-rounded wow fadeInUp delay-0-2s">
                <img
                  className="image"
                  src="assets/images/about/masala powder3.jpg"
                  alt="About"
                />
                <img
                  className="about-over"
                  src="assets/images/about/about-left-over.png"
                  alt="About"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-two-content pt-60 wow fadeInUp delay-0-4s">
                <div className="section-title mb-35">
                  <span className="sub-title mb-20">Why Choose Us</span>
                  <h2>Special Care For Our Every Food</h2>
                </div>
                <div className="about-features mt-60">
                  <div className="row">
                    <div className="col-xl-3 col-md-6">
                      <div className="about-feature-item wow fadeInUp delay-0-5s">
                        <span className="number">1</span>
                        <div className="icon">
                          <i className="flaticon-offer" />
                        </div>
                        <h4>
                          <Link legacyBehavior href="/service-details">
                          Homemade Goodness
                          </Link>
                        </h4>
                        <p>Every batch is freshly made with care.</p>
                        <img src="assets/images/about/arrow.png" alt="Arrow" />
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <div className="about-feature-item wow fadeInUp delay-0-6s">
                        <span className="number">2</span>
                        <div className="icon">
                          <i className="flaticon-return-box" />
                        </div>
                        <h4>
                          <Link legacyBehavior href="/service-details">
                          No Preservatives & Additives
                          </Link>
                        </h4>
                        <p>100% pure, natural ingredients.</p>
                        <img src="assets/images/about/arrow.png" alt="Arrow" />
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <div className="about-feature-item wow fadeInUp delay-0-7s">
                        <span className="number">3</span>
                        <div className="icon">
                          <i className="flaticon-24-hours" />
                        </div>
                        <h4>
                          <Link legacyBehavior href="/service-details">
                          Authentic South Indian Taste
                          </Link>
                        </h4>
                        <p>Traditional recipes for rich, flavorful curries.</p>
                        <img src="assets/images/about/arrow.png" alt="Arrow" />
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <div className="about-feature-item wow fadeInUp delay-0-7s">
                        <span className="number">4</span>
                        <div className="icon">
                          <i className="flaticon-24-hours" />
                        </div>
                        <h4>
                          <Link legacyBehavior href="/service-details">
                          Handpicked Spices
                          </Link>
                        </h4>
                        <p>Sourced from trusted farms to ensure freshness and quality.</p>
                        <img src="assets/images/about/arrow.png" alt="Arrow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="about-shapes">
          <img src="assets/images/shapes/about-shape1.png" alt="Shape" />
          <img src="assets/images/shapes/about-shape2.png" alt="Shape" />
        </div>
      </section>
      {/* About Section End */}
      {/* Feedback Section Start */}
      {/* <section className="feedback-section pt-100 rpt-70 pb-130 rpb-100">
        <div className="container">
          <div className="section-title text-center mb-60">
            <span className="sub-title mb-20">Customer Reviews</span>
            <h2>Valuable Customer’s Feedback</h2>
          </div>
        </div>
        <FeedbackTwoSlider />
      </section> */}
      {/* Feedback Section End */}
      {/* Client Logo Section Start */}
      <div className="client-logo-section text-center bg-light-green py-60">
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
      </div>
    </Layout>
  );
};
export default About;
