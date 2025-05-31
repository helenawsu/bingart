// components/Gallery.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import ImageModal from './imagemodal'; // Import the new modal component
import { language } from 'googleapis/build/src/apis/language';

interface GalleryProps {
  images: { url: string }[];
  language: string; // Language prop for the component
}

export default function Gallery({ images, language }: GalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  console.log("language in gallery.tsx", language);
  const openModal = (src: any) => {
    setSelectedImage(src.url);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative w-full h-64 cursor-pointer"
            onClick={() => openModal(src)}
          >
            <Image
              src={src.url}
              alt={`Gallery image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className=""
            />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isOpen}
        selectedImage={selectedImage}
        closeModal={closeModal}
        language={language}
      />
    </>
  );
}
