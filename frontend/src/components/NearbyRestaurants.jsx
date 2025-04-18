import React from "react";
import "../assets/style/NearbyRestaurants.css";
import Foodcard from "./Foodcard";

const NearbyRestaurants = () => {
  return (
    <>
      <section className="nearby-restaurants">
        <div className="container">
          <div className="inner">
            <div className="description">
              <h2>Nearby Restaurants</h2>
              <p>Smart Location based recommendations</p>
              <span>
                Our smart algorithm curates recommendations based on your
                preferences
              </span>
            </div>
            <div className="nearby-card">
              <div style={{ opacity: 0 }}>
                <Foodcard />
              </div>
              <Foodcard />
              <Foodcard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NearbyRestaurants;
