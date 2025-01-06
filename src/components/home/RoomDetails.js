import React from "react";
import { useParams } from "react-router-dom";
import { roomItems } from "../data/Data";

export default function RoomDetails() {
  const { roomId } = useParams(); // Get the room ID from the URL
  const room = roomItems.find((item) => item.id === parseInt(roomId));

  if (!room) {
    return <p>Room not found.</p>;
  }

  return (
    <div className="container">
      <h1>{room.name}</h1>
      <img src={room.img} alt={room.name} style={{ width: "100%", height: "auto" }} />
      <p>{room.description}</p>
      <p><strong>Price: </strong>{room.price}</p>
      <div>{room.star}</div>
      <button className="btn btn-dark">Book Now</button>
    </div>
  );
}
