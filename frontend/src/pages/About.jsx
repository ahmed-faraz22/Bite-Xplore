import React from "react";
import Foodcard from "../components/Foodcard";
import "../assets/style/About.css";

const About = () => {

  return (
    <>
      <section className="about">
        <div className="container">
          <div className="inner">
            <div className="description">
              <h1>About Us</h1>
              <p>
                BiteXplore is your ultimate companion for discovering the best restaurant deals around town — no delivery involved, just a pure focus on exploration and smart dining decisions. Whether you're a foodie on the hunt for hidden gems or simply looking for the best offers in your area, BiteXplore connects you with a curated list of top-rated local restaurants showcasing their most exciting deals and menu highlights. Our platform makes it easy to compare different dining spots, helping you make informed choices based on your preferences, budget, and cravings. Unlike traditional food apps, we don't charge restaurants commission fees — instead, they subscribe to get featured, allowing them to reach more food lovers while maintaining quality service and pricing. So, dive into the world of flavor with BiteXplore — discover, compare, and uncover your next favorite dining experience.
              </p>
            </div>
            <div className="our-team">
              <h2>Meet Our Team</h2>
              <div className="about-cards">
              <Foodcard />
              <Foodcard />
              <Foodcard />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;