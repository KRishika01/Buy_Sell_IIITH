import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, List, ListItem, ListItemText, Box, Paper } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const My_Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [otp, setOtp] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const get_cart_items = async () => {
        try {
            const token = localStorage.getItem('token');
            const Res = await axios.get('http://localhost:8082/my_cart', {
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });

            if (Res.status === 200 || Res.status === 201) {
                // console.log("RES DATA IN CART: ",Res.data.data);
                setCartItems(Res.data.data);
            } 
            else {
                setError('No items found in the cart.');
            }
        } 
        catch (error) {
            console.error('Error fetching cart items:', error.Res?.data || error.message);
        }
    };

    const remove_from_cart = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const Res = await axios.delete(`http://localhost:8082/my_cart/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });

            if (Res.status === 200 || Res.status === 201) {
                alert('Item removed from cart successfully!');
                setCartItems((old_items) => old_items.filter(item => item._id !== id));
            }
        } 
        catch (error) {
            console.error('Error removing item:', error.Res?.data || error.message);
            alert('Failed to remove item. Please try again.');
        }
    };

    const finalOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            // console.log("TOKEN IN CART: ",token);
            if (!token) {
                alert("User is not authenticated. Please log in.");
                return;
            }

            const Res = await axios.post("http://localhost:8082/final_order", { cartItems }, {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });

            if (Res.status === 200 || Res.status === 201) {
                console.log("OTP IN CART: ",Res.data.otp);
                const otp = Res.data.otp;
                alert(`Your OTP is: ${otp}\nShare this OTP with the seller to complete the transaction.`);
                setCartItems([]);
            } 
            else {
                alert(Res.data.message || "Failed to place the order. Please try again.");
            }
        } 
        catch (error) {
            console.error("Error placing order:", error.Res?.data || error.message);
            alert("Failed to place the order. Please try again.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        // console.log("TOKEN IN FINAL_ORDER: ",token);
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // console.log("DECODED TOKEN IN CART: ",decodedToken);
                setUsername(`${decodedToken.firstname} ${decodedToken.lastname}`);
            } 
            catch (error) {
                console.error('Error decoding token:', error);
                alert('Invalid token. Please log in again.');
            }
        }
    }, []);

    useEffect(() => {
        get_cart_items();
    }, []);

    const calculateTotalCost = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };
    const calculateEachTotal = (item) => {
        return item.price * item.quantity;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" marginTop="15%" color='White' gutterBottom>My Cart</Typography>
            {error && <Typography color="error">{error}</Typography>}
            {cartItems.length > 0 ? (
                <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
                    <List>
                        {cartItems.map((item) => (
                            <ListItem key={item._id} divider>
                                <ListItemText
                                    primary={item.item_name}
                                    secondary={
                                        <>
                                            <Typography variant="body">Price: ₹{calculateEachTotal(item)}</Typography>
                                            <Typography variant="body2">Vendor: {item.vendor_name}</Typography>
                                            <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                        </>
                                    }
                                />
                                <Button color="error" variant="contained" sx={{marginLeft:"2%"}} onClick={() => remove_from_cart(item._id)}>
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h6" sx={{ mt: 2 }}>Total Cost: ₹{calculateTotalCost()}</Typography>
                    <Button color="primary" variant="contained" sx={{ mt: 2 }} onClick={finalOrder}>
                        Final Order
                    </Button>
                </Paper>
            ) : (
                <Typography>Your cart is empty!</Typography>
            )}
        </Container>
    );
};

export default My_Cart;
