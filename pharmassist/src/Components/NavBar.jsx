import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

function NavBar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const settings = ['Profile', 'Dashboard', 'Logout'];
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert token to boolean
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("adminId"); // Remove AdminId
    localStorage.removeItem("adminEmail"); // Remove Email
    localStorage.removeItem("pharmacyId"); // Remove pharmacyId
    localStorage.removeItem("pharmacyName"); // Remove pharmacyName
    localStorage.removeItem("gstNumber"); // Remove gstNumber
    localStorage.removeItem("licenseNo"); // Remove licenseNo
    setIsLoggedIn(false); // Update state
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#3f51b5",paddingInline:"3rem" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pharmassist
        </Typography>

        {isLoggedIn ? (
          <>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={()=>{
                    handleCloseUserMenu();
                    if(setting === "Profile") navigate("/admin/profile");
                    if(setting === "Dashboard") navigate("/dashboard");
                    if(setting === "Logout") handleLogout();
                  } }>
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button
                sx={{ mx: 1, backgroundColor: "white", color: "#4792e6" }}
              >
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
