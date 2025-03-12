import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box, Typography, Card, CardContent, TextField, Button, CircularProgress, Alert
} from "@mui/material";

const Deliver_Items = () => {
    const [vendorOrders, setVendorOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [OTP, setOTP] = useState({}); // Store OTP for each order
    const [verifyLoading, setVerifyLoading] = useState(false);

    const otp_change = (orderId, value) => {
        setOTP((prev) => ({ ...prev, [orderId]: value }));
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const Res = await axios.get("http://localhost:8082/orders_history", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            // console.log("RESPONSE IN DELIVER: ",Res.data);
            // console.log("RESPONSE DATA DELIVER: ",Res.data.vendorOrders);
            setVendorOrders(Res.data.vendorOrders || []);
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

    const verifyOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            // console.log("TOKEN IN DELIVER ITEMS: ",token);
            // console.log("ENTERTED TRY DELIVER");
            setVerifyLoading(true);
            const otp = OTP[orderId] || "";
            // console.log("OTP: ",otp);
            if (!otp) return alert("Please enter an OTP.");
            // console.log("OTP IN DELIVER>JSX ",otp);
            const Res = await axios.post( "http://localhost:8082/deliver_items",{ otp, orderId },{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log("RESPONSE MESSAGE: ",Res.data.message);
            alert(Res.data.message); 
            fetchOrders(); 
        } 
        catch (error) {
            console.error("Error verifying order:", error);
            alert(error.Res?.data?.message || "Error verifying order.");
        } 
        finally {
            setVerifyLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const calculateEachTotal = (item) => {
        return item.price * item.quantity;
    }

    return (
        <Box mt={3}>
            <Typography variant="h5" gutterBottom>Pending Orders</Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : vendorOrders.length === 0 ? (
                <Alert severity="info">No pending orders.</Alert>
            ) : (
                vendorOrders.map((order) => (
                    <Card key={order._id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Order ID: {order._id}
                            </Typography>
                            {/* <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Vendor: {order.vendor_name}
                            </Typography> */}
                            {order.cartItems && order.cartItems.length > 0 ? (
                                <ul>
                                    {order.cartItems.map((item, index) => (
                                        <li key={`${order._id}-${index}`}>
                                            <strong>Item Name: </strong>{item.item_name} <br/>
                                            <strong>Quantity: </strong>{item.quantity} pcs <br/>
                                            <strong>Price (each): </strong>₹{item.price} <br/>
                                            <strong>Total Price: </strong>₹{calculateEachTotal(item)} <br/>
                                            <strong>Vendor: </strong>{item.vendor_name} <br/>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography>No items in this order.</Typography>
                            )}
                            <Box mt={2} display="flex" gap={2}>
                                <TextField
                                    label="Enter OTP"
                                    variant="outlined"
                                    size="small"
                                    value={OTP[order._id] || ""}
                                    onChange={
                                        (e) => otp_change(order._id, e.target.value)
                                    }
                                    disabled={verifyLoading} 
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => verifyOrder(order._id)}
                                    disabled={verifyLoading} 
                                >
                                    {verifyLoading ? "Verifying..." : "Verify Order"}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default Deliver_Items;
