import React, { useState } from "react";
import AuthState from "./auth-state.js";
import { AppBar,Typography,Toolbar,Button,Drawer,IconButton,List,ListItem,ListItemIcon,ListItemText,Box,Divider} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";

export const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navbar = { padding: "1.5rem" };
  const buttonStyle = { margin: "10px" };
  const NavbarItems = [
    { text: "Dashboard", path: "/dashboard" },
    { text: "Profile", path: "/profile" },
    { text: "Search Items", path: "/search_items" },
    { text: "Order History", path: "/orders_history" },
    { text: "Deliver Items", path: "/deliver_items" },
    { text: "My Cart", path: "/my_cart" },
    { text: "Add Items", path: "/additem" },
    { text: "Chatbot", path: "/chatbot" },
  ];

  const navigate = useNavigate();

  const logout_func = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn"); 
    try {
      const Res = await axios.post("http://localhost:8082/logout",{})

      if(Res.status === 200 || Res.status === 201) {
        AuthState.logout();
        navigate("/login");
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  // const isLoggedIn = AuthState.getAuthStatus().isLoggedIn;
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  console.log("LOGGED IN: ",isLoggedIn);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={
              () => setDrawerOpen(true)
            }
          >
            <MenuIcon />
          </IconButton>
          <Typography style={navbar} variant="h4" sx={{ flexGrow: 1 }}>BuySell@IIITH</Typography>

          {/* Render all buttons */}
          <Button
            style={buttonStyle}
            color="error"
            variant="contained"
            disabled={isLoggedIn}
            to="/signup"
            component={Link}
          >Signup</Button>
          <Button
            style={buttonStyle}
            color="error"
            variant="contained"
            disabled={isLoggedIn}
            to="/login"
            component={Link}
          >Login</Button>
          <Button
            style={buttonStyle}
            color="error"
            variant="contained"
            disabled={!isLoggedIn}
            onClick={logout_func}
          >Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Menu</Typography>
          </Box>
          <Divider />
          <List>
            {NavbarItems.map((item) => (
              <ListItem
                key={item.text}
                button
                component={Link}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Toolbar />
    </>
  );
};

export default Navbar;