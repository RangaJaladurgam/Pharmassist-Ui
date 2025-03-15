import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo1 from "../assets/pharmassist-horizontal-logo-bg.png";

function NavBar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const settings = ['My Profile', 'Dashboard', 'Logout'];
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored values
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", paddingInline: "3rem", minHeight: "2.5rem" }}>
  <Toolbar sx={{ minHeight: "2.5rem", paddingY: "2px" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }} style={{display:"flex",cursor:"pointer"}}>
          <img src={Logo1} alt="" style={{width:"200px"}} onClick={()=>navigate("/")}/>
        </Typography>

        {isLoggedIn ? (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "40px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => {
                  handleCloseUserMenu();
                  if (setting === "My Profile") navigate("/admin/profile");
                  if (setting === "Dashboard") navigate("/dashboard");
                  if (setting === "Logout") handleLogout();
                }}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
          <>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button variant="outlined" sx={{ mx: 1, color: "rgb(0, 110, 255)"  }}>Register</Button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button variant="outlined" sx={{ color: "rgb(0, 110, 255)" }}>Login</Button>
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
