import Link from "next/link";
import PageBanner from "../src/components/PageBanner";
import Pagination from "../src/components/Pagination";
import Layout from "../src/layout/Layout";

const BlogStandard = () => {
  return (
    <Layout>
      <PageBanner pageName={"Sri Ayini Blog"} />
      <section className="news-standard-page rel z-1 pt-65 rpt-35 pb-130 rpb-100">
        <div className="container">
          <div className="row">
            {/* Blog Items */}
            <div className="col-xl-8 mt-65">
              {/* Blog Post 1 */}
              <div className="news-standard-item wow fadeInUp delay-0-2s">
                <div className="image">
                  <img src="assets/images/news/blog-standard1.jpg" alt="Sambar Powder" />
                </div>
                <div className="content">
                  <ul className="blog-meta">
                    <li><i className="far fa-calendar-alt" /> <a href="#">July 5, 2025</a></li>
                    <li><i className="far fa-comment-dots" /> <a href="#">Comments (24)</a></li>
                  </ul>
                  <h4>
                    <Link legacyBehavior href="/blog-details1">
                      <a>Why Homemade Sambar Powder Tastes Better Than Store-Bought</a>
                    </Link>
                  </h4>
                  <p>Discover why our grandmothers’ sambar powder recipes still stand the test of time — richer aroma, purer ingredients, and love in every spoon.</p>
                  <Link legacyBehavior href="/blog-details1">
                    <a className="read-more">Read More <i className="fas fa-angle-double-right" /></a>
                  </Link>
                </div>
              </div>

              {/* Blog Post 2 */}
              <div className="news-standard-item wow fadeInUp delay-0-2s">
                <div className="image">
                  <img src="assets/images/news/blog-standard2.jpg" alt="Moringa Powder" />
                </div>
                <div className="content">
                  <ul className="blog-meta">
                    <li><i className="far fa-calendar-alt" /> <a href="#">July 6, 2025</a></li>
                    <li><i className="far fa-comment-dots" /> <a href="#">Comments (18)</a></li>
                  </ul>
                  <h4>
                    <Link legacyBehavior href="/blog-details3">
                      <a>The Health Benefits of Moringa Powder in Tamil Cooking</a>
                    </Link>
                  </h4>
                  <p>Loaded with nutrients and tradition, Moringa is a hidden gem in Tamil kitchens. Here’s why your family should have it regularly.</p>
                  <Link legacyBehavior href="/blog-details3">
                    <a className="read-more">Read More <i className="fas fa-angle-double-right" /></a>
                  </Link>
                </div>
              </div>

              {/* Blog Post 3 */}
              <div className="news-standard-item wow fadeInUp delay-0-2s">
                <div className="image">
                  <img src="assets/images/news/blog-standard3.jpg" alt="Powder Storage" />
                </div>
                <div className="content">
                  <ul className="blog-meta">
                    <li><i className="far fa-calendar-alt" /> <a href="#">July 7, 2025</a></li>
                    <li><i className="far fa-comment-dots" /> <a href="#">Comments (15)</a></li>
                  </ul>
                  <h4>
                    <Link legacyBehavior href="/blog-details4">
                      <a>How to Store Homemade Powders to Keep Them Fresh for Months</a>
                    </Link>
                  </h4>
                  <p>Learn the best traditional storage tips to lock in flavor and freshness for your sambar and kulambu podi without preservatives.</p>
                  <Link legacyBehavior href="/blog-details4">
                    <a className="read-more">Read More <i className="fas fa-angle-double-right" /></a>
                  </Link>
                </div>
              </div>

              {/* Pagination */}
              <ul className="pagination flex-wrap pt-10">
                <Pagination paginationCls={".news-standard-item"} defaultSort={3} />
              </ul>
            </div>

            {/* Sidebar */}
            <div className="col-xl-4 col-lg-6 col-md-8">
              <div className="blog-sidebar mt-65">
                {/* Author Widget */}
                <div className="widget widget-about wow fadeInUp delay-0-2s">
                  <div className="image">
                    <img src="assets/images/widgets/about.jpg" alt="Sri Ayini" />
                  </div>
                  <h4>Sri Ayini</h4>
                  <span className="sub-title">Homemade Foods</span>
                  <p>
                    We make Sambar/Kulambu milagai podi with love and care — no shortcuts, no preservatives — just grandma’s recipe passed down to your plate.
                  </p>
                  <div className="social-style-one">
                    <Link legacyBehavior href="/contact"><a><i className="fab fa-facebook-f" /></a></Link>
                    <Link legacyBehavior href="/contact"><a><i className="fab fa-twitter" /></a></Link>
                    <Link legacyBehavior href="/contact"><a><i className="fab fa-instagram" /></a></Link>
                    <Link legacyBehavior href="/contact"><a><i className="fab fa-youtube" /></a></Link>
                  </div>
                </div>

                {/* Categories Widget */}
                <div className="widget widget-menu wow fadeInUp delay-0-4s">
                  <h4 className="widget-title"><i className="flaticon-leaf-1" /> Categories</h4>
                  <ul>
                    <li><Link legacyBehavior href="/blog-grid">Homemade Powders</Link></li>
                    <li><Link legacyBehavior href="/blog-grid">Tamil Kitchen Tips</Link></li>
                    <li><Link legacyBehavior href="/blog-grid">Natural Ingredients</Link></li>
                    <li><Link legacyBehavior href="/blog-grid">Traditional Cooking</Link></li>
                  </ul>
                </div>

                {/* Recent Posts Widget */}
                <div className="widget widget-news wow fadeInUp delay-0-2s">
                  <h4 className="widget-title"><i className="flaticon-leaf-1" /> Recent Posts</h4>
                  <ul>
                    <li>
                      <div className="image"><img src="assets/images/news/news-widget1.jpg" alt="News" /></div>
                      <div className="content">
                        <h6>
                          <Link legacyBehavior href="/blog-details1">
                            Homemade vs Store-Bought Sambar Powder
                          </Link>
                        </h6>
                        <span className="name">By Sri Ayini</span>
                      </div>
                    </li>
                    <li>
                      <div className="image"><img src="assets/images/news/news-widget2.jpg" alt="News" /></div>
                      <div className="content">
                        <h6>
                          <Link legacyBehavior href="/blog-details3">
                            Moringa in South Indian Cooking
                          </Link>
                        </h6>
                        <span className="name">By Sri Ayini</span>
                      </div>
                    </li>
                    <li>
                      <div className="image"><img src="assets/images/news/news-widget3.jpg" alt="News" /></div>
                      <div className="content">
                        <h6>
                          <Link legacyBehavior href="/blog-details4">
                            Best Storage Tips for Podi
                          </Link>
                        </h6>
                        <span className="name">By Sri Ayini</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Tag Widget */}
                <div className="widget widget-tag-cloud wow fadeInUp delay-0-2s">
                  <h4 className="widget-title"><i className="flaticon-leaf-1" /> Popular Tags</h4>
                  <div className="tag-coulds">
                    <Link legacyBehavior href="/blog-grid">Podi</Link>
                    <Link legacyBehavior href="/blog-grid">Homemade</Link>
                    <Link legacyBehavior href="/blog-grid">Traditional</Link>
                    <Link legacyBehavior href="/blog-grid">Healthy Food</Link>
                    <Link legacyBehavior href="/blog-grid">Moringa</Link>
                    <Link legacyBehavior href="/blog-grid">Tamil Recipes</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogStandard;
