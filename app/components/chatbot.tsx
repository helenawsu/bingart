"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface ChatBotProps {
  selectedImage: string | null;  // The image path from the parent component
  language: string;  // Language for the AI response
}

export default function ChatBot({ selectedImage, language }: ChatBotProps) {
  console.log("language in chatbot.tsx", language);
let init_message = language === 'en' 
  ? 'Let me take a close look at this painting...' 
  : '让我仔细看一下这幅画...';  
  const [messages, setMessages] = useState([{ sender: 'bot', text: init_message }]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch AI response when the component mounts
  useEffect(() => {
    if (selectedImage) {
      // Clear previous messages immediately when a new image is selected
      setMessages([{ sender: 'bot', text: init_message }]);
      // Abort any previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const fetchAICritique = async () => {
        try {
          setLoading(true);
          const response = await axios.post('/api/chat', {
            prompt: "Please provide an art critique for this painting.",
            imagePath: selectedImage,
            language: language,
          }, { signal: controller.signal });

          const botResponse = { sender: 'bot', text: response.data.response };
          setMessages([{ sender: 'bot', text: botResponse.text }]); // Update with critique
        } catch (error) {
          if (axios.isCancel?.(error) || error.name === 'CanceledError') {
            // Request was cancelled, do nothing
            return;
          }
          console.error('Error fetching AI critique:', error);
          setMessages([{ sender: 'bot', text: 'Failed to analyze the image. Please try again later.' }]);
        } finally {
          setLoading(false); // End loading state
        }
      };

      fetchAICritique();

      // Cleanup: abort on unmount or when selectedImage changes
      return () => {
        controller.abort();
      };
    }
  }, [selectedImage, language]);

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
  let placeholderText = language === 'en' ? 'Ask something about this paiting...' : '问关于这张画的问题...';
  let sendText = language === 'en' ? 'Send' : '发送';
  return (
    <div className="flex flex-col bg-gray-100 p-4 rounded-lg">
      <div className="flex-grow overflow-auto mb-4">
        {messages.map((msg, index) => (
          <p key={index} className={`mb-2 ${msg.sender === 'bot' ? 'text-black' : 'text-gray-700'} `}>
            <strong>{msg.sender === 'bot' ? '🎨' : 'You'}: </strong>
            {msg.text}
          </p>
        ))}
        {loading && <p className="text-gray-500">{language === "en" ? "loading..." : "分析中"}</p>}
      </div>
      <form onSubmit={handleUserInput} className="flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={placeholderText}
          className="w-full p-2 border rounded-md focus:outline-none text-black"
          disabled={loading}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-black text-white rounded-md min-w-[64px] flex items-center justify-center"
          disabled={loading}
        >
          {sendText}
        </button>
      </form>
    </div>
  );
}
