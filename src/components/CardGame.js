import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { generateContent } from "../services/llmApi";
import ReactMarkdown from 'react-markdown';
import "./CardGame.css";

function CardGame() {
  const [protagonist, setProtagonist] = useState("");
  const [antagonist, setAntagonist] = useState("");
  const [setting, setSetting] = useState("present day");
  const [userClass, setUserClass] = useState("Fighter");
  const [gender, setGender] = useState("Nonbinary");

  const [storyText, setStoryText] = useState("");
  const [cards, setCards] = useState([]);
  const [choiceCount, setChoiceCount] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [subgenre, setSubgenre] = useState("");
  const [storyline, setStoryline] = useState("");

  const handleNewStory = async (e) => {
    e.preventDefault();

    const prompt = `
You are generating an interactive story game 5-8 sentences at a time in the ${subgenre} genre, 
then generating 5 user responses below the story, then a summary of the plot so far with the following format:

Story text here
 
  ||  <Lawful good response> 

  ||  <Neutral good response>
  
  ||  <Chaotic good response>
  
  ||  <Chaotic neutral response>
  
  ||  <Chaotic evil response>
  
  ||  <Lawful evil response>

  || Full plot summary here (include past and future plot) and use the following format:
     Key Items: <ITEM1>, <ITEM2>, etc.
     Characters: <CHARACTER NAME> - <CHARACTER DESCRIPTION>
     Plot summary

Remember that each response should be something the user's character says and does, not a response to the user's character. 
Each story arc should take at least 20 prompts, two for each step in the hero's journey. 
Once one journey is complete, start the character on a new quest. 
Please remember to include || delimiters between each section of the response. Don't forget the summary at the end!

User inputs:
Protagonist: ${protagonist}
Antagonist: ${antagonist || "None"}
Setting: ${setting}
Class: ${userClass}
Protagonist's Gender: ${gender}

Generate a new story accordingly. Use tone and language appropriate to the setting and subgenre.
`;

    try {
      const rawText = await generateContent(prompt);
      if (rawText) {
        const parts = rawText.split("||").map(part => part.trim());
        const story = parts[0];
        const parsedOptions = parts.slice(1, 7);

        setStoryText(story);
        setCards(parsedOptions.map((opt) => opt));
        console.log(subgenre)

        // Update conversation history
        setConversation([{ userChoice: "Start of Story", response: story }]);
      } else {
        console.error("Failed to generate story.");
      }
    } catch (error) {
      console.error("Error generating new story:", error);
    }
  };

  const handleCardClick = async (selectedText) => {
    setChoiceCount((prevCount) => prevCount + 1);
    const prompt = `
  You are generating an interactive story game 5-8 sentences at a time, then generating 5 user responses below the story, then a short summary of the plot below that. The responses must follow this exact format, where each option is separated by '||':
  
  Story Text Here
  
  ||  <Lawful good response> 

  ||  <Neutral good response>
  
  ||  <Chaotic good response>
  
  ||  <Chaotic neutral response>
  
  ||  <Chaotic evil response>
  
  ||  <Lawful evil response>

  || Full plot summary here (include past and future plot) and use the following format:
     Key Items: <ITEM1>, <ITEM2>, etc.
     Characters: <CHARACTER NAME> - <CHARACTER DESCRIPTION>, <CH. Name2> - <CH DESC. 2> etc.
     Plot summary
  
  User input:
  The current story is as follows:
  ${storyline}
  
  The user selected: "${selectedText}"
  
  Your task is to continue the story based on the user’s selection and include five response options, each on a new line and separated by '||', as shown above.
  The user has made ${choiceCount + 1} choices so far. Use this count to guide the story arc. 
  Each story arc should take at least 20 prompts.
  The story section should only contain new text, don't include anything from the current story.
  Responses should *only* be from the perspective of ${protagonist} this is a first person interactive experience, treat responses accordingly.
  Once one journey is complete, start the character on a new quest. 
  Continue accordingly and adapt the story for the current count of choices.
  Use tone appropriate for the ${setting} setting and ${subgenre} subgenre.
  Don't forget the summary at the end! We need that so you can be passed back a plot summary.
  User inputs:
  Protagonist: ${protagonist}
  Antagonist: ${antagonist || "None"}
  Setting: ${setting}
  Class: ${userClass}
  Subgenre: ${subgenre}
  Protagonist's Gender: ${gender}
  `;

    try {
      const rawText = await generateContent(prompt);
      if (rawText) {
        const parts = rawText.split("||").map(part => part.trim());
        const story = parts[0];
        const parsedOptions = parts.slice(1, 7);
        const summary = parts[7];
        console.log(rawText);
        console.log(summary);

        setStoryText(story);
        setCards(parsedOptions.map((opt) => opt));
        setStoryline("");
        setStoryline(summary);
        console.log(storyline);

        // Update conversation history
        setConversation((prev) => {
          const newEntry = { userChoice: selectedText, response: story };
          const updatedHistory = [...prev, newEntry];
          return updatedHistory;
        });
      } else {
        console.error("Failed to continue story.");
      }
    } catch (error) {
      console.error("Error processing card click:", error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedCards = Array.from(cards);
    const [removed] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, removed);
    setCards(reorderedCards);
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
            <option value="sci-fi space">Sci-Fi Space</option>
            <option value="near-future">Near-Future</option>
            <option value="present day office">Present Day Office</option>
            <option value="high fantasy court">High Fantasy Court</option>
            <option value="sci-fi city">Sci-Fi City</option>
            <option value="near-future science facility">
              Near-Future Lab
            </option>
          </select>
        </label>
        <label>
          Subgenre:
          <select value={subgenre} onChange={(e) => setSubgenre(e.target.value)}>
            <option value="comedy">Comedy</option>
            <option value="rom-com">Romantic Comedy</option>
            <option value="romance">Romance</option>
            <option value="thriller">Thriller</option>
            <option value="horror">Horror</option>
            <option value="slasher">Slasher</option>
            <option value="tragedy">Tragedy</option>
            <option value="tragic comedy">Tragic Comedy</option>
            <option value="comedy of errors">Comedy of Errors</option>
            <option value="adventure">Adventure</option>
            <option value="action">Action</option>
          </select>
        </label>
        <label>
          Class:
          <select value={userClass} onChange={(e) => setUserClass(e.target.value)}>
            <option value="Astronaut">Astronaut</option>
            <option value="Actor">Actor</option>
            <option value="Musician">Musician</option>
            <option value="Inventor">Inventor</option>
            <option value="Fighter">Fighter</option>
            <option value="Healer">Healer</option>
            <option value="Rogue">Rogue</option>
            <option value="Magician">Magician</option>
          </select>
        </label>
        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="Masculine">Masculine</option>
            <option value="Feminine">Feminine</option>
            <option value="Nonbinary">Nonbinary</option>
          </select>
        </label>
        <button type="submit">Generate New Story</button>
      </form>

      <div className="story-container">
        <h2>Story</h2>
        <ReactMarkdown>{storyText}</ReactMarkdown>
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
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="card"
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

      <div className="conversation-container">
        <h2>Conversation History</h2>
        <ul>
          {conversation.map((entry, index) => (
            <li key={index}>
              <strong>Choice:</strong> {entry.userChoice} <br />
              <strong>Response:</strong> {entry.response}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CardGame;
