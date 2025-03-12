import React from "react";
import { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Paper, Typography, TextField, colors } from '@mui/material';
import AuthState from "./auth-state.js";
import axios from "axios";

const Login = () => {
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const navigate = useNavigate();
  
  const Login_func = async(e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const Res = await axios.post("http://localhost:8082/login",{email,password});

      if(Res.status === 200 || Res.status === 201) {
        localStorage.setItem("isLoggedIn","true");
        // console.log("RESPONSE DATA: ",Res.data.data);
        localStorage.setItem("token",Res.data.data.token);
        // console.log("TOKEN: ",Res.data.data.token);

        AuthState.login();
        // console.log("FLAG: ",AuthState.getAuthStatus().isLoggedIn)
        AuthState.getAuthStatus().isLoggedIn = true;
        localStorage.setItem('user',JSON.stringify(Res.data.user));
        // console.log("USER SET");
        alert("Login Successful!!");
        navigate('/profile');
      }
    }
    catch (err) {
      if(err.Res && err.Res.status === 400) {
        setError("All Fields are required");
      }
      else if(err.Res && err.Res.status === 401) {
        setError("Incorrect email or password");
      }
      else if(err.Res && err.Res.status === 409) {
        setError("Invalid Email format");
      }
      else if(err.Res) {
        setError("Login failed.Try again");
      }
      else {
        setError("Network Error");
      }
      console.log("Error in Login: ",err);
    }
    finally {
      setLoading(false);
    }
  };

  const styling = {
    heading: {
      fontSize: "2.5rem",
      fontWeight: "600",
    },
    paperStyle: {
      margin: "100px auto",
      padding: "2rem",
      boxShadow: "10px 10px 10px",
      borderRadius: "1rem",
    },
    buttonStyle: {
      fontSize: "1.2rem",
      fontWeight: "700",
      marginTop: "2rem",
      width: "100%",
      borderRadius: "0.5rem",
    },
    errorStyle: {
      marginTop: "1rem",
      color: "red",
    },
    accountStyle: {
      marginTop: "1.5rem",
    },
    rowStyle: {
      marginTop: "2rem",
      width: "100%",
      display: "flex",
    }
  };

  return (
    <Grid align="center">
      <Paper style={styling.paperStyle}
          sx={{
            width: {
              sm: "50vw",
              md: "40vw",
              lg: "30vw",
              xl: "20vw"
            },
            height: "auto",
            minHeight: "60vh",
          }}
      >
        <Typography style={styling.heading}>Login</Typography>

        <form onSubmit={Login_func}>
          <TextField
            sx={{
              label: {fontWeight: "700", fontSize:"1.2rem"}
            }}
            style={styling.rowStyle}
            label="Email"
            type="email"
            placeholder="Email"
            variant="outlined"
            value={email}
            onChange={
              (e) => setEmail(e.target.value)
            }
            required
          />
          <TextField
            sx={{
              label: {fontWeight: "700", fontSize:"1.2rem"}
            }}
            style={styling.rowStyle}
            label="Password"
            type="password"
            placeholder="Password"
            variant="outlined"
            value={password}
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
            variant="contained"
            disabled={loading}
          >{loading ? "Logging in.." : "Login"}</Button>
        </form>

        <Typography style={styling.accountStyle}>Don't have an account?{" "}
          <a href="/signup">Signup here</a>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Login;