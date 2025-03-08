import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" style={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pharmassist
          </Typography>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{ mx: 1, backgroundColor: "white", color: "#4792e6" }}
            >
              Register
            </Button>
          </Link>

          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "white", color: "#4792e6" }}
            >
              Login
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;
