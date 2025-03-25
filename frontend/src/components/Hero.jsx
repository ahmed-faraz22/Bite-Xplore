import React from "react";
import Foodcard from "./Foodcard";
import "../assets/style/Hero.css";
import Button from "./Button";

const Hero = () => {
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
            <Button />
          </div>
          <div className="hero-card">
            {/* <Foodcard /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
