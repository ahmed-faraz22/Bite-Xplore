import React from "react";
import "../assets/style/NearbyRestaurants.css";
import Foodcard from "./Foodcard";
import cardimg2 from "../assets/images/card2.jpeg";
import cardimg3 from "../assets/images/card3.jpeg";

const NearbyRestaurants = () => {
  return (
    <>
      <section className="nearby-restaurants">
        <div className="container">
          <div className="inner">
            <div className="description">
              <h2>Nearby Restaurants</h2>
              <p>Smart Location based recommendations Our smart algorithm curates recommendations based on your preferences</p>
              <span>
                0% comission
              </span>
              <div className="description-card">
                <h3>Filters</h3>
                <ul>
                  <li>person</li>
                  <li>Rating</li>
                  <li>Price</li>
                  <li>society</li>
                  <li>facilites</li>
                  <li>ambience</li>
                </ul>
                <p>Apply mutliple filters to refine your search</p>
              </div>
            </div>
            <div className="nearby-card">
              <div style={{ opacity: 0 }}>
                <Foodcard />
              </div>
              <Foodcard bgimage={cardimg3} />
              <Foodcard bgimage={cardimg2} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NearbyRestaurants;
