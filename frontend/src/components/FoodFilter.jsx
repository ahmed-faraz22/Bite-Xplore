import React from "react";
import Button from "../components/Button";
import "../assets/style/FoodFilter.css";
import Productcard from "./Productcard";
const FoodFilter = () => {
  return (
    <>
      <section className="food-filter">
        <div className="container">
          <div className="inner">
            <h2>choose best for you</h2>
            <div className="filter-cta">
              <Button buttonLink={"#"} buttonText={`button 1`}/>
              <Button buttonLink={"#"} buttonText={`button 2`}/>
              <Button buttonLink={"#"} buttonText={`button 3`}/>
              <Button buttonLink={"#"} buttonText={`button 4`}/>
              <Button buttonLink={"#"} buttonText={`button 5`}/>
              <Button buttonLink={"#"} buttonText={`button 6`}/>
              <Button buttonLink={"#"} buttonText={`button 7`}/>
              <Button buttonLink={"#"} buttonText={`button 8`}/>
            </div>
            <div className="result-products">
              <Productcard />
              <Productcard />
              <Productcard />
              <Productcard />
              <Productcard />
              <Productcard />
              <Productcard />
              <Productcard />
              <Productcard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FoodFilter;
