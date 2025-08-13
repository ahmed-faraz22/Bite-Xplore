import React, { useState } from "react";
import FoodCategories from "../components/FoodCategories";
import FoodFilter from "../components/FoodFilter";

const Explore = () => {
  const [location, setLocation] = useState("");
  const [restaurant, setRestaurant] = useState("");

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleRestaurantChange = (newRestaurant) => {
    setRestaurant(newRestaurant);
  };

  return (
    <>
      <FoodCategories
        onLocationChange={handleLocationChange}
        onRestaurantChange={handleRestaurantChange}
      />
      <FoodFilter location={location} restaurant={restaurant} />
    </>
  );
};

export default Explore;
