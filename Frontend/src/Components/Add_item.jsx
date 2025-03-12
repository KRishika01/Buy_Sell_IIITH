import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Container, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, Box, OutlinedInput, Chip, Paper,Grid,Divider,useTheme} from '@mui/material';
import { 
  Add as AddIcon, 
  Category as CategoryIcon, 
  AttachMoney as AttachMoneyIcon, 
  Description as DescriptionIcon 
} from '@mui/icons-material';

const Add_item = () => {
    const theme = useTheme();
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const categoryOptions = [
        'Electronics', 
        'Clothing',
        'Home & Kitchen',
        'Books',
        'Toys & Games',
        'Sports & Outdoors',
        'Beauty & Personal Care',
        'Automotive',
        'Groceries',
        'Furniture', 
        'Others'
    ];

    const Add_Item = async () => {
        if (!itemName || !itemPrice || !description || categories.length === 0) {
            alert('Please fill all the details');
            return;
        }
        if (itemPrice < 0) {
            alert("Item price must be an integer");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('User is not logged in');
                return;
            }

            const decodedToken = jwtDecode(token);
            const vendorName = `${decodedToken.firstname} ${decodedToken.lastname}`;

            const Res = await axios.post('http://localhost:8082/additem', {
                item_name: itemName,
                price: itemPrice,
                vendor_name: vendorName,
                description: description,
                categories: categories
            });

            if (Res.status === 200 || Res.status === 201) {
                alert('Item added successfully!');
                setItemName('');
                setItemPrice('');
                setDescription('');
                setCategories([]);
            }
        } 
        catch (error) {
            console.error('Error adding item:', error.response?.data || error.message);
            alert('Failed to add the item. Please try again.');
        }
    };

    return (
        <Paper 
            elevation={6} 
            sx={{ 
                p: { xs: 2, sm: 4 },
                borderRadius: 4,
                width: '50%',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: theme.shadows[12],
                marginTop: "6%",
                marginLeft:"25%"
            }}
        >
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    textAlign: 'center', 
                    color: theme.palette.primary.main, 
                    fontWeight: 'bold',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}
            >
                <AddIcon sx={{ fontSize: 40 }} />
                Add New Item
            </Typography>

            <Divider sx={{
                mb: 3,
                bgcolor: theme.palette.primary.main,
                opacity: 0.3 
            }} />

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        label="Item Name"
                        variant="outlined"
                        fullWidth
                        value={itemName}
                        onChange={
                            (e) => setItemName(e.target.value)
                        }
                        InputProps={{
                            startAdornment: <AddIcon sx={{ mr: 2, color: 'action.active' }} />
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main
                                }
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        label="Item Price"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={itemPrice}
                        onChange={
                            (e) => setItemPrice(e.target.value)
                        }
                        InputProps={{
                            startAdornment: <AttachMoneyIcon sx={{ mr: 2, color: 'action.active' }} />
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main
                                }
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={description}
                        onChange={
                            (e) => setDescription(e.target.value)
                        }
                        InputProps={{
                            startAdornment: <DescriptionIcon sx={{
                                mr: 2,
                                color: 'action.active',
                                alignSelf: 'flex-start',
                                mt: 2
                            }} />
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main
                                }
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                color: 'action.active' 
                            }}
                        >
                            <CategoryIcon sx={{ mr: 1 }} /> Select Categories
                        </InputLabel>
                        <Select
                            multiple
                            value={categories}
                            onChange={
                                (e) => setCategories(e.target.value)
                            }
                            input={<OutlinedInput label="Select Categories" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((cat) => (
                                        <Chip 
                                            key={cat} 
                                            label={cat} 
                                            color="primary" 
                                            size="small" 
                                            variant="outlined"
                                            sx={{ m: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            )}
                            sx={{ 
                                borderRadius: 3,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.action.disabled
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main
                                }
                            }}
                        >
                            {categoryOptions.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={Add_Item}
                        startIcon={<AddIcon />}
                        sx={{ 
                            mt: 2,
                            py: 1.5,
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            boxShadow: theme.shadows[4],
                            '&:hover': { 
                                transform: 'translateY(-3px)',
                                boxShadow: theme.shadows[8]
                            }
                        }}
                    >
                        Add Item
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Add_item;