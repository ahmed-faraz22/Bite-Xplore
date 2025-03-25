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
              <h1>Heading H1</h1>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex
                voluptatum possimus alias, non et cum corrupti! Omnis dolore ex,
                quia mollitia sint, ullam maiores dicta rem deleniti voluptatum
                eaque voluptatibus.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Ex voluptatum possimus alias, non et cum
                corrupti! Omnis dolore ex, quia mollitia sint, ullam maiores
                dicta rem deleniti voluptatum eaque voluptatibus.Lorem ipsum
                dolor sit, amet consectetur adipisicing elit. Ex voluptatum
                possimus alias, non et cum corrupti! Omnis dolore ex, quia
                mollitia sint, ullam maiores dicta rem deleniti voluptatum eaque
                voluptatibus.
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
