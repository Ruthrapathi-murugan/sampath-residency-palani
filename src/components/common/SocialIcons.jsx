import React from "react";
import { socialIcons } from "../data/Data";

export default function SocialIcons() {
  return (
    <div className="col-lg-3 px-5">
      <div className="d-inline-flex align-items-center py-2">
        {socialIcons.map((val, index) => (
          <a
            key={index}
            href={val.url}
            className="me-3"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="social media link"
          >
            {val.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
