"use client";

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment } from 'react';
import ChatBot from './chatbot';  // Import the ChatBot component
import { images } from 'app/data/images'; // Import images to get color

interface ImageModalProps {
  isOpen: boolean;
  selectedImage: string | null;  // Image path from public/images
  closeModal: () => void;
  language: string; 
  // Optionally, you could add selectedImageObj?: { url: string; color?: string }
}

export default function ImageModal({ isOpen, selectedImage, closeModal, language }: ImageModalProps) {
  // Find the image object to get its color
  const imageObj = images.find(img => img.url === selectedImage);
  const bgColor = imageObj?.color || "#fff";

  console.log("language in imagemodal.tsx", language);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Modal background uses image color */}
          <div className="fixed inset-0" style={{ backgroundColor: bgColor, opacity: 0.85 }} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                >
                  X
                </button>

                {/* Responsive layout: Image on top for mobile, side by side for desktop */}
                <div className="flex flex-col md:flex-row">
                  {/* Image section */}
                  <div className="w-full md:w-1/2 md:pr-4 mb-4 md:mb-0 flex items-center justify-center">
                    {selectedImage && (
                      <div className="w-full">
                        <Image
                          src={selectedImage}
                          alt="Selected image"
                          width={800}
                          height={600}
                          className="rounded-lg w-full h-auto max-h-[60vh] md:max-h-[80vh] object-contain"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Chatbot section */}
                  <div className="w-full md:w-1/2">
                    <ChatBot selectedImage={selectedImage} language={language} />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
