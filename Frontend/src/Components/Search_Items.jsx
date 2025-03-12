import React, { useState, useEffect } from "react";
import axios from "axios";
import {TextField, Box, Typography, List, ListItem, ListItemText, Divider,FormControl, InputLabel, 
  Select, MenuItem, Checkbox, ListItemText as MuiListItemText,Button, 
  Snackbar,Paper,Container,Grid} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Search_Items = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [username, setUsername] = useState("");

  const categories = [
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
    'Others',
  ];

  useEffect(() => {
    const get_items = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("TOKEN IN SEARCH: ",token);
        const Res = await axios.get("http://localhost:8082/search_items", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (Res.data && Res.data.data) {
          setItems(Res.data.data);
        }
      } 
      catch (error) {
        console.error("Error fetching items:", error);
        setSnackMessage("Failed to fetch items");
        setSnackOpen(true);
      }
    };

    const token = localStorage.getItem("token");
    // console.log("TOKEN IN SEARCH 2: ",token);
    if (token) {
      const decodedToken = jwtDecode(token);
      // console.log("DECODED TOKEN IN SEARCH: ",decodedToken);
      setUsername(`${decodedToken.firstname} ${decodedToken.lastname}`);
    }

    get_items();
  }, []);

  const filtered_Items = items.filter((item) => {
    const matches_SearchQuery = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matches_Category_Filter = selectedCategories.length === 0 || (item.categories &&
        selectedCategories.some((category) => item.categories.includes(category)));
    return matches_SearchQuery && matches_Category_Filter;
  });

  const CategoryChange_func = (event) => {
    setSelectedCategories(event.target.value);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, my: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold', 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <SearchIcon sx={{ mr: 2 }} /> Search Items
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search for an item"
              variant="outlined"
              value={searchQuery}
              onChange={
                (e) => setSearchQuery(e.target.value)
              }
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 2, color: 'text.secondary' }} />
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ my: 3 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1 }} /> Categories
            </InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={CategoryChange_func}
              renderValue={(selected) => selected.join(", ")}
              label="Categories"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  <Checkbox checked={selectedCategories.includes(category)} />
                  <MuiListItemText primary={category} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          {filtered_Items.length > 0 ? (
            <List>
              {filtered_Items.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    component={Paper} 
                    elevation={2}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      transition: 'transform 0.3s ease',
                      '&:hover': { 
                        transform: 'scale(1.02)',
                        boxShadow: 3 
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="primary">
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Price:</strong> ₹{item.price}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Vendor:</strong> {item.vendor}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Description:</strong> {item.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Category:</strong> {item.categories}
                          </Typography>
                        </>
                      }
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/item/${item.name}`}
                      sx={{ 
                        ml: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          transform: 'scale(1.05)',
                          boxShadow: 3 
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '200px',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              <Typography variant="body1" color="text.secondary">No items found matching your search.</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Snackbar 
        open={snackOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackClose} 
        message={snackMessage} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Container>
  );
};

export default Search_Items;