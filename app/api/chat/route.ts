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
  const { prompt, imagePath, language } = await req.json();

  if (!prompt || !imagePath) {
    return NextResponse.json({ error: 'Prompt or image path is missing' }, { status: 400 });
  }

  try {
    // Construct the path to the image in the public folder
    const imageFilePath = path.join(process.cwd(), 'public', imagePath);

    // // Read and encode the image as base64
    const imageBuffer = fs.readFileSync(imageFilePath);
    // const imageBase64 = imageBuffer.toString('base64');

    // Prepare the message for OpenAI's vision model
    const fileId = await createFile(imageFilePath);
    console.log(language, "what is the language");
    const languageAddOn = language === 'en' ? 'please answer in english' : '请用中文回答。';
    const messages: { role: 'system' | 'user' | 'assistant'; content: any; name?: string }[] = [
      {
        role: 'system',
        content: 'You are an experienced art guide and critic. Analyze the provided painting in depth: identify its genre and place within art history, discuss possible artist influences or schools, and explain how its composition, technique, brushwork, and color choices reflect those influences. Provide concrete references to comparable artists, movements, or historical periods, and highlight any innovative or noteworthy elements. Aim to educate the user about both the technical execution and the broader cultural context.',
      },
      {
        role: 'user',
      content: [
        { type: "input_text", text: `Analyze this painting if the user didn't ask anythinig. Otherwise, focus on answering the user's question. The user asks: "${prompt}". Keep your response within 50 words.` + languageAddOn },
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
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in OpenAI Vision API request:', error);

    if (error.response) {
      console.error('API Error Response:', error.response.data);
    }

    return NextResponse.json({ error: error + 'Failed to process the image or fetch AI response' }, { status: 500 });
  }
}