import React from "react";
import { FaSearchLocation } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import "../assets/style/FoodCategories.css";

const FoodCategories = () => {
  return (
    <>
      <section className="food-categories">
        <div className="container">
          <div className="inner">
            <h2>where would you like to order?</h2>
            <div className="wrapper">
              <label htmlFor="searchCities">Search by Cities</label>
              <div className="search-wrapper">
                <input
                  type="search"
                  name="searchCities"
                  placeholder="Search Cities"
                  id=""
                />
                <FaSearchLocation />
              </div>
              <div className="search-results">
                <ul>
                  <li>
                    <FaLocationArrow /> <span>Rawalpindi</span>
                  </li>
                  <li>
                    <FaLocationArrow /> <span>Rawalpindi</span>
                  </li>
                  <li>
                    <FaLocationArrow /> <span>Rawalpindi</span>
                  </li>
                  <li>
                    <FaLocationArrow /> <span>Rawalpindi</span>
                  </li>
                  <li>
                    <FaLocationArrow /> <span>Rawalpindi</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FoodCategories;
