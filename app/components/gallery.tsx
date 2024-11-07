// components/Gallery.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import ImageModal from './imagemodal'; // Import the new modal component

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (src: string) => {
    setSelectedImage(src);
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
              src={src}
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
      />
    </>
  );
}
