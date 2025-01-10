import React from "react";
import { useParams } from "react-router-dom";
import { roomItems } from "../data/Data";


export default function RoomDetails() {
  const { id } = useParams(); // Match parameter name with route
  const room = roomItems.find((item) => item.id === parseInt(id));

  if (!room) {
    return (
      <div className="container text-center py-5">
        <h1>Room Not Found</h1>
        <p>The room you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">{room.name}</h2>
      <img
        src={room.img}
        alt={room.name}
        style={{ width: "20%", height: "20%" }}
        className="rounded mb-4"
      />
      <div className="row mb-4">
        {room.additionalImages &&
          room.additionalImages.map((image, index) => (
            <div key={index} className="col-4 mb-3">
              <img
                src={image}
                alt={`Additional view ${index + 1}`}
                style={{ width: "100%", height: "auto" }}
                className="rounded"
              />
            </div>
          ))}
      </div>

      <p className="mb-3">{room.description}</p>
      <ul className="list-unstyled">
        {room.amenities.map((amenity, index) => (
          <li key={index} className="d-flex align-items-center mb-2">
            <i className="fa fa-check-circle text-primary me-2"></i> {/* Icon */}
            <span className="text-secondary">{amenity}</span>
          </li>
        ))}
      </ul>
      <p className="mb-3">
        <strong>Price: </strong>{room.price}
      </p>
      <button className="btn btn-dark rounded">Book Now</button>
    </div>
  );
}

