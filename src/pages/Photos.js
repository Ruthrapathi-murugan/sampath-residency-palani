import React from "react";
import Heading from "../components/common/Heading";
import { PhotosPage } from "./pages";
import PhotosGallery from "../components/home/Photos";

export { default as Photos } from "../components/home/Photos";

export default function PhotosPage() {
    return (
      <>
        <Heading heading="Photos" title="Home" subtitle="Photos" />
        <PhotosGallery />
      </>
    );
  }
  
