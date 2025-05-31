"use client";

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment } from 'react';
import ChatBot from './chatbot';  // Import the ChatBot component

interface ImageModalProps {
  isOpen: boolean;
  selectedImage: string | null;  // Image path from public/images
  closeModal: () => void;
  language: string; 
}

export default function ImageModal({ isOpen, selectedImage, closeModal, language }: ImageModalProps) {
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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

                {/* Split layout: Image on the left, ChatBot on the right */}
                <div className="flex">
                  {/* Left Side: Image */}
                  <div className="w-1/2 pr-4">
                    {selectedImage && (
                      <Image
                        src={selectedImage}
                        alt="Selected image"
                        width={800}
                        height={600}
                        objectFit="contain"
                        className="rounded-lg"
                      />
                    )}
                  </div>

                  {/* Right Side: Chatbot Interface */}
                  <div className="w-1/2">
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
