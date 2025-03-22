import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations, TranslationKey } from '../i18n/translations';

export type Language = 'fr' | 'en' | 'es';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageProviderProps = {
    children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('fr');

    // Translation function
    const t = (key: TranslationKey): string => {
        const translation = translations[language][key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key} in language: ${language}`);
            return key;
        }
        return translation;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};