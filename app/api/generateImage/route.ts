import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

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
  const { image, prompt } = await req.json();
  const imageFilePath = path.join(process.cwd(), 'public', image);
  const fileId = await createFile(imageFilePath);
  if (!image || !prompt) {
    return NextResponse.json({ error: 'Image and prompt are required' }, { status: 400 });
  }
    try {
  const response = await openai.responses.create({
  model: "gpt-4.1",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: prompt },
        {
          type: "input_image",
          file_id: fileId,
          detail: "auto",
        },
      ],
    },
  ],
  tools: [{ type: "image_generation" }],
  
});
const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  if (typeof imageBase64 === "string") {
    // const fs = await import("fs");
    // fs.writeFileSync("output.png", new Uint8Array(Buffer.from(imageBase64, "base64")));
  } else {
    console.error("imageBase64 is not a string:", imageBase64);
  }
} else {
  console.log(response.output);
}
const imageBase64 = imageData[0] as string;

// build your data-URI:
const dataUri = `data:image/png;base64,${imageBase64}`;

// and return it as JSON:
return NextResponse.json({ imageUrl: dataUri });
    } catch (error) {
  console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate styled image' }, { status: 500 });
    }


    // const output = await replicate.run(
    //   "paper11667/clipstyler:f2d6b24e6002f25f77ae89c2b0a5987daa6d0bf751b858b94b8416e8542434d1",
    //   {
    //     input: {
    //       text: prompt,
    //       image,
    //       iterations: 2,
    //     },
    //   }
    // );

    // // Handle the output as a binary stream and convert it to base64
    // // @ts-ignore
    // const resultArray = await Promise.all(output.map(async (stream: ReadableStream) => {
    //   const reader = stream.getReader();
    //   const chunks: Uint8Array[] = [];
    //   let done = false;

    //   while (!done) {
    //     const { value, done: streamDone } = await reader.read();
    //     if (value) {
    //       chunks.push(value);
    //     }
    //     done = streamDone;
    //   }

    //   // Combine all chunks into a single Uint8Array
    //   const binaryData = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    //   let offset = 0;
    //   for (const chunk of chunks) {
    //     binaryData.set(chunk, offset);
    //     offset += chunk.length;
    //   }

    //   // Convert binary data to base64 string
    //   const base64String = Buffer.from(binaryData).toString('base64');
    //   return `data:image/png;base64,${base64String}`;  // Assuming the output is PNG
    // }));

    // return NextResponse.json({ imageUrl: resultArray[0] });
  // } catch (error) {
    
  // }
}
