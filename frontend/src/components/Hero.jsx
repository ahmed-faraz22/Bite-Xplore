import React from "react";
import Foodcard from "./Foodcard";
import "../assets/style/Hero.css";
import Button from "./Button";

const Hero = ({ foodCardRef }) => {
  const staticname = "static name";

  return (
    <section className="hero">
      <div className="container">
        <div className="inner">
          <div className="description">
            <h1>Discover the best food in Lahore</h1>
            <p>
              Our app helps you discover the best food nearby with a TikTok-like
              experience, smart recommendations, and advanced search.
            </p>
            <Button buttonLink={"#"} buttonText={`explore`} />
          </div>
          <div ref={foodCardRef} className="hero-card">
            <Foodcard staticname={staticname} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
