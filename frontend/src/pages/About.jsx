import React from "react";
import Foodcard from "../components/Foodcard";
import "../assets/style/About.css";
import cardimg1 from '../assets/images/wania.jpeg'
import cardimg2 from '../assets/images/shariz.jpeg'
import cardimg3 from '../assets/images/suleman.jpeg'
import cardimg4 from '../assets/images/jawaria.jpeg'
import cardimg5 from '../assets/images/fahad.jpeg'

const About = () => {
  const staticname1 = "Wania Eman";
  const staticname2 = "Shariz Saeed";
  const staticname3 = "Suleman Shafiq";
  const staticname4 = "Jawaria Gul";
  const staticname5 = "Fahad Ahmed";

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
              <Foodcard staticname={staticname1} bgimage={cardimg1} />
              <Foodcard staticname={staticname2} bgimage={cardimg2} />
              <Foodcard staticname={staticname3} bgimage={cardimg3} />
              <Foodcard staticname={staticname4} bgimage={cardimg4} />
              <Foodcard staticname={staticname5} bgimage={cardimg5} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
