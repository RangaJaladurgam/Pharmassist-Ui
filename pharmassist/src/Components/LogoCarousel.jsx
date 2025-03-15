import React from "react";
import { motion } from "framer-motion";
import Image1 from "../assets/1.png";
import Image2 from "../assets/Green Simple Medical Health Logo.png";
import Image3 from "../assets/herbal capsule pill leaf medicine drug logo.png";
import Image4 from "../assets/Light Green and Teal Modern Gradient Pharmacy Health Logo.png";
import Image5 from "../assets/Green and Blue Minimalist Pharmacy Logo.png";
import Image6 from "../assets/Red Modern Icons Pharmacy Logo.png";
import Image7 from "../assets/Blue Minimalist Medical Logo.png";
import Image8 from "../assets/Blue Simple Modern Medical Clinic Logo.png";
import Image9 from "../assets/Minimalist Health Care Free Logo.png";
import Image10 from "../assets/Minimalist Black and Blue Medical Clinic Logo.png";
import Image11 from "../assets/Red Circle Health Logo.png";
import Image12 from "../assets/Blue and White Flat Illustrative Health Products Logo.png";
import Image13 from "../assets/Modern Blue Medicine Center Hospital Logo.png";

const logos = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
  Image12,
  Image11,
  Image10,
  Image9,
  Image8,
  Image7,
  Image13,
  Image12,
  Image11,
  Image10,
  Image9,
  Image8,
  Image7,
  Image6,
  Image5,
  Image4,
  Image3,
  Image1,
  Image2
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
