import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function NavBar() {
  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" style={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pharmassist
          </Typography>
          <a
            href="/register"
            style={{ textDecoration: "none", marginRight: "10px" }}
          >
            <Button
              variant="outlined"
              style={{ color: "#fff", borderColor: "#fff" }}
            >
              Register
            </Button>
          </a>
          <a href="/login" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              style={{ color: "#fff", borderColor: "#fff" }}
            >
              Login
            </Button>
          </a>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;
