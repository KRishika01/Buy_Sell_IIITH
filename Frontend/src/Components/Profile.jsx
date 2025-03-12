import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container,Paper,TextField,Typography,Button,Box,CircularProgress,
  Alert,Avatar,Grid,Divider,Snackbar,
  Grid2} from "@mui/material";
import {Edit as EditIcon,Save as SaveIcon,Cancel as CancelIcon,Person as PersonIcon} from '@mui/icons-material';

const Profile = () => {
  const [loading,setLoading] = useState(false);
  const [Editing,setEditing] = useState(false);
  const [profile,SetProfile] = useState(null);
  const [error,setError] = useState("");
  const [snack_bar,setSnack_bar] = useState({
    open: false,
    severity: 'success',
    message: '',
  })
  const [formData,setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    contact: "",
  });

  const navigate = useNavigate();

  const Profile_data_func = async(e) => {
    // e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // console.log("TOKEN IN PROFILE: ",token);
      if(!token) {
        console.log("No Token Found.");
      }
      console.log("Getting the user data...");

      const Res = await axios.get("http://localhost:8082/profile", {
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      // console.log("RESPONSE IN PROFILE: ",Res.data);

      if(Res.status === 200 || Res.status === 201) {
        console.log("RESPONSE DATA IN PROFILE: ",Res.data.data);
        SetProfile(Res.data.data);
        setFormData({
          firstname: Res.data.data.firstname || "",
          lastname: Res.data.data.lastname || "",
          age: Res.data.data.age || "",
          contact: Res.data.data.contact || "",
          email: Res.data.data.email || "",
        });
      }
    }
    catch(error) {
      console.error("Error in getting the userdata: ",error);
      if(error.Res && error.Res.status === 403){
        setError("No permission to access");
      }
      else if(Res.error && Res.error.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      else {
        setError("Error getting the profile");
        handleSnackbar("Failed to load the profile data","error");
      }
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    Profile_data_func();
  }, []);

  useEffect(()=> {
    const token = localStorage.getItem("token");
    // console.log("TOKEN IN PROFILE 1: ",token);
    if(!token) {
      navigate('/login');
    }
    else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [navigate]);

  const handleCloseSnackbar = () => {
    setSnack_bar({...snack_bar,
      open:false
    });
  };

  const handleSnackbar = (
    message,severity
  ) => {
    setSnack_bar({
      open: true,
      message,
      severity,
    });
  };

  if(loading) {
    return (
      <Box  
        display="flex"
        jusifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress/>
      </Box>  
    );
  }
  const profile_edit = async(e) => {
    e.preventDefault();

    try {
      const Res = await axios.put("http://localhost:8082/profile/edit",
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if(Res.status === 200 || Res.status === 201) {
        console.log("RESONSE DATA IN PROFILE 2: ",Res.data.data);
        SetProfile(Res.data.data);
        handleSnackbar("Profile updated successfully!","success");
        setEditing(false);
      }
    }
    catch(error) {
      handleSnackbar("Failed to update the profile.","error");
    };
  };

  useEffect(()=> {
    const token = localStorage.getItem('token');
    console.log("TOKEN IN PROFLE UPDATE: ",token);
    if(!token) {
      navigate("/login");
    }
  }, [navigate]);

  if(loading) {
    return (
      <Box  
        display="flex"
        jusifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress/>
      </Box>  
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py:4 }}>
      <Paper elevation={3} sx={{p:4}}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mr: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 40}}/>
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h4" gutterBottom>Profile</Typography>
            <Typography variant="body1" color="textSecondary">{profile?.email}</Typography>
          </Box>
          {!Editing && (
            <Button
              variant="contained"
              startIcon={<EditIcon/>}
              onClick={
                ()=>setEditing(true)
              }
            >Edit Profile</Button>
          )}
        </Box>
        <Divider sx={{my:3}}/>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {Editing ? (
          <form onSubmit={profile_edit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="First Name"
                  value={formData.firstname}
                  onChange={
                    (e) => setFormData({
                      ...formData,
                      firstname: e.target.value,
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Last Name"
                  value={formData.lastname}
                  onChange={
                    (e) => setFormData({
                      ...formData,
                      lastname: e.target.value,
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Age"
                  value={formData.age}
                  onChange={
                    (e) => setFormData({
                      ...formData,
                      age: e.target.value,
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth
                  label="Contact"
                  value={formData.contact}
                  onChange={
                    (e) => setFormData({
                      ...formData,
                      contact: e.target.value,
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon/>}
                  >Save Changes</Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon/>}
                    onClick={()=>setEditing(false)}
                  >Cancel</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="'subtitle2" color="textSecondary">First Name</Typography>
              <Typography variant="h6">{profile?.firstname || 'Not Set'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="'subtitle2" color="textSecondary">Last Name</Typography>
              <Typography variant="h6">{profile?.lastname || 'Not Set'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="'subtitle2" color="textSecondary">Age</Typography>
              <Typography variant="h6">{profile?.age || 'Not Set'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="'subtitle2" color="textSecondary">Contact</Typography>
              <Typography variant="h6">{profile?.contact || 'Not Set'}</Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
      <Snackbar 
        open={snack_bar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snack_bar.severity}
          variant="filled"
        >{snack_bar.message}</Alert>
      </Snackbar>
    </Container>
  )
}

export default Profile;