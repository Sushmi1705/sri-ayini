import Link from "next/link";
import PageBanner from "../src/components/PageBanner";
import Pagination from "../src/components/Pagination";
import Layout from "../src/layout/Layout";

const BlogGrid = () => {
  return (
    <Layout>
      <PageBanner pageName="Ayini Blogs" />
      <section className="news-page-section rel z-1 py-130 rpy-100">
        <div className="container">
          <div className="row justify-content-center blog-grid">
            {[
              {
                img: "news1.jpg",
                date: "10",
                month: "Jul",
                category: "Spices",
                title: "Why Homemade Sambar Powder Tastes Better Than Store-Bought",
                link: "/blog-details1",
              },
              {
                img: "news2.jpg",
                date: "08",
                month: "Jul",
                category: "Usage Tips",
                title: "5 Easy Ways to Use Idli Podi Beyond Idli & Dosa",
                link: "/blog-details2",
              },
              {
                img: "news3.jpg",
                date: "05",
                month: "Jul",
                category: "Health",
                title: "The Health Benefits of Moringa Powder in Tamil Cooking",
                link: "/blog-details3",
              },
              {
                img: "news4.jpg",
                date: "01",
                month: "Jul",
                category: "Kitchen Tips",
                title: "How to Store Homemade Powders to Keep Them Fresh for Months",
                link: "/blog-details4",
              },
            ].map((blog, i) => (
              <div className="col-xl-4 col-md-6" key={i}>
                <div className={`news-item wow fadeInUp delay-0-${i + 2}s`}>
                  <div className="image">
                    <img
                      src={`assets/images/news/${blog.img}`}
                      alt={blog.title}
                    />
                    <span className="date">
                      <b>{blog.date}</b> {blog.month}
                    </span>
                  </div>
                  <div className="content">
                    <span className="sub-title">{blog.category}</span>
                    <h4>
                      <Link legacyBehavior href={blog.link}>
                        {blog.title}
                      </Link>
                    </h4>
                    <Link legacyBehavior href={blog.link}>
                      <a className="read-more">
                        Read More <i className="fas fa-angle-double-right" />
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ul className="pagination justify-content-center flex-wrap">
            <Pagination paginationCls=".blog-grid .col-xl-4" defaultSort={4} />
          </ul>
        </div>
        <div className="news-shapes">
          <img className="onion" src="assets/images/shapes/onion.png" alt="Onion" />
          <img className="two-leaf" src="assets/images/slider/two-lear.png" alt="Leaf" />
          <img className="leaf-left" src="assets/images/shapes/leaf-three.png" alt="Leaf" />
          <img className="leaf-two" src="assets/images/shapes/leaf-three.png" alt="Leaf" />
          <img className="leaf-three" src="assets/images/shapes/leaf-1.png" alt="Leaf" />
          <img className="litchi" src="assets/images/shapes/litchi.png" alt="Litchi" />
        </div>
      </section>
    </Layout>
  );
};

export default BlogGrid;
