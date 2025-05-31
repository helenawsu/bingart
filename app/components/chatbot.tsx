"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface ChatBotProps {
  selectedImage: string | null;  // The image path from the parent component
  language: string;  // Language for the AI response
}

export default function ChatBot({ selectedImage, language }: ChatBotProps) {
  console.log("language in chatbot.tsx", language);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! Let me analyze the painting for you...' }]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch AI response when the component mounts
  useEffect(() => {
    if (selectedImage) {
      const fetchAICritique = async () => {
        try {
          setLoading(true); // Start loading state
          
          const response = await axios.post('/api/chat', {
            prompt: "Please provide an art critique for this painting.",
            imagePath: selectedImage,  // Image path from public/images
            language: language,
          });

          const botResponse = { sender: 'bot', text: response.data.response };
          setMessages([{ sender: 'bot', text: botResponse.text }]); // Update with critique
        } catch (error) {
          console.error('Error fetching AI critique:', error);
          setMessages([{ sender: 'bot', text: 'Failed to analyze the image. Please try again later.' }]);
        } finally {
          setLoading(false); // End loading state
        }
      };

      fetchAICritique();
    }
  }, [selectedImage]);

  const handleUserInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '') return;

    setLoading(true); // Start loading state

    try {
      const response = await axios.post('/api/chat', {
        prompt: userInput,  // User's prompt
        imagePath: selectedImage,  // Image path from public/images
      });

      const botResponse = { sender: 'bot', text: response.data.response };
      setMessages([...messages, { sender: 'user', text: userInput }, botResponse]);
      setUserInput(''); // Clear input field after submission
    } catch (error) {
      console.error('Error:', error);
      setMessages([...messages, { sender: 'bot', text: 'Failed to get a response from the server.' }]);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 p-4 rounded-lg">
      <div className="flex-grow overflow-auto mb-4">
        {messages.map((msg, index) => (
          <p key={index} className={`mb-2 ${msg.sender === 'bot' ? 'text-blue-500' : 'text-gray-700'} `}>
            <strong>{msg.sender === 'bot' ? 'AI' : 'You'}: </strong>
            {msg.text}
          </p>
        ))}
        {loading && <p className="text-blue-500">AI is analyzing the image...</p>}
      </div>
      <form onSubmit={handleUserInput} className="flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask something about this image..."
          className="w-full p-2 border rounded-md focus:outline-none text-black"
          disabled={loading}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}
