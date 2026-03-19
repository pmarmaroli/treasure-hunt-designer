import React from 'react';
import { Gift, MapPin, User, FileText, Eye, EyeOff } from 'lucide-react';
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
    useClue: boolean;
};

type Riddle = {
    text: string;
    answer: string;
    instruction: string;
    digit: string;
};

type TreasureHuntProps = {
    title: string;
    participants: Participant[];
    locations: Location[];
    riddles: Riddle[];
};

const TreasureHuntPreview: React.FC<TreasureHuntProps> = ({
    title,
    participants,
    locations,
    riddles,
}) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = React.useState<'participants' | 'locations' | 'riddles'>('participants');

    return (
        <div className="bg-amber-50 rounded-xl border-2 border-amber-300 overflow-hidden">
            <div className="bg-emerald-800 text-amber-100 p-4">
                <h2 className="text-xl font-bold flex items-center">
                    <Gift className="mr-2 w-5 h-5" />
                    {title}
                </h2>
            </div>

            <div className="flex border-b border-amber-200">
                <button
                    onClick={() => setActiveTab('participants')}
                    className={`flex-1 py-3 px-4 flex items-center justify-center font-medium ${activeTab === 'participants'
                            ? 'bg-amber-200 text-emerald-800'
                            : 'text-emerald-700 hover:bg-amber-100'
                        }`}
                >
                    <User className="mr-2 w-4 h-4" />
                    {t('participants')}
                </button>
                <button
                    onClick={() => setActiveTab('locations')}
                    className={`flex-1 py-3 px-4 flex items-center justify-center font-medium ${activeTab === 'locations'
                            ? 'bg-amber-200 text-emerald-800'
                            : 'text-emerald-700 hover:bg-amber-100'
                        }`}
                >
                    <MapPin className="mr-2 w-4 h-4" />
                    {t('locations')}
                </button>
                <button
                    onClick={() => setActiveTab('riddles')}
                    className={`flex-1 py-3 px-4 flex items-center justify-center font-medium ${activeTab === 'riddles'
                            ? 'bg-amber-200 text-emerald-800'
                            : 'text-emerald-700 hover:bg-amber-100'
                        }`}
                >
                    <FileText className="mr-2 w-4 h-4" />
                    {t('riddles')}
                </button>
            </div>

            <div className="p-4">
                {activeTab === 'participants' && (
                    <div>
                        <h3 className="text-lg font-bold text-emerald-800 mb-4">{t('participants')} ({participants.length})</h3>
                        <div className="space-y-4">
                            {participants.map((participant, index) => (
                                <div key={index} className="border border-amber-200 rounded-lg p-4 bg-white">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-emerald-700">{participant.name}</h4>
                                        <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-mono">
                                            Code: {participant.code}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-3">{participant.secret}</p>
                                    <div>
                                        <h5 className="text-sm font-semibold text-emerald-700 mb-1">Circuit:</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {participant.circuit.map((locationIndex, idx) => (
                                                <div key={idx} className="flex items-center">
                                                    {idx > 0 && <span className="text-gray-400 mx-1">→</span>}
                                                    <span className="bg-amber-100 text-emerald-700 px-2 py-1 rounded text-sm">
                                                        {locations[locationIndex]?.name || `Lieu ${locationIndex}`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'locations' && (
                    <div>
                        <h3 className="text-lg font-bold text-emerald-800 mb-4">{t('locations')} ({locations.length})</h3>
                        <div className="space-y-4">
                            {locations.map((location, index) => (
                                <div key={index} className="border border-amber-200 rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-emerald-700">{location.name}</h4>
                                        {location.useClue ? (
                                            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                                                <Eye className="w-3 h-3" /> {t('useClueInstead')}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                                <Eye className="w-3 h-3" /> {t('locationDirectName')}
                                            </span>
                                        )}
                                    </div>
                                    {location.useClue && (
                                        <div>
                                            <h5 className="text-sm font-semibold text-emerald-700 mb-1">{t('clue')}</h5>
                                            <p className="text-gray-700">{location.clue}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'riddles' && (
                    <div>
                        <h3 className="text-lg font-bold text-emerald-800 mb-4">{t('riddles')} ({riddles.length})</h3>
                        {/* Visibility legend */}
                        <div className="flex items-center gap-4 text-xs p-2 mb-3 bg-white rounded-lg border border-gray-200">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-emerald-600" /><span className="inline-block w-2 h-2 rounded bg-emerald-50 border border-emerald-300"></span> {t('visibleToParticipants')}</span>
                            <span className="flex items-center gap-1"><EyeOff className="w-3 h-3 text-gray-400" /><span className="inline-block w-2 h-2 rounded bg-gray-100 border border-gray-300 border-dashed"></span> {t('creatorOnly')}</span>
                        </div>
                        <div className="space-y-4">
                            {riddles.map((riddle, index) => (
                                <div key={index} className="border border-amber-200 rounded-lg p-4 bg-white">
                                    <h4 className="font-bold text-emerald-700 mb-2">{t('riddles')} {index + 1}</h4>
                                    <div className="mb-3 border-l-4 border-l-emerald-500 bg-emerald-50 rounded-r-lg p-3">
                                        <h5 className="text-sm font-semibold text-emerald-700 mb-1 flex items-center gap-1"><Eye className="w-3 h-3" /> {t('question')}</h5>
                                        <p className="text-gray-700">{riddle.text}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="border-l-4 border-l-gray-400 border-dashed bg-gray-50 rounded-r-lg p-3">
                                            <h5 className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1"><EyeOff className="w-3 h-3" /> {t('answer')}</h5>
                                            <p className="text-gray-700">{riddle.answer}</p>
                                        </div>
                                        <div>
                                            <div className="border-l-4 border-l-emerald-500 bg-emerald-50 rounded-r-lg p-3 mb-2">
                                                <h5 className="text-sm font-semibold text-emerald-700 mb-1 flex items-center gap-1"><Eye className="w-3 h-3" /> {t('instruction')}</h5>
                                                <p className="text-gray-700">{riddle.instruction}</p>
                                            </div>
                                            <div className="border-l-4 border-l-gray-400 border-dashed bg-gray-50 rounded-r-lg p-3">
                                                <h5 className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1"><EyeOff className="w-3 h-3" /> {t('digit')}</h5>
                                                <p className="text-gray-700 font-bold">{riddle.digit}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreasureHuntPreview;