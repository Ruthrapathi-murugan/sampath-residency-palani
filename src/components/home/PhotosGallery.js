import React from "react";
import { photos } from "../data/Data"; // Correct path to data.js


export default function PhotosGallery() {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title text-center text-primary text-uppercase">
            Photos
          </h6>
          <h1 className="mb-5">Explore Our Gallery</h1>
        </div>
        <div className="row g-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-5 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="photo-item rounded overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="img-fluid"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
