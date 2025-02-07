// src/components/CardGame.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Dummy data for cards (each card could be a story or dialogue option)
const initialCards = [
  { id: 'paragon', content: 'Paragon response' },
  { id: 'rebel', content: 'Rebel response' },
  { id: 'instigator', content: 'Instigator response' },
  { id: 'troublemaker', content: 'Troblemaker response' },
  { id: 'inquisitor', content: 'Inquisitor response' },
];

function CardGame() {
  const [cards, setCards] = useState(initialCards);

  // Handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(cards);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setCards(reordered);
  };

  return (
    <div>
      <h2>Your Story Cards</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cards">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={{ padding: '10px', border: '1px solid #ddd' }}>
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '10px',
                        margin: '0 0 8px 0',
                        background: snapshot.isDragging ? '#e0ffe0' : '#fff',
                        border: '1px solid #ccc',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {card.content}
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
  );
}

export default CardGame;
