import Link from "next/link";
const PageBanner = ({ pageName, pageTitle }) => {
  return (
    <section className="page-banner text-white py-100 rpy-80">
      <div 
        className="banner-bg-img" 
        style={{ backgroundImage: "url(assets/images/banner/banner.png)" }}
      ></div>
      <div className="banner-overlay"></div>
      
      {/* Decorative Floating Elements */}
      <div className="banner-floating-icons">
        <i className="fas fa-leaf icon-1"></i>
        <i className="fas fa-leaf icon-2"></i>
        <i className="fas fa-seedling icon-3"></i>
      </div>

      <div className="container">
        <div className="banner-inner banner-glass wow fadeIn" data-wow-duration="1.5s">
          <h1 className="page-title wow fadeInUp delay-0-2s">
            {pageTitle ? pageTitle : pageName}
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb banner-breadcrumb justify-content-center wow fadeInUp delay-0-4s">
              <li className="breadcrumb-item">
                <Link legacyBehavior href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li className="breadcrumb-item active">{pageName}</li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
};
export default PageBanner;
