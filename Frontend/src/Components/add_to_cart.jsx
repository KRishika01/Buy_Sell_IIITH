import axios from 'axios';
import React from 'react';
export const addToCart = async(item,setCart,setSnackMessage,setSnackOpen) => {
    try {
      const Res = await axios.post('http://localhost:8082/my_cart', {
        item_name: item.name,
        price: item.price,
        vendor_name: item.vendor,
      });

      if (Res.status === 200 || Res.status === 201) {
        setCart(prevCart => {
          const existingItem = prevCart.find(cartItem => cartItem.name === item.name);
          if (existingItem) {
            return prevCart.map(cartItem =>
              cartItem.name === item.name
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          } 
          else {
            return [...prevCart, { ...item, quantity: 1 }];
          }
        });
  
        setSnackMessage(`${item.name} added to cart!`);
        setSnackOpen(true);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error.Res?.data || error.message);
      alert('Failed to add item to cart. Please try again.');
    }
  };

// export default addToCart;