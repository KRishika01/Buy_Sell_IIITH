import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Button,Grid,Paper,Typography,TextField} from '@mui/material';

const Signup = () => {
    const [firstname,setFirstName] = useState("");
    const [lastname,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [age,setAge] = useState(0);
    const [contact,setContact] = useState(0);
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const Signup_func = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        // console.log("SIGNUP");
        try {
            const Res = await axios.post("http://localhost:8082/signup",{
                firstname,lastname,email,age,contact,password
            });
    
            if(Res.status === 200 || Res.status === 201) {
                alert("Signup successful!!");
                navigate('/login');
            }
        }
        catch(err) {
            if(err.Res && err.Res.status === 409) {
                setError("Email already exists.Please use a different email");
            }
            else if(err.Res && err.Res.status === 410) {
                setError("Invalid Email format");
            }
            else if(err.Res && err.Res.status === 408) {
                setError("Invalid Contact number");
            }
            else {
                setError(err);
            }
        };
    }
    const styling = {
        gridStyle: {
            marginTop: "10%",
        },
        paerStyle: {
            padding: "2rem",
            margin: "50px auto",
            borderRadius: "1rem",
            boxShadow: "10px 10px 10px",
        },
        heading: {
            fontSize: "2.5rem",
            fontWeight:"600",
        },
        rowStyle: {
            marginTop: "0.5rem",
            display: "flex",
        },
        buttonStyle: {
            marginTop:"2rem",
            fontSize:"1.2rem",
            fontWeight:"700",
            backgroudColor:"blue",
            borderRadius:"0.5rem",
        },
        accountStyle: {
            marginTop:"1.5rem",
        },
        errorStyle: {
            marginTop: "1rem",
            color: "red",
        },
    }
    return (
        <div>
            <Grid style={styling.gridStyle} align="center">
                <Paper style={styling.paerStyle}
                    sx={{
                        width: {
                            sm:"60vw",
                            md:"60vw",
                            lg:"60vw",
                            xl:"30vw",
                        },
                        height:{
                            sm:"70vh",
                        }
                    }}>
                        <Typography style={styling.heading}>SignUp</Typography>
                        <form onSubmit={Signup_func}>
                            <TextField style={styling.rowStyle}
                                sx={{
                                    label: {fontWeight:"700",fontSize:"1.2rem"}
                                }}
                                label="First Name"
                                name="firstname"
                                placeholder="First Name"
                                type="text"
                                onChange={
                                    (e) => setFirstName(e.target.value)
                                }
                                required
                            ></TextField>
                            <TextField style={styling.rowStyle}
                                sx={{
                                    label: {fontWeight:"700",fontSize:"1.2rem"}
                                }}
                                label="Last Name"
                                name="lastname"
                                placeholder="Last Name"
                                type="text"
                                onChange={
                                    (e) => setLastName(e.target.value)
                                }
                            ></TextField>
                            <TextField style={styling.rowStyle}
                                sx={{
                                    label: {fontWeight:"700",fontSize:"1.2rem"}
                                }}
                                label="Email"
                                name="email"
                                placeholder="Email"
                                type="email"
                                variant="outlined"
                                onChange={
                                    (e) => setEmail(e.target.value)
                                }
                                required
                            />
                            <TextField style={styling.rowStyle}
                                sx={{
                                    label: {fontWeight:"700",fontSize:"1.2rem"}
                                }}
                                label="Age"
                                name="age"
                                placeholder="Age"
                                type="number"
                                variant="outlined"
                                onChange={
                                    (e) => setAge(e.target.value)
                                }
                                inputProps={{
                                    min:15,
                                    max:60,
                                }}
                            />
                            <TextField style={styling.rowStyle}
                                sx={{
                                    label: {fontWeight:"700",fontSize:"1.2rem"}
                                }}
                                label="Contact"
                                name="contact"
                                placeholder="Contact"
                                type="tel"
                                variant="outlined"
                                onChange={
                                    (e) => setContact(e.target.value)
                                }
                            />
                            <TextField style={styling.rowStyle}
                                sx={{
                                    label: {fontWeight:"700",fontSize:"1.2rem"}
                                }}
                                label="Password"
                                name="password"
                                placeholder="Password"
                                type="password"
                                variant="outlined"
                                onChange={
                                    (e) => setPassword(e.target.value)
                                }
                                required
                            />
                            {error && (
                                <Typography style={styling.errorStyle}>{error}</Typography>
                            )} 
                            <Button style={styling.buttonStyle} 
                                type="submit"
                                variant="contained">
                                    SignUp
                            </Button>
                        </form>
                        <Typography style={styling.accountStyle}>Already have an account?
                            <a href="/login">Login here</a></Typography>
                    </Paper>
            </Grid>
        </div>
    )
}

export default Signup;