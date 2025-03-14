import React, { useState } from "react";

import Button from "@mui/material/Button";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image1 from "../assets/Picsart_25-03-14_18-22-42-365.jpg";
import Image3 from "../assets/Picsart_25-03-14_18-26-37-030.jpg";
import Image2 from "../assets/pexels-pixabay-40568.jpg";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import NavBar from "./NavBar";
import LogoCarousel from "./LogoCarousel";

export default function Welcome() {
  const [pharmacies] = useState([
    {
      name: "MediCare Pharmacy",
      location: "Hyderabad",
      details: "Trusted healthcare partner offering 24/7 service.",
    },
    {
      name: "HealthPlus Pharmacy",
      location: "Bangalore",
      details: "Affordable medicines with expert consultations.",
    },
    {
      name: "Lifeline Pharmacy",
      location: "Chennai",
      details: "Your go-to pharmacy for genuine medicines & supplements.",
    },
    {
      name: "Wellness Pharmacy",
      location: "Mumbai",
      details: "Providing top-quality medicines and home delivery services.",
    },
    {
      name: "Apollo Pharmacy",
      location: "Delhi",
      details:
        "India’s leading pharmacy chain with trusted healthcare solutions.",
    },
    {
      name: "CarePoint Pharmacy",
      location: "Pune",
      details:
        "Reliable pharmacy with an extensive range of medicines and wellness products.",
    },
    {
      name: "CityMeds Pharmacy",
      location: "Kolkata",
      details:
        "Serving the community with genuine medicines and expert guidance.",
    },
    {
      name: "LifeCare Pharmacy",
      location: "Ahmedabad",
      details: "A one-stop destination for prescription and OTC medicines.",
    },
    {
      name: "MediTrust Pharmacy",
      location: "Jaipur",
      details:
        "Dedicated to providing high-quality medicines with a focus on customer care.",
    },
    {
      name: "GreenMed Pharmacy",
      location: "Lucknow",
      details: "Offering herbal and allopathic medicines for holistic health.",
    },
  ]);

  const [medicines] = useState([
    {
      name: "Paracetamol",
      category: "Pain Reliever",
      description: "Used to treat mild to moderate pain and fever.",
    },
    {
      name: "Vitamin C",
      category: "Supplements",
      description: "Boosts immunity and promotes skin health.",
    },
    {
      name: "Cough Syrup",
      category: "Cold & Flu",
      description: "Relieves cough and soothes throat irritation.",
    },
    {
      name: "Amoxicillin",
      category: "Antibiotic",
      description: "Used to treat bacterial infections in the body.",
    },
    {
      name: "Ibuprofen",
      category: "Pain Reliever",
      description: "Reduces pain, inflammation, and fever.",
    },
    {
      name: "Omeprazole",
      category: "Gastric Medicine",
      description: "Helps in treating acid reflux and ulcers.",
    },
    {
      name: "Insulin",
      category: "Diabetes Management",
      description: "Regulates blood sugar levels in diabetic patients.",
    },
    {
      name: "Cetirizine",
      category: "Antihistamine",
      description: "Provides relief from allergies and hay fever.",
    },
    {
      name: "ORS Solution",
      category: "Rehydration",
      description: "Used to treat dehydration due to diarrhea.",
    },
    {
      name: "Azithromycin",
      category: "Antibiotic",
      description: "Used for bacterial infections like respiratory infections.",
    },
  ]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {/* Image Carousel */}
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={3000}
          showStatus={false}
          className="banner"
        >
          <div>
            <img src={Image1} alt="Pharmacy" />
          </div>
          <div>
            <img src={Image2} alt="Medicines" />
          </div>
          <div>
            <img src={Image3} alt="Healthcare" />
          </div>
        </Carousel>
      </div>
      <div>
        <LogoCarousel/>
      </div>
      <div className="hero-section">
        {/* Additional Information Section */}
        <div
          className="hero"
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "rgba(67, 180, 255, 0.459)",
          }}
        >
          <h3 style={{ color: "#0277bd" }}>Our Services</h3>
          <p
            style={{
              fontSize: "16px",
              color: "#444",
            }}
          >
            We provide a wide range of services including prescription ref ills,
            health consultations, and wellness products. Our pharmacies are
            equipped to handle your healthcare needs with care and
            professionalism.
          </p>
        </div>
        <div
          className="hero"
          style={{
            textAlign: "center",
            padding: "2rem 1rem",
            backgroundColor: "white",
          }}
        >
          <h2 style={{ color: "#333" }}>Welcome to PharmAssist</h2>
          <p
            style={{
              fontSize: "18px",
              color: "#555",
            }}
          >
            Your trusted partner in healthcare, offering reliable medicines and
            pharmacy services. Find the best pharmacies and medicines near you
            with just one click!
          </p>
          <a href="/explore">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#3f51b5",
                color: "white",
              }}
            >
              Explore Now
            </Button>
          </a>
        </div>
        {/* Testimonials Section */}
        <div
          className="hero"
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "rgba(243, 167, 27, 0.645)",
          }}
        >
          <h3 style={{ color: "#bf360c" }}>What Our Users Say</h3>
          <p
            style={{
              fontSize: "16px",
              color: "#444",
            }}
          >
            "Pharmassist has made it so easy for me to find the medicines I
            need. The service is excellent!" - Sarah J.
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#444",
            }}
          >
            "I love the convenience of having all the pharmacies listed in one
            place. Highly recommend!" - Mark T.
          </p>
        </div>
      </div>
      {/* Welcome Section */}

      {/* Tabs for Pharmacies and Medicines */}
      <div style={{ padding: "2rem" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Featured Pharmacies" />
          <Tab label="Popular Medicines" />
        </Tabs>

        {value === 0 && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {pharmacies.map((pharmacy, index) => (
                <div
                  className="hero"
                  key={index}
                  style={{
                    padding: "15px",
                    borderRadius: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <h4 style={{ color: "#0277bd" }}>{pharmacy.name}</h4>
                  <p style={{ fontSize: "16px", color: "#444" }}>
                    📍 {pharmacy.location}
                  </p>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    {pharmacy.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {value === 1 && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {medicines.map((medicine, index) => (
                <div
                  className="hero"
                  key={index}
                  style={{
                    padding: "15px",
                    borderRadius: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <h4 style={{ color: "#bf360c" }}>{medicine.name}</h4>
                  <p style={{ fontSize: "16px", color: "#444" }}>
                    🗂 Category: {medicine.category}
                  </p>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    {medicine.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with Contact Information */}
      <footer
        style={{
          padding: "1rem",
          textAlign: "center",
          backgroundColor: "#3f51b5",
          color: "#fff",
        }}
      >
        <p>Contact us: info@pharmassist.com | Phone: +123 456 7890</p>
        <p>Follow us on social media: Facebook | Twitter | Instagram</p>
      </footer>
    </>
  );
}
