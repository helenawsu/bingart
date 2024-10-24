import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Set up Google Vision API client
const vision = google.vision({
  version: 'v1',
  auth: process.env.GOOGLE_API_KEY,  // Ensure your Google API key is stored securely in .env.local
});

export async function POST(req: NextRequest) {
  const { prompt, imagePath } = await req.json();

  if (!prompt || !imagePath) {
    return NextResponse.json({ error: 'Prompt or image path is missing' }, { status: 400 });
  }

  try {
    // Construct the path to the image in the public folder
    const imageFilePath = path.join(process.cwd(), 'public', imagePath);

    // Read the image from the file system
    const imageBuffer = fs.readFileSync(imageFilePath);
    const imageBase64 = imageBuffer.toString('base64'); // Convert image to base64

    // Analyze the image using Google Cloud Vision API
    const visionResponse = await vision.images.annotate({
      requestBody: {
        requests: [
          {
            image: {
              content: imageBase64,  // Base64-encoded image
            },
            features: [{ type: 'LABEL_DETECTION', maxResults: 10 }],  // Detect labels in the image
          },
        ],
      },
    });
    const labels = visionResponse.data.responses[0].labelAnnotations;
    // const dominantColors = visionResponse.data.responses[0].imagePropertiesAnnotation.dominantColors.colors;

    const labelDescriptions = labels.map((label) => label.description).join(', ');
    // const colorDescriptions = dominantColors
    //   .map((color) => `RGB(${color.color.red},${color.color.green},${color.color.blue})`)
    //   .join(', ');


    // Combine the image description with the user's prompt
    const combinedPrompt = `
    You are an art critic. A user has provided an image of a painting. Based on the following details, analyze the artistic style, technique, and overall quality:
    
    1. The painting contains the following elements: ${labelDescriptions}.
    
    Provide an insightful critique of the painting, focusing on the drawing style, use of color, and any other relevant artistic aspects.
    
    The user asks: "${prompt}".
  `;
    // Send the combined prompt to OpenAI's GPT
    const apiKey = process.env.AI_API_KEY;
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an experienced art guide who explains the painting style and history and art critic who analyzes and comments on various paintings, focusing on style, color usage, and artistic technique.' },
          { role: 'user', content: combinedPrompt },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = gptResponse.data.choices[0].message.content.trim();
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in Google Vision or OpenAI API request:', error);

    if (error.response) {
      console.error('API Error Response:', error.response.data);
    }

    return NextResponse.json({ error: 'Failed to process the image or fetch AI response' }, { status: 500 });
  }
}
