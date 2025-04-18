import React, { useState } from "react";
import { FaSearchLocation, FaLocationArrow } from "react-icons/fa";
import "../assets/style/FoodCategories.css";

const FoodCategories = ({ onLocationChange }) => {
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState("");

  const handleLocationClick = (city) => {
    setActiveCity(city);
    onLocationChange(city);
  };

  return (
    <section className="food-categories">
      <div className="container">
        <div className="inner">
          <h2>Where would you like to order?</h2>
          <div className="wrapper">
            <label htmlFor="searchCities">Search by Cities</label>
            <div className="search-wrapper">
              <input
                type="search"
                name="searchCities"
                placeholder="Search Cities"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearchLocation />
            </div>
            <div className="search-results">
              <ul>
                {["Rawalpindi", "Islamabad", "Karachi", "Lahore", "Multan"].map(
                  (city) => (
                    <li
                      className={activeCity === city ? "active" : ""}
                      key={city}
                      onClick={() => handleLocationClick(city)}
                    >
                      <FaLocationArrow /> <span>{city}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodCategories;
