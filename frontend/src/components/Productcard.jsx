import React from "react";
import productimg from "../assets/images/foodiesfeed.com_colorful-bowl-of-deliciousness-with-fried-egg.png";
import Button from "./Button";
import { CiStar } from "react-icons/ci";
import "../assets/style/Productcard.css";

const Productcard = () => {
  return (
    <>
      <div className="productcard-wrapper">
        <div className="card-head">
          <img src={productimg} alt="" />
        </div>
        <div className="card-body">
          <span>
            <CiStar />
            <CiStar />
            <CiStar />
            <CiStar />
            <CiStar />
          </span>
          <div className="description">
            <h4>Nike air max dn</h4>
            <p>
              Nike air max dnNike air max dnNike air max dnNike air max dnNike
              air max dnNike air max dnNike air max dnNike air max dn
            </p>
          </div>
          <div className="price-wrapper">
            <span>$190.00</span>
            <Button buttonLink={"#"} buttonText={`view details`} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Productcard;
