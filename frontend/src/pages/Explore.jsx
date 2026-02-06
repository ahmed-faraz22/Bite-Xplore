import React, { useState, useContext } from "react";
import FoodCategories from "../components/FoodCategories";
import FoodFilter from "../components/FoodFilter";
import CompareModal from "../components/CompareModal";
import { CompareProvider, CompareContext } from "../context/CompareContext";

const ExploreContent = () => {
  const [location, setLocation] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const { compareItems } = useContext(CompareContext);

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

      {compareItems.length > 0 && (
        <button
          className="compare-bar"
          onClick={() => compareItems.length >= 2 && setShowCompareModal(true)}
        >
          Compare ({compareItems.length}/2)
        </button>
      )}

      {showCompareModal && (
        <CompareModal onClose={() => setShowCompareModal(false)} />
      )}
    </>
  );
};

const Explore = () => {
  return (
    <CompareProvider>
      <ExploreContent />
    </CompareProvider>
  );
};

export default Explore;
