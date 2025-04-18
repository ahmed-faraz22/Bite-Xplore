import React, { useState } from "react";
import FoodCategories from "../components/FoodCategories";
import FoodFilter from "../components/FoodFilter";

const Explore = () => {
  const [location, setLocation] = useState("");

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <>
      <FoodCategories onLocationChange={handleLocationChange} />
      <FoodFilter location={location} />
    </>
  );
};

export default Explore;
