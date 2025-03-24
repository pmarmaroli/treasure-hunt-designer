import React, { useState } from 'react';
import { Gift, Plus, PlayCircle, ArrowLeft, ArrowRight, Printer, Download, Home, FileCheck, Play, Upload } from 'lucide-react';
import TreasureHuntPreview from './TreasureHuntPreview';
import TreasureHuntGame from './TreasureHuntGame';
import TreasureHuntImporter from './TreasureHuntImporter';
import TreasureHuntVirtualGame from './TreasureHuntVirtualGame';
import generateTreasureHuntPDFs from './pdfGenerator';
import { useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import FormattedText from './components/FormattedText';

type AppMode = 'selection' | 'example' | 'create' | 'import';

// Different test modes
type TestMode = 'simple' | 'virtual';

type Child = {
  name: string;
  code: string;
  message: string;
};


// New types for treasure hunt creation
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

type Participant = {
  name: string;
  secret: string;
  circuit: number[];
  code: string;
};

type TreasureHunt = {
  title: string;
  participants: Participant[];
  locations: Location[];
  riddles: Riddle[];
};

function App() {
  const { t, language } = useLanguage();
  const [appMode, setAppMode] = useState<AppMode>('selection');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [code, setCode] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState(false);

  // States for treasure hunt creation
  const [createStep, setCreateStep] = useState(1);
  const [treasureHunt, setTreasureHunt] = useState<TreasureHunt>({
    title: '',
    participants: [],
    locations: [],
    riddles: [],
  });
  const [participantCount, setParticipantCount] = useState(2);
  const [riddleCount, setRiddleCount] = useState(3);
  const [tempParticipant, setTempParticipant] = useState({ name: '', secret: '' });
  const [tempLocation, setTempLocation] = useState({ name: '', clue: '' });
  const [tempRiddle, setTempRiddle] = useState({
    text: '',
    answer: '',
    instruction: '',
    digit: ''
  });
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  //eslint-disable-next-line
  const [huntCreated, setHuntCreated] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [testModeType, setTestModeType] = useState<TestMode>('simple');

  const handleCreateMode = () => {
    setAppMode('create');
    setSelectedChild(null);
    setCode('');
    setShowMessage(false);
    setError(false);
    setCreateStep(1);
    setTreasureHunt({
      title: '',
      participants: [],
      locations: [],
      riddles: [],
    });
    setHuntCreated(false);
  };

  const handleImportMode = () => {
    setAppMode('import');
    setSelectedChild(null);
    setCode('');
    setShowMessage(false);
    setError(false);
  };

  const handleImportedTreasureHunt = (importedHunt: TreasureHunt) => {
    setTreasureHunt(importedHunt);
    setHuntCreated(true);
    setAppMode('create');
    setCreateStep(5);
    setTestMode(false);
  };

  // Handle test mode with type parameter
  const handleTestMode = (mode: TestMode) => {
    setTestMode(true);
    setTestModeType(mode);
  };

  const returnToSelection = () => {
    setAppMode('selection');
    setSelectedChild(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChild && code === selectedChild.code) {
      setShowMessage(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 820);
    }
  };

  // New handlers for treasure hunt creation
  const nextStep = () => {
    if (createStep < 5) {
      setCreateStep(prevStep => prevStep + 1);
    }
  };

  const prevStep = () => {
    if (createStep > 1) {
      setCreateStep(prevStep => Math.max(1, prevStep - 1));

      // Reset current index based on which step we're returning to
      if (createStep === 3) {
        setCurrentParticipantIndex(treasureHunt.participants.length - 1);
      } else if (createStep === 4) {
        setCurrentLocationIndex(treasureHunt.locations.length - 1);
      } else if (createStep === 5) {
        setCurrentRiddleIndex(treasureHunt.riddles.length - 1);
      }
    }
  };

  const editEntry = (type: 'participant' | 'location' | 'riddle', index: number) => {
    if (type === 'participant') {
      setTempParticipant({ ...treasureHunt.participants[index] });
      setCurrentParticipantIndex(index);

      // Update participants array by removing the one being edited
      setTreasureHunt(prev => ({
        ...prev,
        participants: prev.participants.filter((_, i) => i !== index)
      }));
    } else if (type === 'location') {
      setTempLocation({ ...treasureHunt.locations[index] });
      setCurrentLocationIndex(index);

      // Update locations array by removing the one being edited
      setTreasureHunt(prev => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index)
      }));
    } else if (type === 'riddle') {
      setTempRiddle({ ...treasureHunt.riddles[index] });
      setCurrentRiddleIndex(index);

      // Update riddles array by removing the one being edited
      setTreasureHunt(prev => ({
        ...prev,
        riddles: prev.riddles.filter((_, i) => i !== index)
      }));
    }
  };

  const updateTreasureHuntTitle = (title: string) => {
    setTreasureHunt(prev => ({ ...prev, title }));
  };

  const addParticipant = () => {
    if (tempParticipant.name.trim() && tempParticipant.secret.trim()) {
      const newParticipant: Participant = {
        ...tempParticipant,
        circuit: [],
        code: '',
      };

      setTreasureHunt(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant],
      }));

      setTempParticipant({ name: '', secret: '' });

      if (treasureHunt.participants.length + 1 === participantCount) {
        nextStep();
      } else {
        setCurrentParticipantIndex(prev => prev + 1);
      }
    }
  };

  const addLocation = () => {
    if (tempLocation.name.trim() && tempLocation.clue.trim()) {
      setTreasureHunt(prev => ({
        ...prev,
        locations: [...prev.locations, tempLocation],
      }));

      setTempLocation({ name: '', clue: '' });

      if (treasureHunt.locations.length + 1 === riddleCount) {
        nextStep();
      } else {
        setCurrentLocationIndex(prev => prev + 1);
      }
    }
  };

  const addRiddle = () => {
    if (
      tempRiddle.text.trim() &&
      tempRiddle.answer.trim() &&
      tempRiddle.instruction.trim() &&
      tempRiddle.digit.trim()
    ) {
      // Ajouter l'énigme à la liste
      setTreasureHunt(prev => ({
        ...prev,
        riddles: [...prev.riddles, tempRiddle],
      }));

      // Réinitialiser le formulaire
      setTempRiddle({ text: '', answer: '', instruction: '', digit: '' });

      // Avancer l'index pour la prochaine énigme
      setCurrentRiddleIndex(prev => prev + 1);
    }
  };

  // Function to generate random circuits and codes for each participant
  const generateTreasureHunt = () => {
    // Utiliser une copie profonde pour éviter les problèmes de référence
    const huntCopy = JSON.parse(JSON.stringify(treasureHunt));

    // Générer des circuits aléatoires pour chaque participant
    huntCopy.participants = huntCopy.participants.map((participant: Participant) => {
      // Créer un ordre aléatoire des lieux
      const locationIndices = Array.from({ length: riddleCount }, (_, i) => i);

      // Algorithme de mélange Fisher-Yates
      for (let i = locationIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [locationIndices[i], locationIndices[j]] = [locationIndices[j], locationIndices[i]];
      }

      // Générer le code basé sur le circuit
      const code = locationIndices.map(locIndex => huntCopy.riddles[locIndex].digit).join('');

      return {
        ...participant,
        circuit: locationIndices,
        code: code,
      };
    });

    console.log("Hunt generated:", huntCopy);

    // Mise à jour de l'état avec la chasse au trésor générée
    setTreasureHunt(huntCopy);
    setHuntCreated(true);

    // Passer à l'étape 5
    setCreateStep(5);
  };

  const generateJsonFile = () => {
    const jsonData = JSON.stringify(treasureHunt, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${treasureHunt.title.replace(/\s+/g, '_')}_treasure_hunt.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateStartInstructions = () => {
    let content = '';

    treasureHunt.participants.forEach(participant => {
      const firstLocationIndex = participant.circuit[0];
      const firstLocationClue = treasureHunt.locations[firstLocationIndex].clue;

      content += `INSTRUCTIONS DE DÉPART POUR: ${participant.name}\n\n`;
      content += `Bonjour ${participant.name} !\n\n`;
      content += `Ton aventure commence dans un endroit spécial.\n`;
      content += `Voici l'indice pour trouver cet endroit: ${firstLocationClue}\n\n`;
      content += `----------------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${treasureHunt.title.replace(/\s+/g, '_')}_instructions.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateRiddleSheets = () => {
    let content = '';

    treasureHunt.participants.forEach(participant => {
      participant.circuit.forEach((locationIndex, circuitIndex) => {
        const riddle = treasureHunt.riddles[locationIndex];
        const isLastLocation = circuitIndex === participant.circuit.length - 1;

        content += `FEUILLE D'ÉNIGME POUR: ${participant.name} (Énigme ${circuitIndex + 1}/${participant.circuit.length})\n\n`;
        content += `Cher(e) ${participant.name},\n\n`;
        content += `Voici ton énigme numéro ${circuitIndex + 1}:\n\n`;
        content += `${riddle.text}\n\n`;
        content += `Écris ta réponse au dos de cette feuille puis `;

        if (isLastLocation) {
          const allInstructions = participant.circuit.map(idx => treasureHunt.riddles[idx].instruction).join('\n- ');
          content += `pour trouver ton code secret, suis maintenant ces instructions:\n\n- ${allInstructions}\n\n`;
        } else {
          const nextLocationIndex = participant.circuit[circuitIndex + 1];
          const nextLocationClue = treasureHunt.locations[nextLocationIndex].clue;
          content += `rends-toi à ton prochain lieu. Pour le trouver, suis cet indice:\n\n${nextLocationClue}\n\n`;
        }

        content += `----------------------------------------------------------\n\n`;
      });
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${treasureHunt.title.replace(/\s+/g, '_')}_riddle_sheets.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate PDF files using the imported function
  const handleGeneratePDFs = () => {
    generateTreasureHuntPDFs(treasureHunt, language);
  };

  // This is the fixed version of the renderCreateStep function in App.tsx
  const renderCreateStep = () => {
    switch (createStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">
              {t('step1Title')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('huntTitle')}
                </label>
                <input
                  type="text"
                  value={treasureHunt.title}
                  onChange={(e) => updateTreasureHuntTitle(e.target.value)}
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                  placeholder="Ex: Chasse au trésor de l'Aïd"
                />
              </div>

              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('participantCount')}
                </label>
                <input
                  type="number"
                  value={participantCount}
                  onChange={(e) => setParticipantCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                />
              </div>

              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('riddleCount')}
                </label>
                <input
                  type="number"
                  value={riddleCount}
                  onChange={(e) => setRiddleCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={returnToSelection}
                className="bg-gray-200 text-emerald-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={nextStep}
                disabled={!treasureHunt.title}
                className={`bg-emerald-700 text-amber-100 py-2 px-4 rounded-lg flex items-center ${!treasureHunt.title ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-800'
                  } transition-colors`}
              >
                {t('next')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">
              <FormattedText
                id="step2Title"
                values={{
                  current: Math.min((currentParticipantIndex + 1), participantCount).toString(),
                  total: participantCount.toString()
                }}
              />
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('participantName')}
                </label>
                <input
                  type="text"
                  value={tempParticipant.name}
                  onChange={(e) => setTempParticipant({ ...tempParticipant, name: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                  placeholder="Ex: Jean"
                />
              </div>

              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('finalSecret')}
                </label>
                <textarea
                  value={tempParticipant.secret}
                  onChange={(e) => setTempParticipant({ ...tempParticipant, secret: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                  placeholder="Ex: Ton cadeau est caché dans le frigo!"
                  rows={3}
                />
              </div>
            </div>

            {treasureHunt.participants.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">{t('participants')} :</h3>
                <ul className="bg-amber-50 rounded-lg p-3 border-2 border-amber-200">
                  {treasureHunt.participants.map((p, idx) => (
                    <li key={idx} className="mb-2 pb-2 border-b border-amber-100 last:border-0 last:mb-0 last:pb-0 flex justify-between items-center">
                      <div>
                        <strong>{p.name}</strong>: {p.secret}
                      </div>
                      <button
                        onClick={() => editEntry('participant', idx)}
                        className="ml-2 text-emerald-700 hover:text-emerald-900"
                      >
                        ✏️ {t('edit')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-200 text-emerald-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                {t('previous')}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={addParticipant}
                  disabled={!tempParticipant.name || !tempParticipant.secret}
                  className={`bg-emerald-700 text-amber-100 py-2 px-4 rounded-lg ${!tempParticipant.name || !tempParticipant.secret ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-800'
                    } transition-colors`}
                >
                  {t('addParticipant')}
                </button>
                {treasureHunt.participants.length >= participantCount && (
                  <button
                    onClick={nextStep}
                    className="bg-emerald-700 text-amber-100 py-2 px-4 rounded-lg hover:bg-emerald-800 transition-colors flex items-center"
                  >
                    {t('next')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">
              <FormattedText
                id="step3Title"
                values={{
                  current: Math.min((currentLocationIndex + 1), riddleCount).toString(),
                  total: riddleCount.toString()
                }}
              />
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('locationName')}
                </label>
                <input
                  type="text"
                  value={tempLocation.name}
                  onChange={(e) => setTempLocation({ ...tempLocation, name: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                  placeholder="Ex: Cuisine"
                />
              </div>

              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('locationClue')}
                </label>
                <textarea
                  value={tempLocation.clue}
                  onChange={(e) => setTempLocation({ ...tempLocation, clue: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                  placeholder="Ex: C'est là où l'on prépare les repas"
                  rows={3}
                />
              </div>
            </div>

            {treasureHunt.locations.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">{t('locations')} :</h3>
                <ul className="bg-amber-50 rounded-lg p-3 border-2 border-amber-200">
                  {treasureHunt.locations.map((loc, idx) => (
                    <li key={idx} className="mb-2 pb-2 border-b border-amber-100 last:border-0 last:mb-0 last:pb-0 flex justify-between items-center">
                      <div>
                        <strong>{loc.name}</strong>: {loc.clue}
                      </div>
                      <button
                        onClick={() => editEntry('location', idx)}
                        className="ml-2 text-emerald-700 hover:text-emerald-900"
                      >
                        ✏️ {t('edit')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-200 text-emerald-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                {t('previous')}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={addLocation}
                  disabled={!tempLocation.name || !tempLocation.clue}
                  className={`bg-emerald-700 text-amber-100 py-2 px-4 rounded-lg ${!tempLocation.name || !tempLocation.clue ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-800'
                    } transition-colors`}
                >
                  {t('addLocation')}
                </button>
                {treasureHunt.locations.length >= riddleCount && (
                  <button
                    onClick={nextStep}
                    className="bg-emerald-700 text-amber-100 py-2 px-4 rounded-lg hover:bg-emerald-800 transition-colors flex items-center"
                  >
                    {t('next')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">
              <FormattedText
                id="step4Title"
                values={{
                  current: Math.min((currentRiddleIndex + 1), riddleCount).toString(),
                  total: riddleCount.toString()
                }}
              />
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('riddleText')}
                </label>
                <textarea
                  value={tempRiddle.text}
                  onChange={(e) => setTempRiddle({ ...tempRiddle, text: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                  placeholder="Ex: Je suis blanc comme neige et froid comme glace. Qui suis-je?"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('expectedAnswer')}
                </label>
                <input
                  type="text"
                  value={tempRiddle.answer}
                  onChange={(e) => setTempRiddle({ ...tempRiddle, answer: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                  placeholder="Ex: Le réfrigérateur"
                />
              </div>

              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('digitInstruction')}
                </label>
                <textarea
                  value={tempRiddle.instruction}
                  onChange={(e) => setTempRiddle({ ...tempRiddle, instruction: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                  placeholder="Ex: Compte le nombre de lettres dans ta réponse et garde uniquement le chiffre des unités"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-emerald-800 mb-2 font-medium">
                  {t('expectedDigit')}
                </label>
                <input
                  type="text"
                  value={tempRiddle.digit}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (/^[0-9]$/.test(value))) {
                      setTempRiddle({ ...tempRiddle, digit: value });
                    }
                  }}
                  maxLength={1}
                  pattern="[0-9]"
                  className="w-full p-3 border-2 rounded-lg border-emerald-300 focus:border-emerald-500 bg-amber-50"
                  placeholder="Ex: 3"
                />
              </div>
            </div>

            {treasureHunt.riddles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">{t('riddles')} :</h3>
                <ul className="bg-amber-50 rounded-lg p-3 border-2 border-amber-200">
                  {treasureHunt.riddles.map((r, idx) => (
                    <li key={idx} className="mb-2 pb-2 border-b border-amber-100 last:border-0 last:mb-0 last:pb-0 flex justify-between items-start">
                      <div>
                        <strong>{t('riddles')} {idx + 1}</strong>: {r.text.substring(0, 50)}...
                        <br />
                        <span className="text-sm">{t('answer')}: {r.answer} → {t('digit')}: {r.digit}</span>
                      </div>
                      <button
                        onClick={() => editEntry('riddle', idx)}
                        className="ml-2 text-emerald-700 hover:text-emerald-900"
                      >
                        ✏️ {t('edit')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-200 text-emerald-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                {t('previous')}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={addRiddle}
                  disabled={!tempRiddle.text || !tempRiddle.answer || !tempRiddle.instruction || !tempRiddle.digit}
                  className={`bg-emerald-700 text-amber-100 py-2 px-4 rounded-lg ${!tempRiddle.text || !tempRiddle.answer || !tempRiddle.instruction || !tempRiddle.digit
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-emerald-800'
                    } transition-colors`}
                >
                  {t('addRiddle')}
                </button>
                {treasureHunt.riddles.length >= riddleCount && (
                  <button
                    onClick={generateTreasureHunt}
                    className="bg-emerald-700 text-amber-100 py-2 px-4 rounded-lg hover:bg-emerald-800 transition-colors flex items-center"
                  >
                    {t('finalize')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>

                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">
              {t('step5Title')}
            </h2>

            <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-emerald-800">{treasureHunt.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTestMode('simple')}
                    className="bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors flex items-center"
                  >
                    <Play className="mr-2 w-4 h-4" />
                    {t('testMode')}
                  </button>
                  <button
                    onClick={() => handleTestMode('virtual')}
                    className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                  >
                    <PlayCircle className="mr-2 w-4 h-4" />
                    {t('virtualTest')}
                  </button>
                </div>
              </div>

              <TreasureHuntPreview
                title={treasureHunt.title}
                participants={treasureHunt.participants}
                locations={treasureHunt.locations}
                riddles={treasureHunt.riddles}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={generateJsonFile}
                className="bg-emerald-700 text-amber-100 py-3 px-4 rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center"
              >
                <Download className="mr-2 w-5 h-5" />
                {t('downloadJSON')}
              </button>

              <button
                onClick={generateStartInstructions}
                className="bg-emerald-700 text-amber-100 py-3 px-4 rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center"
              >
                <Printer className="mr-2 w-5 h-5" />
                {t('startInstructions')}
              </button>

              <button
                onClick={generateRiddleSheets}
                className="bg-emerald-700 text-amber-100 py-3 px-4 rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center"
              >
                <Printer className="mr-2 w-5 h-5" />
                {t('riddleSheets')}
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={handleGeneratePDFs}
                className="w-full bg-emerald-700 text-amber-100 py-3 px-4 rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center"
              >
                <FileCheck className="mr-2 w-5 h-5" />
                {t('generateAllPDFs')}
              </button>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-200 text-emerald-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                {t('previous')}
              </button>
              <button
                onClick={returnToSelection}
                className="bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors flex items-center"
              >
                <Home className="mr-2 w-5 h-5" />
                {t('home')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    //<div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 p-8 relative overflow-hidden">
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-[#8B4513] to-[#3E1D09] p-8 relative overflow-hidden">
      {/* Add treasure hunt decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCI+PGNpcmNsZSBjeD0iMzUiIGN5PSIzNSIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMDUsIDEzMywgNjMsIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-20"></div>

        {/* Decorative compass */}
        <div className="absolute top-10 right-10 opacity-20">
          <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber-200">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
            <path d="M12 12L7 7m5 5l5-5m-5 5l-5 5m5-5l5 5" />
          </svg>
        </div>

        {/* Decorative map elements */}
        <div className="absolute bottom-20 left-10 opacity-20">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber-200">
            <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
            <path d="M9 3v15m6-12v15" />
          </svg>
        </div>
      </div>

      {/* Language Selector */}
      <LanguageSelector />

      {/* Decorative elements */}
      <div className="absolute top-20 left-40 opacity-20">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber-200">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </div>
      <div className="absolute bottom-40 right-20 opacity-20">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber-200">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2v20M2 12h20M12 12l4 4M12 12l4-4M12 12l-4 4M12 12l-4-4"></path>
        </svg>
      </div>

      {/* Pattern overlay for islamic-style decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')] opacity-10"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-center mb-12">
          <div className="bg-amber-800 bg-opacity-20 rounded-full p-6 border-2 border-yellow-600"
            style={{ boxShadow: '0 4px 10px rgba(205, 133, 63, 0.5)' }}>
            <h1 className="text-4xl font-bold text-amber-300 text-center drop-shadow-lg flex items-center">
              {t('treasureHunt')}
              <Gift className="ml-4 text-amber-300" />
            </h1>
          </div>
        </div>

        {appMode === 'selection' ? (
          <div className="flex flex-col items-center justify-center gap-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                onClick={handleCreateMode}
                className="bg-amber-50 rounded-xl p-8 text-2xl font-bold text-emerald-800 shadow-lg 
         hover:transform hover:scale-105 transition-all duration-300
         hover:bg-amber-200 hover:text-emerald-900 border-2 border-amber-300 flex flex-col items-center justify-center"
                style={{
                  boxShadow: '0 4px 14px rgba(120, 80, 40, 0.5)',
                  backgroundImage: 'linear-gradient(to bottom right, rgba(245, 222, 179, 0.9), rgba(205, 133, 63, 0.7))',
                  border: '2px solid #8B4513'
                }}
              >
                <Plus className="w-16 h-16 mb-4 text-emerald-700" />
                <span>{t('createNew')}</span>
              </button>

              <button
                onClick={handleImportMode}
                className="bg-amber-50 rounded-xl p-8 text-2xl font-bold text-emerald-800 shadow-lg 
         hover:transform hover:scale-105 transition-all duration-300
         hover:bg-amber-200 hover:text-emerald-900 border-2 border-amber-300 flex flex-col items-center justify-center"
                style={{
                  boxShadow: '0 4px 14px rgba(120, 80, 40, 0.5)',
                  backgroundImage: 'linear-gradient(to bottom right, rgba(245, 222, 179, 0.9), rgba(205, 133, 63, 0.7))',
                  border: '2px solid #8B4513'
                }}
              >
                <Upload className="w-16 h-16 mb-4 text-emerald-700" />
                <span>{t('import')}</span>
                <span className="text-sm mt-2 text-emerald-700 font-normal">{t('importFile')}</span>
              </button>
            </div>
          </div>
        ) : appMode === 'import' ? (
          <TreasureHuntImporter
            onImport={handleImportedTreasureHunt}
            onCancel={returnToSelection}
          />
        ) : appMode === 'create' ? (
          testMode ? (
            testModeType === 'virtual' ? (
              <TreasureHuntVirtualGame
                treasureHunt={treasureHunt}
                onBack={() => setTestMode(false)}
              />
            ) : (
              <TreasureHuntGame
                title={treasureHunt.title}
                participants={treasureHunt.participants}
                onBack={() => setTestMode(false)}
              />
            )
          ) : (
            <div
              className="rounded-xl p-8 shadow-lg max-w-2xl mx-auto border-2 border-amber-300"
              style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(255, 251, 235, 0.95), rgba(252, 211, 77, 0.85))',
                boxShadow: '0 4px 20px rgba(255, 217, 102, 0.4)'
              }}
            >
              {renderCreateStep()}
            </div>
          )
        )
          : (
            <div
              className="rounded-xl p-8 shadow-lg max-w-md mx-auto border-2 border-amber-300"
              style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(255, 251, 235, 0.95), rgba(252, 211, 77, 0.85))',
                boxShadow: '0 4px 20px rgba(255, 217, 102, 0.4)'
              }}
            >
              <button
                onClick={() => setSelectedChild(null)}
                className="mb-4 text-emerald-800 hover:text-emerald-900 flex items-center font-medium"
              >
                ← {t('back')}
              </button>

              <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
                {selectedChild?.name}
              </h2>

              {!showMessage ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-emerald-900 mb-2 font-medium">
                      <FormattedText
                        id="enterCode"
                        values={{ length: selectedChild?.code.length || 0 }}
                      />
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={`w-full p-3 border-2 rounded-lg ${error
                        ? 'border-red-500 animate-shake'
                        : 'border-emerald-300 focus:border-emerald-500'
                        } bg-amber-50`}
                      maxLength={selectedChild?.code.length}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-700 text-amber-100 py-3 rounded-lg
                    hover:bg-emerald-800 transition-colors duration-300 font-medium"
                  >
                    {t('validate')}
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                  <p className="text-lg text-emerald-900 animate-reveal font-medium">
                    {selectedChild?.message}
                  </p>
                </div>
              )}
            </div>
          )}
      </div>


    </div>
  );
}

export default App;