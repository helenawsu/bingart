import { useState } from 'react';

export default function LanguageSwitcher({ onLanguageChange }) {
  const [language, setLanguage] = useState('en'); // Default to English

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'zh' : 'en';
    setLanguage(newLanguage);
    onLanguageChange(newLanguage); // Pass the new language back to the parent
  };

  return (
    <div className="flex items-center space-x-2 my-3">
      
      <div
        className={`relative inline-block w-12 h-6 transition duration-200 ease-linear rounded-full
          ${language === 'zh' ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <span
          className={`absolute left-0 top-0 h-6 w-6 bg-white border-2 border-gray-300 rounded-full shadow-md transform transition
            ${language === 'zh' ? 'translate-x-6' : 'translate-x-0'}`}
        />
        <input
          type="checkbox"
          className="absolute opacity-0 w-full h-full cursor-pointer"
          checked={language === 'zh'}
          onChange={toggleLanguage}
        />
      </div>
      <span className="text-white">{language === 'en' ? 'English' : '中文'}</span>
    </div>
  );
}
