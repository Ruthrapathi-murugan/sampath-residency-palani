import React from "react";
import CommonHeading from "../common/CommonHeading";
import { services } from "../data/Data";
import { Link } from "react-router-dom";
import "../../css/style.css";

export default function Services() {
  return (
    <>
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <CommonHeading
              heading="Our Services"
              title="Services"
              subtitle="Explore Our"
            />
            <p className="text-muted mt-3">
              Experience world-class hospitality with our comprehensive range of services designed for your comfort
            </p>
          </div>

          <div className="row g-4 mt-4">
            {services.map((item, index) => (
              <div 
                key={index}
                className="col-lg-4 col-md-6 wow fadeInUp" 
                data-wow-delay={`${0.1 + index * 0.1}s`}
              >
                <Link to={item.path} className="service-card-link">
                  <div className="service-card h-100 rounded shadow-sm hover-shadow-lg transition-all">
                    <div className="service-card-header">
                      <div className="service-icon-wrapper">
                        <div className="service-icon">
                          {item.icon}
                        </div>
                      </div>
                    </div>

                    <div className="service-card-body">
                      <h5 className="service-card-title mb-3">
                        {item.name}
                      </h5>
                      <p className="service-card-description text-muted mb-0">
                        {item.discription}
                      </p>
                    </div>

                    <div className="service-card-footer">
                      <span className="read-more-btn">
                        Learn More <i className="fa fa-arrow-right ms-2"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Services Features Section */}
          <div className="row g-4 mt-5">
            <div className="col-lg-12">
              <h3 className="text-center mb-5">Why Choose Our Services?</h3>
            </div>
            <div className="col-md-3 wow fadeInUp">
              <div className="feature-box text-center">
                <div className="feature-icon">
                  <i className="fa fa-clock fa-3x text-primary"></i>
                </div>
                <h5 className="mt-3">24/7 Available</h5>
                <p className="text-muted small">Round-the-clock service for your convenience</p>
              </div>
            </div>
            <div className="col-md-3 wow fadeInUp" data-wow-delay="0.1s">
              <div className="feature-box text-center">
                <div className="feature-icon">
                  <i className="fa fa-user-check fa-3x text-primary"></i>
                </div>
                <h5 className="mt-3">Professional Staff</h5>
                <p className="text-muted small">Trained and courteous service professionals</p>
              </div>
            </div>
            <div className="col-md-3 wow fadeInUp" data-wow-delay="0.2s">
              <div className="feature-box text-center">
                <div className="feature-icon">
                  <i className="fa fa-shield-alt fa-3x text-primary"></i>
                </div>
                <h5 className="mt-3">Safe & Secure</h5>
                <p className="text-muted small">Your safety and privacy are our priority</p>
              </div>
            </div>
            <div className="col-md-3 wow fadeInUp" data-wow-delay="0.3s">
              <div className="feature-box text-center">
                <div className="feature-icon">
                  <i className="fa fa-star fa-3x text-primary"></i>
                </div>
                <h5 className="mt-3">Premium Quality</h5>
                <p className="text-muted small">Top-notch service standards always maintained</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
