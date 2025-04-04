export type TranslationKey =
  // Header and navigation
  | 'treasureHunt'
  | 'back'
  | 'home'
  | 'cancel'
  | 'next'
  | 'previous'
  
  // Main menu
  | 'createNew'
  | 'import'
  | 'importFile'
  | 'conceptPresentation'
  
  // Game interaction
  | 'enterCode'
  | 'validate'
  | 'incorrectCode'
  | 'congratulations'
  
  // Creation steps
  | 'step1Title'
  | 'step2Title'
  | 'step3Title'
  | 'step4Title'
  | 'step5Title'
  | 'huntTitle'
  | 'participantCount'
  | 'riddleCount'
  | 'participantName'
  | 'finalSecret'
  | 'locationName'
  | 'locationClue'
  | 'riddleText'
  | 'expectedAnswer'
  | 'digitInstruction'
  | 'expectedDigit'
  | 'addParticipant'
  | 'addAndContinue'
  | 'addLocation'
  | 'addRiddle'
  | 'addAndFinalize'
  
  // Preview tabs
  | 'participants'
  | 'locations'
  | 'riddles'
  | 'circuit'
  | 'code'
  | 'finalMessage'
  | 'clue'
  | 'question'
  | 'answer'
  | 'digit'
  | 'instruction'
  
  // Final step buttons
  | 'downloadJSON'
  | 'startInstructions'
  | 'riddleSheets'
  | 'generateAllPDFs'
  | 'testMode'
  | 'virtualTest'
  
  // Test mode
  | 'selectParticipant'
  | 'startHuntInstructions'
  | 'startHunt'
  | 'findLocation'
  | 'collectedDigits'
  | 'whatIsLocation'
  | 'checkLocation'
  | 'wrongLocation'
  | 'correctLocation'
  | 'hereIsRiddle'
  | 'whatIsAnswer'
  | 'wrongAnswer'
  | 'finalCodeEntry'
  | 'followInstructions'
  | 'enterSecretCode'
  | 'validateCode'
  | 'wrongCode'
  | 'secretRevealed'
  | 'restart'
  | 'edit'
  | 'finalize'
  | 'step'
  | 'yourAnswerHere'
  | 'validateAnswer' 
  | 'solvedAllRiddles'

  // Import
  | 'importTitle'
  | 'dragDropJSON'
  | 'browseFiles'
  | 'importSuccess'
  | 'wrongFileFormat'
  | 'expectedFormat'
  
  // File formats
  | 'invalidFileFormat'
  | 'jsonReadError'
  | 'requiredElements'
  | 'titleElement'
  | 'participantsElement'
  | 'locationsElement'
  | 'riddlesElement'
  | 'or'
  
  // PDF generation translations
  | 'hello'
  | 'findSecretCode'
  | 'clueToFindLocation';

type TranslationsType = {
  [key in 'fr' | 'en' | 'es']: {
    [key in TranslationKey]: string;
  };
};

export const translations: TranslationsType = {
  fr: {
    // Header and navigation
    treasureHunt: 'Concepteur de Chasse au Trésor',
    back: 'Retour',
    home: 'Accueil',
    cancel: 'Annuler',
    next: 'Suivant',
    previous: 'Précédent',
    
    // Main menu
    createNew: 'Créer Nouveau',
    import: 'Importer',
    importFile: 'Charger un fichier existant',
    conceptPresentation: `Bienvenue sur notre outil de création de chasses au trésor personnalisées !

    Avec cet outil, vous pouvez concevoir des aventures uniques pour plusieurs participants, chacun suivant un parcours distinct. Vous avez la liberté de définir les énigmes, les indices, les réponses et le message final à révéler.
    
    De notre côté, nous nous chargeons de générer tous les documents nécessaires pour l'impression ainsi que la page web où les participants entreront le code secret qu'ils devront découvrir.
    
    Notre système automatise la correspondance entre les participants, leurs parcours et leurs codes secrets, vous permettant ainsi de vous concentrer pleinement sur la création de contenu captivant.`,

    // Game interaction
    enterCode: 'Entre ton code secret à {length} chiffres :',
    validate: 'Valider',
    incorrectCode: 'Code incorrect',
    congratulations: 'Félicitations',
    
    // Creation steps
    step1Title: 'Étape 1: Informations générales',
    step2Title: 'Étape 2: Participants ({current}/{total})',
    step3Title: 'Étape 3: Lieux ({current}/{total})',
    step4Title: 'Étape 4: Énigmes ({current}/{total})',
    step5Title: 'Étape 5: Finalisation',
    huntTitle: 'Titre de la chasse au trésor:',
    participantCount: 'Nombre de participants:',
    riddleCount: 'Nombre d\'énigmes par participant:',
    participantName: 'Prénom du participant:',
    finalSecret: 'Secret final (il s\'agit du message qui sera révélé au participant à la fin de la quête si le code secret qu\'il détient est correct)',
    locationName: 'Nom du lieu:',
    locationClue: 'Indice pour trouver ce lieu:',
    riddleText: 'Texte de l\'énigme:',
    expectedAnswer: 'Réponse attendue:',
    digitInstruction: 'Instruction pour obtenir un chiffre:',
    expectedDigit: 'Chiffre attendu (0-9):',
    addParticipant: 'Ajouter participant',
    addAndContinue: 'Ajouter et continuer',
    addLocation: 'Ajouter lieu',
    addRiddle: 'Ajouter énigme',
    addAndFinalize: 'Ajouter et finaliser',
    
    // Preview tabs
    participants: 'Participants',
    locations: 'Lieux',
    riddles: 'Énigmes',
    circuit: 'Circuit:',
    code: 'Code:',
    finalMessage: 'Message final',
    clue: 'Indice:',
    question: 'Question:',
    answer: 'Réponse:',
    digit: 'Chiffre:',
    instruction: 'Instruction:',
    
    // Final step buttons
    downloadJSON: 'Télécharger JSON',
    startInstructions: 'Instructions de départ',
    riddleSheets: 'Feuilles d\'énigmes',
    generateAllPDFs: 'Générer tous les PDFs',
    testMode: 'Le Coffre',
    virtualTest: 'Test Virtuel',
    
    // Test mode
    selectParticipant: 'Sélectionne ton prénom pour commencer:',
    startHuntInstructions: 'Instructions de départ pour {name}',
    startHunt: 'Commencer la chasse au trésor',
    findLocation: 'Trouve le lieu',
    collectedDigits: 'Chiffres collectés:',
    whatIsLocation: 'Quel est ce lieu?',
    checkLocation: 'Vérifier le lieu',
    wrongLocation: 'Ce n\'est pas le bon lieu. Essaie encore!',
    correctLocation: 'Bravo! Tu as trouvé le bon lieu.',
    hereIsRiddle: 'Voici ton énigme:',
    whatIsAnswer: 'Quelle est ta réponse?',
    wrongAnswer: 'Ce n\'est pas la bonne réponse. Réfléchis bien!',
    finalCodeEntry: 'Saisie du code final',
    followInstructions: 'Pour obtenir le code secret, tu dois suivre les instructions ci-dessous pour chaque lieu visité:',
    enterSecretCode: 'Entre le code secret:',
    validateCode: 'Valider le code',
    wrongCode: 'Code incorrect. Vérifie les chiffres que tu as collectés!',
    secretRevealed: 'Bravo {name} ! Ton cadeau est caché {location}',
    restart: 'Recommencer',
    edit: 'Modifier',
    finalize: 'Finaliser',
    step: 'Étape',
    yourAnswerHere: 'Ta réponse ici',
    validateAnswer: 'Valider ma réponse',
    solvedAllRiddles: 'Tu as résolu toutes les énigmes!',

    // Import
    importTitle: 'Importer une chasse au trésor',
    dragDropJSON: 'Glissez et déposez votre fichier JSON ici',
    browseFiles: 'Parcourir les fichiers',
    importSuccess: 'Chasse au trésor importée avec succès!',
    wrongFileFormat: 'Le fichier doit être au format JSON',
    expectedFormat: 'Format attendu',
    
    // File formats
    invalidFileFormat: 'Format de fichier incorrect. Veuillez importer un fichier de chasse au trésor valide.',
    jsonReadError: 'Erreur lors de la lecture du fichier JSON:',
    requiredElements: 'Le fichier JSON doit contenir:',
    titleElement: 'Un titre (title)',
    participantsElement: 'Une liste de participants (participants)',
    locationsElement: 'Une liste de lieux (locations)',
    riddlesElement: 'Une liste d\'énigmes (riddles)',
    or: 'ou',
    
    // PDF generation translations
    hello: 'Bonjour',
    findSecretCode: 'Pour trouver ton code secret, tu dois te rendre à un certain endroit.',
    clueToFindLocation: 'Voici l\'indice pour trouver cet endroit:'
  },
  
  en: {
    // Header and navigation
    treasureHunt: 'Treasure Hunt Designer',
    back: 'Back',
    home: 'Home',
    cancel: 'Cancel',
    next: 'Next',
    previous: 'Previous',
    
    // Main menu
    createNew: 'Create New',
    import: 'Import',
    importFile: 'Load an existing file',
    conceptPresentation: `Welcome to our customized treasure hunt creation tool!

With this tool, you can design unique adventures for multiple participants, each following a distinct path. You have the freedom to define the riddles, clues, answers, and the final message to reveal.

On our side, we take care of generating all the necessary documents for printing as well as the web page where participants will enter the secret code they need to discover.

Our system automates the correspondence between participants, their paths, and their secret codes, allowing you to focus entirely on creating engaging content.`,

    // Game interaction
    enterCode: 'Enter your {length}-digit secret code:',
    validate: 'Validate',
    incorrectCode: 'Incorrect code',
    congratulations: 'Congratulations',
    
    // Creation steps
    step1Title: 'Step 1: General Information',
    step2Title: 'Step 2: Participants ({current}/{total})',
    step3Title: 'Step 3: Locations ({current}/{total})',
    step4Title: 'Step 4: Riddles ({current}/{total})',
    step5Title: 'Step 5: Finalization',
    huntTitle: 'Treasure hunt title:',
    participantCount: 'Number of participants:',
    riddleCount: 'Number of riddles per participant:',
    participantName: 'Participant name:',
    finalSecret: 'Final secret (this is the message that will be revealed to the participant at the end of the quest if the secret code they hold is correct)',
    locationName: 'Location name:',
    locationClue: 'Clue to find this location:',
    riddleText: 'Riddle text:',
    expectedAnswer: 'Expected answer:',
    digitInstruction: 'Instruction to get a digit:',
    expectedDigit: 'Expected digit (0-9):',
    addParticipant: 'Add participant',
    addAndContinue: 'Add and continue',
    addLocation: 'Add location',
    addRiddle: 'Add riddle',
    addAndFinalize: 'Add and finalize',
    
    // Preview tabs
    participants: 'Participants',
    locations: 'Locations',
    riddles: 'Riddles',
    circuit: 'Circuit:',
    code: 'Code:',
    finalMessage: 'Final message',
    clue: 'Clue:',
    question: 'Question:',
    answer: 'Answer:',
    digit: 'Digit:',
    instruction: 'Instruction:',
    
    // Final step buttons
    downloadJSON: 'Download JSON',
    startInstructions: 'Starting Instructions',
    riddleSheets: 'Riddle Sheets',
    generateAllPDFs: 'Generate All PDFs',
    testMode: 'The Chest',
    virtualTest: 'Virtual Test',
    
    // Test mode
    selectParticipant: 'Select your name to begin:',
    startHuntInstructions: 'Starting instructions for {name}',
    startHunt: 'Start the treasure hunt',
    findLocation: 'Find the location',
    collectedDigits: 'Collected digits:',
    whatIsLocation: 'What is this location?',
    checkLocation: 'Check location',
    wrongLocation: 'That\'s not the right location. Try again!',
    correctLocation: 'Well done! You found the right location.',
    hereIsRiddle: 'Here is your riddle:',
    whatIsAnswer: 'What is your answer?',
    wrongAnswer: 'That\'s not the right answer. Think again!',
    finalCodeEntry: 'Final code entry',
    followInstructions: 'To get the secret code, you must follow the instructions below for each location visited:',
    enterSecretCode: 'Enter the secret code:',
    validateCode: 'Validate code',
    wrongCode: 'Incorrect code. Check the digits you collected!',
    secretRevealed: 'Congratulations {name}! Your gift is hidden {location}',
    restart: 'Restart',
    edit: 'Edit',
    finalize: 'Finalize',
    step: 'Step',
    yourAnswerHere: 'Your answer here',
    validateAnswer: 'Validate my answer',
    solvedAllRiddles: 'You solved all the riddles!',

    // Import
    importTitle: 'Import a treasure hunt',
    dragDropJSON: 'Drag and drop your JSON file here',
    browseFiles: 'Browse files',
    importSuccess: 'Treasure hunt imported successfully!',
    wrongFileFormat: 'The file must be in JSON format',
    expectedFormat: 'Expected format',
    
    // File formats
    invalidFileFormat: 'Invalid file format. Please import a valid treasure hunt file.',
    jsonReadError: 'Error reading JSON file:',
    requiredElements: 'The JSON file must contain:',
    titleElement: 'A title (title)',
    participantsElement: 'A list of participants (participants)',
    locationsElement: 'A list of locations (locations)',
    riddlesElement: 'A list of riddles (riddles)',
    or: 'or',
    
    // PDF generation translations
    hello: 'Hello',
    findSecretCode: 'To find your secret code, you need to go to a specific location.',
    clueToFindLocation: 'Here is the clue to find this location:'
  },
  
  es: {
    // Header and navigation
    treasureHunt: 'Diseñador de Búsqueda del Tesoro',
    back: 'Volver',
    home: 'Inicio',
    cancel: 'Cancelar',
    next: 'Siguiente', 
    previous: 'Anterior',

    // Main menu
    createNew: 'Crear Nuevo',
    import: 'Importar',
    importFile: 'Cargar un archivo existente',
    conceptPresentation: `¡Bienvenido a nuestra herramienta de creación de búsquedas del tesoro personalizadas!

    Con esta herramienta, puedes diseñar aventuras únicas para varios participantes, cada uno siguiendo un recorrido distinto. Tienes la libertad de definir los acertijos, las pistas, las respuestas y el mensaje final a revelar.
    
    Por nuestra parte, nos encargamos de generar todos los documentos necesarios para imprimir, así como la página web donde los participantes introducirán el código secreto que deberán descubrir.
    
    Nuestro sistema automatiza la correspondencia entre los participantes, sus recorridos y sus códigos secretos, permitiéndote concentrarte plenamente en la creación de contenido cautivador.`,

    // Game interaction
    enterCode: 'Introduce tu código secreto de {length} dígitos:',
    validate: 'Validar',
    incorrectCode: 'Código incorrecto',
    congratulations: 'Felicidades',
    
    // Creation steps
    step1Title: 'Paso 1: Información General',
    step2Title: 'Paso 2: Participantes ({current}/{total})',
    step3Title: 'Paso 3: Ubicaciones ({current}/{total})',
    step4Title: 'Paso 4: Acertijos ({current}/{total})',
    step5Title: 'Paso 5: Finalización',
    huntTitle: 'Título de la búsqueda del tesoro:',
    participantCount: 'Número de participantes:',
    riddleCount: 'Número de acertijos por participante:',
    participantName: 'Nombre del participante:',
    finalSecret: 'Secreto final (este es el mensaje que se revelará al participante al final de la búsqueda si el código secreto que posee es correcto)',
    locationName: 'Nombre de la ubicación:',
    locationClue: 'Pista para encontrar esta ubicación:',
    riddleText: 'Texto del acertijo:',
    expectedAnswer: 'Respuesta esperada:',
    digitInstruction: 'Instrucción para obtener un dígito:',
    expectedDigit: 'Dígito esperado (0-9):',
    addParticipant: 'Añadir participante',
    addAndContinue: 'Añadir y continuar',
    addLocation: 'Añadir ubicación',
    addRiddle: 'Añadir acertijo',
    addAndFinalize: 'Añadir y finalizar',
    
    // Preview tabs
    participants: 'Participantes',
    locations: 'Ubicaciones',
    riddles: 'Acertijos',
    circuit: 'Circuito:',
    code: 'Código:',
    finalMessage: 'Mensaje final',
    clue: 'Pista:',
    question: 'Pregunta:',
    answer: 'Respuesta:',
    digit: 'Dígito:',
    instruction: 'Instrucción:',
    
    // Final step buttons
    downloadJSON: 'Descargar JSON',
    startInstructions: 'Instrucciones iniciales',
    riddleSheets: 'Hojas de acertijos',
    generateAllPDFs: 'Generar todos los PDFs',
    testMode: 'El Cofre',
    virtualTest: 'Prueba Virtual',
    
    // Test mode
    selectParticipant: 'Selecciona tu nombre para comenzar:',
    startHuntInstructions: 'Instrucciones iniciales para {name}',
    startHunt: 'Comenzar la búsqueda del tesoro',
    findLocation: 'Encuentra la ubicación',
    collectedDigits: 'Dígitos recolectados:',
    whatIsLocation: '¿Cuál es esta ubicación?',
    checkLocation: 'Verificar ubicación',
    wrongLocation: '¡Esa no es la ubicación correcta. ¡Inténtalo de nuevo!',
    correctLocation: '¡Bien hecho! Has encontrado la ubicación correcta.',
    hereIsRiddle: 'Aquí está tu acertijo:',
    whatIsAnswer: '¿Cuál es tu respuesta?',
    wrongAnswer: '¡Esa no es la respuesta correcta. ¡Piensa de nuevo!',
    finalCodeEntry: 'Entrada del código final',
    followInstructions: 'Para obtener el código secreto, debes seguir las instrucciones a continuación para cada ubicación visitada:',
    enterSecretCode: 'Introduce el código secreto:',
    validateCode: 'Validar código',
    wrongCode: '¡Código incorrecto. ¡Verifica los dígitos que recolectaste!',
    secretRevealed: '¡Felicidades {name}! Tu regalo está escondido {location}',
    restart: 'Reiniciar',
    edit: 'Editar',
    finalize: 'Finalizar',  
    step: 'Etapa',
    yourAnswerHere: 'Tu respuesta aquí',
    validateAnswer: 'Validar mi respuesta',
    solvedAllRiddles: '¡Has resuelto todos los acertijos!',
    
    // Import
    importTitle: 'Importar una búsqueda del tesoro',
    dragDropJSON: 'Arrastra y suelta tu archivo JSON aquí',
    browseFiles: 'Explorar archivos',
    importSuccess: '¡Búsqueda del tesoro importada con éxito!',
    wrongFileFormat: 'El archivo debe estar en formato JSON',
    expectedFormat: 'Formato esperado',
    
    // File formats
    invalidFileFormat: 'Formato de archivo incorrecto. Por favor, importe un archivo válido de búsqueda del tesoro.',
    jsonReadError: 'Error al leer el archivo JSON:',
    requiredElements: 'El archivo JSON debe contener:',
    titleElement: 'Un título (title)',
    participantsElement: 'Una lista de participantes (participants)',
    locationsElement: 'Una lista de ubicaciones (locations)',
    riddlesElement: 'Una lista de acertijos (riddles)',
    or: 'o',
    
    // PDF generation translations
    hello: 'Hola',
    findSecretCode: 'Para encontrar tu código secreto, debes ir a un lugar específico.',
    clueToFindLocation: 'Aquí está la pista para encontrar este lugar:'
  }
};