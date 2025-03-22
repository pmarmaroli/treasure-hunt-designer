import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

/**
 * Fonction principale pour générer tous les PDFs nécessaires
 */
export const generateTreasureHuntPDFs = (treasureHunt: TreasureHunt) => {
  // Cette fonction génère les trois types de PDF
  generateStartInstructionsPDF(treasureHunt);
  generateRiddleSheetsPDF(treasureHunt);
  generateSummaryPDF(treasureHunt);
};

/**
 * Génère un PDF avec les instructions de départ pour chaque participant
 */
const generateStartInstructionsPDF = (treasureHunt: TreasureHunt) => {
  const doc = new jsPDF();
  const title = treasureHunt.title;
  
  doc.setFontSize(20);
  doc.text(title, 105, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.text('Instructions de départ', 105, 30, { align: 'center' });
  
  let y = 50;
  
  treasureHunt.participants.forEach((participant, index) => {
    if (index > 0 && y > 240) {
      doc.addPage();
      y = 20;
    }
    
    const firstLocationIndex = participant.circuit[0];
    const firstLocationClue = treasureHunt.locations[firstLocationIndex].clue;
    
    doc.setFontSize(14);
    doc.text(`Pour: ${participant.name}`, 20, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.text(`Bonjour ${participant.name} !`, 20, y);
    y += 10;
    
    const text = `Pour trouver ton code secret, tu dois te rendre à un certain endroit.

Voici l'indice pour trouver cet endroit: ${firstLocationClue}`;
    
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, y);
    y += splitText.length * 7 + 15;
    
    if (index < treasureHunt.participants.length - 1) {
      doc.line(20, y - 5, 190, y - 5);
    }
  });
  
  // Sauvegarde explicite du PDF d'instructions de départ
  doc.save(`${title.replace(/\s+/g, '_')}_instructions_depart.pdf`);
};

/**
 * Génère un PDF avec les feuilles d'énigmes pour la chasse au trésor
 */
const generateRiddleSheetsPDF = (treasureHunt: TreasureHunt) => {
  const doc = new jsPDF();
  const title = treasureHunt.title;
  
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
      doc.text(`Énigme pour: ${participant.name}`, 105, 30, { align: 'center' });
      doc.text(`(${circuitIndex + 1}/${participant.circuit.length})`, 105, 40, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Cher(e) ${participant.name},`, 20, 60);
      
      doc.text(`Voici ton énigme numéro ${circuitIndex + 1}:`, 20, 70);
      
      const riddleText = doc.splitTextToSize(riddle.text, 170);
      doc.text(riddleText, 20, 80);
      
      let y = 80 + riddleText.length * 7 + 10;
      
      doc.text(`Écris ta réponse au dos de cette feuille puis ${isLastLocation ? 'suis ces instructions:' : 'rends-toi à ton prochain lieu.'}`, 20, y);
      y += 10;
      
      if (isLastLocation) {
        // Final instructions to get the code
        doc.text('Pour trouver ton code secret, suis ces instructions:', 20, y);
        y += 10;
        
        participant.circuit.forEach((locIdx, idx) => {
          const instruction = treasureHunt.riddles[locIdx].instruction;
          const wrappedInstruction = doc.splitTextToSize(`${idx + 1}. ${instruction}`, 160);
          doc.text(wrappedInstruction, 25, y);
          y += wrappedInstruction.length * 7;
        });
      } else {
        // Clue for next location
        const nextLocationIndex = participant.circuit[circuitIndex + 1];
        const nextLocationClue = treasureHunt.locations[nextLocationIndex].clue;
        
        doc.text('Pour trouver ton prochain lieu, suis cet indice:', 20, y);
        y += 10;
        
        const clueText = doc.splitTextToSize(nextLocationClue, 160);
        doc.text(clueText, 25, y);
      }
      
      // Add footer with participant name, page number, and location
      const location = treasureHunt.locations[locationIndex];
      doc.setFontSize(10);
      doc.text(`${participant.name} - Page ${circuitIndex + 1}/${participant.circuit.length} - Lieu: ${location.name}`, 105, 280, { align: 'center' });
    });
  });
  
  // Sauvegarde explicite du PDF des énigmes
  doc.save(`${title.replace(/\s+/g, '_')}_enigmes.pdf`);
};

/**
 * Génère un PDF récapitulatif avec tous les détails de la chasse au trésor
 */
const generateSummaryPDF = (treasureHunt: TreasureHunt) => {
  const doc = new jsPDF();
  const title = treasureHunt.title;
  
  doc.setFontSize(20);
  doc.text(title, 105, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.text('Récapitulatif pour l\'organisateur', 105, 30, { align: 'center' });
  
  // Participant information
  let y = 45;
  doc.setFontSize(14);
  doc.text('Participants et leurs codes', 20, y);
  y += 10;
  
  // Draw header background
  doc.setFillColor(16, 122, 90);
  doc.rect(20, y, 170, 10, 'F');
  
  // Draw header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('Nom', 25, y + 7);
  doc.text('Code secret', 70, y + 7);
  doc.text('Message final', 120, y + 7);
  
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
  doc.text('Lieux et indices', 20, y);
  y += 10;
  
  // Draw header background
  doc.setFillColor(16, 122, 90);
  doc.rect(20, y, 170, 10, 'F');
  
  // Draw header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('#', 25, y + 7);
  doc.text('Lieu', 40, y + 7);
  doc.text('Indice', 90, y + 7);
  
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
  doc.text('Circuits à suivre par participant', 20, y);
  y += 15;
  
  treasureHunt.participants.forEach((participant) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
      doc.setFontSize(14);
      doc.text('Circuits à suivre (suite)', 20, y);
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
      
      circuitInfo += `${circuitIndex + 1}. ${location.name} (Énigme: "${riddle.text.substring(0, 30)}${riddle.text.length > 30 ? '...' : ''}", Chiffre: ${riddle.digit})\n`;
    });
    
    const circuitLines = doc.splitTextToSize(circuitInfo, 165);
    doc.text(circuitLines, 25, y);
    y += circuitLines.length * 7 + 5;
    
    // Add code information
    doc.setFillColor(245, 245, 220);
    doc.rect(25, y - 5, 80, 10, 'F');
    doc.setFontSize(12);
    doc.text(`Code final: ${participant.code}`, 30, y);
    y += 15;
  });
  
  // Add a new page for riddle information
  doc.addPage();
  y = 20;
  doc.setFontSize(14);
  doc.text('Énigmes, réponses et chiffres correspondants', 20, y);
  y += 15;
  
  treasureHunt.riddles.forEach((riddle, riddleIndex) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
      doc.setFontSize(14);
      doc.text('Énigmes (suite)', 20, y);
      y += 15;
    }
    
    // Draw riddle number with background
    doc.setFillColor(16, 122, 90);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, y - 5, 170, 10, 'F');
    doc.setFontSize(12);
    doc.text(`Énigme ${riddleIndex + 1}`, 25, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
    
    // Riddle text
    const riddleText = doc.splitTextToSize(riddle.text, 165);
    doc.setFontSize(11);
    doc.text(riddleText, 25, y);
    y += riddleText.length * 7 + 5;
    
    // Answer
    doc.setFontSize(11);
    doc.text(`Réponse: ${riddle.answer}`, 25, y);
    y += 7;
    
    // Instruction
    const instructionText = doc.splitTextToSize(`Instruction: ${riddle.instruction}`, 165);
    doc.text(instructionText, 25, y);
    y += instructionText.length * 7 + 5;
    
    // Digit
    doc.setFillColor(230, 250, 230);
    doc.rect(25, y - 5, 40, 10, 'F');
    doc.text(`Chiffre: ${riddle.digit}`, 30, y);
    y += 15;
  });
  
  // Sauvegarde explicite du PDF récapitulatif
  doc.save(`${title.replace(/\s+/g, '_')}_recapitulatif.pdf`);
};

export default generateTreasureHuntPDFs;