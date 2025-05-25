import React, { useState } from "react";
import { Link } from "react-router-dom";
import { navList } from "../data/Data";
import SocialIcons from "./SocialIcons";

export default function Header() {
  const [navbarCollapse, setNavbarCollapse] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (itemId) => {
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleToggle = () => {
    setNavbarCollapse((prevState) => !prevState);
  };

  const closeNavbar = () => {
    setNavbarCollapse(false);
  };

  return (
    <>
      <div className="container-fluid bg-dark px-0">
        <div className="row gx-0">
          <div className="col-lg-3 bg-dark d-none d-lg-block">
            <Link
              to="/"
              className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center"
            >
              <h4 className="m-0 text-primary text-uppercase d-flex align-items-center">
                <img
                  src="/assets/img/logo.jpg"
                  alt="Sampath Residency Logo"
                  className="img-fluid"
                  style={{ maxHeight: "50px", marginRight: "10px" }}
                />
                Sampath Residency
              </h4>
            </Link>
          </div>
          <div className="col-lg-9">
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0">
              <Link to="/" className="navbar-brand d-block d-lg-none">
                <h3 className="m-0 text-primary text-uppercase d-flex align-items-center">
                  <img
                    src="/assets/img/logo.jpg"
                    alt="Sampath Residency Logo"
                    className="img-fluid"
                    style={{ maxHeight: "30px", marginRight: "10px" }}
                  />
                  Sampath Residency
                </h3>
              </Link>
              <button
                type="button"
                className="navbar-toggler"
                onClick={handleToggle}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className={`navbar-collapse justify-content-around ${
                  navbarCollapse ? "show" : "collapse"
                }`}
              >
                <div className="navbar-nav mr-auto py-0">
                  {navList.map((item, index) => (
                    <div key={index} className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(item.id)} onMouseLeave={handleMouseLeave}>
                      {item.subItems ? (
                        <>
                          <Link className="nav-link dropdown-toggle" to="#">
                            {item.text}
                          </Link>
                          <div className={`dropdown-menu rounded-0 m-0 ${
                            activeDropdown === item.id ? "show" : ""
                          }`}>
                            {item.subItems.map((sub, subIndex) => (
                              <Link
                                key={subIndex}
                                to={sub.path}
                                className="dropdown-item"
                                onClick={closeNavbar}
                              >
                                {sub.text}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          className="nav-link"
                          onClick={closeNavbar}
                        >
                          {item.text}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <SocialIcons />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
