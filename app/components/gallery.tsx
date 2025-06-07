// components/Gallery.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import ImageModal from './imagemodal'; // Import the new modal component
import { language } from 'googleapis/build/src/apis/language';

interface GalleryProps {
  images: { url: string; title?: string; color?: string }[]; // Add color to type
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

  // Helper to determine if a hex color is "dark"
  function isDark(hex: string) {
    // Remove hash if present
    hex = hex.replace('#', '');
    // Convert 3-digit to 6-digit
    if (hex.length === 3) {
      hex = hex.split('').map(x => x + x).join('');
    }
    // Parse r,g,b
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    // Perceived brightness formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((src, index) => {
          const bgColor = src.color || '#e5e7eb';
          const textColor = isDark(bgColor) ? 'white' : 'black';
          return (
            <div
              key={index}
              className="relative w-full h-64 cursor-pointer"
              onClick={() => openModal(src)}
            >
              {/* Title overlay */}
              {src.title && (
                <div
                  className={`absolute top-0 left-0 w-full text-center py-1 z-10 text-xs md:text-sm truncate`}
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    opacity: 1,
                  }}
                >
                  {src.title}
                </div>
              )}
              <Image
                src={src.url}
                alt={`Gallery image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className=""
              />
            </div>
          );
        })}
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
