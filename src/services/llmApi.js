
// Import the GoogleGenerativeAI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_SECRET_KEY);

// Select the Gemini 2.0 Flash model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Call the model to generate content
async function generateContent(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text(); // Return the response text
    } catch (error) {
        console.error("Error generating content:", error);
        return null; // Return null in case of an error
    }
}

// Export the function for use in other files
module.exports = { generateContent };
