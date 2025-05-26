import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
});
// Function to create a file with the Files API
async function createFile(filePath) {
  console.log('Creating file for OpenAI Vision API:', filePath);
  const fileContent = fs.createReadStream(filePath);
  const result = await openai.files.create({
    file: fileContent,
    purpose: "vision",
  });
  return result.id;
}
export async function POST(req: NextRequest) {
  let { prompt, imagePath, language } = await req.json();

  if (!imagePath) {
    return NextResponse.json({ error: 'Prompt or image path is missing' }, { status: 400 });
  }
  if (!prompt) {
    prompt = `based on the image analysis, generate a prompt to feed into an image-generation model. The prompt should: Specify an art style or medium (e.g., ‘oil painting in the style of Klimt’, ‘high-contrast noir photograph’, ‘surreal watercolor dreamscape’)\n• Suggest any key lighting, color, or composition tweaks to transform it into a new artwork\n• Be 1–2 sentences long, vivid, and actionable for an AI image model.`
  }
  try {
    // Construct the path to the image in the public folder
    const imageFilePath = path.join(process.cwd(), 'public', imagePath);

    // // Read and encode the image as base64
    const imageBuffer = fs.readFileSync(imageFilePath);
    // const imageBase64 = imageBuffer.toString('base64');

    // Prepare the message for OpenAI's vision model
    const fileId = await createFile(imageFilePath);
    const languageAddOn = language === 'en' ? '' : '请用中文回答。';
    const messages: { role: 'system' | 'user' | 'assistant'; content: any; name?: string }[] = [
      {
        role: 'system',
        content: 
        `You are a creative prompt engineer. You will first analyze an image in terms of composition, color palette, mood, focal elements, textures, etc., 
        then you’ll craft a single, detailed instruction for an image-generation model (e.g. Stable Diffusion or DALL·E) 
        that captures the essence of the user’s photo and suggest an evocative art style or approach.`
      },
      {
        role: 'user',
      content: [
        { type: "input_text", text: ` "${prompt}` },
        {
          type: "input_image",
          file_id: fileId,
        },
      ],
      },
    ];

    // Call OpenAI's vision model
    const gptResponse = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: messages,    });

    // Log the response for debugging
    console.log('OpenAI Vision Response:', gptResponse);

    const aiResponse = gptResponse.output_text ?? 'No response content available';
    console.log('AI Response:', aiResponse);
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in OpenAI Vision API request:', error);

    if (error.response) {
      console.error('API Error Response:', error.response.data);
    }

    return NextResponse.json({ error: error + 'Failed to process the image or fetch AI response' }, { status: 500 });
  }
}