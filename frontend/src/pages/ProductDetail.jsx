import React from "react";
import resturentlogo from "../assets/images/logo.png";
import "../assets/style/ProductDetail.css";
import productimg from "../assets/images/foodiesfeed.com_colorful-bowl-of-deliciousness-with-fried-egg.png";

const ProductDetail = () => {
  return (
    <>
      <section className="product-detail">
        <div className="container">
          <div className="inner">
            <div className="resturent-details">
              <div className="resturent-logo">
                <img src={resturentlogo} alt="" />
              </div>
              <div className="resturent-name">
                <h3>Ahmed white wala</h3>
              </div>
            </div>
            <div className="product-details">
              <div className="product-img">
                <img src={productimg} alt="" />
              </div>
              <div className="product-content">
                <div className="head">
                  <h3>borgerrrr</h3>
                  <span>$199</span>
                </div>
                <div className="body">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quidem cum dolor rem voluptatem at necessitatibus perferendis
                  libero exercitationem nobis dicta odio soluta tempora, vitae
                  quo. Ipsum officiis consequatur sapiente minus?
                </p>
                <ul>
                  <li>website: www.duzz.com</li>
                  <li>phone: 0300123456</li>
                  <li>email: hello@gmail.com</li>
                </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
