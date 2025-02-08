import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { generateContent } from "../services/llmApi"; // Import the generateContent function from llmAPI.js
import "./CardGame.css";

function CardGame() {
  const [protagonist, setProtagonist] = useState("");
  const [antagonist, setAntagonist] = useState("");
  const [setting, setSetting] = useState("present day");
  const [userClass, setUserClass] = useState("Fighter");

  const [storyText, setStoryText] = useState("");
  //const [options, setOptions] = useState([]);
  const [cards, setCards] = useState([]);
  //const [conversation, setConversation] = useState([]);

  const handleNewStory = async (e) => {
    e.preventDefault();

    const prompt = `
You are generating a story 5-8 sentences at a time, then generating 5 user responses below the story with the following format:

<Story>
 
|| (Paragon) <Lawful good response> 

|| (Rebel Good) <Chaotic good response>

|| (Neutral) <Chaotic neutral response>

|| (Rebel Evil) <Chaotic evil response>

|| (Inquisitor) <Lawful evil response>

Remember that each response should be something the user's character says and does, not a response to the user's character. 
Each story arc should take at least 24 prompts, two for each step in the hero's journey. 
Once one journey is complete, start the character on a new quest. 
Please remember to include || delimiters between each section of the response

User inputs:
Protagonist: ${protagonist}
Antagonist: ${antagonist || "None"}
Setting: ${setting}
Class: ${userClass}

Generate a new story accordingly.
`;

    try {
      const rawText = await generateContent(prompt); // Call generateContent and pass the prompt
      if (rawText) {
        // Split the raw response by the '||' delimiter
        const parts = rawText.split("||").map(part => part.trim());

        // The first part is the story, and the next 5 parts are the options
        const story = parts[0]; // Everything before the first '||' is the story text
        const parsedOptions = parts.slice(1, 6); // The next 5 parts are the options

        setStoryText(story); // Set the story text
        //setOptions(parsedOptions); // Set the options array
        setCards(parsedOptions.map((opt) => opt)); // Set the cards to the 5 options

        //setConversation((prev) => [...prev, { prompt, response: rawText }]);
      } else {
        console.error("Failed to generate story.");
      }
    } catch (error) {
      console.error("Error generating new story:", error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedCards = Array.from(cards);
    const [removed] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, removed);
    setCards(reorderedCards);
  };

  const handleCardClick = async (selectedText) => {
    const prompt = `
  You are generating a story 5-8 sentences at a time, then generating 5 user responses below the story. The responses must follow this exact format, where each option is separated by '||':
  
  <Story Text>
  
  || (Paragon) <Lawful good response> 
  
  || (Rebel Good) <Chaotic good response>
  
  || (Neutral) <Chaotic neutral response>
  
  || (Rebel Evil) <Chaotic evil response>
  
  || (Inquisitor) <Lawful evil response>
  
  User input:
  The current story is as follows:
  ${storyText}
  
  The user selected: "${selectedText}"
  
  Your task is to continue the story based on the user’s selection and include five response options, each on a new line and separated by '||', as shown above.
  Each option must be a different character's potential action or response to the current situation.
  `;
  
    try {
      const rawText = await generateContent(prompt); // Call generateContent and pass the prompt
      if (rawText) {
        // Split the raw response by the '||' delimiter
        const parts = rawText.split("||").map(part => part.trim());
  
        // The first part is the story, and the next 5 parts are the options
        const story = parts[0]; // Everything before the first '||' is the story text
        const parsedOptions = parts.slice(1, 6); // The next 5 parts are the options
  
        setStoryText(story); // Set the new story text
        //setOptions(parsedOptions); // Set the new options
        setCards(parsedOptions.map((opt) => opt)); // Set the new cards
  
        //setConversation((prev) => [...prev, { prompt, response: rawText }]);
      } else {
        console.error("Failed to continue story.");
      }
    } catch (error) {
      console.error("Error processing card click:", error);
    }
  };
  

  return (
    <div className="card-game">
      <h1>StoryCard MAgIc</h1>
      <form onSubmit={handleNewStory} className="input-form">
        <label>
          Protagonist Name:
          <input
            type="text"
            value={protagonist}
            onChange={(e) => setProtagonist(e.target.value)}
            required
          />
        </label>
        <label>
          Antagonist Name (optional):
          <input
            type="text"
            value={antagonist}
            onChange={(e) => setAntagonist(e.target.value)}
          />
        </label>
        <label>
          Setting:
          <select value={setting} onChange={(e) => setSetting(e.target.value)}>
            <option value="present day">Present Day</option>
            <option value="fantasy">Fantasy</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="near-future">Near-Future</option>
          </select>
        </label>
        <label>
          Class:
          <select value={userClass} onChange={(e) => setUserClass(e.target.value)}>
            <option value="Fighter">Fighter</option>
            <option value="Healer">Healer</option>
            <option value="Rogue">Rogue</option>
            <option value="Mage">Mage</option>
          </select>
        </label>
        <button type="submit">Generate New Story</button>
      </form>

      <div className="story-container">
        <h2>Story</h2>
        <p>{storyText}</p>
      </div>

      <div className="options-container">
        <h2>Responses</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="cards">
            {(provided) => (
              <div
                className="cards-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {cards.map((cardText, index) => (
                  <Draggable key={cardText + index} draggableId={cardText + index} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`card ${snapshot.isDragging ? "dragging" : ""}`}
                        onClick={() => handleCardClick(cardText)}
                      >
                        {cardText}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default CardGame;
