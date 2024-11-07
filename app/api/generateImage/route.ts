import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: NextRequest) {
  const { image, prompt } = await req.json();

  if (!image || !prompt) {
    return NextResponse.json({ error: 'Image and prompt are required' }, { status: 400 });
  }

  const apiKey = process.env.REPLICATE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Replicate API key is missing" }, { status: 500 });
  }

  const replicate = new Replicate({
    auth: apiKey,
  });

  try {
    const output = await replicate.run(
      "paper11667/clipstyler:f2d6b24e6002f25f77ae89c2b0a5987daa6d0bf751b858b94b8416e8542434d1",
      {
        input: {
          text: prompt,
          image,
          iterations: 2,
        },
      }
    );

    // Handle the output as a binary stream and convert it to base64
    const resultArray = await Promise.all(output.map(async (stream: ReadableStream) => {
      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (value) {
          chunks.push(value);
        }
        done = streamDone;
      }

      // Combine all chunks into a single Uint8Array
      const binaryData = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        binaryData.set(chunk, offset);
        offset += chunk.length;
      }

      // Convert binary data to base64 string
      const base64String = Buffer.from(binaryData).toString('base64');
      return `data:image/png;base64,${base64String}`;  // Assuming the output is PNG
    }));

    return NextResponse.json({ imageUrl: resultArray[0] });
  } catch (error) {
    console.error('Error generating styled image:', error);
    return NextResponse.json({ error: 'Failed to generate styled image' }, { status: 500 });
  }
}
