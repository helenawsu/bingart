"use client";
import { useContext, useState } from 'react';
import ImageUploader from 'app/components/imageuploader';
import { LanguageContext } from '../context/language';

export default function Page() {
  const { language } = useContext(LanguageContext);
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (uploadedImage: string | null) => {
    setImage(uploadedImage);

  };

  const handleGenerateStyledImage = async () => {
    if (!image) return;
    setLoading(true);

    try {
      // Step 1: Upload the image to Cloudinary
      const uploadResponse = await fetch('/api/uploadImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      let uploadData;
      {
        const text = await uploadResponse.text();
        try {
          uploadData = JSON.parse(text);
        } catch {
          throw new Error(`Upload error: ${text}`);
        }
      }
      const imageUrl = uploadData.imageUrl;

      if (!imageUrl) {
        console.error('Failed to upload image', uploadData.error);
        setPrompt(uploadData.error || 'Failed to upload image');
        setLoading(false);
        return;
      }
      console.log('Uploaded image ');

      const promptResponse = await fetch('/api/getPrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: imageUrl, prompt: prompt }),
      });

      let stylePrompt;
      {
        const text = await promptResponse.text();
        try {
          stylePrompt = JSON.parse(text);
        } catch {
          throw new Error(`Prompt error: ${text}`);
        }
      }
      if (stylePrompt.response) {
        setPrompt(stylePrompt.response);
      } else {
        console.error('prompt is empty', stylePrompt.error);
        setPrompt(stylePrompt.error || 'Prompt generation failed');
      }

      // Step 2: Use the uploaded image URL with Replicate for style transfer
      const styleResponse = await fetch('/api/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageurl: image, prompt: stylePrompt.response }),
      });

      let styleData;
      {
        const text = await styleResponse.text();
        try {
          styleData = JSON.parse(text);
        } catch {
          throw new Error(`Style generation error: ${text}`);
        }
      }
      console.log('Style Data:', styleData);
      if (styleData.imageUrl) {
        console.log('Generated image URL:', styleData.imageUrl);
        setGeneratedImage(styleData.imageUrl);
      } else {
        console.error('Error in generating styled image:', styleData.error);
        setPrompt(styleData.error || 'Failed to generate styled image');
      }
    } catch (error) {
      console.error("Error generating styled image:", error);
      setPrompt(error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col">
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        {language === 'en' ? 'Upload any photos to get inspiration!' : '上传照片获取灵感！'}
      </h1>
      

      {/* ImageUploader Component */}
      <ImageUploader onImageUpload={handleImageUpload} language={language}/>

      {/* Style Prompt Input */}
      {/* <input
        type="text"
        placeholder="Describe the desired art style, e.g., 'Impressionist'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-4 p-2 border rounded-md w-full"
      /> */}
      <p>{prompt}</p>
      {/* Generate Styled Image Button */}
      <div className="mt-6" />
      <button
        onClick={handleGenerateStyledImage}
        className="px-4 py-2 bg-black text-white mb-4"
        disabled={loading}
      >
        {loading
          ? (language === 'en' ? "Generating..." : "生成中...")
          : (language === 'en' ? "Generate Styled Image" : "生成风格图像")}
      </button>
      {/* <p>(warning: it's slow)</p> */}
      {/* Display Generated Image */}
      {generatedImage && (
        <div className="mt-4">
          <img
            src={generatedImage}
            alt="Generated art"
            className="max-w-full h-auto shadow-md max-h-64"
            style={{ maxHeight: '32rem' }}
          />
        </div>
      )}
    </section>
  );
}
