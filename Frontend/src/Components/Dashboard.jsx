import React from "react";
import { TextField, Typography, Box } from "@mui/material";

export const Dashboard = () => {
    return (
        <Box 
            sx={{
                height: "50vh", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                // backgroundColor: ""
            }}
        >
            <Typography 
                variant="h3" 
                sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                }}
            >
                WELCOME TO DASHBOARD!!
            </Typography>
        </Box>
    );
};
