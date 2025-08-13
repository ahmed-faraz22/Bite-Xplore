import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Hero from "../components/Hero";
import NearbyRestaurants from "../components/NearbyRestaurants";
import Products from "../components/Products";
import "../assets/style/home.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef();
  const foodCardRef = useRef();

  useGSAP(() => {
    // Horizontal scroll for container
    gsap.to(containerRef.current, {
      x: "-50%",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 5%",
        end: "top -100%",
        scrub: 1,
        pin: true,
        markers: false,
      },
    });

    // Animate food card movement
    gsap.to(foodCardRef.current, {
      x: "182svh",
      y: "-22vh",
      rotation: 360, // Full rotation
      maxWidth: "20%",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 10%",
        end: "top -100%",
        scrub: 1,
        markers: false,
      },
    });
  }, []);
  return (
    <>
      <div ref={containerRef} className="scroll">
        <Hero foodCardRef={foodCardRef} />
        <NearbyRestaurants />
      </div>
      <Products />
    </>
  );
};

export default Home;
