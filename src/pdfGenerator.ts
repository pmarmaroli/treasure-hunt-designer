import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

type Language = 'fr' | 'en' | 'es';

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

// Traductions pour les PDF
const pdfTranslations = {
  fr: {
    startInstructions: 'Instructions de départ à donner aux participants',
    for: 'Pour:',
    hello: 'Bonjour',
    findSecretCode: 'Ton aventure commence en te rendant dans un lieu précis.',
    clueToFindLocation: 'Indice pour trouver ce lieu:',
    riddleFor: 'Énigme pour:',
    dear: 'Cher(e)',
    riddleNumber: 'Voici ton énigme numéro',
    writeAnswer: 'Écris ta réponse au dos de cette feuille puis',
    followInstructions: 'suis ces instructions:',
    goToNextLocation: 'rends-toi à ton prochain lieu.',
    toFindSecretCode: 'Pour trouver ton code secret, suis ces instructions:',
    withAnswer: 'Avec ta réponse', // Added for the new format
    toFindNextLocation: 'Pour trouver ton prochain lieu, suis cet indice:',
    page: 'Page',
    location: 'Lieu:',
    summary: 'Récapitulatif pour l\'organisateur',
    participantsAndCodes: 'Participants et leurs codes',
    name: 'Nom',
    secretCode: 'Code secret',
    finalMessage: 'Message final',
    locationsAndClues: 'Lieux et indices',
    clue: 'Indice',
    circuitsToFollow: 'Circuits à suivre par participant',
    circuitsToFollowCont: 'Circuits à suivre (suite)',
    finalCode: 'Code final:',
    riddlesAnswersDigits: 'Énigmes, réponses et chiffres correspondants',
    riddlesCont: 'Énigmes (suite)',
    riddle: 'Énigme',
    answer: 'Réponse:',
    instruction: 'Instruction:',
    digit: 'Chiffre:',
    startInstructionsFile: 'instructions_depart',
    riddlesFile: 'enigmes',
    summaryFile: 'recapitulatif',
    printAndPlace: 'Imprimez cette page, placez-la dans une enveloppe adressée à ',
    printAndPlaceCont: ', puis déposez à l\'endroit suivant : ',
  },
  en: {
    startInstructions: 'Starting instructions to give to participants',
    for: 'For:',
    hello: 'Hello',
    findSecretCode: 'Your adventure begins by going to a specific location.',
    clueToFindLocation: 'Clue to find this location:',
    riddleFor: 'Riddle for:',
    dear: 'Dear',
    riddleNumber: 'Here is your riddle number',
    writeAnswer: 'Write your answer on the back of this sheet then',
    followInstructions: 'follow these instructions:',
    goToNextLocation: 'go to your next location.',
    toFindSecretCode: 'To find your secret code, follow these instructions:',
    withAnswer: 'With your answer', // Added for the new format
    toFindNextLocation: 'To find your next location, follow this clue:',
    page: 'Page',
    location: 'Location:',
    summary: 'Summary for the organizer',
    participantsAndCodes: 'Participants and their codes',
    name: 'Name',
    secretCode: 'Secret code',
    finalMessage: 'Final message',
    locationsAndClues: 'Locations and clues',
    clue: 'Clue',
    circuitsToFollow: 'Circuits to follow by participant',
    circuitsToFollowCont: 'Circuits to follow (continued)',
    finalCode: 'Final code:',
    riddlesAnswersDigits: 'Riddles, answers and corresponding digits',
    riddlesCont: 'Riddles (continued)',
    riddle: 'Riddle',
    answer: 'Answer:',
    instruction: 'Instruction:',
    digit: 'Digit:',
    startInstructionsFile: 'starting_instructions',
    riddlesFile: 'riddles',
    summaryFile: 'summary',
    printAndPlace: 'Print this page, place it in an envelope addressed to ',
    printAndPlaceCont: ', then drop it at the following location: ',
  },
  es: {
    startInstructions: 'Instrucciones iniciales para dar a los participantes',
    for: 'Para:',
    hello: 'Hola',
    findSecretCode: 'Tu aventura comienza yendo a un lugar específico.',
    clueToFindLocation: 'Pista para encontrar este lugar:',
    riddleFor: 'Acertijo para:',
    dear: 'Estimado/a',
    riddleNumber: 'Aquí está tu acertijo número',
    writeAnswer: 'Escribe tu respuesta en el reverso de esta hoja y luego',
    followInstructions: 'sigue estas instrucciones:',
    goToNextLocation: 've a tu próxima ubicación.',
    toFindSecretCode: 'Para encontrar tu código secreto, sigue estas instrucciones:',
    withAnswer: 'Con tu respuesta', // Added for the new format
    toFindNextLocation: 'Para encontrar tu próxima ubicación, sigue esta pista:',
    page: 'Página',
    location: 'Ubicación:',
    summary: 'Resumen para el organizador',
    participantsAndCodes: 'Participantes y sus códigos',
    name: 'Nombre',
    secretCode: 'Código secreto',
    finalMessage: 'Mensaje final',
    locationsAndClues: 'Ubicaciones y pistas',
    clue: 'Pista',
    circuitsToFollow: 'Circuitos a seguir por participante',
    circuitsToFollowCont: 'Circuitos a seguir (continuación)',
    finalCode: 'Código final:',
    riddlesAnswersDigits: 'Acertijos, respuestas y dígitos correspondientes',
    riddlesCont: 'Acertijos (continuación)',
    riddle: 'Acertijo',
    answer: 'Respuesta:',
    instruction: 'Instrucción:',
    digit: 'Dígito:',
    startInstructionsFile: 'instrucciones_iniciales',
    riddlesFile: 'acertijos',
    summaryFile: 'resumen',
    printAndPlace: 'Imprime esta página, colócala en un sobre dirigido a ',
    printAndPlaceCont: ', luego deja en la siguiente ubicación: ',
  }
};

/**
 * Fonction principale pour générer tous les PDFs nécessaires
 */
export const generateTreasureHuntPDFs = (treasureHunt: TreasureHunt, language: Language = 'fr') => {
  // Cette fonction génère les trois types de PDF avec la langue appropriée
  generateStartInstructionsPDF(treasureHunt, language);
  generateRiddleSheetsPDF(treasureHunt, language);
  generateSummaryPDF(treasureHunt, language);
};

/**
 * Génère un PDF avec les instructions de départ pour chaque participant
 */
const generateStartInstructionsPDF = (treasureHunt: TreasureHunt, language: Language) => {
  const doc = new jsPDF();
  const title = treasureHunt.title;
  const texts = pdfTranslations[language];
  
  doc.setFontSize(20);
  doc.text(title, 105, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.text(texts.startInstructions, 105, 30, { align: 'center' });
  
  let y = 50;
  
  treasureHunt.participants.forEach((participant, index) => {
    if (index > 0 && y > 240) {
      doc.addPage();
      y = 20;
    }
    
    const firstLocationIndex = participant.circuit[0];
    const firstLocationClue = treasureHunt.locations[firstLocationIndex].clue;
    
    doc.setFontSize(14);
    doc.text(`${texts.for} ${participant.name}`, 20, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.text(`${texts.hello} ${participant.name}!`, 20, y);
    y += 10;
    
    const text = `${texts.findSecretCode}

${texts.clueToFindLocation} ${firstLocationClue}`;
    
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, y);
    y += splitText.length * 7 + 15;
    
    if (index < treasureHunt.participants.length - 1) {
      doc.line(20, y - 5, 190, y - 5);
    }
  });
  
  // Sauvegarde du PDF d'instructions de départ
  doc.save(`${title.replace(/\s+/g, '_')}_${texts.startInstructionsFile}.pdf`);
};

/**
 * Génère un PDF avec les feuilles d'énigmes pour la chasse au trésor
 */
const generateRiddleSheetsPDF = (treasureHunt: TreasureHunt, language: Language) => {
  const doc = new jsPDF();
  const title = treasureHunt.title;
  const texts = pdfTranslations[language];
  
  let pageCount = 0;
  
  treasureHunt.participants.forEach(participant => {
    participant.circuit.forEach((locationIndex, circuitIndex) => {
      if (pageCount > 0) {
        doc.addPage();
      }
      pageCount++;
      
      const riddle = treasureHunt.riddles[locationIndex];
      const isLastLocation = circuitIndex === participant.circuit.length - 1;
      
      doc.setFontSize(16);
      doc.text(title, 105, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text(`${texts.riddleFor} ${participant.name}`, 105, 30, { align: 'center' });
      doc.text(`(${circuitIndex + 1}/${participant.circuit.length})`, 105, 40, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`${texts.dear} ${participant.name},`, 20, 60);
      
      doc.text(`${texts.riddleNumber} ${circuitIndex + 1}:`, 20, 70);
      
      const riddleText = doc.splitTextToSize(riddle.text, 170);
      doc.text(riddleText, 20, 80);
      
      let y = 80 + riddleText.length * 7 + 10;
      
      doc.text(`${texts.writeAnswer} ${isLastLocation ? texts.followInstructions : texts.goToNextLocation}`, 20, y);
      y += 10;
      
      if (isLastLocation) {
        // Final instructions to get the code
        doc.text(texts.toFindSecretCode, 20, y);
        y += 10;
        
        // Modified section to reference which riddle answer each instruction applies to
        participant.circuit.forEach((locIdx, idx) => {
          const instruction = treasureHunt.riddles[locIdx].instruction;
          const wrappedInstruction = doc.splitTextToSize(`${texts.withAnswer} ${idx + 1}: ${instruction}`, 160);
          doc.text(wrappedInstruction, 25, y);
          y += wrappedInstruction.length * 7;
        });
      } else {
        // Clue for next location
        const nextLocationIndex = participant.circuit[circuitIndex + 1];
        const nextLocationClue = treasureHunt.locations[nextLocationIndex].clue;
        
        doc.text(texts.toFindNextLocation, 20, y);
        y += 10;
        
        const clueText = doc.splitTextToSize(nextLocationClue, 160);
        doc.text(clueText, 25, y);
      }
      
      // Add footer with participant name, page number, and location
      const location = treasureHunt.locations[locationIndex];
      doc.setFontSize(10);
      doc.text(`${texts.page} ${circuitIndex + 1}/${participant.circuit.length} - ${texts.printAndPlace} ${participant.name}${texts.printAndPlaceCont} ${location.name}`, 105, 280, { align: 'center' });

    });
  });
  
  // Sauvegarde du PDF des énigmes
  doc.save(`${title.replace(/\s+/g, '_')}_${texts.riddlesFile}.pdf`);
};

/**
 * Génère un PDF récapitulatif avec tous les détails de la chasse au trésor
 */
const generateSummaryPDF = (treasureHunt: TreasureHunt, language: Language) => {
  const doc = new jsPDF();
  const title = treasureHunt.title;
  const texts = pdfTranslations[language];
  
  doc.setFontSize(20);
  doc.text(title, 105, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.text(texts.summary, 105, 30, { align: 'center' });
  
  // Participant information
  let y = 45;
  doc.setFontSize(14);
  doc.text(texts.participantsAndCodes, 20, y);
  y += 10;
  
  // Draw header background
  doc.setFillColor(16, 122, 90);
  doc.rect(20, y, 170, 10, 'F');
  
  // Draw header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(texts.name, 25, y + 7);
  doc.text(texts.secretCode, 70, y + 7);
  doc.text(texts.finalMessage, 120, y + 7);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  y += 15;
  
  // Draw participant rows
  treasureHunt.participants.forEach((participant, index) => {
    const secretLines = doc.splitTextToSize(participant.secret, 80);
    const rowHeight = Math.max(10, secretLines.length * 7);
    
    // Draw alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(20, y - 5, 170, rowHeight + 5, 'F');
    }
    
    doc.text(participant.name, 25, y);
    doc.text(participant.code, 70, y);
    doc.text(secretLines, 120, y);
    
    y += rowHeight + 5;
    
    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });
  
  // Location information
  y += 10;
  doc.setFontSize(14);
  doc.text(texts.locationsAndClues, 20, y);
  y += 10;
  
  // Draw header background
  doc.setFillColor(16, 122, 90);
  doc.rect(20, y, 170, 10, 'F');
  
  // Draw header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('#', 25, y + 7);
  doc.text(texts.name, 40, y + 7);
  doc.text(texts.clue, 90, y + 7);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  y += 15;
  
  // Draw location rows
  treasureHunt.locations.forEach((location, index) => {
    const clueLines = doc.splitTextToSize(location.clue, 90);
    const rowHeight = Math.max(10, clueLines.length * 7);
    
    // Draw alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(20, y - 5, 170, rowHeight + 5, 'F');
    }
    
    doc.text(`${index + 1}`, 25, y);
    doc.text(location.name, 40, y);
    doc.text(clueLines, 90, y);
    
    y += rowHeight + 5;
    
    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });
  
  // Add a new page for circuit information
  doc.addPage();
  y = 20;
  doc.setFontSize(14);
  doc.text(texts.circuitsToFollow, 20, y);
  y += 15;
  
  treasureHunt.participants.forEach((participant) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
      doc.setFontSize(14);
      doc.text(texts.circuitsToFollowCont, 20, y);
      y += 15;
    }
    
    // Draw participant name with background
    doc.setFillColor(230, 230, 230);
    doc.rect(20, y - 5, 170, 10, 'F');
    doc.setFontSize(12);
    doc.text(`${participant.name}:`, 25, y);
    y += 10;
    
    // Create circuit text
    doc.setFontSize(11);
    let circuitInfo = '';
    participant.circuit.forEach((locationIndex, circuitIndex) => {
      const location = treasureHunt.locations[locationIndex];
      const riddle = treasureHunt.riddles[locationIndex];
      
      circuitInfo += `${circuitIndex + 1}. ${location.name} (${texts.riddle}: "${riddle.text.substring(0, 30)}${riddle.text.length > 30 ? '...' : ''}", ${texts.digit.replace(':', '')} ${riddle.digit})\n`;
    });
    
    const circuitLines = doc.splitTextToSize(circuitInfo, 165);
    doc.text(circuitLines, 25, y);
    y += circuitLines.length * 7 + 5;
    
    // Add code information
    doc.setFillColor(245, 245, 220);
    doc.rect(25, y - 5, 80, 10, 'F');
    doc.setFontSize(12);
    doc.text(`${texts.finalCode} ${participant.code}`, 30, y);
    y += 15;
  });
  
  // Add a new page for riddle information
  doc.addPage();
  y = 20;
  doc.setFontSize(14);
  doc.text(texts.riddlesAnswersDigits, 20, y);
  y += 15;
  
  treasureHunt.riddles.forEach((riddle, riddleIndex) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
      doc.setFontSize(14);
      doc.text(texts.riddlesCont, 20, y);
      y += 15;
    }
    
    // Draw riddle number with background
    doc.setFillColor(16, 122, 90);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, y - 5, 170, 10, 'F');
    doc.setFontSize(12);
    doc.text(`${texts.riddle} ${riddleIndex + 1}`, 25, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
    
    // Riddle text
    const riddleText = doc.splitTextToSize(riddle.text, 165);
    doc.setFontSize(11);
    doc.text(riddleText, 25, y);
    y += riddleText.length * 7 + 5;
    
    // Answer
    doc.setFontSize(11);
    doc.text(`${texts.answer} ${riddle.answer}`, 25, y);
    y += 7;
    
    // Instruction
    const instructionText = doc.splitTextToSize(`${texts.instruction} ${riddle.instruction}`, 165);
    doc.text(instructionText, 25, y);
    y += instructionText.length * 7 + 5;
    
    // Digit
    doc.setFillColor(230, 250, 230);
    doc.rect(25, y - 5, 40, 10, 'F');
    doc.text(`${texts.digit} ${riddle.digit}`, 30, y);
    y += 15;
  });
  
  // Sauvegarde du PDF récapitulatif
  doc.save(`${title.replace(/\s+/g, '_')}_${texts.summaryFile}.pdf`);
};

export default generateTreasureHuntPDFs;