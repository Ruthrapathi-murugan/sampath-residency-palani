import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { carouselData } from "../data/Data";

export default function Carousel() {
  const sliderRef = useRef(null);

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // We'll use our custom arrows
    fade: true, // Optional: for fade effect
    autoplay: true, // Optional: auto-rotate slides
    autoplaySpeed: 3000, // Optional: time between slides
  };

  return (
    <div className="container-fluid p-0 mb-5 position-relative">
      <Slider ref={sliderRef} {...settings}>
        {carouselData.map((val, index) => (
          <div key={index}>
            <div className="position-relative">
              <img 
                className="w-100" 
                src={val.img} 
                alt="Image" 
                style={{ height: "600px", objectFit: "cover" }} 
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <div className="text-center p-3" style={{ maxWidth: "1000px" }}>
                  <h6 className="section-title text-white text-uppercase mb-3 animated slideInDown">
                    {val.subtitle}
                  </h6>
                  <h1 className="display-3 text-white mb-4 animated slideInDown">
                    {val.title}
                  </h1>
                  <a
                    href="/rooms"
                    className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft"
                  >
                    {val.btn1}
                  </a>
                  <a
                    href="/rooms"
                    className="btn btn-light py-md-3 px-md-5 animated slideInRight"
                  >
                    {val.btn2}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      
      {/* Custom arrows */}
      <button
        className="position-absolute top-50 start-0 translate-middle-y btn btn-link text-white"
        type="button"
        onClick={previous}
        style={{ zIndex: 1, left: "20px" }}
      >
        <i className="bi bi-chevron-left fs-1"></i>
      </button>
      <button
        className="position-absolute top-50 end-0 translate-middle-y btn btn-link text-white"
        type="button"
        onClick={next}
        style={{ zIndex: 1, right: "20px" }}
      >
        <i className="bi bi-chevron-right fs-1"></i>
      </button>
    </div>
  );
}