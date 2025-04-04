import React from "react";
import Hero from "../components/Hero";
import NearbyRestaurants from "../components/NearbyRestaurants";
import Products from "../components/Products";

const Home = () => {
  return (
    <>
      <Hero />
      <NearbyRestaurants />
      <Products />
    </>
  );
};

export default Home;
