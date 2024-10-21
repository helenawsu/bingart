// components/Gallery.tsx
"use client";

import Image from 'next/image';

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((src, index) => (
        <div key={index} className="relative w-full h-64">
          <Image
            src={src}
            alt={`Gallery image ${index + 1}`}
            layout="fill"
            objectFit="cover"
            // className="rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
