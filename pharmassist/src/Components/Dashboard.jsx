import React from "react";
import { Container, Typography, Paper, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashMenu from "./DashMenu";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <DashMenu />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Welcome to Your Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{ p: 3, textAlign: "center", backgroundColor: "#f5f5f5" }}
            >
              <Typography variant="h6">Profile Overview</Typography>
              <Typography variant="body1">
                Manage your account details
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/profile")}
              >
                Go to Profile
              </Button>
            </Paper>
          </Grid>

          {/* Recent Activity Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{ p: 3, textAlign: "center", backgroundColor: "#f5f5f5" }}
            >
              <Typography variant="h6">Recent Activity</Typography>
              <Typography variant="body1">View your latest actions</Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/activity")}
              >
                View Activity
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;
