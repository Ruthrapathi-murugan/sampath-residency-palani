import React from "react";
import "./css/style.css";
import "./css/bootstrap.min.css";
import "./css/animate.css";
import "./css/animate.min.css";
import "./App.css";
import Header from "./components/common/Header";
import RoomService from "./pages/RoomService"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {
  Home,
  Booking,
  AboutUs,
  Contact,
  PageNotFound,
  Room,
  Services,
  Team,
  RoomDetails,
  Testimonial,
  GoogleReviews,
} from "./pages/index";
import Footer from "./components/common/Footer";
import PhotosGallery from "./components/home/PhotosGallery";
export default function App() {
  return (
    <>
      <div>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/*" element={<PageNotFound />} />
            <Route path="/rooms" element={<Room />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/rooms/:bedType" element={<RoomDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/photos" element={<PhotosGallery/>}/>
            <Route path="/roomservice" element={<RoomService/>}/>
            <Route path="/googlereviews" element={<GoogleReviews/>}/>
          </Routes>
          <Footer />

        </Router>
      </div>
    </>
  );
}
