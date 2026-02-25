import React, { useState } from "react";
import CommonHeading from "../common/CommonHeading";
import { facility, roomItems } from "../data/Data";
import { Link } from "react-router-dom";

export default function Rooms() {
  const [sortBy, setSortBy] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");
  const [comparisonList, setComparisonList] = useState([]);

  // Filter rooms by price
  const filterByPrice = (rooms) => {
    switch (priceFilter) {
      case "budget":
        return rooms.filter((r) => r.priceNumeric < 3000);
      case "mid":
        return rooms.filter((r) => r.priceNumeric >= 3000 && r.priceNumeric < 4000);
      case "premium":
        return rooms.filter((r) => r.priceNumeric >= 4000);
      default:
        return rooms;
    }
  };

  // Sort rooms
  const sortRooms = (rooms) => {
    const sorted = [...rooms];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.priceNumeric - b.priceNumeric);
      case "price-high":
        return sorted.sort((a, b) => b.priceNumeric - a.priceNumeric);
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  // Apply filters and sorting
  let filteredRooms = filterByPrice(roomItems);
  filteredRooms = sortRooms(filteredRooms);

  const toggleComparison = (roomId) => {
    if (comparisonList.includes(roomId)) {
      setComparisonList(comparisonList.filter((id) => id !== roomId));
    } else {
      if (comparisonList.length < 3) {
        setComparisonList([...comparisonList, roomId]);
      } else {
        alert("You can compare up to 3 rooms at a time");
      }
    }
  };

  const comparisonRooms = roomItems.filter((r) => comparisonList.includes(r.id));

  return (
    <>
      <div className="container-xxl py-5">
        <div className="container">
          <CommonHeading
            heading="Our Rooms"
            title="Rooms"
            subtitle="Explore Our"
          />

          {/* Filter & Sort Section - MakeMyTrip Style */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">🔍 Filter by Price</label>
                  <select
                    className="form-select"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">💰 Budget (Under ₹3000)</option>
                    <option value="mid">💳 Mid-Range (₹3000 - ₹4000)</option>
                    <option value="premium">👑 Premium (₹4000+)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">📊 Sort By</label>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="price-low">💹 Price: Low to High</option>
                    <option value="price-high">💹 Price: High to Low</option>
                    <option value="name">🔤 Room Name (A-Z)</option>
                    <option value="rating">⭐ Rating</option>
                  </select>
                </div>
              </div>

              {/* Comparison Tool */}
              {comparisonList.length > 0 && (
                <div className="mt-3 p-2 bg-light border rounded">
                  <small className="text-muted">
                    <strong>📋 Comparing {comparisonList.length} room(s)</strong>
                    <button
                      className="btn btn-sm btn-warning ms-2"
                      onClick={() => {
                        // Show comparison modal
                        alert("Comparison:\n\n" +
                          comparisonRooms
                            .map((r) => `${r.name} - ₹${r.price}/night`)
                            .join("\n")
                        );
                      }}
                    >
                      🔄 Compare
                    </button>
                    <button
                      className="btn btn-sm btn-secondary ms-2"
                      onClick={() => setComparisonList([])}
                    >
                      ✕ Clear
                    </button>
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Room Results Count */}
          <div className="mb-3">
            <p className="text-muted">
              Showing <strong>{filteredRooms.length}</strong> of{" "}
              <strong>{roomItems.length}</strong> rooms
            </p>
          </div>

          {/* Room Cards Grid */}
          <div className="row g-4">
            {filteredRooms.map((item, key) => (
              <div key={key} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div className="room-item shadow rounded overflow-hidden">
                  <div className="position-relative">
                    <img className="img-fluid" src={item.img} alt={item.name} />
                    <small className="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">
                      {item.price}
                    </small>

                    {/* Comparison Checkbox */}
                    <div className="position-absolute top-0 end-0 p-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={comparisonList.includes(item.id)}
                        onChange={() => toggleComparison(item.id)}
                        title="Add to comparison"
                      />
                    </div>
                  </div>

                  <div className="p-4 mt-2">
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <h5 className="mb-1">{item.name}</h5>
                        {item.rating && (
                          <small className="text-warning">
                            ⭐ {item.rating}/5.0
                          </small>
                        )}
                      </div>
                      <div className="ps-2">{item.star}</div>
                    </div>

                    {/* Amenities */}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {item.amenities?.slice(0, 3).map((amenity, idx) => (
                        <small key={idx} className="badge bg-light text-dark">
                          {amenity}
                        </small>
                      ))}
                      {item.amenities?.length > 3 && (
                        <small className="badge bg-light text-dark">
                          +{item.amenities.length - 3} more
                        </small>
                      )}
                    </div>

                    <p className="text-body mb-3">{item.description}</p>

                    {/* Room Details */}
                    {item.amenities && (
                      <div className="d-flex mb-3 gap-3">
                        {item.amenities.slice(0, 2).map((amenity, index) => (
                          <small key={index} className="text-muted">
                            ✓ {amenity}
                          </small>
                        ))}
                      </div>
                    )}

                    {/* Pricing Info */}
                    <div className="bg-light p-2 rounded mb-3">
                      <small className="text-muted d-block">Per Night</small>
                      <h6 className="mb-0">{item.price}</h6>
                    </div>

                    <div className="d-flex justify-content-between gap-2">
                      <Link
                        className="btn btn-sm btn-primary rounded py-2 px-3"
                        to={`/room/${item.id}`}
                      >
                        👁️ View Details
                      </Link>
                      <Link
                        className="btn btn-sm btn-success rounded py-2 px-3"
                        to={`/room/${item.id}?book=true`}
                      >
                        🛏️ Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredRooms.length === 0 && (
            <div className="alert alert-info text-center mt-4">
              <h5>No rooms match your filters</h5>
              <p>Try adjusting your price range or sorting preferences</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
