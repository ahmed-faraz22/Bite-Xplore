import React from "react";
import Hero from "../components/Hero";
import NearbyRestaurants from "../components/NearbyRestaurants";
import Products from "../components/Products";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Foodcard from "../components/Foodcard";

const Home = () => {
  return (
    <>
      <Header />
      <div className="animated-card">
        <Foodcard />
      </div>
      <Hero />
      <NearbyRestaurants />
      <Products />
      <Footer />
    </>
  );
};

export default Home;
