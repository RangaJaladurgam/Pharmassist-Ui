import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import Image1 from "../assets/pexels-padrinan-806427.jpg";
import Image2 from "../assets/pexels-pavel-danilyuk-5998512.jpg";
import Image3 from "../assets/pexels-pixabay-40568.jpg";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function Welcome() {
  const [pharmacies] = useState([
    { 
      name: "MediCare Pharmacy", 
      location: "Hyderabad", 
      details: "Trusted healthcare partner offering 24/7 service." 
    },
    { 
      name: "HealthPlus Pharmacy", 
      location: "Bangalore", 
      details: "Affordable medicines with expert consultations." 
    },
    { 
      name: "Lifeline Pharmacy", 
      location: "Chennai", 
      details: "Your go-to pharmacy for genuine medicines & supplements." 
    },
  ]);

  const [medicines] = useState([
    { 
      name: "Paracetamol", 
      category: "Pain Reliever", 
      description: "Used to treat mild to moderate pain and fever."
    },
    { 
      name: "Vitamin C", 
      category: "Supplements", 
      description: "Boosts immunity and promotes skin health." 
    },
    { 
      name: "Cough Syrup", 
      category: "Cold & Flu", 
      description: "Relieves cough and soothes throat irritation." 
    },
  ]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" style={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pharmassist
          </Typography>
          <a href="/register" style={{ textDecoration: "none", marginRight: "10px" }}>
            <Button variant="outlined" style={{ color: "#fff", borderColor: "#fff" }}>Register</Button>
          </a>
          <a href="/login" style={{ textDecoration: "none" }}>
            <Button variant="outlined" style={{ color: "#fff", borderColor: "#fff" }}>Login</Button>
          </a>
        </Toolbar>
      </AppBar>

      {/* Image Carousel */}
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Carousel showThumbs={false} autoPlay infiniteLoop interval={3000} showStatus={false} className="banner">
          <div><img src={Image1} alt="Pharmacy" /></div>
          <div><img src={Image2} alt="Medicines" /></div>
          <div><img src={Image3} alt="Healthcare" /></div>
        </Carousel>
      </div>

      {/* Welcome Section */}
      <div style={{ textAlign: "center", padding: "2rem 1rem", backgroundColor: "#f5f5f5", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#333" }}>Welcome to Pharmassist</h2>
        <p style={{ fontSize: "18px", color: "#555", maxWidth: "600px", margin: "0 auto" }}>
          Your trusted partner in healthcare, offering reliable medicines and pharmacy services. 
          Find the best pharmacies and medicines near you with just one click!
        </p>
        <a href="/explore">
          <Button variant="contained" style={{ backgroundColor: "#3f51b5", color: "white", marginTop: "10px" }}>
            Explore Now
          </Button>
        </a>
      </div>

      {/* Additional Information Section */}
      <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "#e3f2fd", borderRadius: "10px", margin: "20px 0" }}>
        <h3 style={{ color: "#0277bd" }}>Our Services</h3>
        <p style={{ fontSize: "16px", color: "#444", maxWidth: "600px", margin: "0 auto" }}>
          We provide a wide range of services including prescription ref ills, health consultations, and wellness products. Our pharmacies are equipped to handle your healthcare needs with care and professionalism.
        </p>
      </div>

      {/* Testimonials Section */}
      <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "#fff3e0", borderRadius: "10px", margin: "20px 0" }}>
        <h3 style={{ color: "#bf360c" }}>What Our Users Say</h3>
        <p style={{ fontSize: "16px", color: "#444", maxWidth: "600px", margin: "0 auto" }}>
          "Pharmassist has made it so easy for me to find the medicines I need. The service is excellent!" - Sarah J.
        </p>
        <p style={{ fontSize: "16px", color: "#444", maxWidth: "600px", margin: "0 auto" }}>
          "I love the convenience of having all the pharmacies listed in one place. Highly recommend!" - Mark T.
        </p>
      </div>

      {/* Tabs for Pharmacies and Medicines */}
      <div style={{ padding: "2rem" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Featured Pharmacies" />
          <Tab label="Popular Medicines" />
        </Tabs>

        {value === 0 && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {pharmacies.map((pharmacy, index) => (
                <div key={index} style={{ 
                  padding: "15px", 
                  borderRadius: "10px", 
                  backgroundColor: "#e3f2fd", 
                  textAlign: "center", 
                  boxShadow: "2px 4px 8px rgba(0,0,0,0.1)" 
                }}>
                  <h4 style={{ color: "#0277bd" }}>{pharmacy.name}</h4>
                  <p style={{ fontSize: "16px", color: "#444" }}>📍 {pharmacy.location}</p>
                  <p style={{ fontSize: "14px", color: "#666" }}>{pharmacy.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {value === 1 && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {medicines.map((medicine, index) => (
                <div key={index} style={{ 
                  padding: "15px", 
                  borderRadius: "10px", 
                  backgroundColor: "#fff3e0", 
                  textAlign: "center", 
                  boxShadow: "2px 4px 8px rgba(0,0,0,0.1)" 
                }}>
                  <h4 style={{ color: "#bf360c" }}>{medicine.name}</h4>
                  <p style={{ fontSize: "16px", color: "#444" }}>🗂 Category: {medicine.category}</p>
                  <p style={{ fontSize: "14px", color: "#666" }}>{medicine.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with Contact Information */}
      <footer style={{ padding: "1rem", textAlign: "center", backgroundColor: "#3f51b5", color: "#fff" }}>
        <p>Contact us: info@pharmassist.com | Phone: +123 456 7890</p>
        <p>Follow us on social media: Facebook | Twitter | Instagram</p>
      </footer>
    </>
  );
}