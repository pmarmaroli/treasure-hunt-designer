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
  useClue: boolean;
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
    toFindSecretCode: 'Pour trouver ton code secret, suis ces instructions:',
    withAnswer: 'Avec ta réponse',
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
    summaryFile: 'recapitulatif',
    postersFile: 'affiches_enigmes',
    navigationSlipsFile: 'fiches_navigation',
    writeAnswerThenOpenEnvelope: 'Écris ta réponse puis consulte ta fiche de navigation',
    cutAlongDottedLine: 'Découpez le long des pointillés',
    placeAtLocation: 'À déposer au lieu :',
  },
  en: {
    startInstructions: 'Starting instructions to give to participants',
    for: 'For:',
    hello: 'Hello',
    findSecretCode: 'Your adventure begins by going to a specific location.',
    clueToFindLocation: 'Clue to find this location:',
    toFindSecretCode: 'To find your secret code, follow these instructions:',
    withAnswer: 'With your answer',
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
    summaryFile: 'summary',
    postersFile: 'riddle_posters',
    navigationSlipsFile: 'navigation_slips',
    writeAnswerThenOpenEnvelope: 'Write your answer down, then check your navigation sheet',
    cutAlongDottedLine: 'Cut along dotted line',
    placeAtLocation: 'Place at location:',
  },
  es: {
    startInstructions: 'Instrucciones iniciales para dar a los participantes',
    for: 'Para:',
    hello: 'Hola',
    findSecretCode: 'Tu aventura comienza yendo a un lugar específico.',
    clueToFindLocation: 'Pista para encontrar este lugar:',
    toFindSecretCode: 'Para encontrar tu código secreto, sigue estas instrucciones:',
    withAnswer: 'Con tu respuesta',
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
    summaryFile: 'resumen',
    postersFile: 'carteles_acertijos',
    navigationSlipsFile: 'fichas_navegacion',
    writeAnswerThenOpenEnvelope: 'Escribe tu respuesta y consulta tu hoja de navegación',
    cutAlongDottedLine: 'Corte por la línea de puntos',
    placeAtLocation: 'Colocar en la ubicación:',
  }
};

/**
 * Fonction principale pour générer tous les PDFs nécessaires
 */
export const generateTreasureHuntPDFs = (treasureHunt: TreasureHunt, language: Language = 'fr') => {
  generateRiddlePostersPDF(treasureHunt, language);
  generateNavigationSheetsPDF(treasureHunt, language);
  generateSummaryPDF(treasureHunt, language);
};


/**
 * Génère un PDF avec une affiche par lieu (énigme partagée)
 */
const generateRiddlePostersPDF = (treasureHunt: TreasureHunt, language: Language) => {
  const doc = new jsPDF();
  const title = treasureHunt.title;
  const texts = pdfTranslations[language];

  // Find which locations are actually used in circuits
  const usedLocationIndices = new Set<number>();
  treasureHunt.participants.forEach(p => {
    p.circuit.forEach(idx => usedLocationIndices.add(idx));
  });

  let pageCount = 0;

  treasureHunt.locations.forEach((location, locationIndex) => {
    if (!usedLocationIndices.has(locationIndex)) return;

    if (pageCount > 0) {
      doc.addPage();
    }
    pageCount++;

    const riddle = treasureHunt.riddles[locationIndex];

    // Title
    doc.setFontSize(20);
    doc.text(title, 105, 25, { align: 'center' });

    // Location name with background
    doc.setFillColor(16, 122, 90);
    doc.rect(20, 35, 170, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`${texts.location} ${location.name}`, 105, 43, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Riddle text (large, readable)
    doc.setFontSize(16);
    const riddleText = doc.splitTextToSize(riddle.text, 160);
    doc.text(riddleText, 105, 70, { align: 'center' });

    // Instruction note
    const noteY = 70 + riddleText.length * 8 + 20;
    doc.setFontSize(12);
    doc.setFillColor(255, 248, 220);
    const noteText = doc.splitTextToSize(texts.writeAnswerThenOpenEnvelope, 150);
    doc.rect(25, noteY - 5, 160, noteText.length * 7 + 4, 'F');
    doc.text(noteText, 105, noteY + 2, { align: 'center' });

    // Footer: placement instruction for organizer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`${texts.placeAtLocation} ${location.name}`, 105, 285, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  });

  doc.save(`${title.replace(/\s+/g, '_')}_${texts.postersFile}.pdf`);
};

/**
 * Génère un PDF avec une fiche par participant (instructions de départ + navigation complète)
 */
const generateNavigationSheetsPDF = (treasureHunt: TreasureHunt, language: Language) => {
  const doc = new jsPDF();
  const title = treasureHunt.title;
  const texts = pdfTranslations[language];

  treasureHunt.participants.forEach((participant, participantIndex) => {
    if (participantIndex > 0) {
      doc.addPage();
    }

    // Track the starting page number for this participant (1-based)
    const participantStartPage = doc.getNumberOfPages();

    // Header: title + participant name
    doc.setFontSize(16);
    doc.text(title, 105, 15, { align: 'center' });

    doc.setFillColor(16, 122, 90);
    doc.rect(20, 22, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text(participant.name, 105, 29, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Start instructions: greeting + first location clue/name
    let y = 40;
    const firstLocationIndex = participant.circuit[0];
    const firstLocation = treasureHunt.locations[firstLocationIndex];

    doc.setFontSize(11);
    doc.text(`${texts.hello} ${participant.name}!`, 25, y);
    y += 7;

    doc.setFontSize(10);
    let startContent: string;
    if (firstLocation.useClue) {
      startContent = `${texts.findSecretCode}\n${texts.clueToFindLocation} ${firstLocation.clue}`;
    } else {
      startContent = `${texts.findSecretCode}\n${texts.location} ${firstLocation.name}`;
    }
    const startText = doc.splitTextToSize(startContent, 160);
    doc.text(startText, 25, y);
    y += startText.length * 5 + 5;

    doc.setDrawColor(16, 122, 90);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    y += 6;

    // Each stop in the participant's circuit
    participant.circuit.forEach((locationIndex, circuitIndex) => {
      const riddle = treasureHunt.riddles[locationIndex];
      const isLastStop = circuitIndex === participant.circuit.length - 1;

      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        doc.setFontSize(12);
        doc.text(`${participant.name} (${texts.page} ${circuitIndex + 1})`, 105, 15, { align: 'center' });
        y = 25;
      }

      // Stop number (no location name — participant must discover it from clues)
      doc.setFillColor(240, 240, 240);
      doc.rect(20, y - 4, 170, 8, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${texts.riddle} ${circuitIndex + 1}`, 25, y + 1);
      doc.setFont('helvetica', 'normal');
      y += 10;

      // Instruction for this riddle's answer
      doc.setFontSize(10);
      const instructionText = doc.splitTextToSize(
        `${texts.withAnswer} ${circuitIndex + 1}: ${riddle.instruction}`,
        160
      );
      doc.text(instructionText, 25, y);
      y += instructionText.length * 5 + 3;

      if (isLastStop) {
        // Always start the secret code instructions on a new page
        doc.addPage();
        doc.setFontSize(12);
        doc.text(`${participant.name}`, 105, 15, { align: 'center' });
        y = 30;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(texts.toFindSecretCode, 25, y);
        doc.setFont('helvetica', 'normal');
        y += 7;

        participant.circuit.forEach((locIdx, idx) => {
          const instr = treasureHunt.riddles[locIdx].instruction;
          const line = doc.splitTextToSize(`${texts.withAnswer} ${idx + 1}: ${instr}`, 155);

          // Check if this instruction block fits on the current page
          const neededHeight = line.length * 5 + 2;
          if (y + neededHeight > 275) {
            doc.addPage();
            doc.setFontSize(12);
            doc.text(`${participant.name} (${texts.toFindSecretCode})`, 105, 15, { align: 'center' });
            y = 25;
            doc.setFontSize(10);
          }

          doc.text(line, 30, y);
          y += neededHeight;
        });
      } else {
        // Next location clue or name — with page-break check
        const nextLocationIndex = participant.circuit[circuitIndex + 1];
        const nextLocation = treasureHunt.locations[nextLocationIndex];

        if (y > 265) {
          doc.addPage();
          doc.setFontSize(12);
          doc.text(`${participant.name} (${texts.page} ${circuitIndex + 2})`, 105, 15, { align: 'center' });
          y = 25;
        }

        doc.setFontSize(10);
        if (nextLocation.useClue) {
          doc.text(texts.toFindNextLocation, 25, y);
          y += 6;
          doc.setFontSize(9);
          const clueText = doc.splitTextToSize(nextLocation.clue, 155);
          doc.text(clueText, 30, y);
          y += clueText.length * 5 + 3;
        } else {
          doc.text(`${texts.toFindNextLocation} ${nextLocation.name}`, 25, y);
          y += 9;
        }
      }

      // Separator line between stops
      if (!isLastStop) {
        doc.setDrawColor(200, 200, 200);
        doc.line(30, y, 180, y);
        doc.setDrawColor(0, 0, 0);
        y += 6;
      }
    });

    // Organizer-only footer: location order (discreet, light gray, multi-line)
    const locationOrder = participant.circuit
      .map((locIdx, idx) => `${idx + 1}: ${treasureHunt.locations[locIdx].name}`)
      .join('  |  ');
    doc.setFontSize(6);
    doc.setTextColor(180, 180, 180);
    const footerLines = doc.splitTextToSize(locationOrder, 170);
    const footerStartY = 292 - (footerLines.length - 1) * 3;
    doc.text(footerLines, 105, footerStartY, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Ensure even page count per participant for recto-verso printing
    const participantPageCount = doc.getNumberOfPages() - participantStartPage + 1;
    if (participantPageCount % 2 !== 0) {
      doc.addPage(); // blank page to make it even
    }
  });

  doc.save(`${title.replace(/\s+/g, '_')}_${texts.navigationSlipsFile}.pdf`);
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