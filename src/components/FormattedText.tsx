import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKey } from '../i18n/translations';

interface FormattedTextProps {
    id: TranslationKey;
    values?: Record<string, string | number>;
}

const FormattedText: React.FC<FormattedTextProps> = ({ id, values = {} }) => {
    const { t } = useLanguage();
    let text = t(id);

    // Replace placeholders with actual values
    Object.entries(values).forEach(([key, value]) => {
        text = text.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });

    return <>{text}</>;
};

export default FormattedText;