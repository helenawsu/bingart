"use client";
import { useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (image: string | null) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedImage = reader.result as string;
        setImage(uploadedImage);
        onImageUpload(uploadedImage);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4 max-w-full"
        style={{ width: '100%' }}
      />
      {image && (
        <div className="mt-4">
          <img src={image} alt="Uploaded" className="h-auto rounded-md shadow-md max-w-full" />
        </div>
      )}
    </div>
  );
}
