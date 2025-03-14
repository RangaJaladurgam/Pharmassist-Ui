import React from "react";
import { motion } from "framer-motion";
import Image1 from "../assets/1.png";
import Image3 from "../assets/herbal capsule pill leaf medicine drug logo.png";
import Image4 from "../assets/Light Green and Teal Modern Gradient Pharmacy Health Logo.png";
import Image5 from "../assets/Pink Simple Creative And Professional Medical Home Logo Design Template.png";
import Image6 from "../assets/Red Modern Icons Pharmacy Logo.png";

const logos = [
  Image1,
  Image3,
  Image4,
  Image5,
  Image6,
  Image1,
  Image3,
  Image4,
  Image5,
  Image6,
  Image1,
  Image5,
  Image4,
  Image3,
  Image1,
  Image6,
  Image5,
  Image4,
  Image3,
  Image1,
];

const Row = ({ direction, speed }) => {
  return (
    <div className="logo-row">
      <motion.div
        className="logo-track"
        animate={{
          x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
        }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
      >
        {[...logos, ...logos].map((logo, index) => (
          <img key={index} src={logo} alt="Logo" className="logo"/>
        ))}
      </motion.div>
    </div>
  );
};

const LogoCarousel = () => {
  return (
    <div className="logo-carousel">
      <Row direction="left" speed={100} />
      <Row direction="right" speed={100} />
      <Row direction="left" speed={100} />
      <Row direction="right" speed={100} />
    </div>
  );
};

export default LogoCarousel;
