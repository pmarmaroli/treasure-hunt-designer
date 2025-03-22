import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

type Participant = {
    name: string;
    secret: string;
    circuit: number[];
    code: string;
};

type Location = {
    name: string;
    clue: string;
};

type Riddle = {
    text: string;
    answer: string;
    instruction: string;
    digit: string;
};

type TreasureHunt = {
    title: string;
    participants: Participant[];
    locations: Location[];
    riddles: Riddle[];
};

type ImporterProps = {
    onImport: (data: TreasureHunt) => void;
    onCancel: () => void;
};

const TreasureHuntImporter: React.FC<ImporterProps> = ({ onImport, onCancel }) => {
    const { t } = useLanguage();
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const processFile = (file: File) => {
        if (file.type !== 'application/json') {
            setError(t('wrongFileFormat'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result as string;
                const treasureHunt = JSON.parse(result) as TreasureHunt;

                // Basic validation
                if (!treasureHunt.title ||
                    !Array.isArray(treasureHunt.participants) ||
                    !Array.isArray(treasureHunt.locations) ||
                    !Array.isArray(treasureHunt.riddles)) {
                    setError(t('invalidFileFormat'));
                    return;
                }

                setSuccess(true);

                // Delay to show success message before importing
                setTimeout(() => {
                    onImport(treasureHunt);
                }, 1000);

            } catch (err) {
                setError(`${t('jsonReadError')} ${err instanceof Error ? err.message : String(err)}`);
            }
        };

        reader.readAsText(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-4">
                <button
                    onClick={onCancel}
                    className="mr-4 text-amber-300 hover:text-amber-200 flex items-center font-medium"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {t('back')}
                </button>
                <h2 className="text-3xl font-bold text-amber-300">
                    {t('importTitle')}
                </h2>
            </div>

            <div
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${isDragging
                    ? 'border-amber-300 bg-amber-900 bg-opacity-20'
                    : error
                        ? 'border-red-300 bg-red-900 bg-opacity-10'
                        : success
                            ? 'border-green-300 bg-green-900 bg-opacity-10'
                            : 'border-amber-200 bg-amber-900 bg-opacity-10'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".json"
                    className="hidden"
                />

                {success ? (
                    <div className="flex flex-col items-center justify-center text-amber-100 py-8">
                        <div className="bg-green-700 rounded-full p-3 mb-4">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-xl font-medium">{t('importSuccess')}</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-amber-800 bg-opacity-40 rounded-full p-6 inline-block mb-4">
                            <Upload className="w-16 h-16 text-amber-200" />
                        </div>
                        <h3 className="text-xl font-bold text-amber-100 mb-2">
                            {t('dragDropJSON')}
                        </h3>
                        <p className="text-amber-200 mb-6">{t('or')}</p>
                        <button
                            onClick={handleButtonClick}
                            className="bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors"
                        >
                            {t('browseFiles')}
                        </button>
                    </>
                )}
            </div>

            {error && (
                <div className="bg-red-900 bg-opacity-20 border border-red-300 rounded-lg p-4 text-red-100 flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-amber-900 bg-opacity-20 border border-amber-300 rounded-lg p-4 text-amber-100">
                <h3 className="font-bold mb-2">{t('expectedFormat')}</h3>
                <p className="mb-2">{t('requiredElements')}</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>{t('titleElement')}</li>
                    <li>{t('participantsElement')}</li>
                    <li>{t('locationsElement')}</li>
                    <li>{t('riddlesElement')}</li>
                </ul>
            </div>
        </div>
    );
};

export default TreasureHuntImporter;