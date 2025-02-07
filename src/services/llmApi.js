// src/services/llmApi.js
import axios from 'axios';

// Use an environment variable for your API key. Create a .env file in the project root.
const API_KEY = process.env.REACT_APP_LLM_API_KEY;
const BASE_URL = 'https://api.openai.com/v1/chat/completions'; // Example endpoint (adjust as needed)

export const queryLLM = async (prompt) => {
  try {
    const response = await axios.post(
      BASE_URL,
      {
        model: 'gpt-3.5-turbo', // or another model of choice
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('LLM API error:', error);
    throw error;
  }
};
