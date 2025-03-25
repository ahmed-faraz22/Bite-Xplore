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
              <h2>Heading H2</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
                distinctio debitis accusantium alias ut ipsam eligendi
                perferendis autem molestias. Laboriosam fuga ut adipisci non
                aperiam. Eveniet autem unde laborum facilis.
              </p>
            </div>
            <div className="nearby-card">
              <Foodcard />
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
