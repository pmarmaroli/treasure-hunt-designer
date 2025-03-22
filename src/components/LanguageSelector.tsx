import React from 'react';
import { Language, useLanguage } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
    ];

    return (
        <div className="absolute top-8 right-8 z-20">
            <div className="bg-amber-100 bg-opacity-80 rounded-lg shadow-lg overflow-hidden border border-amber-300">
                <div className="flex">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code as Language)}
                            className={`px-3 py-2 flex items-center ${language === lang.code
                                    ? 'bg-emerald-700 text-amber-100 font-medium'
                                    : 'bg-transparent text-emerald-800 hover:bg-amber-200'
                                } transition-colors duration-200`}
                        >
                            <span className="mr-2">{lang.flag}</span>
                            <span className="hidden md:inline">{lang.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector;