import React, { useState } from 'react';
import { Gift, User, ArrowLeft } from 'lucide-react';

type Participant = {
    name: string;
    secret: string;
    circuit: number[];
    code: string;
};

type TreasureHuntGameProps = {
    title: string;
    participants: Participant[];
    onBack: () => void;
};

const TreasureHuntGame: React.FC<TreasureHuntGameProps> = ({
    title,
    participants,
    onBack
}) => {
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const handleParticipantSelect = (participant: Participant) => {
        setSelectedParticipant(participant);
        setCode('');
        setShowMessage(false);
        setError(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedParticipant && code === selectedParticipant.code) {
            setShowMessage(true);
            setError(false);
        } else {
            setError(true);
            setTimeout(() => setError(false), 820);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-4">
                <button
                    onClick={onBack}
                    className="mr-4 text-amber-300 hover:text-amber-200 flex items-center font-medium"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Retour
                </button>
                <h2 className="text-3xl font-bold text-amber-300">
                    {title}
                </h2>
            </div>

            {!selectedParticipant ? (
                <div>
                    <p className="text-amber-100 mb-6">Sélectionne ton prénom pour commencer:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {participants.map((participant) => (
                            <button
                                key={participant.name}
                                onClick={() => handleParticipantSelect(participant)}
                                className="bg-amber-50 rounded-xl p-6 text-2xl font-bold text-emerald-800 shadow-lg 
                          hover:transform hover:scale-105 transition-all duration-300
                          hover:bg-amber-200 hover:text-emerald-900 border-2 border-amber-300 flex items-center justify-center"
                                style={{
                                    boxShadow: '0 4px 14px rgba(255, 217, 102, 0.3)',
                                    backgroundImage: 'linear-gradient(to bottom right, rgba(255, 251, 235, 0.9), rgba(252, 231, 121, 0.7))'
                                }}
                            >
                                <User className="mr-2 w-6 h-6" />
                                {participant.name}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div
                    className="rounded-xl p-8 shadow-lg max-w-md mx-auto border-2 border-amber-300"
                    style={{
                        backgroundImage: 'linear-gradient(to bottom, rgba(255, 251, 235, 0.95), rgba(252, 211, 77, 0.85))',
                        boxShadow: '0 4px 20px rgba(255, 217, 102, 0.4)'
                    }}
                >
                    <button
                        onClick={() => setSelectedParticipant(null)}
                        className="mb-4 text-emerald-800 hover:text-emerald-900 flex items-center font-medium"
                    >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Retour
                    </button>

                    <h3 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
                        {selectedParticipant.name}
                    </h3>

                    {!showMessage ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-emerald-900 mb-2 font-medium">
                                    Entre ton code secret à {selectedParticipant.code.length} chiffres:
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className={`w-full p-3 border-2 rounded-lg ${error
                                            ? 'border-red-500 animate-shake'
                                            : 'border-emerald-300 focus:border-emerald-500'
                                        } bg-amber-50`}
                                    maxLength={selectedParticipant.code.length}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-emerald-700 text-amber-100 py-3 rounded-lg
                        hover:bg-emerald-800 transition-colors duration-300 font-medium flex items-center justify-center"
                            >
                                <Gift className="mr-2 w-5 h-5" />
                                Valider
                            </button>
                        </form>
                    ) : (
                        <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                            <p className="text-lg text-emerald-900 animate-reveal font-medium">
                                {selectedParticipant.secret}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TreasureHuntGame;