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
    '/images/9AEE9CE6-C123-4BDA-8F71-F17BFCC87422.JPG',
    '/images/39CB9A00-4ACF-4748-B9DA-6AAF13DDE575.JPG',
    '/images/77B456B5-3E9C-45F2-A12C-68D0FE8321D2.JPG',
    '/images/373910c136cf7550cbbfc063ba21233b.JPG',
    '/images/89097756-7648-48B0-AB9C-D52234238A46.JPG',
    '/images/A2A68580-DA58-4478-A667-6262B6391B17.JPG',
    '/images/BC922305-AC6B-4443-9FF1-AB42FC4D8FE5.JPG',
  ];
  return (
    <section>
      <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      <h1 className="mb-8  font-semibold tracking-tighter">
        {language === 'en' ? 'My Portfolio' : '我的作品集'}
      </h1>
      <section>
  {language === 'en' ? (
    <pre className="mb-4">{`let it happen
let it come 
let it leave
let it happen
everything accompanied
in this world 
was belonged to you 
at the moment
and 
forever   

I wish to capture, through words and brushstrokes, 
those gentle and moving moments of life, 
allowing them to shine with enduring brilliance as time flows on.`}</pre>
  ) : (
    <pre className="mb-4">
{`来来往往，
即使纵然消失，
依然实实在在。
这个世界上伴随着你的
每一个瞬间，
那一刻属于你，
更是，
永远。

我希望通过文字和画笔，细腻捕捉生活中那些温柔而动人的瞬间，
让它们在时光的流转中绽放恒久的光辉。
    `}
  </pre>
  )}
</section>


      <Gallery images={images} />
      {/* <div className="my-8">
        <BlogPosts />
      </div> */}
    </section>
  );
}
