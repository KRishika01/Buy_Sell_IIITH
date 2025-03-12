import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Tabs, Tab, Card, CardContent, Typography, CircularProgress, Alert, Paper,Divider} from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  // width: '98%',
  margin: '10% auto',
  backgroundColor: theme.palette.background.default,
  boxShadow: '10px 4px 6px rgba(0,0,0,0.1)',
  width:"120%",
  marginTop:"20%",
}));

const OrderCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '10px 6px 12px rgba(0,0,0,0.1)',
  },
}));

const OrdersHistory = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    get_orders();
  }, []);

  const get_orders = async () => {
    try {
      setLoading(true);
      const Res = await axios.get("http://localhost:8082/orders_history", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log("VENDOR ITEMS IN ORDERS: ",Res.data.vendorOrders_1);
      setVendorOrders(Res.data.vendorOrders_1 || []);
      // console.log("SOLD ITEMS IN ORDERS: ",Res.data.soldItems);
      setSoldItems(Res.data.soldItems || []);
      // console.log("BOUGHT ITEMS IN ORDERS: ",Res.data.boughtItems);
      setBoughtItems(Res.data.boughtItems || []);
      setError(null);
    }
    catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  };

  const calculateEachTotal = (item) => {
    return item.price * item.quantity;
  }

  const orders_styling = (title, items, emptyMessage) => {
    if (title === "Pending Orders") {
      return (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom color="red">{title}</Typography>
          {items.length === 0 ? (
            <Alert severity="info">{emptyMessage}</Alert>
          ) : (
            items.map((order) => (
              <OrderCard key={order._id}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">Order ID: {order._id}</Typography>
                  {order.cartItems && order.cartItems.length > 0 ? (
                    <Box>
                      {order.cartItems.map((item, index) => (
                        <Box key={`${order._id}-${index}`} mb={1}>
                          <Typography><strong>Item:</strong> {item.item_name}</Typography>
                          <Typography><strong>Quantity:</strong> {item.quantity} pcs</Typography>
                          <Typography><strong>Vendor:</strong> {item.vendor_name}</Typography>
                          <Typography><strong>Buyer:</strong> {item.buyer_name}</Typography>
                          <Typography><strong>Price:</strong> ₹{calculateEachTotal(item)}</Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography>No items in this order.</Typography>
                  )}
                </CardContent>
              </OrderCard>
            ))
          )}
        </Box>
      );
    }

    return (
      <Box mt={3}>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        {items.length === 0 ? (
          <Alert severity="info">{emptyMessage}</Alert>
        ) : (
          items.map((item, index) => {
            if (!item) return null;
            return (
              <OrderCard key={item._id}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {item.item_name}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2">
                        <strong>Quantity:</strong> {item.quantity} pcs
                      </Typography>
                      <Typography variant="body2">
                        <strong>Price:</strong> ₹{item.total_price}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2">
                        <strong>Vendor:</strong> {item.vendor_name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Buyer:</strong> {item.buyer_name}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </OrderCard>
            );
          })
        )}
      </Box>
    );
  };

  return (
    <StyledPaper elevation={3}>
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)} 
        centered
        variant="fullWidth"
      >
        <Tab label="Pending Orders" />
        <Tab label="Sold Items" />
        <Tab label="Bought Items" />
      </Tabs>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {error && (
        <Box mt={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && activeTab === 0 && orders_styling("Pending Orders", vendorOrders, "No pending orders.")}
      {!loading && activeTab === 1 && orders_styling("Sold Items", soldItems, "No sold items found.")}
      {!loading && activeTab === 2 && orders_styling("Bought Items", boughtItems, "No bought items found.")}
    </StyledPaper>
  );
};

export default OrdersHistory;