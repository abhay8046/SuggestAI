import React, { useState } from 'react';
import axios from 'axios';
import './App.css';



const API_KEY = process.env.REACT_APP_API_KEY;; // Replace with your actual OpenAI API key
const API_ENDPOINT = 'https://api.openai.com/v1/completions';

function App() {
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showApp, setShowApp] = useState(false);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    getSuggestions(text);
  };

  const getSuggestions = async (text) => {
    if (text.trim() === '') {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINT,
        {
          model: "text-davinci-003",
          prompt: text,
          max_tokens: 50,
          temperature: 0.7,
          n: 3
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      const { choices } = response.data;
      setSuggestions(choices.map(choice => choice.text));
    } catch (error) {
      console.error(error);
    }
  };

  const handleTryNowClick = () => {
    setShowApp(true);
  };

  return (
    <div className="container">
      {!showApp && (
        <div className="landing-screen">
          <h2>Welcome to</h2>
          <h1>SuggestAi</h1>
          <p>Start typing in the text area below to experience AI-generated suggestions as you type.</p>
          <button className="try-now-button" onClick={handleTryNowClick}>
            Try Now
          </button>
        </div>
      )}
      {showApp && (
        <div className="app">
          <textarea
            placeholder="Start typing to experience AI magic..."
            value={inputText}
            onChange={handleInputChange}
          />
          <div id="suggestions">
            {suggestions.map((suggestion, index) => (
              <p key={index}>{suggestion}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
