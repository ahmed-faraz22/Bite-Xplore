import React, { useState } from "react";
import {
  FaSearchLocation,
  FaLocationArrow,
  FaSearch,
  FaUtensils,
} from "react-icons/fa";
import "../assets/style/FoodCategories.css";

const FoodCategories = ({ onLocationChange, onRestaurantChange }) => {
  const [searchCity, setSearchCity] = useState("");
  const [searchRestaurant, setSearchRestaurant] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [activeRestaurant, setActiveRestaurant] = useState("");

  const cities = ["Rawalpindi", "Islamabad", "Karachi", "Lahore", "Multan"];
  const restaurants = [
    "Burger Lab",
    "Pizza Hut",
    "Zaify's",
    "KFC",
    "Buddys's",
    "Hardee’s",
    "Salt'n Pepper",
  ];

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.toLowerCase().includes(searchRestaurant.toLowerCase())
  );

  const handleLocationClick = (city) => {
    setActiveCity(city);
    onLocationChange(city);
  };

  const handleRestaurantClick = (restaurant) => {
    setActiveRestaurant(restaurant);
    if (onRestaurantChange) {
      onRestaurantChange(restaurant);
    }
  };

  return (
    <section className="food-categories">
      <div className="container">
        <div className="inner">
          <h2>Where would you like to order?</h2>
          <div className="search-outer">
            {/* City Search */}
            <div className="wrapper">
              <label htmlFor="searchCities">Search by Cities</label>
              <div className="search-wrapper">
                <input
                  type="search"
                  name="searchCities"
                  placeholder="Search Cities"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
                <FaSearchLocation />
              </div>
              <div className="search-results">
                <ul>
                  {filteredCities.map((city) => (
                    <li
                      className={activeCity === city ? "active" : ""}
                      key={city}
                      onClick={() => handleLocationClick(city)}
                    >
                      <FaLocationArrow /> <span>{city}</span>
                    </li>
                  ))}
                </ul>
                {filteredCities.length === 0 && (
                  <p className="no-results">No matching cities found</p>
                )}
              </div>
            </div>

            {/* Restaurant Search */}
            <div className="wrapper">
              <label htmlFor="searchRestaurants">Search by Restaurants</label>
              <div className="search-wrapper">
                <input
                  type="search"
                  name="searchRestaurants"
                  placeholder="Search Restaurants"
                  value={searchRestaurant}
                  onChange={(e) => setSearchRestaurant(e.target.value)}
                />
                <FaSearch />
              </div>
              <div className="search-results">
                <ul>
                  {filteredRestaurants.map((restaurant) => (
                    <li
                      className={
                        activeRestaurant === restaurant ? "active" : ""
                      }
                      key={restaurant}
                      onClick={() => handleRestaurantClick(restaurant)}
                    >
                      <FaUtensils /> <span>{restaurant}</span>
                    </li>
                  ))}
                </ul>
                {filteredRestaurants.length === 0 && (
                  <p className="no-results">No matching restaurants found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodCategories;
