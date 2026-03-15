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
    writeAnswerThenOpenEnvelope: 'Écris ta réponse puis ouvre ton enveloppe pour les instructions',
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
    writeAnswerThenOpenEnvelope: 'Write your answer down, then open your envelope for instructions',
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
    writeAnswerThenOpenEnvelope: 'Escribe tu respuesta y abre tu sobre para las instrucciones',
    cutAlongDottedLine: 'Corte por la línea de puntos',
    placeAtLocation: 'Colocar en la ubicación:',
  }
};

/**
 * Fonction principale pour générer tous les PDFs nécessaires
 */
export const generateTreasureHuntPDFs = (treasureHunt: TreasureHunt, language: Language = 'fr') => {
  generateStartInstructionsPDF(treasureHunt, language);
  generateRiddlePostersPDF(treasureHunt, language);
  generateNavigationSlipsPDF(treasureHunt, language);
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
 * Génère un PDF avec les fiches de navigation (4 par page, groupées par lieu)
 */
const generateNavigationSlipsPDF = (treasureHunt: TreasureHunt, language: Language) => {
  const doc = new jsPDF();
  const title = treasureHunt.title;
  const texts = pdfTranslations[language];

  // Page dimensions for A4
  const pageW = 210;
  const pageH = 297;
  const margin = 10;
  const slipW = (pageW - 2 * margin) / 2;
  const slipH = (pageH - 2 * margin) / 2;
  const halfSlipH = (pageH - 2 * margin) / 2;

  let pageStarted = false;

  // Helper: draw a dotted rectangle
  const drawDottedRect = (x: number, y: number, w: number, h: number) => {
    doc.setDrawColor(180, 180, 180);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(x, y, w, h);
    doc.setLineDashPattern([], 0);
    doc.setDrawColor(0, 0, 0);
  };

  // Helper: render a normal slip (quarter page)
  const renderNormalSlip = (
    x: number, y: number,
    participant: Participant,
    locationIndex: number,
    circuitIndex: number,
    location: Location
  ) => {
    const padding = 4;
    const innerW = slipW - 2 * padding;
    const contentX = x + padding;
    let contentY = y + padding + 5;

    drawDottedRect(x, y, slipW, slipH);

    // Participant name (bold)
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(participant.name, contentX, contentY);
    contentY += 8;
    doc.setFont('helvetica', 'normal');

    // Instruction for this riddle's answer
    const riddle = treasureHunt.riddles[locationIndex];
    doc.setFontSize(10);
    const instructionText = doc.splitTextToSize(
      `${texts.withAnswer} ${circuitIndex + 1}: ${riddle.instruction}`,
      innerW
    );
    doc.text(instructionText, contentX, contentY);
    contentY += instructionText.length * 5 + 4;

    // Next location clue
    const nextLocationIndex = participant.circuit[circuitIndex + 1];
    const nextLocationClue = treasureHunt.locations[nextLocationIndex].clue;

    doc.setFontSize(10);
    doc.text(texts.toFindNextLocation, contentX, contentY);
    contentY += 6;

    doc.setFontSize(9);
    const clueText = doc.splitTextToSize(nextLocationClue, innerW);
    doc.text(clueText, contentX, contentY);

    // Footer: location placement
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`${texts.placeAtLocation} ${location.name}`, x + slipW / 2, y + slipH - 3, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  };

  // Helper: render a last-stop slip (half page)
  const renderLastStopSlip = (
    x: number, y: number,
    participant: Participant,
    locationIndex: number,
    circuitIndex: number,
    location: Location
  ) => {
    const fullW = pageW - 2 * margin;
    const padding = 5;
    const innerW = fullW - 2 * padding;
    const contentX = x + padding;
    let contentY = y + padding + 5;

    drawDottedRect(x, y, fullW, halfSlipH);

    // Participant name (bold)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(participant.name, contentX, contentY);
    contentY += 8;
    doc.setFont('helvetica', 'normal');

    // Current riddle instruction
    const riddle = treasureHunt.riddles[locationIndex];
    doc.setFontSize(10);
    const currentInstr = doc.splitTextToSize(
      `${texts.withAnswer} ${circuitIndex + 1}: ${riddle.instruction}`,
      innerW
    );
    doc.text(currentInstr, contentX, contentY);
    contentY += currentInstr.length * 5 + 6;

    // Final code assembly instructions
    doc.setFontSize(11);
    doc.text(texts.toFindSecretCode, contentX, contentY);
    contentY += 7;

    doc.setFontSize(10);
    participant.circuit.forEach((locIdx, idx) => {
      const instr = treasureHunt.riddles[locIdx].instruction;
      const line = doc.splitTextToSize(`${texts.withAnswer} ${idx + 1}: ${instr}`, innerW - 5);
      doc.text(line, contentX + 5, contentY);
      contentY += line.length * 5 + 2;
    });

    // Footer: location placement
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`${texts.placeAtLocation} ${location.name}`, x + fullW / 2, y + halfSlipH - 3, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  };

  // Iterate by location
  treasureHunt.locations.forEach((location, locationIndex) => {
    // Classify participants at this location as normal vs last-stop
    const normalSlips: { participant: Participant; circuitIndex: number }[] = [];
    const lastStopSlips: { participant: Participant; circuitIndex: number }[] = [];

    treasureHunt.participants.forEach(participant => {
      const circuitIndex = participant.circuit.indexOf(locationIndex);
      if (circuitIndex === -1) return;

      if (circuitIndex === participant.circuit.length - 1) {
        lastStopSlips.push({ participant, circuitIndex });
      } else {
        normalSlips.push({ participant, circuitIndex });
      }
    });

    // Render normal slips (4 per page: 2 cols x 2 rows)
    for (let i = 0; i < normalSlips.length; i++) {
      const posOnPage = i % 4;
      if (posOnPage === 0) {
        if (pageStarted) doc.addPage();
        pageStarted = true;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(texts.cutAlongDottedLine, 105, 7, { align: 'center' });
        doc.setTextColor(0, 0, 0);
      }

      const col = posOnPage % 2;
      const row = Math.floor(posOnPage / 2);
      const x = margin + col * slipW;
      const y = margin + row * slipH;

      const { participant, circuitIndex } = normalSlips[i];
      renderNormalSlip(x, y, participant, locationIndex, circuitIndex, location);
    }

    // Render last-stop slips (2 per page: full width, half height)
    for (let i = 0; i < lastStopSlips.length; i++) {
      const posOnPage = i % 2;
      if (posOnPage === 0) {
        if (pageStarted) doc.addPage();
        pageStarted = true;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(texts.cutAlongDottedLine, 105, 7, { align: 'center' });
        doc.setTextColor(0, 0, 0);
      }

      const x = margin;
      const y = margin + posOnPage * halfSlipH;

      const { participant, circuitIndex } = lastStopSlips[i];
      renderLastStopSlip(x, y, participant, locationIndex, circuitIndex, location);
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