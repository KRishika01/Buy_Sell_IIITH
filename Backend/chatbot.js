import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/chatbot', async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: message }] }]
            }
        );

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

        res.json({ reply });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
