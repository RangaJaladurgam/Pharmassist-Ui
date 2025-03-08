import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function NavBar({ isLoggedIn, setIsLoggedIn }) {
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert token to boolean
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsLoggedIn(false); // Update state
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#3f51b5" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pharmassist
        </Typography>

        {isLoggedIn ? (
          <>
            <Link to="/pharmacy" style={{ textDecoration: "none" }}>
              <Button sx={{ mx: 1, color: "white" }}>Pharmacy</Button>
            </Link>
            <Link to="/medicines" style={{ textDecoration: "none" }}>
              <Button sx={{ mx: 1, color: "white" }}>Medicines</Button>
            </Link>
            <Link to="/patients" style={{ textDecoration: "none" }}>
              <Button sx={{ mx: 1, color: "white" }}>Patients</Button>
            </Link>
            <Link to="/bills" style={{ textDecoration: "none" }}>
              <Button sx={{ mx: 1, color: "white" }}>Bills</Button>
            </Link>
            <Button onClick={handleLogout} sx={{ mx: 1, color: "white" }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button sx={{ mx: 1, backgroundColor: "white", color: "#4792e6" }}>
                Register
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button sx={{ backgroundColor: "white", color: "#4792e6" }}>
                Login
              </Button>
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
