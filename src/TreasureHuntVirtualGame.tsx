import React, { useState } from 'react';
import { Gift, User, ArrowLeft, MapPin, PlayCircle, CheckCircle } from 'lucide-react';

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

type TreasureHuntVirtualGameProps = {
    treasureHunt: TreasureHunt;
    onBack: () => void;
};

const TreasureHuntVirtualGame: React.FC<TreasureHuntVirtualGameProps> = ({
    treasureHunt,
    onBack,
}) => {
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [currentStep, setCurrentStep] = useState<'start' | 'location' | 'riddle' | 'code' | 'result'>('start');
    const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
    const [circuitPosition, setCircuitPosition] = useState(0);
    const [locationGuess, setLocationGuess] = useState('');
    const [riddleAnswer, setRiddleAnswer] = useState('');
    const [enteredCode, setEnteredCode] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [collectedDigits, setCollectedDigits] = useState<string[]>([]);

    //eslint-disable-next-line
    const [isSuccess, setIsSuccess] = useState(false);

    const handleParticipantSelect = (participant: Participant) => {
        setSelectedParticipant(participant);
        setCurrentStep('start');
        setCircuitPosition(0);
        setLocationGuess('');
        setRiddleAnswer('');
        setEnteredCode('');
        setMessage('');
        setErrorMessage('');
        setCollectedDigits([]);
        setIsSuccess(false);

        // The first location in the participant's circuit
        setCurrentLocationIndex(participant.circuit[0]);
    };

    const handleStartHunt = () => {
        setCurrentStep('location');
    };

    const handleLocationGuessSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedParticipant) return;

        const currentLocation = treasureHunt.locations[currentLocationIndex];

        // Case-insensitive comparison
        if (locationGuess.trim().toLowerCase() === currentLocation.name.toLowerCase()) {
            setErrorMessage('');
            setCurrentStep('riddle');
        } else {
            setErrorMessage('Ce n\'est pas le bon lieu. Essaie encore!');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleRiddleAnswerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedParticipant) return;

        const currentRiddle = treasureHunt.riddles[currentLocationIndex];

        // Case-insensitive comparison
        if (riddleAnswer.trim().toLowerCase() === currentRiddle.answer.toLowerCase()) {
            // Add the digit to collected digits
            setCollectedDigits([...collectedDigits, currentRiddle.digit]);
            setErrorMessage('');

            // Check if this was the last location in the circuit
            if (circuitPosition >= selectedParticipant.circuit.length - 1) {
                // All locations completed, move to code entry
                setCurrentStep('code');
            } else {
                // Move to next location in the circuit
                const nextCircuitPosition = circuitPosition + 1;
                setCircuitPosition(nextCircuitPosition);
                setCurrentLocationIndex(selectedParticipant.circuit[nextCircuitPosition]);
                setLocationGuess('');
                setRiddleAnswer('');
                setCurrentStep('location');
            }
        } else {
            setErrorMessage('Ce n\'est pas la bonne réponse. Réfléchis bien!');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedParticipant) return;

        if (enteredCode === selectedParticipant.code) {
            setIsSuccess(true);
            setCurrentStep('result');
            setMessage(selectedParticipant.secret);
        } else {
            setErrorMessage('Code incorrect. Vérifie les chiffres que tu as collectés!');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const resetGame = () => {
        setSelectedParticipant(null);
        setCurrentStep('start');
        setCircuitPosition(0);
        setLocationGuess('');
        setRiddleAnswer('');
        setEnteredCode('');
        setMessage('');
        setErrorMessage('');
        setCollectedDigits([]);
        setIsSuccess(false);
    };

    const renderCurrentContent = () => {
        if (!selectedParticipant) {
            return (
                <div>
                    <p className="text-amber-100 mb-6">Sélectionne un participant pour commencer le test:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {treasureHunt.participants.map((participant) => (
                            <button
                                key={participant.name}
                                onClick={() => handleParticipantSelect(participant)}
                                className="bg-amber-50 rounded-xl p-6 text-xl font-bold text-emerald-800 shadow-lg 
                          hover:transform hover:scale-105 transition-all duration-300
                          hover:bg-amber-200 hover:text-emerald-900 border-2 border-amber-300 flex items-center justify-center"
                                style={{
                                    boxShadow: '0 4px 14px rgba(255, 217, 102, 0.3)',
                                    backgroundImage: 'linear-gradient(to bottom right, rgba(255, 251, 235, 0.9), rgba(252, 231, 121, 0.7))'
                                }}
                            >
                                <User className="mr-2 w-5 h-5" />
                                {participant.name}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        switch (currentStep) {
            case 'start': {
                const firstLocationIndex = selectedParticipant.circuit[0];
                const firstLocationClue = treasureHunt.locations[firstLocationIndex].clue;

                return (
                    <div className="rounded-xl p-6 shadow-lg border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100">
                        <h3 className="text-2xl font-bold text-emerald-800 mb-4">Instructions de départ pour {selectedParticipant.name}</h3>

                        <div className="mb-6 p-4 bg-white rounded-lg border border-amber-200">
                            <p className="text-emerald-800">Bonjour {selectedParticipant.name} !</p>
                            <p className="mt-3 text-emerald-800">Pour trouver ton code secret, tu dois te rendre à un certain endroit.</p>
                            <p className="mt-3 text-emerald-800 font-medium">Voici l'indice pour trouver cet endroit:</p>
                            <p className="mt-2 p-3 bg-amber-50 rounded-lg text-emerald-700 italic border border-amber-100">{firstLocationClue}</p>
                        </div>

                        <button
                            onClick={handleStartHunt}
                            className="w-full bg-emerald-700 text-amber-100 py-3 rounded-lg
                         hover:bg-emerald-800 transition-colors duration-300 font-medium flex items-center justify-center"
                        >
                            <PlayCircle className="mr-2 w-5 h-5" />
                            Commencer la chasse au trésor
                        </button>
                    </div>
                );
            }

            case 'location': {
                const locationClue = treasureHunt.locations[currentLocationIndex].clue;

                return (
                    <div className="rounded-xl p-6 shadow-lg border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-emerald-800">
                                Étape {circuitPosition + 1}/{selectedParticipant.circuit.length}
                            </h3>
                            {/* <div className="text-sm bg-amber-200 px-3 py-1 rounded-full text-emerald-700">
                                Chiffres collectés: {collectedDigits.join(' ')}
                            </div> */}
                        </div>

                        <div className="mb-6 p-4 bg-white rounded-lg border border-amber-200">
                            <div className="flex items-center mb-2">
                                <MapPin className="text-emerald-700 w-5 h-5 mr-2" />
                                <h4 className="font-bold text-emerald-700">Trouve le lieu</h4>
                            </div>
                            <p className="mt-2 text-emerald-800">Indice:</p>
                            <p className="mt-1 p-3 bg-amber-50 rounded-lg text-emerald-700 italic border border-amber-100">{locationClue}</p>
                        </div>

                        <form onSubmit={handleLocationGuessSubmit} className="space-y-4">
                            <div>
                                <label className="block text-emerald-900 mb-2 font-medium">
                                    Quel est ce lieu?
                                </label>
                                <input
                                    type="text"
                                    value={locationGuess}
                                    onChange={(e) => setLocationGuess(e.target.value)}
                                    className={`w-full p-3 border-2 rounded-lg ${errorMessage ? 'border-red-500' : 'border-emerald-300 focus:border-emerald-500'} bg-amber-50`}
                                    placeholder="Ex: Cuisine"
                                    autoFocus
                                />
                            </div>

                            {errorMessage && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!locationGuess.trim()}
                                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center
                           ${!locationGuess.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-emerald-700 text-amber-100 hover:bg-emerald-800'} 
                           transition-colors duration-300`}
                            >
                                Vérifier le lieu
                            </button>
                        </form>
                    </div>
                );
            }

            case 'riddle': {
                const riddle = treasureHunt.riddles[currentLocationIndex];

                return (
                    <div className="rounded-xl p-6 shadow-lg border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-emerald-800">
                                Étape {circuitPosition + 1}/{selectedParticipant.circuit.length}
                            </h3>
                            <div className="text-sm bg-amber-200 px-3 py-1 rounded-full text-emerald-700">
                                Chiffres collectés: {collectedDigits.join(' ')}
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-white rounded-lg border border-amber-200">
                            <p className="text-emerald-800 mb-3">Bravo! Tu as trouvé le bon lieu.</p>
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <p className="text-emerald-700 font-medium">Voici ton énigme:</p>
                                <p className="mt-2 text-emerald-800 italic">{riddle.text}</p>
                            </div>
                        </div>

                        <form onSubmit={handleRiddleAnswerSubmit} className="space-y-4">
                            <div>
                                <label className="block text-emerald-900 mb-2 font-medium">
                                    Quelle est ta réponse?
                                </label>
                                <input
                                    type="text"
                                    value={riddleAnswer}
                                    onChange={(e) => setRiddleAnswer(e.target.value)}
                                    className={`w-full p-3 border-2 rounded-lg ${errorMessage ? 'border-red-500' : 'border-emerald-300 focus:border-emerald-500'} bg-amber-50`}
                                    placeholder="Ta réponse ici"
                                    autoFocus
                                />
                            </div>

                            {errorMessage && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!riddleAnswer.trim()}
                                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center
                           ${!riddleAnswer.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-emerald-700 text-amber-100 hover:bg-emerald-800'} 
                           transition-colors duration-300`}
                            >
                                Valider ma réponse
                            </button>
                        </form>
                    </div>
                );
            }

            case 'code': {
                return (
                    <div className="rounded-xl p-6 shadow-lg border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100">
                        <h3 className="text-2xl font-bold text-emerald-800 mb-4">Saisie du code final</h3>

                        <div className="mb-6 p-4 bg-white rounded-lg border border-amber-200">
                            <p className="text-emerald-800 mb-3">Bravo {selectedParticipant.name}! Tu as résolu toutes les énigmes!</p>

                            <p className="text-emerald-800 mb-3">
                                Pour obtenir le code secret, tu dois suivre les instructions ci-dessous pour chaque lieu visité:
                            </p>

                            <div className="space-y-2 mb-4">
                                {selectedParticipant.circuit.map((locIdx, idx) => (
                                    <div key={idx} className="p-2 bg-amber-50 rounded border border-amber-100">
                                        <p className="text-emerald-700">
                                            <span className="font-bold">{idx + 1}. </span>
                                            {treasureHunt.riddles[locIdx].instruction}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-emerald-100 p-3 rounded-lg text-center">
                                <p className="text-emerald-800 font-medium">Chiffres collectés:</p>
                                <div className="flex justify-center gap-2 mt-2">
                                    {collectedDigits.map((digit, idx) => (
                                        <span key={idx} className="w-8 h-8 flex items-center justify-center bg-white border-2 border-emerald-300 rounded-lg font-mono font-bold text-emerald-700">
                                            {digit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleCodeSubmit} className="space-y-4">
                            <div>
                                <label className="block text-emerald-900 mb-2 font-medium">
                                    Entre le code secret:
                                </label>
                                <input
                                    type="text"
                                    value={enteredCode}
                                    onChange={(e) => setEnteredCode(e.target.value)}
                                    className={`w-full p-3 border-2 rounded-lg text-center font-mono text-lg
                             ${errorMessage ? 'border-red-500' : 'border-emerald-300 focus:border-emerald-500'} bg-amber-50`}
                                    maxLength={selectedParticipant.code.length}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    autoFocus
                                />
                            </div>

                            {errorMessage && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!enteredCode.trim()}
                                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center
                           ${!enteredCode.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-emerald-700 text-amber-100 hover:bg-emerald-800'} 
                           transition-colors duration-300`}
                            >
                                <Gift className="mr-2 w-5 h-5" />
                                Valider le code
                            </button>
                        </form>
                    </div>
                );
            }

            case 'result': {
                return (
                    <div className="rounded-xl p-6 shadow-lg border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100">
                        <div className="flex justify-center mb-6">
                            <div className="bg-emerald-100 rounded-full p-4">
                                <CheckCircle className="w-16 h-16 text-emerald-600" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-emerald-800 mb-4 text-center">Félicitations {selectedParticipant.name}!</h3>

                        <div className="p-5 bg-white rounded-lg border border-amber-200 mb-6">
                            <p className="text-lg text-emerald-800 animate-reveal font-medium text-center">
                                {message}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={resetGame}
                                className="bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors flex items-center"
                            >
                                Recommencer
                            </button>
                        </div>
                    </div>
                );
            }

            default:
                return null;
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
                    {treasureHunt.title} - Mode Test
                </h2>
            </div>

            <div className="max-w-lg mx-auto">
                {renderCurrentContent()}
            </div>
        </div>
    );
};

export default TreasureHuntVirtualGame;