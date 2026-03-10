import Link from "next/link";
import { Fragment } from "react";
import Slider from "react-slick";
import { clientLogo } from "../sliderProps";
const ClientLogoSlider = () => {
  return (
    <Fragment>
      <Slider {...clientLogo} className="client-logo-wrap">
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
        <div className="client-logo-item">
          <Link legacyBehavior href="/contact">
            <a>
              <img
                src="assets/images/logos/logo.png"
                alt="Client Logo"
              />
            </a>
          </Link>
        </div>
      </Slider>
    </Fragment>
  );
};
export default ClientLogoSlider;
