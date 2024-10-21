"use client";
import { useState } from 'react';
import { BlogPosts } from 'app/components/posts';
import LanguageSwitcher from 'app/components/languageswitch';
import Gallery from 'app/components/gallery'; // Import the Gallery component

export default function Page() {
  const [language, setLanguage] = useState('en'); // Default to English

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage); // Update language when changed
  };
  const images = [
    '/images/9AEE9CE6-C123-4BDA-8F71-F17BFCC87422.jpg',
    '/images/39CB9A00-4ACF-4748-B9DA-6AAF13DDE575.jpg',
    '/images/77B456B5-3E9C-45F2-A12C-68D0FE8321D2.jpg',
    '/images/373910c136cf7550cbbfc063ba21233b.jpg',
    '/images/89097756-7648-48B0-AB9C-D52234238A46.jpg',
    '/images/A2A68580-DA58-4478-A667-6262B6391B17.jpg',
    '/images/BC922305-AC6B-4443-9FF1-AB42FC4D8FE5.jpg',
  ];
  return (
    <section>
      <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        {language === 'en' ? 'My Portfolio' : '我的作品集'}
      </h1>
      <p className="mb-4">
        {language === 'en'
          ? `Hellow world`
          : `你好世界`
        }
      </p>
      <Gallery images={images} />
      {/* <div className="my-8">
        <BlogPosts />
      </div> */}
    </section>
  );
}
