import React from "react";
import Foodcard from "./Foodcard";
import "../assets/style/Hero.css";
import Button from "./Button";
import cardimg from "../assets/images/card1.jpeg";

const Hero = ({ foodCardRef }) => {
  const staticname = "About Bite Xplore";

  return (
    <section className="hero">
      <div className="container">
        <div className="inner">
          <div className="description">
            <h1>Discover the best food in town</h1>
            <p>
              Our app helps you with smart recommendations, advanced search, and
              a fun, swipe-based browsing experience.
            </p>
            <Button buttonLink={"/explore"} buttonText={`explore`} />
          </div>
          <div ref={foodCardRef} className="hero-card">
            <Foodcard staticname={staticname} bgimage={cardimg} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
