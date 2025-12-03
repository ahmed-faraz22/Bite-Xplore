import React, { useState, useEffect } from "react";
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

  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]); // Store all restaurants

  // 🔥 Fetch cities & restaurants dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityRes = await fetch("http://localhost:4000/api/cities");
        const restaurantRes = await fetch(
          "http://localhost:4000/api/restaurants"
        );

        setCities(await cityRes.json());
        const restaurantsData = await restaurantRes.json();
        setAllRestaurants(restaurantsData);
        setRestaurants(restaurantsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // 🔥 Filter restaurants by selected city
  useEffect(() => {
    if (activeCity) {
      const cityRestaurants = allRestaurants.filter(
        (restaurant) => restaurant.city?.toLowerCase() === activeCity.toLowerCase()
      );
      setRestaurants(cityRestaurants);
      // Clear restaurant selection when city changes
      if (activeRestaurant) {
        setActiveRestaurant("");
        onRestaurantChange("");
      }
    } else {
      // If no city selected, show all restaurants
      setRestaurants(allRestaurants);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCity, allRestaurants]);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchRestaurant.toLowerCase())
  );

  const handleLocationClick = (city) => {
    // Toggle city selection - if same city clicked, deselect it
    if (activeCity === city.name) {
      setActiveCity("");
      onLocationChange("");
    } else {
      setActiveCity(city.name);
      onLocationChange(city.name);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setActiveRestaurant(restaurant.name);
    onRestaurantChange(restaurant.name);
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
                      className={activeCity === city.name ? "active" : ""}
                      key={city.id}
                      onClick={() => handleLocationClick(city)}
                    >
                      <FaLocationArrow /> <span>{city.name}</span>
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
                        activeRestaurant === restaurant.name ? "active" : ""
                      }
                      key={restaurant._id || restaurant.id}
                      onClick={() => handleRestaurantClick(restaurant)}
                    >
                      <FaUtensils /> <span>{restaurant.name}</span>
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
