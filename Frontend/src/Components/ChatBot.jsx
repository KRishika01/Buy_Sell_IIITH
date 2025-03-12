import React, { useState, useEffect, useRef } from "react";
import { Container, TextField, IconButton, List, ListItem, Paper, Box,Typography,CircularProgress} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setIsLoading(true);
    // console.log("NEW MESSAGE: ",newMessage);

    try {
      const Res = await axios.post("http://localhost:5000/chatbot", { 
        message: input 
      });
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: Res.data.reply 
      }]);
    } 
    catch (error) {
      console.error("Error fetching chatbot response", error);
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: "Error: Unable to connect to the chatbot." 
      }]);
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Container 
      sx={{ 
        width: "40vw",   
        maxWidth: "400px", 
        py: 4, 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          height: '90vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="h6" component="h1">AI ChatBot</Typography>
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            bgcolor: 'background.default'
          }}
        >
          <List sx={{ p: 0 }}>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  p: 0.5
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 3,
                    borderTopRightRadius: msg.sender === 'user' ? 0 : 3,
                    borderTopLeftRadius: msg.sender === 'bot' ? 0 : 3,
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      opacity: 0.7,
                      textAlign: msg.sender === 'user' ? 'right' : 'left'
                    }}
                  ></Typography>
                </Paper>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={
              (e) => setInput(e.target.value)
            }
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 5,
                pr: 1,
                bgcolor: 'background.default'
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  sx={{
                    bgcolor: input.trim() ? 'primary.main' : 'grey.300',
                    color: 'white',
                    '&:hover': {
                      bgcolor: input.trim() ? 'primary.dark' : 'grey.400'
                    },
                    '&:disabled': {
                      bgcolor: 'grey.300',
                      color: 'grey.500'
                    },
                    transition: 'background-color 0.2s'
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <SendIcon size={20} />
                  )}
                </IconButton>
              )
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatBot;