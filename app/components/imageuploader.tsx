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
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      {image && (
        <div className="mt-4">
          <img src={image} alt="Uploaded" className="max-w-full h-auto rounded-md shadow-md" />
        </div>
      )}
    </div>
  );
}
