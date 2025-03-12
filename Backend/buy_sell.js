import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import session from 'express-session';
dotenv.config();
import AuthState from '../Frontend/src/Components/auth-state.js';
import authenticateToken from './jwt_verification.js';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import crypto from 'crypto';
import { data } from 'react-router-dom';
import bodyParser from 'body-parser';
import 'dotenv/config';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.JWT_SECRET, // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));
app.use(express.urlencoded({ extended: true }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MONGO_URL = "mongodb+srv://Rishika_26:Rishika%4026@cluster0.9ue28.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(MONGO_URL);

const database_name = "Authentication";
const collection_name_users = "Authentication";
const collection_login_name = "Login";
const collection_name_seller = "Seller_Products";
const collection_order_name = "Orders_History";
const collection_name_cart = "My_Cart";
const collection_sold_name = "Sold_Items";
const collection_bought_name = "Bought_Items";

// **** SIGNUP ****

app.post('/signup', async (req, res) => {
    const { firstname, lastname, email, age, contact, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const email_format = /^[a-zA-Z]+(\.[a-zA-Z]+)?@(students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/;
    if (!email_format.test(email)) {
        return res.status(410).json({
            success: false,
            message: 'Invalid email format.'
        });
    }

    const contact_format = /^\d{0,10}$/

    if (!contact_format.test(contact)) {
        return res.status(408).json({
            success: false,
            message: 'Invalid Contact Number.'
        });
    }

    const hash_password = await bcrypt.hash(password, 10);
    // console.log("hash_password"+hash_password);

    const newuser = {
        firstname,
        lastname,
        email,
        age,
        contact,
        password: hash_password,
    };


    client.connect();
    const database = client.db(database_name);
    const collection = database.collection(collection_name_users);

    const user_existing = await collection.findOne({ email: email });
    if (user_existing) {
        return res.status(409).json({
            success: false,
            message: 'Email already exists',
        });
    }
    else {
        const output = collection.insertOne(newuser);
        // const jwt_token = create_JWT_token((await output).insertedId.toString());
        // console.log("Generated JWT token:", jwt_token);

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                firstname,
                lastname,
                email,
                age,
                contact,
                // jwt_token
            }
        });
        
    }

    // res.status(201).json({
    //     firstname,
    //     lastname,
    //     email,
    //     age,
    //     contact,
    //     token:jwt_token,
    // });
});

// **** LOGIN ****

app.post('/login', async function (req, res) {
    let connection;
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', { email, password }); // Debug log

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const email_format = /^[a-zA-Z]+(\.[a-zA-Z]+)?@(students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/;
        if (!email_format.test(email)) {
            return res.status(409).json({
                success: false,
                message: 'Invalid email format.'
            });
        }

        connection = await client.connect();
        const database = client.db(database_name);
        const collection = database.collection(collection_name_users);
        const collection_1 = database.collection(collection_login_name);

        const user = await collection.findOne({ email: email });
        console.log('Found user:', user); // Debug log

        if (!user) {
            return res.status(400).json({
                message: 'User not found. Please check email or signup'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            const loginUser = {
                email,
                password: user.password,
            };
            const output = await collection_1.insertOne(loginUser);
            AuthState.login({
                email,
                password: user.password,
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname
            });
            console.log("After login:", AuthState.getAuthStatus().currentUser);
            console.log("User state:", AuthState.getAuthStatus());
            console.log("rhuofg " + AuthState.getAuthStatus().isLoggedIn);
            console.log("Done");

            req.session.user = {
                id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            };

            return res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                data: {
                    email,
                    token,
                }
            });
        } else {
            console.log('Password mismatch:', {
                provided: password,
                stored: user.password
            }); 
            return res.status(401).json({
                message: 'Incorrect password'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: 'An error occurred during login',
            error: error.message
        });
    }
    // finally {
    //     // Close the connection after the operation
    //     if (connection) {
    //         try {
    //             await client.close();
    //         } catch (error) {
    //             console.error('Error closing connection:', error);
    //         }
    //     }
    // }
});

// **** LOGOUT ****

app.post('/logout', async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to destroy session' });
            }
            res.status(200).send('Logged out successfully');
        });
    } else {
        res.status(400).json({ error: 'No session found' });
    }
});

// **** PROFILE ****

app.get('/profile', authenticateToken, async (req, res) => {
    console.log("Received profile request");

    try {
        await client.connect();
        console.log("Connected to MongoDB"); 

        const database = client.db(database_name);
        const loginCollection = database.collection(collection_login_name); 
        const signupCollection = database.collection(collection_name_users); 

        // Fetch the most recent login record
        const recentLogin = await loginCollection.findOne({}, { sort: { _id: -1 } });
        console.log("Most recent login record:", recentLogin); 

        if (!recentLogin) {
            return res.status(404).json({ message: 'No user found in login records' });
        }

        const userDetails = await signupCollection.findOne({ email: recentLogin.email });
        console.log("User details from signup table:", userDetails); 

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found in signup records' });
        }

        const profileData = {
            email: recentLogin.email,
            firstname: userDetails.firstname || 'Not set',
            lastname: userDetails.lastname || 'Not set',
            age: userDetails.age || 'Not set',
            contact: userDetails.contact || 'Not set'
        };

        res.status(200).json({
            message: 'User details fetched successfully',
            data: profileData
        });
    } catch (error) {
        console.error('Error in fetching user details:', error); 
        res.status(500).json({
            message: 'Failed to fetch user data',
            error: error.message
        });
    }
});

app.put('/profile/edit', async (req, res) => {
    const { firstname, lastname, age, contact} = req.body;

    if (!firstname || !lastname || !age || !contact) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await client.connect();
        console.log("Connected to MongoDB"); 

        const database = client.db(database_name);
        const collection = database.collection(collection_name_users);
        const result = await collection.findOneAndUpdate(
            {}, 
            { $set: { firstname, lastname, age, contact} },
            { returnDocument: 'after', upsert: true } 
        );

        res.status(200).json({ data: result.value });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// **** ADD ITEM ****

app.post('/additem', authenticateToken, async function (req, res) {
    try {
        const { item_name, price, description, categories } = req.body;

        if (!item_name || !price || !description || !categories || categories.length === 0) {
            return res.status(400).json({
                message: "All fields are required, including categories.",
            });
        }

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: "User is not authenticated." });
        }

        let username;
        try {
            const decodedToken = jwtDecode(token);
            username = `${decodedToken.firstname} ${decodedToken.lastname}`;
        } catch (error) {
            console.error("Error decoding token:", error);
            return res.status(401).json({ message: "Invalid token." });
        }

        await client.connect();
        const database = client.db(database_name);
        const collection = database.collection(collection_name_seller);
        console.log("Connected to database");

        const output = await collection.insertOne({
            item_name,
            price,
            vendor_name: username, 
            description,
            categories,
            username,
        });

        console.log("Item added with ID:", output.insertedId);

        return res.status(200).json({
            message: "Item added successfully.",
        });
    } catch (error) {
        console.error("Error adding item:", error);
        return res.status(500).json({
            message: "Failed to add item",
            error: error.message,
        });
    }
});

// **** SEARCH ITEMS ****

app.get("/search_items", authenticateToken, async function(req, res) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: "User is not authenticated." });
        }

        let username;
        try {
            const decodedToken = jwtDecode(token);
            username = `${decodedToken.firstname} ${decodedToken.lastname}`;
        } catch (error) {
            console.error("Error decoding token:", error);
            return res.status(401).json({ message: "Invalid token." });
        }

        await client.connect();
        const database = client.db(database_name);
        const collection = database.collection(collection_name_seller);
        const items = await collection.find().toArray();

        const formattedItems = items.map((item) => {
            const isUserVendor = item.vendor_name === username;
            return {
                name: item.item_name,
                price: item.price,
                vendor: item.vendor_name,
                description: item.description,
                categories: item.categories,
                access_denied: isUserVendor ? "You cannot buy your own item." : null,
            };
        });

        console.log("GET ALL THE ITEMS");
        return res.status(200).json({
            message: "Got all the data",
            data: formattedItems,
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        return res.status(500).json({
            message: "Failed to get data",
            error: error.message,
        });
    }
});


// **** SEARCH ITEM BY NAME ****

app.get("/item/:itemName", authenticateToken, async function(req, res) {
    const { itemName } = req.params;

    try {
        await client.connect();
        const database = client.db(database_name);
        const collection = database.collection(collection_name_seller);

        const item = await collection.findOne({ item_name: itemName });

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        const formattedItem = {
            name: item.item_name,
            price: item.price,
            vendor: item.vendor_name,
            description: item.description,
            categories: item.categories, 
        };

        console.log("Fetched item details:", formattedItem);
        return res.status(200).json({
            message: "Item fetched successfully",
            data: formattedItem,
        });
    } catch (error) {
        console.error("Error fetching item:", error);
        return res.status(500).json({
            message: "Failed to get item details",
            error: error.message,
        });
    }
});

// **** CART ****

app.post('/my_cart', authenticateToken, async function(req, res) {
    const { item_name, price, vendor_name } = req.body;
    const userId = req.user.id; 

    if(!item_name || !price || !vendor_name) {
        return res.status(400).json({
            message: "All Fields are required",
        });
    }
    const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: "User is not authenticated." });
        }

        let username;
        try {
            const decodedToken = jwtDecode(token);
            username = `${decodedToken.firstname} ${decodedToken.lastname}`;
        } catch (error) {
            console.error("Error decoding token:", error);
            return res.status(401).json({ message: "Invalid token." });
        }

    try {
        await client.connect();
        const database = client.db(database_name);
        const collection = database.collection(collection_name_cart);
        
        const exist_item = await collection.findOne({ item_name, userId });
        
        if(exist_item) {
            await collection.updateOne(
                { item_name, userId },
                {
                    $inc: { quantity: 1 }, 
                    // $set: { price: quantity * exist_item.price } 
                }
                
            );
            res.status(200).send({ message: 'Item quantity updated in cart' });
        } else {
            const output = await collection.insertOne({ 
                item_name, 
                price, 
                vendor_name, 
                buyer_name: username,
                quantity: 1, 
                userId 
            });
            
            res.status(200).json({
                message: "Item added to cart successfully."
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error adding item to cart",
            error: error.message
        });
    }
});

app.get('/my_cart', authenticateToken, async function (req, res) {
    const userId = req.user.id; 

    try {
        await client.connect();
        const database = client.db(database_name);
        const collection = database.collection(collection_name_cart);
  
        // Fetch only items for the specific user
        const items = await collection.find({ userId }).toArray();
  
        if (items.length === 0) {
            return res.status(404).json({
                message: 'Cart is empty.',
            });
        }
  
        res.status(200).json({
            message: 'Items fetched successfully.',
            data: items,
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({
            message: 'Failed to fetch cart items',
            error: error.message,
        });
    }
});

app.delete('/my_cart/:id', authenticateToken, async function (req, res) {
    const { id } = req.params;
    const userId = req.user.id; 

    try {
        await client.connect();
        const database = client.db(database_name);
        const collection = database.collection(collection_name_cart);
        console.log("Deleting item:", { itemId: id, userId }); 
        const result = await collection.deleteOne({ 
            _id: new ObjectId(id), 
            userId 
        });
  
        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "Item not found",
            });
        }
  
        res.status(200).send({
            message: "Item removed from cart successfully",
        });
    } catch (error) {
        console.error("Error in removing the item from the cart:", error);
        res.status(500).send({
            message: "Failed to remove item from cart",
            error: error.message,
        });
    }
});


app.post('/final_order', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const { cartItems } = req.body;

        console.log("REQ USER ID: ",req.user.id);
        // console.log("USER_ID: ",order.userId);

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'No items in the cart' });
        }

        const otp = generateOTP();
        console.log("OTP IN FINAL ORDER: ",otp);

        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
        console.log("HASHED OTP IN FINAL ORDER: ",hashedOtp);

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: "User is not authenticated." });
        }

        let username;
        try {
            const decodedToken = jwtDecode(token);
            username = `${decodedToken.firstname} ${decodedToken.lastname}`;
        } catch (error) {
            console.error("Error decoding token:", error);
            return res.status(401).json({ message: "Invalid token." });
        }


        await client.connect();
        const database = client.db(database_name);
        const cartCollection = database.collection(collection_name_cart);
        const orderCollection = database.collection(collection_order_name);

        const newOrder = {
            userId,
            username,
            cartItems,
            otp: hashedOtp, 
            status: "Pending",
            createdAt: new Date(),
        };

        const result = await orderCollection.insertOne(newOrder); 
        console.log("ACK: ",result.acknowledged);
        if (result.acknowledged) {
            console.log("ENTERED");
            console.log("USER_ID: ",userId);
            await cartCollection.deleteMany({ userId }); 

            console.log('Order placed successfully and cart items deleted');
            return res.status(200).json({
                message: 'Placed final order successfully',
                otp 
            });
        } else {
            console.error('Order insertion failed');
            return res.status(500).json({ message: 'Failed to place the order. Please try again' });
        }
    } catch (error) {
        console.error('Error in placing the order:', error);
        return res.status(500).json({
            message: 'Failed to place the order. Please try again',
            error: error.message,
        });
    } 
    // finally {
    //     await client.close(); // Ensure the database connection is closed
    // }
});


app.get("/orders_history", authenticateToken, async (req, res) => {
    try {
      const vendorName = `${req.user.firstname} ${req.user.lastname}`;
      console.log("VENDOR: ", vendorName);
  
      await client.connect();
      const database = client.db(database_name);
      const ordersCollection = database.collection(collection_order_name);
      const soldCollection = database.collection(collection_sold_name);
      const boughtCollection = database.collection(collection_bought_name);
  
      const orders = await ordersCollection.find({
        "cartItems.vendor_name": vendorName,
        status: "Pending",
      }).toArray();

      const orders_1 = await ordersCollection.find({
        "cartItems.buyer_name": vendorName,
        status: "Pending",
      }).toArray();
  
      const soldItems = await soldCollection.find({
        vendor_name: vendorName,
      }).toArray();
      const formattedSoldItems = soldItems.flatMap(sold => sold.vendorItems);
      console.log("SOLD ITEMS: ", soldItems);
      console.log("FORMATTED SOLD ITEMS: ", formattedSoldItems);
  
      const boughtItems = await boughtCollection.find({
        buyer_name: req.user.firstname + " " + req.user.lastname, 
      }).toArray();
      const formattedBoughtItems = boughtItems.flatMap(bought => bought.vendorItems);
      console.log("BOUGHT ITEMS: ", boughtItems);
      console.log("FORMATTED BOUGHT ITEMS: ", formattedBoughtItems);
  
      const vendorOrders = orders
        .map(order => ({
          ...order,
          cartItems: order.cartItems.filter(item => item.vendor_name === vendorName),
        }))
        .filter(order => order.cartItems.length > 0);

        const vendorOrders_1 = orders_1
        .map(order => ({
          ...order,
          cartItems: order.cartItems.filter(item => item.buyer_name === vendorName),
        }))
        .filter(order => order.cartItems.length > 0);

        console.log("VENDOR_ORDERS: ",vendorOrders);
  
      res.status(200).json({
        vendorOrders: vendorOrders,
        vendorOrders_1: vendorOrders_1,
        soldItems,
        boughtItems,
      });
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
      res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
  });
  
  app.post("/deliver_items", authenticateToken, async (req, res) => {
    try {
        const { otp, orderId } = req.body;
        const vendorName = `${req.user.firstname} ${req.user.lastname}`;

        await client.connect();
        const database = client.db(database_name);
        const ordersCollection = database.collection(collection_order_name);
        const soldCollection = database.collection(collection_sold_name);
        const boughtCollection = database.collection(collection_bought_name);

        const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const vendorItems = order.cartItems.filter(item => item.vendor_name === vendorName);
        if (vendorItems.length === 0) {
            return res.status(403).json({ message: "You cannot verify this order" });
        }
        // console.log("VENDOR ITEMS: ",vendorItems);
        console.log("ORDER otp: ",order.otp);

        console.log("OTP: ",otp);
        const isOTPValid = await bcrypt.compare(otp, order.otp);

        if(!isOTPValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const soldItems_Insert = vendorItems.map(item => ({
            orderId: order._id,
            itemId: item._id,
            item_name: item.item_name,
            vendor_name: vendorName,
            buyer_name: order.username,
            quantity: item.quantity,
            price: item.price,
            total_price: item.price * item.quantity,
            dateSold: new Date(),
        }));
        const sold_items = await soldCollection.insertMany(soldItems_Insert);
        console.log("VENDOR ITEMS INSERTED SUCCESSFULLY");
        // console.log("INSERT: ",soldItems_Insert);

        const boughtItems_Insert = vendorItems.map(item => ({
            orderId: order._id,
            itemId: item._id,
            item_name: item.item_name,
            vendor_name: vendorName,
            buyer_name: order.username,
            quantity: item.quantity,
            price: item.price,
            total_price: item.price * item.quantity,
            dateSold: new Date(),
        }));
        const bought_items = await boughtCollection.insertMany(boughtItems_Insert);
        // console.log("BOUGHT ITEMS INSERTED SUCCESSFULLY");
        // console.log("BOUGHT INSERT: ",bought_items);
        const remainingItems = order.cartItems.filter(item => item.vendor_name !== vendorName);

        if (remainingItems.length === 0) {
            await ordersCollection.deleteOne({ _id: new ObjectId(orderId) });
        } 
        else {
            await ordersCollection.updateOne(
                { _id: new ObjectId(orderId) },
                { $set: { cartItems: remainingItems } }
            );
        }

        res.status(200).json({ message: "Order verified successfully" });
    } 
    catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ message: "Failed to verify order", error: error.message });
    }
});

// **** CHATBOT ****

// app.post('/chatbot', async (req, res) => {
//     try {
//         const message = req.body.message;

//         if (!message) {
//             return res.status(400).json({ error: 'Message cannot be empty' });
//         }

//         // Call Gemini API
//         const response = await axios.post(
//             `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
//             {
//                 contents: [{ role: "user", parts: [{ text: message }] }]
//             }
//         );

//         const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

//         res.json({ reply });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: 'Failed to process request' });
//     }
// });


axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            // alert("You need to log in to access this page.");
            navigate('/login'); 
        }
        return Promise.reject(error);
    }
);

const PORT = process.env.PORT || 8082;
app.listen(PORT, function (err) {
  if (err) throw err;
  console.log(`Server running on http://localhost:${PORT}`);
});
