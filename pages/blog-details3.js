import Link from "next/link";
import Slider from "react-slick";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { newsSlider } from "../src/sliderProps";

const BlogDetails3 = () => {
  return (
    <Layout>
      <PageBanner pageName={"The Health Benefits of Moringa Powder in Tamil Cooking"} />
      <section className="news-details-page rel z-1 pt-65 rpt-35 pb-130 rpb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 mt-65">
              <div className="blog-details-content">
                <ul className="blog-meta">
                  <li>
                    <i className="far fa-calendar-alt" />
                    <a href="#">July 8, 2025</a>
                  </li>
                  <li>
                    <i className="far fa-comment-dots" />
                    <a href="#">Comments (98)</a>
                  </li>
                </ul>
                <h3 className="title">
                  The Health Benefits of Moringa Powder in Tamil Cooking
                </h3>
                <div className="image my-35">
                  <img src="/assets/images/news/blog-details.jpg" alt="Blog" />
                </div>
                <p>
                  Moringa powder, known locally as <strong>Murungai Keerai Podi</strong>, is a powerhouse of nutrition deeply rooted in Tamil households. More than just a health supplement, it has been used traditionally in everyday dishes — blending wellness with taste.
                </p>

                <h4>1. Packed with Nutrients</h4>
                <p>
                  Moringa leaves are rich in <strong>iron, calcium, vitamins A, C, and E</strong>. Just a spoonful of moringa powder added to your meal can help support immunity, bone strength, and energy levels — naturally and effectively.
                </p>

                <h4>2. Improves Digestion</h4>
                <p>
                  In Tamil cooking, moringa powder is often mixed with rice and ghee or added to chutneys. Its <strong>high fiber content</strong> aids digestion and supports a healthy gut, making it perfect for everyday meals.
                </p>

                <h4>3. Helps Regulate Blood Sugar</h4>
                <p>
                  Studies show that moringa helps <strong>lower blood sugar levels</strong>. Including it in Tamil dishes like keerai kootu or podi varieties can be a simple way to support diabetic-friendly diets.
                </p>

                <h4>4. Anti-Inflammatory Properties</h4>
                <p>
                  Moringa contains <strong>powerful antioxidants and anti-inflammatory compounds</strong>. It helps reduce inflammation, which is at the root of many chronic illnesses — all while enhancing the flavor of everyday Tamil foods.
                </p>

                <h4>5. Enhances Skin and Hair Health</h4>
                <p>
                  The presence of Vitamin E and Omega-3s in moringa supports <strong>healthy skin, shiny hair, and reduced hair fall</strong>. It’s no wonder our grandmothers always said, “Murungai Keerai is beauty food!”
                </p>

                <h4>How to Use It in Cooking</h4>
                <p>
                  Add moringa powder to <strong>poriyal, rasam, idli podi, or even chapati dough</strong>. You can also blend it into buttermilk or sprinkle it over salads. It’s an easy way to upgrade any meal with a nutritional punch.
                </p>

                <h4>Final Thoughts</h4>
                <p>
                  Moringa powder is not a new trend — it’s a time-tested superfood from our Tamil kitchens. By adding a pinch of this green gold into daily recipes, we carry forward our tradition of using food as medicine.
                </p>

                <blockquote>
                  “Murungai Keerai podi is more than a spice — it’s a healing tradition on every Tamil plate.”
                </blockquote>

                <p>
                  Bring this humble leaf into your modern kitchen, and let your family enjoy both flavor and health the way our ancestors did.
                </p>

                <div className="tag-share mt-35 pt-20 pb-10 mb-55">
                  <div className="tags">
                    <h6>Popular Tags : </h6>
                    <Link legacyBehavior href="/blog-grid">Moringa</Link>
                    <Link legacyBehavior href="/blog-grid">Tamil Cooking</Link>
                    <Link legacyBehavior href="/blog-grid">Healthy Food</Link>
                  </div>
                  <div className="social-style-one">
                    <h6>Share Blog : </h6>
                    <Link legacyBehavior href="/contact"><a><i className="fab fa-facebook-f" /></a></Link>
                    <Link legacyBehavior href="/contact"><a><i className="fab fa-twitter" /></a></Link>
                    <Link legacyBehavior href="/contact"><a><i className="fab fa-youtube" /></a></Link>
                    <Link legacyBehavior href="/contact"><a><i className="fab fa-instagram" /></a></Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-xl-4 col-lg-6 col-md-8">
              <div className="blog-sidebar mt-65">
                <div className="widget widget-about wow fadeInUp delay-0-2s">
                  <div className="image">
                    <img src="/assets/images/widgets/about.jpg" alt="Author" />
                  </div>
                  <h4>Sri Ayini</h4>
                  <span className="sub-title">Homemade Foods</span>
                  <p>
                    We use ancient Tamil recipes with locally sourced moringa leaves to make nutrient-rich podi — made fresh, made clean.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogDetails3;
