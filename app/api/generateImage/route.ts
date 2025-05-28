import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
});
async function createFile(res) {
  
  const result = await openai.files.create({
    file: res.body,        
    purpose: "vision",
  });
  return result.id;
}
export async function POST(req: NextRequest) {
  const { imageurl, prompt } = await req.json();
  console.log("prompt", prompt);
  // console.log('Received image:', imageurl);
  if (!imageurl || !prompt) {
    return NextResponse.json({ error: 'Image and prompt are required' }, { status: 400 });
  }
  
    try {
      const res = await fetch(imageurl);

      // const fileId = await createFile(res);
  const response = await openai.responses.create({
  model: "gpt-4.1",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: prompt },
        {
          type: "input_image",
          image_url: imageurl,
          detail: "auto",
        },
      ],
    },
  ],
  tools: [{ type: "image_generation" }],
  
});
console.log('Full response:', response);
// 1) Grab the output array
const outputs = response.output as Array<{
  type: string;
  content?: any[];
}>;
console.log('Outputs:', outputs);
// 2) Find the “message” entry and get its content
const message = outputs.find((o) => o.type === 'message');
if (!message?.content) {
  console.error('No assistant message content:', outputs);
  // handle error…
}
console.log('Message content:', message?.content);
// 3) Inside that content, filter for image tool calls
const imageData = (message?.content as any[])
  .filter((c) => c.type === 'image_generation_call')
  .map((c) => c.result as string);

console.log('Extracted image data:', imageData);
if (imageData.length > 0) {
  const base64 = imageData[0] as string;
  const dataUri = `data:image/png;base64,${base64}`;
  return NextResponse.json({ imageUrl: dataUri });
    // const fs = await import("fs");
    // fs.writeFileSync("output.png", new Uint8Array(Buffer.from(imageBase64, "base64")));

} else {
  console.log(response.output);
}
 return NextResponse.json({ error: 'Failed to generate styled image result image url is not string' }, { status: 500 });
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
