import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, Snackbar, Paper, Container, Grid, Divider,IconButton,Tooltip} from "@mui/material";
import { 
  ShoppingCart as ShoppingCartIcon, 
  ArrowBack as ArrowBackIcon,
  InfoOutlined as InfoIcon 
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { addToCart } from './add_to_cart';

const ItemDetail = () => {
  const { itemName } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("TOKEN IN ITEMDETAIL: ",token);
        const Res = await axios.get(`http://localhost:8082/item/${itemName}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (Res.data && Res.data.data) {
          setItem(Res.data.data);
          setLoading(false);
        } 
        else {
          console.error("Invalid item data format:", Res.data);
          setLoading(false);
        }
      } 
      catch (error) {
        console.error("Error fetching item details:", error);
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      const token_decoded = jwtDecode(token);
      setUsername(`${token_decoded.firstname} ${token_decoded.lastname}`);
    }

    fetchItemDetails();
  }, [itemName]);

  const Add_cart = (item) => {
    addToCart(item, setCart, setSnackMessage, setSnackOpen);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}
        >
          <Typography variant="h5" color="textSecondary">
            Loading item details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}
        >
          <Typography variant="h5" color="error">Item not found</Typography>
        </Box>
      </Container>
    );
  }

  const user_vendor_flag = item.vendor === username;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            position: 'relative' 
          }}
        >
          <Tooltip title="Back to Search" placement="left">
            <IconButton 
              onClick={handleGoBack} 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                left: 16, 
                color: 'text.secondary' 
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography 
                variant="h4" 
                color="primary" 
                gutterBottom 
                sx={{ fontWeight: 'bold',marginLeft:"8%" }}
              >{item.name}</Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Description
                </Typography>
                <Typography variant="body1">{item.description}</Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                    >Price</Typography>
                    <Typography 
                      variant="h5" 
                      color="primary" 
                      sx={{ fontWeight: 'bold' }}
                    >₹{item.price}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                    >Vendor</Typography>
                    <Typography variant="h6">{item.vendor}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={() => Add_cart(item)}
                disabled={user_vendor_flag}
                sx={{ 
                  py: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'scale(1.02)',
                    boxShadow: 3 
                  }
                }}
              >
                Add to Cart
              </Button>

              {user_vendor_flag && (
                <Typography 
                  variant="body2" 
                  color="error" 
                  sx={{ mt: 1, textAlign: 'center' }}
                >
                  You cannot add your own item to the cart.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={snackMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Container>
  );
};

export default ItemDetail;