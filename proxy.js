const express = require("express");
const cors = require("cors");
const axios = require("axios");
require('dotenv').config();

const app = express();
const port = 5000;

// Environment variables (use dotenv or similar to load them)
const API_KEY = process.env.REACT_APP_SCW_SECRET_KEY;
const PROJECT_ID = process.env.REACT_APP_SCW_DEFAULT_PROJECT_ID;

app.use(cors());
app.use(express.json());

// Proxy route
app.post("/api", async (req, res) => {
    const { model, messages } = req.body; // Extract data from the request body

    console.log("Request Body:", req.body);
    console.log("API_KEY:", API_KEY);
    console.log("PROJECT_ID:", process.env.REACT_APP_SCW_DEFAULT_PROJECT_ID);
    console.log("ORGANIZATION_ID:", process.env.REACT_APP_SCW_DEFAULT_ORGANIZATION_ID);

    try {
        // Make request to Scaleway API
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: model || "gpt-4o-mini", // Default model
                messages: messages || [], // Default messages
                stream: true, // Indicating that it's a streaming response
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`, // Ensure the token is correctly passed here
                    "X-Project-ID": process.env.REACT_APP_SCW_DEFAULT_PROJECT_ID,
                    "X-Organization-ID": process.env.REACT_APP_SCW_DEFAULT_ORGANIZATION_ID,
                },
            }
        );

        // Handle the response from Scaleway
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Transfer-Encoding": "chunked",
        });

        // Stream the response back to the client
        response.data.on("data", (chunk) => {
            res.write(chunk);
        });

        response.data.on("end", () => {
            res.end();
        });
    } catch (error) {
        console.error("Error:", error.message);
        console.error("Response data:", error.response?.data); // Log response data to help diagnose
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
