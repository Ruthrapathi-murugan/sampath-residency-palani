import React from "react";
import Heading from "../components/common/Heading";
import Sliders from "../components/home/Slider";
import Roomservice from "../components/home/Roomservice";

export default function RoomService() {
  return (
    <>
      <Heading heading="RoomService" title="Home" subtitle="RoomService" />
      <Roomservice />
      <Sliders />
    </>
  );
}
