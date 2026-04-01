import Link from "next/link";
import { Fragment } from "react";
import munfirmSlider from "../munfirmSlider";
export const HomeSlider1 = () => {
  const { active, setActive } = munfirmSlider();
  return (
    <Fragment>
      <button
        className="slider-prev slick-arrow"
        onClick={() => setActive(active == 1 ? 2 : 1)}
      >
        <i className="fas fa-chevron-left" />
      </button>

      <div
        className={`slider-single-item slide-one hero-slide ${
          active == 1 ? "slick-active" : ""
        }`}
      >
        <div className="container hero-slide-container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="slider-content hero-copy">
                <h2 className="sub-title">Traditional & Pure</h2>
                <h3>The Heart of Authentic Spices</h3>
                <h6>Handcrafted blends that bring generations of flavor to your kitchen.</h6>
                <div className="slider-btns mt-30">
                  <Link legacyBehavior href="/product-details">
                    <a className="theme-btn style-two">
                      Shop Now <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="slider-images hero-visual-stage">
                <img
                  className="image hero-visual-image"
                  src="assets/images/slider/banner.png"
                  alt="Slider"
                />
                <img
                  className="offer hero-offer-badge"
                  src="assets/images/shapes/organic.png"
                  alt="Organic"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="slide-shapes hero-shapes">
          <img
            className="two-leaf hero-shape hero-shape-two-leaf"
            src="assets/images/slider/two-lear.png"
            alt="Leaf"
          />
          <img
            className="half-leaf hero-shape hero-shape-half-leaf"
            src="assets/images/slider/half-leaf.png"
            alt="Leaf"
          />
          <img
            className="leaf-one hero-shape hero-shape-leaf-one"
            src="assets/images/slider/leaf-1.png"
            alt="Leaf"
          />
          <img
            className="leaf-two hero-shape hero-shape-leaf-two"
            src="assets/images/slider/leaf-2.png"
            alt="Leaf"
          />
        </div>
      </div>
      
      <div
        className={`slider-single-item slide-two hero-slide hero-slide-alt ${
          active == 2 ? "slick-active" : ""
        }`}
      >
        <div className="container hero-slide-container">
          <div className="row align-items-center flex-row-reverse">
            <div className="col-lg-5">
              <div className="slider-content hero-copy">
                <h2 className="sub-title">100% Organic</h2>
                <h3>Grown with Love and Harvested with Care</h3>
                <h6>Experience the purity of nature in every flavorful bite.</h6>
                <div className="slider-btns mt-30">
                  <Link legacyBehavior href="/product-details">
                    <a className="theme-btn style-two">
                      Shop Now <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="slider-images hero-visual-stage">
                <img
                  className="image hero-visual-image"
                  src="assets/images/slider/banner2.png"
                  alt="Slider"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="slide-shapes hero-shapes">
          <img
            className="two-leaf hero-shape hero-shape-two-leaf"
            src="assets/images/slider/two-lear.png"
            alt="Leaf"
          />
          <img
            className="half-leaf hero-shape hero-shape-half-leaf"
            src="assets/images/slider/half-leaf.png"
            alt="Leaf"
          />
          <img
            className="leaf-one hero-shape hero-shape-leaf-one"
            src="assets/images/slider/leaf-1.png"
            alt="Leaf"
          />
          <img
            className="leaf-two hero-shape hero-shape-leaf-two"
            src="assets/images/slider/leaf-2.png"
            alt="Leaf"
          />
        </div>
      </div>

      <button
        className="slider-next slick-arrow"
        onClick={() => setActive(active == 2 ? 1 : 2)}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </Fragment>
  );
};
// export const HomeSlider2 = () => {
//   const { active, setActive } = munfirmSlider();
//   return (
//     <Fragment>
//       <button
//         className="slider-prev slick-arrow"
//         onClick={() => setActive(active == 1 ? 2 : 1)}
//       >
//         <i className="fas fa-chevron-left" />
//       </button>

//       <div
//         className={`slider-single-item style-two ${
//           active == 1 ? "slick-active" : ""
//         }`}
//       >
//         <div className="container">
//           <div className="row align-items-center">
//             <div className="col-lg-6">
//               <div className="slider-content">
//                 <div className="sub-title mb-20">Welcome to Munfirm</div>
//                 <h1>Organic Foods &amp; Vegetables</h1>
//                 <div className="slider-btns mt-30">
//                   <Link legacyBehavior href="/shop-grid">
//                     <a className="theme-btn style-two">
//                       Shop Now <i className="fas fa-angle-double-right" />
//                     </a>
//                   </Link>
//                   <Link legacyBehavior href="/about">
//                     <a className="theme-btn style-two">
//                       Learn More <i className="fas fa-angle-double-right" />
//                     </a>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-6">
//               <div className="slider-images">
//                 <img
//                   className="image"
//                   src="assets/images/slider/slider-two1.png"
//                   alt="Slider"
//                 />
//                 <img
//                   className="offer"
//                   src="assets/images/shapes/organic.png"
//                   alt="Organic"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div
//         className={`slider-single-item style-two ${
//           active == 2 ? "slick-active" : ""
//         }`}
//       >
//         <div className="container">
//           <div className="row align-items-center">
//             <div className="col-lg-6">
//               <div className="slider-content">
//                 <div className="sub-title mb-20">Welcome to Munfirm</div>
//                 <h1>Organic Foods &amp; Vegetables</h1>
//                 <div className="slider-btns mt-30">
//                   <Link legacyBehavior href="/about">
//                     <a className="theme-btn style-two">
//                       Learn More <i className="fas fa-angle-double-right" />
//                     </a>
//                   </Link>
//                   <Link legacyBehavior href="/shop-grid">
//                     <a className="theme-btn style-two">
//                       Shop Now <i className="fas fa-angle-double-right" />
//                     </a>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-6">
//               <div className="slider-images">
//                 <img
//                   className="image"
//                   src="assets/images/slider/slider-two3.png"
//                   alt="Slider"
//                 />
//                 <img
//                   className="offer"
//                   src="assets/images/shapes/organic.png"
//                   alt="Organic"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <button
//         className="slider-next slick-arrow"
//         onClick={() => setActive(active == 2 ? 1 : 2)}
//       >
//         <i className="fas fa-chevron-right" />
//       </button>
//     </Fragment>
//   );
// };
// export const HomeSlider3 = () => {
//   const { active, setActive } = munfirmSlider();
//   return (
//     <Fragment>
//       <button
//         className="slider-prev slick-arrow"
//         onClick={() => setActive(active == 1 ? 2 : 1)}
//       >
//         <i className="fas fa-chevron-left" />
//       </button>

//       <div
//         className={`slider-single-item style-three slide-one ${
//           active == 1 ? "slick-active" : ""
//         }`}
//       >
//         <div className="container-fluid">
//           <div className="row align-items-center">
//             <div className="col-xl-5">
//               <div className="slider-content">
//                 <div className="sub-title mb-20">Welcome to Munfirm</div>
//                 <h1>Organic Food &amp; Vegetables</h1>
//                 <p>
//                   On the other hand we denounce with righteou indignation and
//                   dislike men who are so beguiled and demoralized
//                 </p>
//                 <div className="slider-btns mt-20">
//                   <Link legacyBehavior href="/shop-grid">
//                     <a className="theme-btn style-two">
//                       Shop Now <i className="fas fa-angle-double-right" />
//                     </a>
//                   </Link>
//                   <Link legacyBehavior href="/about">
//                     <a className="theme-btn style-three">
//                       Learn More <i className="fas fa-angle-double-right" />
//                     </a>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-7 col-lg-9">
//               <div className="slider-images">
//                 <img
//                   className="image"
//                   src="assets/images/slider/slider-three-1.png"
//                   alt="Slider"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div
//         className={`slider-single-item style-three slide-two ${
//           active == 2 ? "slick-active" : ""
//         }`}
//       >
//         <div className="container-fluid">
//           <div className="row align-items-center">
//             <div className="col-xl-7 col-lg-9">
//               <div className="slider-images">
//                 <img
//                   className="image"
//                   src="assets/images/slider/slider-three-1.png"
//                   alt="Slider"
//                 />
//               </div>
//             </div>
//             <div className="col-xl-5">
//               <div className="slider-content">
//                 <div className="sub-title mb-20">Welcome to Munfirm</div>
//                 <h1>Organic Food &amp; Vegetables</h1>
//                 <p>
//                   On the other hand we denounce with righteou indignation and
//                   dislike men who are so beguiled and demoralized
//                 </p>
//                 <div className="slider-btns mt-20">
//                   <Link legacyBehavior href="/shop-grid">
//                     <a className="theme-btn style-two">
//                       Shop Now <i className="fas fa-angle-double-right" />
//                     </a>
//                   </Link>
//                   <Link legacyBehavior href="/about">
//                     <a className="theme-btn style-three">
//                       Learn More <i className="fas fa-angle-double-right" />
//                     </a>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <button
//         className="slider-next slick-arrow"
//         onClick={() => setActive(active == 2 ? 1 : 2)}
//       >
//         <i className="fas fa-chevron-right" />
//       </button>
//     </Fragment>
//   );
// };
export default HomeSlider1;
