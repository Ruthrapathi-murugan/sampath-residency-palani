import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

export default function Book() {
  // State for check-in and check-out dates
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  return (
    <div className="container-fluid booking pb-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="container">
        <div className="bg-white shadow" style={{ padding: "35px" }}>
          <div className="row g-2">
            <div className="col-md-10">
              <div className="row g-2">
                {/* Check-in Date Picker */}
                <div className="col-md-3">
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    className="form-control"
                    placeholderText="Check-in"
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()} // Prevent past dates
                  />
                </div>

                {/* Check-out Date Picker */}
                <div className="col-md-3">
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    className="form-control"
                    placeholderText="Check-out"
                    dateFormat="dd/MM/yyyy"
                    minDate={checkIn || new Date()} // Ensure check-out is after check-in
                  />
                </div>

                {/* Adults Dropdown */}
                <div className="col-md-3">
                  <select className="form-select">
                    <option selected>Adult</option>
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                    <option value="4">4 Adults</option>
                    <option value="5">5 Adults</option>
                  </select>
                </div>

                {/* Children Dropdown */}
                <div className="col-md-3">
                  <select className="form-select">
                    <option selected>Child</option>
                    <option value="1">1 Child</option>
                    <option value="2">2 Children</option>
                    <option value="3">3 Children</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-md-2">
            <Link to="/rooms">
              <button className="btn btn-primary w-100">Submit</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
