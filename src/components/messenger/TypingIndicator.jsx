import React from 'react';
import './typingIndicator.css';

const TypingIndicator = ({ typingUsers, conversationId }) => {
  if (!typingUsers || !typingUsers[conversationId]) {
    return null;
  }

  const users = Object.values(typingUsers[conversationId]);
  
  if (users.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].userName} is typing...`;
    } else if (users.length === 2) {
      return `${users[0].userName} and ${users[1].userName} are typing...`;
    } else {
      return `${users[0].userName} and ${users.length - 1} others are typing...`;
    }
  };

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator;
