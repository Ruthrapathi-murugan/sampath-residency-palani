import React from "react";
import Heading from "../components/common/Heading";
import CommonHeading from "../components/common/CommonHeading";
import { contact } from "../components/data/Data";

export default function Contact() {
  return (
    <>
      <Heading heading="Contact" title="Home" subtitle="Contact" />

      <div className="container-xxl py-5">
        <div className="container">
          <CommonHeading
            heading="Contact Us"
            subtitle="Contact "
            title="For Any Query"
          />
          <div className="row g-4">
            <div className="col-12">
              <div className="row gy-4">
                {contact.map((item, index) => (
                  <div className="col-md-4" key={index}>
                    <h6 className="section-title text-start text-primary text-uppercase">
                      {item.title}
                    </h6>
                    <div className="d-flex align-items-center mb-2">
                      {item.icon}
                      <div className="ms-2">
                        {/* Display single contact number */}
                        {item.contact && !Array.isArray(item.contact) && (
                          <a 
                            href={`tel:${item.contact.replace(/\s+/g, '')}`} 
                            className="text-decoration-none d-block"
                          >
                            {item.contact}
                          </a>
                        )}
                        
                        {/* Display multiple contact numbers */}
                        {Array.isArray(item.contacts) && item.contacts.map((number, numIndex) => (
                          <a
                            key={numIndex}
                            href={`tel:${number.replace(/\s+/g, '')}`}
                            className="text-decoration-none d-block"
                          >
                            {number}
                          </a>
                        ))}
                        
                        {/* Display email */}
                        {item.email && (
                          <a
                            href={`mailto:${item.email}`}
                            className="text-decoration-none d-block"
                          >
                            {item.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6 wow fadeIn" data-wow-delay="0.1s">
              <iframe
                className="position-relative rounded w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1004468.7649309416!2d76.37067524687498!3d10.444879299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9df4d869956d7%3A0xcba27d0cdf7bf7f!2sSampath%20Residency!5e0!3m2!1sen!2sin!4v1736251180031!5m2!1sen!2sin"
                frameBorder="0"
                style={{ minHeight: "350px", border: "0" }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
            <div className="col-md-6">
              <div className="wow fadeInUp" data-wow-delay="0.2s">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="Your Name"
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Your Email"
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          placeholder="Subject"
                        />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          placeholder="Leave a message here"
                          id="message"
                          style={{ height: "150px" }}
                        ></textarea>
                        <label htmlFor="message">Message</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}