"use client";
import { useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (image: string | null) => void;
  language?: string;
}

export default function ImageUploader({ onImageUpload, language = 'en' }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedImage = reader.result as string;
        setImage(uploadedImage);
        onImageUpload(uploadedImage);
      };
      reader.readAsDataURL(file);
    }
  };

  // Translated placeholder
  const noFileText = language === 'en' ? 'No file chosen' : '未选择文件';

  return (
    <div className="w-full">
      <label className="block mb-2">
        <span className="sr-only">Choose file</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="customFileInput"
        />
        <span
          className="inline-block px-4 py-2 bg-gray-200  cursor-pointer"
          onClick={() => document.getElementById('customFileInput')?.click()}
        >
          {language === 'en' ? 'Choose Image' : '选择图片'}
        </span>
        <span className="ml-2 text-gray-500">
          {fileName ? fileName : noFileText}
        </span>
      </label>
      {image && (
        <div className="mt-4">
          <img src={image} alt="Uploaded" className="h-auto rounded-md shadow-md max-w-full" />
        </div>
      )}
    </div>
  );
}
