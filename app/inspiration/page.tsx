"use client";
import { useState } from 'react';
import ImageUploader from 'app/components/imageuploader';

export default function Page() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (uploadedImage: string | null) => {
    setImage(uploadedImage);
  };

  const handleGenerateStyledImage = async () => {
    if (!image || !prompt) return;
    setLoading(true);

    try {
      // Step 1: Upload the image to Cloudinary
      const uploadResponse = await fetch('/api/uploadImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.imageUrl;

      if (!imageUrl) {
        console.error('Failed to upload image');
        setLoading(false);
        return;
      }


      const promptResponse = await fetch('/api/getPrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: imageUrl, prompt: prompt }),
      });
      const stylePrompt = await promptResponse.json();
      if (stylePrompt.text) {
        setPrompt(stylePrompt.text);
      } else {
        console.error('Error in generating styled image:', stylePrompt.error);
      }

      // Step 2: Use the uploaded image URL with Replicate for style transfer
      const styleResponse = await fetch('/api/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl, prompt }),
      });

      const styleData = await styleResponse.json();
      if (styleData.imageUrl) {
        setGeneratedImage(styleData.imageUrl);
      } else {
        console.error('Error in generating styled image:', styleData.error);
      }
    } catch (error) {
      console.error("Error generating styled image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center">
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Upload any photos to get inspiration! </h1>
      

      {/* ImageUploader Component */}
      <ImageUploader onImageUpload={handleImageUpload} />

      {/* Style Prompt Input */}
      <input
        type="text"
        placeholder="Describe the desired art style, e.g., 'Impressionist'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-4 p-2 border rounded-md w-full"
      />

      {/* Generate Styled Image Button */}
      <button
        onClick={handleGenerateStyledImage}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Styled Image"}
      </button>
      <p>(warning: it's slow)</p>
      {/* Display Generated Image */}
      {generatedImage && (
        <div className="mt-4">
          <img src={generatedImage} alt="Generated art" className="max-w-full h-auto rounded-md shadow-md" />
        </div>
      )}
    </section>
  );
}
