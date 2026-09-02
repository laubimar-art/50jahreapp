import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

// ==================================================
// SUPABASE
// ==================================================

const SUPABASE_URL =
  "https://qacbbmixkqjryipksbrh.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_sIG13bMei4VT4qZRQavkVg_REQiokMT";

// ==================================================
// TEST / LIVE MODE
// ==================================================

const TEST_MODE = true;
const TEST_QR_VALUE = "GISADA";

const TOTAL_BOOTHS = 20;
const TEST_UNLOCK_AT = 2;
const GOODIE_UNLOCK_AT = 18;

// ==================================================
// DESIGN
// ==================================================

const RED = "#CF2D36";
const BLACK = "#111111";
const LIGHT = "#F5F5F5";
const BORDER = "#E7E7E7";

const GREEN = "#209447";
const GREEN_BG = "rgba(32, 148, 71, 0.16)";

const UNVISITED_BG = "rgba(90, 90, 90, 0.05)";
const UNVISITED_BORDER = "rgba(90, 90, 90, 0.28)";

// ==================================================
// STORAGE
// ==================================================

const STORAGE_SCOPE = TEST_MODE
  ? "impoJubiTestV4"
  : "impoJubiLiveV2";

const USER_STORAGE_KEY = `${STORAGE_SCOPE}:user`;
const VISITED_STORAGE_KEY = `${STORAGE_SCOPE}:visited`;
const GOODIE_STORAGE_KEY = `${STORAGE_SCOPE}:goodie`;
const SESSIONS_STORAGE_KEY = `${STORAGE_SCOPE}:sessions`;
const LANGUAGE_STORAGE_KEY = `${STORAGE_SCOPE}:language`;
const VISIT_PROOFS_STORAGE_KEY = `${STORAGE_SCOPE}:visitProofs`;
const DEVICE_ID_STORAGE_KEY = `${STORAGE_SCOPE}:deviceId`;
const REGISTRATION_ID_STORAGE_KEY = `${STORAGE_SCOPE}:registrationId`;

const LEGACY_USER_STORAGE_KEY = "impoJubiUserV2";
const LEGACY_VISITED_STORAGE_KEY = "impoJubiVisitedV2";
const LEGACY_GOODIE_STORAGE_KEY = "impoJubiGoodieV1";
const LEGACY_SESSIONS_STORAGE_KEY = "impoJubiSessionsV1";
const LEGACY_LANGUAGE_STORAGE_KEY = "impoJubiLanguageV1";

const SUPPORTED_LANGUAGES = ["de", "fr", "it", "en"];

// ==================================================
// TRANSLATIONS
// ==================================================

const translations = {
  en: {
    chooseLanguage: "Language",
    welcome: "Welcome!",
    intro:
      "Discover our anniversary event and collect the brands you visit in your personal digital brand pass.",
    firstName: "First name",
    lastName: "Last name",
    start: "START",
    starting: "STARTING...",
    nameRequired: "Please enter your first and last name.",
    registrationError:
      "We could not connect to the event database. Please check your internet connection and try again.",
    registrationClosed: "Registration is currently closed.",
    registrationLimit:
      "The maximum number of participants has been reached.",
    anniversaryLabel: "50 YEARS IMPORT PARFUMERIE",
    hello: (name) => `Hi ${name}!`,
    welcomeEvent: "Welcome to our anniversary event.",
    boothsVisited: "Booths visited",
    brandPass: "Your brand pass",
    tapBooth: "Tap on a booth to scan its QR code.",
    visited: "Visited",
    notVisited: "Not visited",
    mapNotFound: "Map image not found.",
    mapUploadBefore: "Upload the original image to the",
    mapUploadAfter: "folder as:",
    alreadyVisited: (name) => `✓ ${name} already visited.`,
    boothCollected: (name) => `✓ ${name} successfully collected.`,
    boothSavedOffline: (name) =>
      `✓ ${name} saved on this device. It will be synchronized automatically when the connection is available.`,
    wrongBoothQr: (name) =>
      `This QR code does not belong to ${name}. Please scan the QR code at this booth.`,
    scanQr: "Scan QR code",
    startingCamera: "Starting camera...",
    scannerCouldNotLoad: "Scanner could not be loaded.",
    cameraReady: "Camera ready – point it at the QR code.",
    savingVisit: "Saving visit...",
    testScanBooth: "TEST MODE – scan the GISADA QR code.",
    testScanGoodie:
      "TEST MODE – scan the GISADA QR code to approve the Goodie Bag.",
    wrongTestQr: (value) => `Wrong test QR. Detected: ${value}`,
    wrongGoodieQr: "Wrong Goodie Bag QR code.",
    cameraCouldNotStart: "Camera could not be started.",
    cameraPermission:
      "Please allow camera access and try again.",
    close: "CLOSE",
    sessionProblem:
      "Your session could not be found in the database. Please restore it with your recovery code.",
    goodieBag: "Goodie Bag",
    goodieCollected: "✓ Goodie Bag collected",
    goodieReady: "You're ready!",
    testGoodieReady:
      "Test completed. Goodie Bag collection is now available.",
    goodieLiveReady: (visited, total) =>
      `${visited} / ${total} booths visited`,
    testGoodieInstruction:
      "TEST MODE – scan 2 different booths to unlock the Goodie Bag.",
    liveGoodieInstruction: (required, total) =>
      `Visit at least ${required} of ${total} booths to unlock your Goodie Bag.`,
    remainingOne: "1 more booth to go",
    remainingMany: (count) => `${count} more booths to go`,
    collectGoodie: "COLLECT GOODIE BAG",
    checkingGoodie: "Checking eligibility...",
    goodieConnection:
      "A connection to the event database is required before the Goodie Bag can be approved. Please try again.",
    goodieAlreadyCollected:
      "This Goodie Bag has already been collected.",
    goodieAlreadyProcessing:
      "This Goodie Bag is already being processed on another device.",
    goodieNotEligible: (required) =>
      `The required ${required} booth visits have not yet been confirmed.`,
    goodieApprovalExpired:
      "The Goodie Bag approval is no longer valid. Please scan the Goodie Bag QR code again.",
    goodieApprovedEyebrow: "GOODIE BAG",
    approved: "APPROVED",
    testApproval: "Test approval successful",
    boothsVisitedApproval: (visited, total) =>
      `${visited} / ${total} booths visited`,
    mayHandOver: "You may hand over the Goodie Bag.",
    goodieReceived: "GOODIE BAG RECEIVED",
    confirmingGoodie: "CONFIRMING...",
    goodieConfirmError:
      "The handover could not be saved in the database. Please keep this screen open, check the connection and try again.",
    recoveryLost: "Lost your session?",
    recoveryTitle: "Restore your session",
    recoveryText: "Enter your personal recovery code.",
    recoveryButton: "RESTORE SESSION",
    restoring: "RESTORING...",
    recoveryRequired: "Please enter your recovery code.",
    recoveryNotFound:
      "No session was found for this recovery code.",
    recoveryConnectionError:
      "The database could not be reached. Please check your internet connection and try again.",
    recoveryCodeLabel: "Your recovery code",
    recoveryCodeText:
      "Keep this code in case you need to restore your session.",
    thankYou:
      "Thank you for celebrating our 50th anniversary with us today. Have a safe trip home!",
    done: "DONE",
    mapAlt: "Brand fair map",
    logoAlt: "Import Parfumerie",
    anniversaryAlt: "50 Years Import Parfumerie",
    panoramaAlt:
      "Import Parfumerie anniversary team illustration",
  },

  de: {
    chooseLanguage: "Sprache",
    welcome: "Willkommen!",
    intro:
      "Entdecke unser Jubiläumsevent und sammle die besuchten Marken in deinem persönlichen digitalen Brand Pass.",
    firstName: "Vorname",
    lastName: "Nachname",
    start: "START",
    starting: "WIRD GESTARTET...",
    nameRequired: "Bitte Vorname und Nachname eingeben.",
    registrationError:
      "Die Verbindung zur Event-Datenbank konnte nicht hergestellt werden. Bitte prüfe deine Internetverbindung und versuche es erneut.",
    registrationClosed:
      "Die Registrierung ist momentan geschlossen.",
    registrationLimit:
      "Die maximale Anzahl Teilnehmender wurde erreicht.",
    anniversaryLabel: "50 JAHRE IMPORT PARFUMERIE",
    hello: (name) => `Hallo ${name}!`,
    welcomeEvent:
      "Willkommen an unserem Jubiläumsevent.",
    boothsVisited: "Besuchte Stände",
    brandPass: "Dein Brand Pass",
    tapBooth:
      "Tippe auf einen Stand, um den QR-Code zu scannen.",
    visited: "Besucht",
    notVisited: "Nicht besucht",
    mapNotFound:
      "Der Übersichtsplan wurde nicht gefunden.",
    mapUploadBefore:
      "Lade das Originalbild in den",
    mapUploadAfter:
      "Ordner hoch als:",
    alreadyVisited: (name) =>
      `✓ ${name} bereits besucht.`,
    boothCollected: (name) =>
      `✓ ${name} erfolgreich erfasst.`,
    boothSavedOffline: (name) =>
      `✓ ${name} wurde auf diesem Gerät gespeichert. Der Besuch wird automatisch synchronisiert, sobald die Verbindung verfügbar ist.`,
    wrongBoothQr: (name) =>
      `Dieser QR-Code gehört nicht zu ${name}. Bitte scanne den QR-Code an diesem Stand.`,
    scanQr: "QR-Code scannen",
    startingCamera:
      "Kamera wird gestartet...",
    scannerCouldNotLoad:
      "Der Scanner konnte nicht geladen werden.",
    cameraReady:
      "Kamera bereit – richte sie auf den QR-Code.",
    savingVisit:
      "Besuch wird gespeichert...",
    testScanBooth:
      "TESTMODUS – scanne den GISADA QR-Code.",
    testScanGoodie:
      "TESTMODUS – scanne den GISADA QR-Code für die Goodie-Bag-Freigabe.",
    wrongTestQr: (value) =>
      `Falscher Test-QR. Erkannt: ${value}`,
    wrongGoodieQr:
      "Falscher Goodie-Bag-QR-Code.",
    cameraCouldNotStart:
      "Die Kamera konnte nicht gestartet werden.",
    cameraPermission:
      "Bitte erlaube den Kamerazugriff und versuche es erneut.",
    close: "SCHLIESSEN",
    sessionProblem:
      "Deine Session wurde in der Datenbank nicht gefunden. Bitte stelle sie mit deinem Recovery-Code wieder her.",
    goodieBag: "Goodie Bag",
    goodieCollected:
      "✓ Goodie Bag abgeholt",
    goodieReady: "Du bist bereit!",
    testGoodieReady:
      "Test abgeschlossen. Das Goodie Bag kann jetzt abgeholt werden.",
    goodieLiveReady: (visited, total) =>
      `${visited} / ${total} Stände besucht`,
    testGoodieInstruction:
      "TESTMODUS – scanne 2 verschiedene Stände, um das Goodie Bag freizuschalten.",
    liveGoodieInstruction: (required, total) =>
      `Besuche mindestens ${required} von ${total} Ständen, um dein Goodie Bag freizuschalten.`,
    remainingOne: "Noch 1 Stand",
    remainingMany: (count) =>
      `Noch ${count} Stände`,
    collectGoodie:
      "GOODIE BAG ABHOLEN",
    checkingGoodie:
      "Berechtigung wird geprüft...",
    goodieConnection:
      "Für die Freigabe des Goodie Bags wird eine Verbindung zur Event-Datenbank benötigt. Bitte versuche es erneut.",
    goodieAlreadyCollected:
      "Dieses Goodie Bag wurde bereits abgeholt.",
    goodieAlreadyProcessing:
      "Dieses Goodie Bag wird bereits auf einem anderen Gerät bearbeitet.",
    goodieNotEligible: (required) =>
      `Die erforderlichen ${required} Standbesuche sind noch nicht bestätigt.`,
    goodieApprovalExpired:
      "Die Goodie-Bag-Freigabe ist nicht mehr gültig. Bitte scanne den Goodie-Bag-QR-Code erneut.",
    goodieApprovedEyebrow: "GOODIE BAG",
    approved: "FREIGEGEBEN",
    testApproval:
      "Testfreigabe erfolgreich",
    boothsVisitedApproval: (visited, total) =>
      `${visited} / ${total} Stände besucht`,
    mayHandOver:
      "Das Goodie Bag darf übergeben werden.",
    goodieReceived:
      "GOODIE BAG ÜBERGEBEN",
    confirmingGoodie:
      "WIRD BESTÄTIGT...",
    goodieConfirmError:
      "Die Übergabe konnte nicht in der Datenbank gespeichert werden. Bitte diesen Screen geöffnet lassen, Verbindung prüfen und erneut versuchen.",
    recoveryLost: "Session verloren?",
    recoveryTitle:
      "Session wiederherstellen",
    recoveryText:
      "Gib deinen persönlichen Recovery-Code ein.",
    recoveryButton:
      "SESSION WIEDERHERSTELLEN",
    restoring:
      "WIRD WIEDERHERGESTELLT...",
    recoveryRequired:
      "Bitte gib deinen Recovery-Code ein.",
    recoveryNotFound:
      "Für diesen Recovery-Code wurde keine Session gefunden.",
    recoveryConnectionError:
      "Die Datenbank ist momentan nicht erreichbar. Bitte prüfe deine Internetverbindung und versuche es erneut.",
    recoveryCodeLabel:
      "Dein Recovery-Code",
    recoveryCodeText:
      "Bewahre diesen Code auf, falls du deine Session wiederherstellen musst.",
    thankYou:
      "Vielen Dank, dass du heute mit uns unser 50-jähriges Jubiläum gefeiert hast. Komm gut nach Hause!",
    done: "FERTIG",
    mapAlt:
      "Übersichtsplan der Brandmesse",
    logoAlt: "Import Parfumerie",
    anniversaryAlt:
      "50 Jahre Import Parfumerie",
    panoramaAlt:
      "Illustration des Import-Parfumerie-Teams",
  },

  fr: {
    chooseLanguage: "Langue",
    welcome: "Bienvenue !",
    intro:
      "Découvrez notre événement anniversaire et collectionnez les marques visitées dans votre Brand Pass numérique personnel.",
    firstName: "Prénom",
    lastName: "Nom",
    start: "COMMENCER",
    starting: "DÉMARRAGE...",
    nameRequired:
      "Veuillez saisir votre prénom et votre nom.",
    registrationError:
      "Impossible de se connecter à la base de données de l'événement. Vérifiez votre connexion Internet et réessayez.",
    registrationClosed:
      "Les inscriptions sont actuellement fermées.",
    registrationLimit:
      "Le nombre maximum de participants a été atteint.",
    anniversaryLabel:
      "50 ANS IMPORT PARFUMERIE",
    hello: (name) => `Bonjour ${name} !`,
    welcomeEvent:
      "Bienvenue à notre événement anniversaire.",
    boothsVisited:
      "Stands visités",
    brandPass:
      "Votre Brand Pass",
    tapBooth:
      "Touchez un stand pour scanner son code QR.",
    visited: "Visité",
    notVisited: "Non visité",
    mapNotFound:
      "Le plan n'a pas été trouvé.",
    mapUploadBefore:
      "Téléchargez l'image originale dans le dossier",
    mapUploadAfter:
      "sous le nom :",
    alreadyVisited: (name) =>
      `✓ ${name} déjà visité.`,
    boothCollected: (name) =>
      `✓ ${name} enregistré avec succès.`,
    boothSavedOffline: (name) =>
      `✓ ${name} a été enregistré sur cet appareil. La visite sera synchronisée automatiquement dès que la connexion sera disponible.`,
    wrongBoothQr: (name) =>
      `Ce code QR n'appartient pas à ${name}. Veuillez scanner le code QR de ce stand.`,
    scanQr:
      "Scanner le code QR",
    startingCamera:
      "Démarrage de la caméra...",
    scannerCouldNotLoad:
      "Le scanner n'a pas pu être chargé.",
    cameraReady:
      "Caméra prête – dirigez-la vers le code QR.",
    savingVisit:
      "Enregistrement de la visite...",
    testScanBooth:
      "MODE TEST – scannez le code QR GISADA.",
    testScanGoodie:
      "MODE TEST – scannez le code QR GISADA pour valider le Goodie Bag.",
    wrongTestQr: (value) =>
      `Mauvais QR de test. Détecté : ${value}`,
    wrongGoodieQr:
      "Mauvais code QR du Goodie Bag.",
    cameraCouldNotStart:
      "La caméra n'a pas pu démarrer.",
    cameraPermission:
      "Veuillez autoriser l'accès à la caméra et réessayer.",
    close: "FERMER",
    sessionProblem:
      "Votre session n'a pas été trouvée dans la base de données. Veuillez la restaurer avec votre code de récupération.",
    goodieBag:
      "Goodie Bag",
    goodieCollected:
      "✓ Goodie Bag récupéré",
    goodieReady:
      "C'est bon !",
    testGoodieReady:
      "Test terminé. Le Goodie Bag peut maintenant être récupéré.",
    goodieLiveReady: (visited, total) =>
      `${visited} / ${total} stands visités`,
    testGoodieInstruction:
      "MODE TEST – scannez 2 stands différents pour débloquer le Goodie Bag.",
    liveGoodieInstruction: (required, total) =>
      `Visitez au moins ${required} des ${total} stands pour débloquer votre Goodie Bag.`,
    remainingOne:
      "Encore 1 stand",
    remainingMany: (count) =>
      `Encore ${count} stands`,
    collectGoodie:
      "RÉCUPÉRER LE GOODIE BAG",
    checkingGoodie:
      "Vérification en cours...",
    goodieConnection:
      "Une connexion à la base de données de l'événement est nécessaire pour valider le Goodie Bag. Veuillez réessayer.",
    goodieAlreadyCollected:
      "Ce Goodie Bag a déjà été récupéré.",
    goodieAlreadyProcessing:
      "Ce Goodie Bag est déjà en cours de traitement sur un autre appareil.",
    goodieNotEligible: (required) =>
      `Les ${required} visites requises ne sont pas encore confirmées.`,
    goodieApprovalExpired:
      "La validation du Goodie Bag n'est plus valable. Veuillez scanner à nouveau le code QR du Goodie Bag.",
    goodieApprovedEyebrow:
      "GOODIE BAG",
    approved:
      "VALIDÉ",
    testApproval:
      "Validation test réussie",
    boothsVisitedApproval: (visited, total) =>
      `${visited} / ${total} stands visités`,
    mayHandOver:
      "Le Goodie Bag peut être remis.",
    goodieReceived:
      "GOODIE BAG REMIS",
    confirmingGoodie:
      "CONFIRMATION...",
    goodieConfirmError:
      "La remise n'a pas pu être enregistrée dans la base de données. Gardez cet écran ouvert, vérifiez la connexion et réessayez.",
    recoveryLost:
      "Session perdue ?",
    recoveryTitle:
      "Restaurer votre session",
    recoveryText:
      "Saisissez votre code de récupération personnel.",
    recoveryButton:
      "RESTAURER LA SESSION",
    restoring:
      "RESTAURATION...",
    recoveryRequired:
      "Veuillez saisir votre code de récupération.",
    recoveryNotFound:
      "Aucune session n'a été trouvée pour ce code de récupération.",
    recoveryConnectionError:
      "La base de données est actuellement inaccessible. Vérifiez votre connexion Internet et réessayez.",
    recoveryCodeLabel:
      "Votre code de récupération",
    recoveryCodeText:
      "Conservez ce code au cas où vous devriez restaurer votre session.",
    thankYou:
      "Merci d'avoir célébré avec nous aujourd'hui notre 50e anniversaire. Nous vous souhaitons un bon retour !",
    done: "TERMINER",
    mapAlt:
      "Plan de l'événement",
    logoAlt:
      "Import Parfumerie",
    anniversaryAlt:
      "50 ans Import Parfumerie",
    panoramaAlt:
      "Illustration de l'équipe Import Parfumerie",
  },

  it: {
    chooseLanguage: "Lingua",
    welcome: "Benvenuto!",
    intro:
      "Scopri il nostro evento anniversario e raccogli i brand visitati nel tuo Brand Pass digitale personale.",
    firstName: "Nome",
    lastName: "Cognome",
    start: "INIZIA",
    starting: "AVVIO...",
    nameRequired:
      "Inserisci nome e cognome.",
    registrationError:
      "Impossibile connettersi al database dell'evento. Controlla la connessione Internet e riprova.",
    registrationClosed:
      "Le registrazioni sono attualmente chiuse.",
    registrationLimit:
      "È stato raggiunto il numero massimo di partecipanti.",
    anniversaryLabel:
      "50 ANNI IMPORT PARFUMERIE",
    hello: (name) => `Ciao ${name}!`,
    welcomeEvent:
      "Benvenuto al nostro evento anniversario.",
    boothsVisited:
      "Stand visitati",
    brandPass:
      "Il tuo Brand Pass",
    tapBooth:
      "Tocca uno stand per scansionare il suo codice QR.",
    visited:
      "Visitato",
    notVisited:
      "Non visitato",
    mapNotFound:
      "La mappa non è stata trovata.",
    mapUploadBefore:
      "Carica l'immagine originale nella cartella",
    mapUploadAfter:
      "con il nome:",
    alreadyVisited: (name) =>
      `✓ ${name} già visitato.`,
    boothCollected: (name) =>
      `✓ ${name} registrato con successo.`,
    boothSavedOffline: (name) =>
      `✓ ${name} è stato salvato su questo dispositivo. La visita verrà sincronizzata automaticamente quando la connessione sarà disponibile.`,
    wrongBoothQr: (name) =>
      `Questo codice QR non appartiene a ${name}. Scansiona il codice QR di questo stand.`,
    scanQr:
      "Scansiona il codice QR",
    startingCamera:
      "Avvio della fotocamera...",
    scannerCouldNotLoad:
      "Impossibile caricare lo scanner.",
    cameraReady:
      "Fotocamera pronta – inquadra il codice QR.",
    savingVisit:
      "Salvataggio della visita...",
    testScanBooth:
      "MODALITÀ TEST – scansiona il codice QR GISADA.",
    testScanGoodie:
      "MODALITÀ TEST – scansiona il codice QR GISADA per approvare il Goodie Bag.",
    wrongTestQr: (value) =>
      `QR di test errato. Rilevato: ${value}`,
    wrongGoodieQr:
      "Codice QR del Goodie Bag errato.",
    cameraCouldNotStart:
      "Impossibile avviare la fotocamera.",
    cameraPermission:
      "Consenti l'accesso alla fotocamera e riprova.",
    close: "CHIUDI",
    sessionProblem:
      "La tua sessione non è stata trovata nel database. Ripristinala con il tuo codice di recupero.",
    goodieBag:
      "Goodie Bag",
    goodieCollected:
      "✓ Goodie Bag ritirato",
    goodieReady:
      "Ci siamo!",
    testGoodieReady:
      "Test completato. Ora puoi ritirare il Goodie Bag.",
    goodieLiveReady: (visited, total) =>
      `${visited} / ${total} stand visitati`,
    testGoodieInstruction:
      "MODALITÀ TEST – scansiona 2 stand diversi per sbloccare il Goodie Bag.",
    liveGoodieInstruction: (required, total) =>
      `Visita almeno ${required} dei ${total} stand per sbloccare il tuo Goodie Bag.`,
    remainingOne:
      "Manca ancora 1 stand",
    remainingMany: (count) =>
      `Mancano ancora ${count} stand`,
    collectGoodie:
      "RITIRA IL GOODIE BAG",
    checkingGoodie:
      "Verifica in corso...",
    goodieConnection:
      "È necessaria una connessione al database dell'evento per approvare il Goodie Bag. Riprova.",
    goodieAlreadyCollected:
      "Questo Goodie Bag è già stato ritirato.",
    goodieAlreadyProcessing:
      "Questo Goodie Bag è già in fase di elaborazione su un altro dispositivo.",
    goodieNotEligible: (required) =>
      `Le ${required} visite richieste non sono ancora confermate.`,
    goodieApprovalExpired:
      "L'approvazione del Goodie Bag non è più valida. Scansiona nuovamente il codice QR del Goodie Bag.",
    goodieApprovedEyebrow:
      "GOODIE BAG",
    approved:
      "APPROVATO",
    testApproval:
      "Approvazione test riuscita",
    boothsVisitedApproval: (visited, total) =>
      `${visited} / ${total} stand visitati`,
    mayHandOver:
      "Il Goodie Bag può essere consegnato.",
    goodieReceived:
      "GOODIE BAG CONSEGNATO",
    confirmingGoodie:
      "CONFERMA...",
    goodieConfirmError:
      "La consegna non può essere salvata nel database. Mantieni aperta questa schermata, controlla la connessione e riprova.",
    recoveryLost:
      "Hai perso la sessione?",
    recoveryTitle:
      "Ripristina la sessione",
    recoveryText:
      "Inserisci il tuo codice di recupero personale.",
    recoveryButton:
      "RIPRISTINA SESSIONE",
    restoring:
      "RIPRISTINO...",
    recoveryRequired:
      "Inserisci il tuo codice di recupero.",
    recoveryNotFound:
      "Nessuna sessione trovata per questo codice di recupero.",
    recoveryConnectionError:
      "Il database non è attualmente raggiungibile. Controlla la connessione Internet e riprova.",
    recoveryCodeLabel:
      "Il tuo codice di recupero",
    recoveryCodeText:
      "Conserva questo codice nel caso in cui sia necessario ripristinare la sessione.",
    thankYou:
      "Grazie per aver festeggiato oggi con noi il nostro 50° anniversario. Buon rientro a casa!",
    done: "FINE",
    mapAlt:
      "Mappa dell'evento",
    logoAlt:
      "Import Parfumerie",
    anniversaryAlt:
      "50 anni Import Parfumerie",
    panoramaAlt:
      "Illustrazione del team Import Parfumerie",
  },
};

// ==================================================
// BOOTHS
// ==================================================

const booths = [
  {
    id: 1,
    name: "Gisada",
    area: {
      left: 15.9,
      top: 4.8,
      width: 25.1,
      height: 7.0,
    },
  },
  {
    id: 2,
    name: "P&I Parfums",
    area: {
      left: 49.4,
      top: 4.8,
      width: 14.4,
      height: 7.0,
    },
  },
  {
    id: 3,
    name: "Karikaturist",
    area: {
      left: 66.8,
      top: 4.8,
      width: 11.3,
      height: 7.0,
    },
  },
  {
    id: 4,
    name: "Jean-Pierre Rossellet",
    area: {
      left: 44.1,
      top: 16.1,
      width: 4.8,
      height: 7.0,
    },
  },
  {
    id: 5,
    name: "Nobilis Group",
    area: {
      left: 49.5,
      top: 16.1,
      width: 14.3,
      height: 7.0,
    },
  },
  {
    id: 6,
    name: "Flariel",
    area: {
      left: 44.1,
      top: 23.7,
      width: 4.8,
      height: 8.5,
    },
  },
  {
    id: 7,
    name: "Bode Studios",
    area: {
      left: 49.7,
      top: 23.7,
      width: 14.1,
      height: 8.5,
    },
  },
  {
    id: 8,
    name: "L'Oréal Luxe",
    shape: "circle",
    area: {
      left: 41.6,
      top: 38.1,
      width: 25.4,
      height: 23.6,
    },
  },
  {
    id: 9,
    name: "Clarins",
    area: {
      left: 48.8,
      top: 68.6,
      width: 14.3,
      height: 7.0,
    },
  },
  {
    id: 10,
    name: "Bvlgari",
    area: {
      left: 48.8,
      top: 76.3,
      width: 14.3,
      height: 7.0,
    },
  },
  {
    id: 11,
    name: "Shiseido",
    area: {
      left: 48.8,
      top: 88.8,
      width: 14.3,
      height: 7.1,
    },
  },
  {
    id: 12,
    name: "Deurocos Cosmetic",
    rotate: -45,
    area: {
      left: 22.1,
      top: 68.5,
      width: 13.8,
      height: 6.8,
    },
  },
  {
    id: 13,
    name: "Give Back Beauty",
    rotate: -45,
    area: {
      left: 27.1,
      top: 74.9,
      width: 10.6,
      height: 4.8,
    },
  },
  {
    id: 14,
    name: "Coty",
    area: {
      left: 14.7,
      top: 88.8,
      width: 25.1,
      height: 7.1,
    },
  },
  {
    id: 15,
    name: "Puig",
    area: {
      left: 28.2,
      top: 16.1,
      width: 6.5,
      height: 22.1,
    },
  },
  {
    id: 16,
    name: "Clinique",
    area: {
      left: 5.1,
      top: 16.6,
      width: 8.3,
      height: 16.6,
    },
  },
  {
    id: 17,
    name: "Dr.Jart+",
    area: {
      left: 5.1,
      top: 33.4,
      width: 12.8,
      height: 11.0,
    },
  },
  {
    id: 18,
    name: "Tom Ford",
    area: {
      left: 5.1,
      top: 44.7,
      width: 12.8,
      height: 11.0,
    },
  },
  {
    id: 19,
    name: "Estée Lauder",
    area: {
      left: 5.1,
      top: 56.1,
      width: 12.8,
      height: 11.0,
    },
  },
  {
    id: 20,
    name: "Jo Malone London",
    area: {
      left: 5.1,
      top: 67.6,
      width: 8.3,
      height: 16.2,
    },
  },
];

// ==================================================
// BASIC HELPERS
// ==================================================

function loadJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore.
  }
}

function uniqueNumbers(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return [
    ...new Set(
      values
        .map(Number)
        .filter(
          (value) =>
            Number.isInteger(value) &&
            value >= 1 &&
            value <= TOTAL_BOOTHS
        )
    ),
  ].sort((a, b) => a - b);
}

function normalizeQR(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function normalizeRecoveryCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function createLocalId() {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getOrCreateLocalId(key) {
  try {
    const existing = localStorage.getItem(key);

    if (existing) {
      return existing;
    }

    const value = createLocalId();

    localStorage.setItem(key, value);

    return value;
  } catch {
    return createLocalId();
  }
}

function wait(ms) {
  return new Promise((resolve) =>
    window.setTimeout(resolve, ms)
  );
}

// ==================================================
// INITIAL STORAGE
// ==================================================

function loadInitialUser() {
  const current = loadJSON(USER_STORAGE_KEY, null);

  if (current) {
    return current;
  }

  if (TEST_MODE) {
    return loadJSON(LEGACY_USER_STORAGE_KEY, null);
  }

  return null;
}

function loadInitialVisited() {
  const current = loadJSON(VISITED_STORAGE_KEY, null);

  if (Array.isArray(current)) {
    return uniqueNumbers(current);
  }

  if (TEST_MODE) {
    return uniqueNumbers(
      loadJSON(LEGACY_VISITED_STORAGE_KEY, [])
    );
  }

  return [];
}

function loadInitialGoodie() {
  const current = loadJSON(GOODIE_STORAGE_KEY, null);

  if (current) {
    return current;
  }

  if (TEST_MODE) {
    return loadJSON(LEGACY_GOODIE_STORAGE_KEY, {
      collectedAt: null,
    });
  }

  return {
    collectedAt: null,
  };
}

function detectInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }

    if (TEST_MODE) {
      const legacy = localStorage.getItem(
        LEGACY_LANGUAGE_STORAGE_KEY
      );

      if (SUPPORTED_LANGUAGES.includes(legacy)) {
        return legacy;
      }
    }
  } catch {
    // Ignore.
  }

  const browserLanguage = String(
    navigator.language || "en"
  )
    .slice(0, 2)
    .toLowerCase();

  return SUPPORTED_LANGUAGES.includes(browserLanguage)
    ? browserLanguage
    : "en";
}

// ==================================================
// VISIT PROOFS
// ==================================================

function loadVisitProofs() {
  const raw = loadJSON(VISIT_PROOFS_STORAGE_KEY, {});

  if (
    !raw ||
    typeof raw !== "object" ||
    Array.isArray(raw)
  ) {
    return {};
  }

  const result = {};

  Object.entries(raw).forEach(([key, value]) => {
    const boothId = Number(key);

    if (
      Number.isInteger(boothId) &&
      boothId >= 1 &&
      boothId <= TOTAL_BOOTHS &&
      typeof value === "string" &&
      value.length > 0
    ) {
      result[boothId] = value.slice(0, 500);
    }
  });

  return result;
}

function saveVisitProof(boothId, qrToken) {
  const proofs = loadVisitProofs();

  proofs[boothId] = String(qrToken || "")
    .trim()
    .slice(0, 500);

  saveJSON(VISIT_PROOFS_STORAGE_KEY, proofs);
}

function removeVisitProofs(boothIds) {
  if (!Array.isArray(boothIds) || boothIds.length === 0) {
    return;
  }

  const proofs = loadVisitProofs();

  boothIds.forEach((boothId) => {
    delete proofs[Number(boothId)];
  });

  saveJSON(VISIT_PROOFS_STORAGE_KEY, proofs);
}

function clearVisitProofs() {
  saveJSON(VISIT_PROOFS_STORAGE_KEY, {});
}

function getVisitProofIds() {
  return uniqueNumbers(Object.keys(loadVisitProofs()));
}

function getVisitScanPayload() {
  const proofs = loadVisitProofs();

  return Object.entries(proofs)
    .map(([boothId, qrToken]) => ({
      boothId: Number(boothId),
      qrToken,
    }))
    .filter(
      (entry) =>
        Number.isInteger(entry.boothId) &&
        entry.boothId >= 1 &&
        entry.boothId <= TOTAL_BOOTHS
    )
    .sort((a, b) => a.boothId - b.boothId);
}

// ==================================================
// SUPABASE RPC
// ==================================================

class RpcError extends Error {
  constructor(message, status, body) {
    super(message);

    this.name = "RpcError";
    this.status = status;
    this.body = body;
  }
}

function isRetryableError(error) {
  if (error?.name === "AbortError") {
    return true;
  }

  if (error instanceof TypeError) {
    return true;
  }

  if (error instanceof RpcError) {
    return (
      error.status === 429 ||
      error.status >= 500
    );
  }

  return false;
}

async function supabaseRpc(
  functionName,
  payload,
  options = {}
) {
  const {
    retries = 2,
    timeoutMs = 8000,
  } = options;

  let lastError = null;

  for (
    let attempt = 0;
    attempt <= retries;
    attempt += 1
  ) {
    const controller = new AbortController();

    const timeout = window.setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/${functionName}`,
        {
          method: "POST",

          headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },

          body: JSON.stringify(payload),

          signal: controller.signal,
        }
      );

      window.clearTimeout(timeout);

      const text = await response.text();

      if (!response.ok) {
        throw new RpcError(
          `Supabase request failed: ${response.status}`,
          response.status,
          text
        );
      }

      if (!text) {
        return null;
      }

      return JSON.parse(text);
    } catch (error) {
      window.clearTimeout(timeout);

      lastError = error;

      const canRetry =
        attempt < retries &&
        isRetryableError(error);

      if (!canRetry) {
        throw error;
      }

      const delay =
        350 * Math.pow(2, attempt) +
        Math.floor(Math.random() * 250);

      await wait(delay);
    }
  }

  throw lastError;
}

function serverErrorContains(error, value) {
  return String(
    error?.body ||
      error?.message ||
      ""
  ).includes(value);
}

// ==================================================
// SCANNER HELPERS
// ==================================================

async function stopScannerInstance(scanner) {
  if (!scanner) {
    return;
  }

  try {
    if (scanner.isScanning) {
      await scanner.stop();
    }
  } catch {
    // Ignore.
  }

  try {
    scanner.clear();
  } catch {
    // Ignore.
  }
}

function scannerConfig() {
  return {
    fps: 10,

    qrbox: (width, height) => {
      const size = Math.floor(
        Math.min(width, height) * 0.9
      );

      return {
        width: size,
        height: size,
      };
    },

    disableFlip: false,
  };
}

function chooseRearCamera(cameras) {
  if (
    !Array.isArray(cameras) ||
    cameras.length === 0
  ) {
    return null;
  }

  const keywords = [
    "back",
    "rear",
    "environment",
    "rück",
    "arrière",
    "posteriore",
    "trasera",
  ];

  const match = cameras.find((camera) => {
    const label = String(
      camera.label || ""
    ).toLowerCase();

    return keywords.some((keyword) =>
      label.includes(keyword)
    );
  });

  return match || cameras[cameras.length - 1];
}

// ==================================================
// APP
// ==================================================

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [language, setLanguage] = useState(
    detectInitialLanguage
  );

  const t =
    translations[language] ||
    translations.en;

  const [user, setUser] = useState(loadInitialUser);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
  });

  const [visited, setVisited] = useState(
    loadInitialVisited
  );

  const [goodieData, setGoodieData] = useState(
    loadInitialGoodie
  );

  const [scanTarget, setScanTarget] = useState(null);
  const [scannerStatus, setScannerStatus] = useState("");
  const [scannerRestartKey, setScannerRestartKey] = useState(0);

  const [message, setMessage] = useState("");
  const [mapError, setMapError] = useState(false);

  const [goodieApproved, setGoodieApproved] = useState(false);
  const [goodieApprovalError, setGoodieApprovalError] = useState("");
  const [goodieReceiving, setGoodieReceiving] = useState(false);
  const [showGoodieSuccess, setShowGoodieSuccess] = useState(false);

  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [restoring, setRestoring] = useState(false);

  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const [legacyRetryTick, setLegacyRetryTick] = useState(0);

  const scannerRef = useRef(null);
  const scanLockedRef = useRef(false);
  const scannerSectionRef = useRef(null);
  const mapSectionRef = useRef(null);
  const legacyMigrationRef = useRef(false);
  const legacyRetryTimerRef = useRef(null);

  const scannerId = "qr-reader-region";

  const deviceId = getOrCreateLocalId(
    DEVICE_ID_STORAGE_KEY
  );

  const testCompleted =
    TEST_MODE &&
    visited.length >= TEST_UNLOCK_AT;

  const goodieEligible =
    TEST_MODE
      ? visited.length >= TEST_UNLOCK_AT
      : visited.length >= GOODIE_UNLOCK_AT;

  const goodieCollected = Boolean(
    goodieData?.collectedAt
  );

  const progress = Math.round(
    (visited.length / booths.length) * 100
  );

  // ==================================================
  // STORAGE
  // ==================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        language
      );
    } catch {
      // Ignore.
    }
  }, [language]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    saveJSON(
      VISITED_STORAGE_KEY,
      visited
    );
  }, [visited]);

  useEffect(() => {
    saveJSON(
      GOODIE_STORAGE_KEY,
      goodieData
    );
  }, [goodieData]);

  useEffect(() => {
    if (!user?.recoveryCode) {
      return;
    }

    const sessions = loadJSON(
      SESSIONS_STORAGE_KEY,
      {}
    );

    const key = normalizeRecoveryCode(
      user.recoveryCode
    );

    sessions[key] = {
      user,
      visited,
      goodieData,
      language,
      savedAt: new Date().toISOString(),
    };

    saveJSON(
      SESSIONS_STORAGE_KEY,
      sessions
    );
  }, [
    user,
    visited,
    goodieData,
    language,
  ]);

  // ==================================================
  // APPLY SERVER STATE
  // ==================================================

  const applyServerState = (
    state,
    options = {}
  ) => {
    if (!state) {
      return;
    }

    const {
      mergeLocalProofs = true,
      clientRegistrationId =
        user?.clientRegistrationId ||
        null,
    } = options;

    const serverVisited = uniqueNumbers(
      state.visited || []
    );

    const localProofIds = mergeLocalProofs
      ? getVisitProofIds()
      : [];

    const nextVisited = mergeLocalProofs
      ? uniqueNumbers([
          ...serverVisited,
          ...localProofIds,
        ])
      : serverVisited;

    const nextLanguage =
      SUPPORTED_LANGUAGES.includes(
        state.language
      )
        ? state.language
        : language;

    const nextUser = {
      id: state.id,
      firstname: state.firstname,
      lastname: state.lastname,
      language: nextLanguage,
      recoveryCode: state.recoveryCode,
      clientRegistrationId,
      dbSynced: true,
    };

    const nextGoodie = {
      collectedAt:
        state.goodieCollectedAt ||
        null,
    };

    saveJSON(
      USER_STORAGE_KEY,
      nextUser
    );

    saveJSON(
      VISITED_STORAGE_KEY,
      nextVisited
    );

    saveJSON(
      GOODIE_STORAGE_KEY,
      nextGoodie
    );

    setUser(nextUser);
    setVisited(nextVisited);
    setGoodieData(nextGoodie);

    if (nextLanguage !== language) {
      setLanguage(nextLanguage);
    }
  };

  // ==================================================
  // FULL STATE SYNC
  // ==================================================

  const syncAllVisitProofs = async (
    recoveryCode,
    options = {}
  ) => {
    if (!recoveryCode) {
      return {
        ok: false,
        sessionNotFound: true,
      };
    }

    const {
      retries = 1,
      timeoutMs = 7000,
    } = options;

    const scans = getVisitScanPayload();

    try {
      const result = await supabaseRpc(
        "sync_visits",
        {
          p_recovery_code: recoveryCode,
          p_scans: scans,
        },
        {
          retries,
          timeoutMs,
        }
      );

      if (
        !result ||
        result.status === "session_not_found"
      ) {
        return {
          ok: false,
          sessionNotFound: true,
        };
      }

      if (result.status !== "ok") {
        return {
          ok: false,
        };
      }

      const invalidBooths = uniqueNumbers(
        result.invalidBooths || []
      );

      if (invalidBooths.length > 0) {
        removeVisitProofs(
          invalidBooths
        );
      }

      applyServerState(
        result.state,
        {
          mergeLocalProofs: true,
        }
      );

      return {
        ok: true,
        invalidBooths,
        state: result.state,
      };
    } catch (error) {
      console.error(
        "Visit sync failed:",
        error
      );

      return {
        ok: false,
        networkError: true,
        error,
      };
    }
  };

  // ==================================================
  // BACKGROUND SYNC
  // ==================================================

  useEffect(() => {
    if (
      !user?.dbSynced ||
      !user?.recoveryCode
    ) {
      return undefined;
    }

    let cancelled = false;

    const syncNow = async () => {
      if (cancelled) {
        return;
      }

      await syncAllVisitProofs(
        user.recoveryCode,
        {
          retries: 1,
          timeoutMs: 6000,
        }
      );
    };

    const handleOnline = () => {
      syncNow();
    };

    const handleFocus = () => {
      syncNow();
    };

    const handleVisibility = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        syncNow();
      }
    };

    syncNow();

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [
    user?.dbSynced,
    user?.recoveryCode,
  ]);

  // ==================================================
  // LEGACY MIGRATION
  // ==================================================

  useEffect(() => {
    if (
      !user ||
      user.dbSynced ||
      legacyMigrationRef.current
    ) {
      return;
    }

    legacyMigrationRef.current = true;
    let cancelled = false;

    const migrate = async () => {
      try {
        if (user.recoveryCode) {
          try {
            const existing = await supabaseRpc(
              "get_participant_state",
              {
                p_recovery_code:
                  user.recoveryCode,
              },
              {
                retries: 0,
                timeoutMs: 5000,
              }
            );

            if (
              existing &&
              !cancelled
            ) {
              if (TEST_MODE) {
                visited.forEach(
                  (boothId) => {
                    saveVisitProof(
                      boothId,
                      TEST_QR_VALUE
                    );
                  }
                );
              }

              applyServerState(
                existing,
                {
                  mergeLocalProofs: true,
                }
              );

              await syncAllVisitProofs(
                existing.recoveryCode,
                {
                  retries: 1,
                  timeoutMs: 6000,
                }
              );

              return;
            }
          } catch {
            // Continue.
          }
        }

        const legacyBase = String(
          user.id ||
            getOrCreateLocalId(
              REGISTRATION_ID_STORAGE_KEY
            )
        );

        const legacyClientId =
          `legacy-${legacyBase}`.slice(
            0,
            95
          );

        const state = await supabaseRpc(
          "register_participant",
          {
            p_first_name:
              user.firstname,
            p_last_name:
              user.lastname,
            p_language:
              user.language ||
              language,
            p_client_registration_id:
              legacyClientId,
          },
          {
            retries: 2,
            timeoutMs: 8000,
          }
        );

        if (
          !state ||
          cancelled
        ) {
          return;
        }

        if (TEST_MODE) {
          visited.forEach(
            (boothId) => {
              saveVisitProof(
                boothId,
                TEST_QR_VALUE
              );
            }
          );
        }

        applyServerState(
          state,
          {
            mergeLocalProofs: true,
            clientRegistrationId:
              legacyClientId,
          }
        );

        await syncAllVisitProofs(
          state.recoveryCode,
          {
            retries: 1,
            timeoutMs: 6000,
          }
        );
      } catch (error) {
        console.error(
          "Legacy migration failed:",
          error
        );

        legacyMigrationRef.current = false;

        if (!cancelled) {
          legacyRetryTimerRef.current =
            window.setTimeout(() => {
              setLegacyRetryTick(
                (value) =>
                  value + 1
              );
            }, 5000);
        }
      }
    };

    migrate();

    return () => {
      cancelled = true;

      if (
        legacyRetryTimerRef.current
      ) {
        window.clearTimeout(
          legacyRetryTimerRef.current
        );
      }
    };
  }, [
    user,
    language,
    legacyRetryTick,
    visited,
  ]);

  // ==================================================
  // REGISTER
  // ==================================================

  const register = async () => {
    if (registering) {
      return;
    }

    const firstname =
      form.firstname.trim();

    const lastname =
      form.lastname.trim();

    setRegistrationError("");

    if (
      !firstname ||
      !lastname
    ) {
      setRegistrationError(
        t.nameRequired
      );

      return;
    }

    setRegistering(true);

    const clientRegistrationId =
      getOrCreateLocalId(
        REGISTRATION_ID_STORAGE_KEY
      );

    try {
      const state = await supabaseRpc(
        "register_participant",
        {
          p_first_name: firstname,
          p_last_name: lastname,
          p_language: language,
          p_client_registration_id:
            clientRegistrationId,
        },
        {
          retries: 2,
          timeoutMs: 8000,
        }
      );

      if (!state) {
        throw new Error(
          "Empty registration response"
        );
      }

      clearVisitProofs();

      setVisited([]);

      setGoodieData({
        collectedAt: null,
      });

      applyServerState(
        state,
        {
          mergeLocalProofs: false,
          clientRegistrationId,
        }
      );
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      if (
        serverErrorContains(
          error,
          "REGISTRATION_CLOSED"
        )
      ) {
        setRegistrationError(
          t.registrationClosed
        );
      } else if (
        serverErrorContains(
          error,
          "REGISTRATION_LIMIT_REACHED"
        )
      ) {
        setRegistrationError(
          t.registrationLimit
        );
      } else {
        setRegistrationError(
          t.registrationError
        );
      }
    } finally {
      setRegistering(false);
    }
  };

  // ==================================================
  // LOCAL RECOVERY
  // ==================================================

  const restoreLocalSession = (
    recoveryCode
  ) => {
    const normalized =
      normalizeRecoveryCode(
        recoveryCode
      );

    const currentSessions = loadJSON(
      SESSIONS_STORAGE_KEY,
      {}
    );

    let session =
      currentSessions[normalized];

    if (
      !session &&
      TEST_MODE
    ) {
      const legacySessions = loadJSON(
        LEGACY_SESSIONS_STORAGE_KEY,
        {}
      );

      session =
        legacySessions[normalized];
    }

    if (!session?.user) {
      return false;
    }

    const restoredVisited =
      uniqueNumbers(
        session.visited || []
      );

    const restoredGoodie =
      session.goodieData || {
        collectedAt: null,
      };

    const restoredLanguage =
      SUPPORTED_LANGUAGES.includes(
        session.user.language
      )
        ? session.user.language
        : language;

    const restoredUser = {
      ...session.user,
      language:
        restoredLanguage,
    };

    saveJSON(
      USER_STORAGE_KEY,
      restoredUser
    );

    saveJSON(
      VISITED_STORAGE_KEY,
      restoredVisited
    );

    saveJSON(
      GOODIE_STORAGE_KEY,
      restoredGoodie
    );

    setUser(restoredUser);
    setVisited(restoredVisited);
    setGoodieData(restoredGoodie);
    setLanguage(restoredLanguage);

    return true;
  };

  // ==================================================
  // RECOVERY DATABASE
  // ==================================================

  const restoreSession = async () => {
    if (restoring) {
      return;
    }

    const code = recoveryInput.trim();

    setRecoveryMessage("");

    if (
      normalizeRecoveryCode(
        code
      ).length !== 8
    ) {
      setRecoveryMessage(
        t.recoveryRequired
      );

      return;
    }

    setRestoring(true);

    try {
      const state = await supabaseRpc(
        "get_participant_state",
        {
          p_recovery_code:
            code,
        },
        {
          retries: 1,
          timeoutMs: 8000,
        }
      );

      if (!state) {
        setRecoveryMessage(
          t.recoveryNotFound
        );

        return;
      }

      clearVisitProofs();

      applyServerState(
        state,
        {
          mergeLocalProofs: false,
          clientRegistrationId:
            null,
        }
      );

      setRecoveryMessage("");
      setRecoveryInput("");
      setRecoveryOpen(false);
      setGoodieApproved(false);
      setShowGoodieSuccess(false);
    } catch (error) {
      console.error(
        "Recovery failed:",
        error
      );

      const localRestored =
        restoreLocalSession(
          code
        );

      if (!localRestored) {
        setRecoveryMessage(
          t.recoveryConnectionError
        );
      }
    } finally {
      setRestoring(false);
    }
  };

  // ==================================================
  // SCROLL
  // ==================================================

  const scrollToScanner = () => {
    window.setTimeout(() => {
      scannerSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  };

  const scrollToMap = () => {
    window.setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  };

  // ==================================================
  // SCANNER CONTROL
  // ==================================================

  const stopScanner = async () => {
    const scanner =
      scannerRef.current;

    if (!scanner) {
      return;
    }

    scannerRef.current = null;

    await stopScannerInstance(scanner);
  };

  const closeScanner = async () => {
    scanLockedRef.current = true;

    await stopScanner();

    setScanTarget(null);
    setScannerStatus("");

    scanLockedRef.current = false;

    scrollToMap();
  };

  const openBoothScanner = async (
    booth
  ) => {
    if (
      visited.includes(booth.id)
    ) {
      setMessage(
        t.alreadyVisited(
          booth.name
        )
      );

      return;
    }

    await stopScanner();

    setMessage("");
    setScannerStatus("");

    setScanTarget({
      type: "booth",
      booth,
    });
  };

  const openGoodieScanner = async () => {
    if (
      !goodieEligible ||
      goodieCollected
    ) {
      return;
    }

    await stopScanner();

    setMessage("");
    setScannerStatus("");

    setScanTarget({
      type: "goodie",
    });
  };

  useEffect(() => {
    if (!scanTarget) {
      return;
    }

    scrollToScanner();
  }, [
    scanTarget,
    scannerRestartKey,
  ]);

  useEffect(() => {
    if (!scanTarget) {
      return undefined;
    }

    const handleVisibility =
      async () => {
        if (
          document.visibilityState ===
          "hidden"
        ) {
          await stopScanner();
        } else {
          setScannerRestartKey(
            (value) =>
              value + 1
          );
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [scanTarget]);

  // ==================================================
  // QR SCANNER
  // ==================================================

  useEffect(() => {
    if (!scanTarget) {
      return undefined;
    }

    let cancelled = false;
    let ownedScanner = null;

    const cleanupOwnedScanner =
      async () => {
        if (!ownedScanner) {
          return;
        }

        const scanner =
          ownedScanner;

        ownedScanner = null;

        if (
          scannerRef.current ===
          scanner
        ) {
          scannerRef.current =
            null;
        }

        await stopScannerInstance(
          scanner
        );
      };

    const startScanner = async () => {
      scanLockedRef.current = false;

      setScannerStatus(
        t.startingCamera
      );

      await wait(350);

      if (cancelled) {
        return;
      }

      const scannerElement =
        document.getElementById(
          scannerId
        );

      if (!scannerElement) {
        setScannerStatus(
          t.scannerCouldNotLoad
        );

        return;
      }

      const handleSuccess = async (
        decodedText
      ) => {
        if (
          cancelled ||
          scanLockedRef.current
        ) {
          return;
        }

        scanLockedRef.current = true;

        const rawQr = String(
          decodedText || ""
        )
          .trim()
          .slice(0, 500);

        const normalized =
          normalizeQR(rawQr);

        if (
          TEST_MODE &&
          normalized !==
            normalizeQR(
              TEST_QR_VALUE
            )
        ) {
          setMessage(
            t.wrongTestQr(rawQr)
          );

          scanLockedRef.current = false;

          return;
        }

        // ========================================
        // GOODIE
        // ========================================

        if (
          scanTarget.type ===
          "goodie"
        ) {
          setScannerStatus(
            t.checkingGoodie
          );

          const syncResult =
            await syncAllVisitProofs(
              user?.recoveryCode,
              {
                retries: 1,
                timeoutMs: 7000,
              }
            );

          if (!syncResult.ok) {
            if (
              syncResult.sessionNotFound
            ) {
              setMessage(
                t.sessionProblem
              );
            } else {
              setMessage(
                t.goodieConnection
              );
            }

            scanLockedRef.current = false;

            return;
          }

          try {
            const approval =
              await supabaseRpc(
                "approve_goodie_bag",
                {
                  p_recovery_code:
                    user?.recoveryCode,
                  p_qr_token:
                    rawQr,
                  p_device_id:
                    deviceId,
                },
                {
                  retries: 2,
                  timeoutMs: 8000,
                }
              );

            if (!approval) {
              throw new Error(
                "Empty Goodie approval response"
              );
            }

            if (approval.state) {
              applyServerState(
                approval.state,
                {
                  mergeLocalProofs: true,
                }
              );
            }

            if (
              approval.status ===
              "approved"
            ) {
              await cleanupOwnedScanner();

              setScanTarget(null);
              setScannerStatus("");
              setGoodieApprovalError("");
              setGoodieApproved(true);

              scanLockedRef.current = false;

              return;
            }

            if (
              approval.status ===
              "invalid_qr"
            ) {
              setMessage(
                t.wrongGoodieQr
              );

              scanLockedRef.current = false;

              return;
            }

            if (
              approval.status ===
              "already_collected"
            ) {
              if (
                approval.collectedAt
              ) {
                setGoodieData({
                  collectedAt:
                    approval.collectedAt,
                });
              }

              await cleanupOwnedScanner();

              setScanTarget(null);
              setScannerStatus("");

              setMessage(
                t.goodieAlreadyCollected
              );

              scanLockedRef.current = false;

              scrollToMap();

              return;
            }

            if (
              approval.status ===
              "already_approved"
            ) {
              await cleanupOwnedScanner();

              setScanTarget(null);
              setScannerStatus("");

              setMessage(
                t.goodieAlreadyProcessing
              );

              scanLockedRef.current = false;

              scrollToMap();

              return;
            }

            if (
              approval.status ===
              "not_eligible"
            ) {
              await cleanupOwnedScanner();

              setScanTarget(null);
              setScannerStatus("");

              setMessage(
                t.goodieNotEligible(
                  approval.required ||
                    (TEST_MODE
                      ? TEST_UNLOCK_AT
                      : GOODIE_UNLOCK_AT)
                )
              );

              scanLockedRef.current = false;

              scrollToMap();

              return;
            }

            if (
              approval.status ===
              "session_not_found"
            ) {
              await cleanupOwnedScanner();

              setScanTarget(null);

              setMessage(
                t.sessionProblem
              );

              scanLockedRef.current = false;

              scrollToMap();

              return;
            }

            throw new Error(
              `Unexpected Goodie status: ${approval.status}`
            );
          } catch (error) {
            console.error(
              "Goodie approval failed:",
              error
            );

            setMessage(
              t.goodieConnection
            );

            scanLockedRef.current = false;

            return;
          }
        }

        // ========================================
        // BOOTH
        // ========================================

        const booth =
          scanTarget.booth;

        setScannerStatus(
          t.savingVisit
        );

        saveVisitProof(
          booth.id,
          rawQr
        );

        setVisited(
          (current) =>
            uniqueNumbers([
              ...current,
              booth.id,
            ])
        );

        const syncResult =
          await syncAllVisitProofs(
            user?.recoveryCode,
            {
              retries: 0,
              timeoutMs: 5000,
            }
          );

        if (
          syncResult.ok &&
          syncResult.invalidBooths?.includes(
            booth.id
          )
        ) {
          setMessage(
            TEST_MODE
              ? t.wrongTestQr(
                  rawQr
                )
              : t.wrongBoothQr(
                  booth.name
                )
          );

          setScannerStatus(
            TEST_MODE
              ? t.testScanBooth
              : t.cameraReady
          );

          scanLockedRef.current = false;

          return;
        }

        if (
          syncResult.sessionNotFound
        ) {
          setMessage(
            t.sessionProblem
          );

          await cleanupOwnedScanner();

          setScanTarget(null);
          setScannerStatus("");

          scanLockedRef.current = false;

          scrollToMap();

          return;
        }

        if (syncResult.ok) {
          setMessage(
            t.boothCollected(
              booth.name
            )
          );
        } else {
          setMessage(
            t.boothSavedOffline(
              booth.name
            )
          );
        }

        await cleanupOwnedScanner();

        setScanTarget(null);
        setScannerStatus("");

        scanLockedRef.current = false;

        scrollToMap();
      };

      const handleFailure = () => {
        // Normal while looking for QR.
      };

      try {
        ownedScanner =
          new Html5Qrcode(
            scannerId
          );

        scannerRef.current =
          ownedScanner;

        await ownedScanner.start(
          {
            facingMode: {
              ideal: "environment",
            },
          },
          scannerConfig(),
          handleSuccess,
          handleFailure
        );
      } catch (firstError) {
        console.warn(
          "Environment camera start failed:",
          firstError
        );

        await cleanupOwnedScanner();

        if (cancelled) {
          return;
        }

        try {
          const cameras =
            await Html5Qrcode.getCameras();

          const camera =
            chooseRearCamera(
              cameras
            );

          if (!camera) {
            throw firstError;
          }

          ownedScanner =
            new Html5Qrcode(
              scannerId
            );

          scannerRef.current =
            ownedScanner;

          await ownedScanner.start(
            camera.id,
            scannerConfig(),
            handleSuccess,
            handleFailure
          );
        } catch (secondError) {
          console.error(
            "Camera fallback failed:",
            secondError
          );

          await cleanupOwnedScanner();

          if (!cancelled) {
            setScannerStatus(
              t.cameraCouldNotStart
            );

            setMessage(
              t.cameraPermission
            );
          }

          return;
        }
      }

      if (cancelled) {
        await cleanupOwnedScanner();
        return;
      }

      if (TEST_MODE) {
        setScannerStatus(
          scanTarget.type ===
            "goodie"
            ? t.testScanGoodie
            : t.testScanBooth
        );
      } else {
        setScannerStatus(
          t.cameraReady
        );
      }
    };

    startScanner();

    return () => {
      cancelled = true;

      if (ownedScanner) {
        const scanner =
          ownedScanner;

        ownedScanner = null;

        if (
          scannerRef.current ===
          scanner
        ) {
          scannerRef.current =
            null;
        }

        void stopScannerInstance(
          scanner
        );
      }
    };
  }, [
    scanTarget,
    scannerRestartKey,
    language,
    user?.recoveryCode,
  ]);

  // ==================================================
  // GOODIE CONFIRM
  // ==================================================

  const confirmGoodieReceived = async () => {
    if (goodieReceiving) {
      return;
    }

    setGoodieApprovalError("");

    setGoodieReceiving(true);

    try {
      const syncResult =
        await syncAllVisitProofs(
          user?.recoveryCode,
          {
            retries: 2,
            timeoutMs: 8000,
          }
        );

      if (!syncResult.ok) {
        throw new Error(
          "Visit sync failed before Goodie handover"
        );
      }

      const result =
        await supabaseRpc(
          "collect_goodie_bag",
          {
            p_recovery_code:
              user?.recoveryCode,
            p_device_id:
              deviceId,
          },
          {
            retries: 2,
            timeoutMs: 8000,
          }
        );

      if (!result) {
        throw new Error(
          "Empty Goodie collection response"
        );
      }

      if (result.state) {
        applyServerState(
          result.state,
          {
            mergeLocalProofs: true,
          }
        );
      }

      if (
        result.status === "collected" ||
        result.status === "already_collected"
      ) {
        const collectedAt =
          result.collectedAt ||
          result.state?.goodieCollectedAt ||
          new Date().toISOString();

        setGoodieData({
          collectedAt,
        });

        saveJSON(
          GOODIE_STORAGE_KEY,
          {
            collectedAt,
          }
        );

        setGoodieApproved(false);
        setShowGoodieSuccess(true);

        return;
      }

      if (
        result.status ===
        "approval_required"
      ) {
        setGoodieApproved(false);

        setMessage(
          t.goodieApprovalExpired
        );

        scrollToMap();

        return;
      }

      if (
        result.status ===
        "not_eligible"
      ) {
        setGoodieApproved(false);

        setMessage(
          t.goodieNotEligible(
            result.required ||
              (TEST_MODE
                ? TEST_UNLOCK_AT
                : GOODIE_UNLOCK_AT)
          )
        );

        scrollToMap();

        return;
      }

      if (
        result.status ===
        "session_not_found"
      ) {
        setGoodieApproved(false);

        setMessage(
          t.sessionProblem
        );

        scrollToMap();

        return;
      }

      throw new Error(
        `Unexpected collect status: ${result.status}`
      );
    } catch (error) {
      console.error(
        "Goodie confirmation failed:",
        error
      );

      setGoodieApprovalError(
        t.goodieConfirmError
      );
    } finally {
      setGoodieReceiving(false);
    }
  };

  // ==================================================
  // SPLASH
  // ==================================================

  if (showSplash) {
    return <Splash t={t} />;
  }

  // ==================================================
  // REGISTRATION
  // ==================================================

  if (!user) {
    return (
      <Page>
        <Header t={t} />

        <main style={styles.registrationContent}>
          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
            t={t}
          />

          <div style={styles.jubiLogoWrapper}>
            <img
              src="/LogoJubi.png"
              alt={t.anniversaryAlt}
              style={styles.jubiLogo}
            />
          </div>

          <h1 style={styles.registrationTitle}>
            {t.welcome}
          </h1>

          <p style={styles.registrationIntro}>
            {t.intro}
          </p>

          <label style={styles.label}>
            {t.firstName}
          </label>

          <input
            style={styles.input}
            value={form.firstname}
            placeholder={t.firstName}
            autoComplete="given-name"
            maxLength={80}
            disabled={registering}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                firstname:
                  event.target.value,
              }))
            }
          />

          <label style={styles.label}>
            {t.lastName}
          </label>

          <input
            style={styles.input}
            value={form.lastname}
            placeholder={t.lastName}
            autoComplete="family-name"
            maxLength={80}
            disabled={registering}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                lastname:
                  event.target.value,
              }))
            }
          />

          <button
            type="button"
            style={{
              ...styles.primaryButton,
              opacity:
                registering
                  ? 0.65
                  : 1,
            }}
            disabled={registering}
            onClick={register}
          >
            {registering
              ? t.starting
              : t.start}
          </button>

          {registrationError && (
            <div style={styles.errorBox}>
              {registrationError}
            </div>
          )}

          <RecoveryPanel
            open={recoveryOpen}
            setOpen={setRecoveryOpen}
            value={recoveryInput}
            setValue={setRecoveryInput}
            message={recoveryMessage}
            onRestore={restoreSession}
            restoring={restoring}
            t={t}
          />
        </main>
      </Page>
    );
  }

  // ==================================================
  // MAIN
  // ==================================================

  return (
    <Page>
      <style>
        {`
          @keyframes boothShimmer {
            0% {
              background-color: rgba(90, 90, 90, 0.045);
              border-color: rgba(90, 90, 90, 0.22);
            }

            50% {
              background-color: rgba(90, 90, 90, 0.12);
              border-color: rgba(90, 90, 90, 0.42);
            }

            100% {
              background-color: rgba(90, 90, 90, 0.045);
              border-color: rgba(90, 90, 90, 0.22);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .booth-unvisited {
              animation: none !important;
            }
          }
        `}
      </style>

      <Header t={t} />

      <main style={styles.content}>
        <p style={styles.eyebrow}>
          {t.anniversaryLabel}
        </p>

        <h1 style={styles.passTitle}>
          {t.hello(user.firstname)}
        </h1>

        <p style={styles.intro}>
          {t.welcomeEvent}
        </p>

        <Progress
          visited={visited.length}
          total={booths.length}
          progress={progress}
          t={t}
        />

        <section
          ref={mapSectionRef}
          style={styles.mapSection}
        >
          <h2 style={styles.sectionTitle}>
            {t.brandPass}
          </h2>

          <p style={styles.mapIntro}>
            {t.tapBooth}
          </p>

          <div style={styles.mapCard}>
            {!mapError ? (
              <div style={styles.mapWrapper}>
                <img
                  src="/brand-map2.png"
                  alt={t.mapAlt}
                  style={styles.mapImage}
                  onError={() =>
                    setMapError(true)
                  }
                />

                {booths.map((booth) => {
                  const isVisited =
                    testCompleted ||
                    visited.includes(
                      booth.id
                    );

                  return (
                    <button
                      key={booth.id}
                      type="button"
                      className={
                        isVisited
                          ? ""
                          : "booth-unvisited"
                      }
                      aria-label={`${booth.name} – ${
                        isVisited
                          ? t.visited
                          : t.notVisited
                      }`}
                      title={booth.name}
                      onClick={() =>
                        openBoothScanner(
                          booth
                        )
                      }
                      style={{
                        ...styles.boothOverlay,

                        left:
                          `${booth.area.left}%`,

                        top:
                          `${booth.area.top}%`,

                        width:
                          `${booth.area.width}%`,

                        height:
                          `${booth.area.height}%`,

                        transform:
                          booth.rotate
                            ? `rotate(${booth.rotate}deg)`
                            : undefined,

                        borderRadius:
                          booth.shape ===
                          "circle"
                            ? "50%"
                            : 1,

                        background:
                          isVisited
                            ? GREEN_BG
                            : UNVISITED_BG,

                        border:
                          isVisited
                            ? `2px solid ${GREEN}`
                            : `1px solid ${UNVISITED_BORDER}`,

                        animation:
                          isVisited
                            ? "none"
                            : "boothShimmer 3.8s ease-in-out infinite",
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div style={styles.mapError}>
                <strong>
                  {t.mapNotFound}
                </strong>

                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  {t.mapUploadBefore}{" "}
                  <strong>
                    public
                  </strong>{" "}
                  {t.mapUploadAfter}
                </div>

                <code style={styles.code}>
                  brand-map2.png
                </code>
              </div>
            )}
          </div>

          <div style={styles.legend}>
            <Legend
              color={GREEN_BG}
              border={GREEN}
              borderWidth={2}
              label={t.visited}
            />

            <Legend
              color={UNVISITED_BG}
              border={UNVISITED_BORDER}
              borderWidth={1}
              label={t.notVisited}
            />
          </div>

          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}
        </section>

        <GoodieBag
          visited={visited.length}
          eligible={goodieEligible}
          collected={goodieCollected}
          onCollect={openGoodieScanner}
          t={t}
        />

        {scanTarget && (
          <Scanner
            scanTarget={scanTarget}
            status={scannerStatus}
            scannerSectionRef={scannerSectionRef}
            onClose={closeScanner}
            t={t}
          />
        )}

        <section style={styles.recoveryInfo}>
          <div style={styles.recoveryInfoLabel}>
            {t.recoveryCodeLabel}
          </div>

          <div style={styles.recoveryCode}>
            {user.recoveryCode}
          </div>

          <div style={styles.recoveryInfoText}>
            {t.recoveryCodeText}
          </div>
        </section>
      </main>

      {goodieApproved && (
        <GoodieApprovedScreen
          user={user}
          visited={visited.length}
          total={booths.length}
          onReceived={confirmGoodieReceived}
          working={goodieReceiving}
          error={goodieApprovalError}
          t={t}
        />
      )}

      {showGoodieSuccess && (
        <GoodieSuccessScreen
          onDone={() =>
            setShowGoodieSuccess(false)
          }
          t={t}
        />
      )}
    </Page>
  );
}

// ==================================================
// COMPONENTS
// ==================================================

function Page({ children }) {
  return (
    <div style={styles.page}>
      <div style={styles.app}>
        {children}
      </div>
    </div>
  );
}

function Header({ t }) {
  return (
    <header style={styles.header}>
      <img
        src="/impo_logo.png"
        alt={t.logoAlt}
        style={styles.logo}
      />
    </header>
  );
}

function Splash({ t }) {
  return (
    <div style={styles.splash}>
      <img
        src="/LogoJubi.png"
        alt={t.anniversaryAlt}
        style={styles.splashLogo}
      />
    </div>
  );
}

function LanguageSelector({
  language,
  setLanguage,
  t,
}) {
  const options = [
    { code: "de", label: "DE" },
    { code: "fr", label: "FR" },
    { code: "it", label: "IT" },
    { code: "en", label: "EN" },
  ];

  return (
    <div style={styles.languageSection}>
      <div style={styles.languageLabel}>
        {t.chooseLanguage}
      </div>

      <div style={styles.languageButtons}>
        {options.map((option) => {
          const active =
            language === option.code;

          return (
            <button
              key={option.code}
              type="button"
              onClick={() =>
                setLanguage(
                  option.code
                )
              }
              style={{
                ...styles.languageButton,

                ...(active
                  ? styles.languageButtonActive
                  : styles.languageButtonInactive),
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Progress({
  visited,
  total,
  progress,
  t,
}) {
  return (
    <div style={styles.progressCard}>
      <div style={styles.progressTop}>
        <div>
          <div style={styles.progressNumber}>
            {visited} / {total}
          </div>

          <div style={styles.progressLabel}>
            {t.boothsVisited}
          </div>
        </div>

        <div style={styles.percent}>
          {progress}%
        </div>
      </div>

      <div style={styles.progressBackground}>
        <div
          style={{
            ...styles.progressBar,
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function Legend({
  color,
  border,
  borderWidth = 1,
  label,
}) {
  return (
    <div style={styles.legendItem}>
      <span
        style={{
          ...styles.legendBox,
          background: color,
          border:
            `${borderWidth}px solid ${border}`,
        }}
      />

      <span>{label}</span>
    </div>
  );
}

function RecoveryPanel({
  open,
  setOpen,
  value,
  setValue,
  message,
  onRestore,
  restoring,
  t,
}) {
  return (
    <section style={styles.recoveryPanel}>
      <button
        type="button"
        style={styles.recoveryToggle}
        onClick={() =>
          setOpen(!open)
        }
      >
        {t.recoveryLost}
      </button>

      {open && (
        <div style={styles.recoveryBody}>
          <div style={styles.recoveryTitle}>
            {t.recoveryTitle}
          </div>

          <p style={styles.recoveryText}>
            {t.recoveryText}
          </p>

          <input
            type="text"
            value={value}
            placeholder="ABCD-1234"
            autoCapitalize="characters"
            autoComplete="off"
            maxLength={12}
            disabled={restoring}
            style={styles.recoveryInput}
            onChange={(event) =>
              setValue(
                event.target.value.toUpperCase()
              )
            }
          />

          {message && (
            <div style={styles.recoveryMessage}>
              {message}
            </div>
          )}

          <button
            type="button"
            disabled={restoring}
            style={{
              ...styles.recoveryButton,
              opacity:
                restoring
                  ? 0.65
                  : 1,
            }}
            onClick={onRestore}
          >
            {restoring
              ? t.restoring
              : t.recoveryButton}
          </button>
        </div>
      )}
    </section>
  );
}

function GoodieBag({
  visited,
  eligible,
  collected,
  onCollect,
  t,
}) {
  const required =
    TEST_MODE
      ? TEST_UNLOCK_AT
      : GOODIE_UNLOCK_AT;

  const remaining =
    Math.max(
      required - visited,
      0
    );

  const goodieProgress =
    Math.min(
      visited / required,
      1
    ) * 100;

  return (
    <section style={styles.goodieCard}>
      <div style={styles.goodieIcon}>
        🎁
      </div>

      <div style={styles.goodieTitle}>
        {t.goodieBag}
      </div>

      {collected ? (
        <div style={styles.goodieCollected}>
          {t.goodieCollected}
        </div>
      ) : eligible ? (
        <>
          <div style={styles.goodieUnlocked}>
            {t.goodieReady}
          </div>

          <div style={styles.goodieText}>
            {TEST_MODE
              ? t.testGoodieReady
              : t.goodieLiveReady(
                  visited,
                  TOTAL_BOOTHS
                )}
          </div>
        </>
      ) : (
        <>
          <div style={styles.goodieText}>
            {TEST_MODE
              ? t.testGoodieInstruction
              : t.liveGoodieInstruction(
                  GOODIE_UNLOCK_AT,
                  TOTAL_BOOTHS
                )}
          </div>

          <div style={styles.goodieCount}>
            {visited} / {required}
          </div>

          <div
            style={
              styles.goodieProgressBackground
            }
          >
            <div
              style={{
                ...styles.goodieProgressBar,
                width:
                  `${goodieProgress}%`,
              }}
            />
          </div>

          <div style={styles.goodieRemaining}>
            {remaining === 1
              ? t.remainingOne
              : t.remainingMany(
                  remaining
                )}
          </div>
        </>
      )}

      {!collected && (
        <button
          type="button"
          disabled={!eligible}
          onClick={onCollect}
          style={{
            ...styles.goodieButton,

            ...(eligible
              ? styles.goodieButtonActive
              : styles.goodieButtonDisabled),
          }}
        >
          {t.collectGoodie}
        </button>
      )}
    </section>
  );
}

function Scanner({
  scanTarget,
  status,
  scannerSectionRef,
  onClose,
  t,
}) {
  const label =
    scanTarget.type === "goodie"
      ? t.goodieBag
      : scanTarget.booth.name;

  return (
    <div
      ref={scannerSectionRef}
      style={styles.scannerCard}
    >
      <div style={styles.scannerHeader}>
        <div>
          <div style={styles.scannerTitle}>
            {t.scanQr}
          </div>

          <div style={styles.scannerSubtitle}>
            {label}
          </div>
        </div>

        <div style={styles.scannerBadge}>
          QR
        </div>
      </div>

      <div style={styles.scannerStatus}>
        {status}
      </div>

      <div
        id="qr-reader-region"
        style={styles.scannerRegion}
      />

      <button
        type="button"
        style={styles.secondaryButton}
        onClick={onClose}
      >
        {t.close}
      </button>
    </div>
  );
}

function GoodieApprovedScreen({
  user,
  visited,
  total,
  onReceived,
  working,
  error,
  t,
}) {
  return (
    <div style={styles.goodieApprovedScreen}>
      <div style={styles.goodieApprovedContent}>
        <div style={styles.goodieApprovedCheck}>
          ✓
        </div>

        <div style={styles.goodieApprovedEyebrow}>
          {t.goodieApprovedEyebrow}
        </div>

        <h1 style={styles.goodieApprovedTitle}>
          {t.approved}
        </h1>

        <div style={styles.goodieApprovedName}>
          {user.firstname} {user.lastname}
        </div>

        <div style={styles.goodieApprovedProgress}>
          {TEST_MODE
            ? t.testApproval
            : t.boothsVisitedApproval(
                visited,
                total
              )}
        </div>

        <div style={styles.goodieApprovedInstruction}>
          {t.mayHandOver}
        </div>

        {error && (
          <div style={styles.goodieApprovalError}>
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={working}
          style={{
            ...styles.goodieReceivedButton,
            opacity:
              working
                ? 0.7
                : 1,
          }}
          onClick={onReceived}
        >
          {working
            ? t.confirmingGoodie
            : t.goodieReceived}
        </button>
      </div>
    </div>
  );
}

function GoodieSuccessScreen({
  onDone,
  t,
}) {
  return (
    <div style={styles.goodieSuccessScreen}>
      <style>
        {`
          @keyframes goodiePan {
            0% {
              background-position: left center;
            }

            100% {
              background-position: right center;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .goodie-panorama {
              animation: none !important;
              background-position: center center !important;
            }
          }
        `}
      </style>

      <div style={styles.goodieSuccessContent}>
        <img
          src="/impo_logo.png"
          alt={t.logoAlt}
          style={styles.goodieFinalLogo}
        />

        <h1 style={styles.goodieThankYou}>
          {t.thankYou}
        </h1>

        <div
          className="goodie-panorama"
          style={styles.goodiePanorama}
          role="img"
          aria-label={t.panoramaAlt}
        />

        <button
          type="button"
          style={styles.goodieDoneButton}
          onClick={onDone}
        >
          {t.done}
        </button>
      </div>
    </div>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: LIGHT,
    color: BLACK,
    fontFamily:
      '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },

  app: {
    maxWidth: 430,
    minHeight: "100vh",
    margin: "0 auto",
    background: "#FFFFFF",
  },

  header: {
    height: 70,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom:
      `1px solid ${BORDER}`,
  },

  logo: {
    width: 82,
    display: "block",
  },

  splash: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFFFFF",
  },

  splashLogo: {
    width: "72%",
    maxWidth: 350,
    objectFit: "contain",
  },

  languageSection: {
    marginBottom: 26,
    textAlign: "center",
  },

  languageLabel: {
    marginBottom: 9,
    color: "#888888",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  languageButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 7,
  },

  languageButton: {
    minWidth: 52,
    height: 38,
    padding: "0 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    transition:
      "all 0.15s ease",
  },

  languageButtonActive: {
    border:
      `1px solid ${RED}`,
    background: RED,
    color: "#FFFFFF",
  },

  languageButtonInactive: {
    border:
      `1px solid ${BORDER}`,
    background: "#FFFFFF",
    color: "#555555",
  },

  registrationContent: {
    padding:
      "26px 20px 50px",
  },

  jubiLogoWrapper: {
    display: "flex",
    justifyContent: "center",
    margin:
      "4px 0 30px",
  },

  jubiLogo: {
    width: "70%",
    maxWidth: 280,
    objectFit: "contain",
  },

  registrationTitle: {
    margin: 0,
    fontSize: 36,
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  registrationIntro: {
    margin:
      "12px 0 30px",
    color: "#666666",
    fontSize: 16,
    lineHeight: 1.5,
  },

  label: {
    display: "block",
    marginBottom: 7,
    fontSize: 13,
    fontWeight: 700,
  },

  input: {
    width: "100%",
    boxSizing:
      "border-box",
    padding: 15,
    marginBottom: 18,
    border:
      `1px solid ${BORDER}`,
    borderRadius: 8,
    background: "#FFFFFF",
    fontSize: 16,
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    padding: 16,
    marginTop: 5,
    border: 0,
    borderRadius: 8,
    background: RED,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "0.7px",
    cursor: "pointer",
  },

  errorBox: {
    marginTop: 14,
    padding: 13,
    border:
      "1px solid rgba(207,45,54,0.25)",
    borderRadius: 9,
    background:
      "rgba(207,45,54,0.06)",
    color: RED,
    fontSize: 12,
    lineHeight: 1.45,
  },

  content: {
    padding:
      "28px 20px 60px",
  },

  eyebrow: {
    margin: 0,
    color: RED,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1.2px",
  },

  passTitle: {
    margin:
      "6px 0 8px",
    fontSize: 34,
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  intro: {
    margin:
      "12px 0 26px",
    color: "#666666",
    fontSize: 16,
    lineHeight: 1.5,
  },

  progressCard: {
    padding: 20,
    margin:
      "26px 0 28px",
    borderRadius: 14,
    background: RED,
    color: "#FFFFFF",
  },

  progressTop: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  progressNumber: {
    fontSize: 30,
    fontWeight: 800,
  },

  progressLabel: {
    marginTop: 2,
    fontSize: 13,
    opacity: 0.9,
  },

  percent: {
    fontSize: 22,
    fontWeight: 800,
  },

  progressBackground: {
    height: 7,
    marginTop: 18,
    overflow: "hidden",
    borderRadius: 999,
    background:
      "rgba(255,255,255,0.30)",
  },

  progressBar: {
    height: "100%",
    borderRadius: 999,
    background: "#FFFFFF",
    transition:
      "width 0.4s ease",
  },

  mapSection: {
    scrollMarginTop: 16,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
  },

  mapIntro: {
    margin:
      "6px 0 14px",
    color: "#777777",
    fontSize: 13,
    lineHeight: 1.4,
  },

  mapCard: {
    padding: 6,
    overflow: "hidden",
    border:
      `1px solid ${BORDER}`,
    borderRadius: 14,
    background: "#FFFFFF",
  },

  mapWrapper: {
    position: "relative",
    width: "100%",
    lineHeight: 0,
  },

  mapImage: {
    width: "100%",
    height: "auto",
    display: "block",
    userSelect: "none",
    WebkitUserDrag: "none",
  },

  boothOverlay: {
    position: "absolute",
    zIndex: 5,
    boxSizing:
      "border-box",
    padding: 0,
    margin: 0,
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    WebkitTapHighlightColor:
      "transparent",
    transition:
      "background 0.18s ease, border-color 0.18s ease, border-width 0.18s ease",
  },

  mapError: {
    padding: 30,
    background: "#FAFAFA",
    color: "#555555",
    fontSize: 14,
    lineHeight: 1.5,
    textAlign: "center",
  },

  code: {
    display:
      "inline-block",
    padding:
      "6px 10px",
    marginTop: 12,
    borderRadius: 6,
    background: "#EEEEEE",
  },

  legend: {
    display: "flex",
    gap: 22,
    marginTop: 13,
    color: "#666666",
    fontSize: 12,
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },

  legendBox: {
    width: 16,
    height: 16,
    boxSizing:
      "border-box",
    borderRadius: 3,
  },

  message: {
    padding: 13,
    marginTop: 16,
    border:
      `1px solid ${BORDER}`,
    borderRadius: 10,
    background: "#F7F7F7",
    fontSize: 13,
    lineHeight: 1.4,
  },

  recoveryPanel: {
    marginTop: 38,
    paddingTop: 22,
    borderTop:
      `1px solid ${BORDER}`,
    textAlign: "center",
  },

  recoveryToggle: {
    padding: 8,
    border: 0,
    background:
      "transparent",
    color: "#999999",
    fontSize: 12,
    textDecoration:
      "underline",
    cursor: "pointer",
  },

  recoveryBody: {
    marginTop: 14,
    padding: 16,
    borderRadius: 12,
    background: "#F7F7F7",
    textAlign: "left",
  },

  recoveryTitle: {
    fontSize: 17,
    fontWeight: 800,
  },

  recoveryText: {
    margin:
      "6px 0 12px",
    color: "#777777",
    fontSize: 13,
    lineHeight: 1.4,
  },

  recoveryInput: {
    width: "100%",
    boxSizing:
      "border-box",
    padding: 14,
    border:
      `1px solid ${BORDER}`,
    borderRadius: 8,
    background: "#FFFFFF",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "2px",
    textAlign: "center",
    textTransform:
      "uppercase",
    outline: "none",
  },

  recoveryButton: {
    width: "100%",
    padding: 14,
    marginTop: 12,
    border: 0,
    borderRadius: 8,
    background: BLACK,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },

  recoveryMessage: {
    marginTop: 10,
    color: RED,
    fontSize: 12,
    lineHeight: 1.4,
  },

  recoveryInfo: {
    marginTop: 34,
    paddingTop: 22,
    borderTop:
      `1px solid ${BORDER}`,
    textAlign: "center",
  },

  recoveryInfoLabel: {
    color: "#999999",
    fontSize: 11,
    textTransform:
      "uppercase",
    letterSpacing: "0.8px",
  },

  recoveryCode: {
    marginTop: 7,
    color: BLACK,
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: "2px",
  },

  recoveryInfoText: {
    maxWidth: 280,
    margin:
      "7px auto 0",
    color: "#AAAAAA",
    fontSize: 10,
    lineHeight: 1.4,
  },

  goodieCard: {
    marginTop: 30,
    padding: 18,
    border:
      `1px solid ${BORDER}`,
    borderRadius: 16,
    background: "#FFFFFF",
  },

  goodieIcon: {
    marginBottom: 10,
    fontSize: 26,
  },

  goodieTitle: {
    fontSize: 22,
    fontWeight: 800,
  },

  goodieText: {
    marginTop: 8,
    color: "#666666",
    fontSize: 14,
    lineHeight: 1.45,
  },

  goodieCount: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: 800,
  },

  goodieProgressBackground: {
    height: 7,
    marginTop: 8,
    overflow: "hidden",
    borderRadius: 999,
    background: "#EEEEEE",
  },

  goodieProgressBar: {
    height: "100%",
    borderRadius: 999,
    background: RED,
    transition:
      "width 0.3s ease",
  },

  goodieRemaining: {
    marginTop: 8,
    color: "#888888",
    fontSize: 12,
  },

  goodieUnlocked: {
    marginTop: 8,
    color: GREEN,
    fontSize: 17,
    fontWeight: 800,
  },

  goodieCollected: {
    marginTop: 8,
    color: GREEN,
    fontSize: 15,
    fontWeight: 800,
  },

  goodieButton: {
    width: "100%",
    padding: 15,
    marginTop: 18,
    border: 0,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.5px",
  },

  goodieButtonActive: {
    background: RED,
    color: "#FFFFFF",
    cursor: "pointer",
  },

  goodieButtonDisabled: {
    background: "#E8E8E8",
    color: "#999999",
    cursor: "default",
  },

  scannerCard: {
    padding: 16,
    marginTop: 20,
    border:
      `1px solid ${BORDER}`,
    borderRadius: 14,
    background: "#FFFFFF",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
    scrollMarginTop: 16,
  },

  scannerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: 12,
  },

  scannerTitle: {
    fontSize: 20,
    fontWeight: 800,
  },

  scannerSubtitle: {
    marginTop: 4,
    color: "#666666",
    fontSize: 14,
  },

  scannerBadge: {
    minWidth: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding:
      "0 8px",
    borderRadius: 8,
    background: RED,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: 800,
  },

  scannerStatus: {
    margin:
      "10px 0 14px",
    color: "#777777",
    fontSize: 12,
    lineHeight: 1.4,
  },

  scannerRegion: {
    width: "100%",
    minHeight: 300,
    overflow: "hidden",
    borderRadius: 10,
    background: "#111111",
  },

  secondaryButton: {
    width: "100%",
    padding: 14,
    marginTop: 14,
    border:
      `1px solid ${BLACK}`,
    borderRadius: 8,
    background: "#FFFFFF",
    color: BLACK,
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },

  goodieApprovedScreen: {
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: GREEN,
  },

  goodieApprovedContent: {
    width: "100%",
    maxWidth: 390,
    color: "#FFFFFF",
    textAlign: "center",
  },

  goodieApprovedCheck: {
    width: 82,
    height: 82,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin:
      "0 auto 26px",
    border:
      "3px solid rgba(255,255,255,0.9)",
    borderRadius: "50%",
    fontSize: 46,
    fontWeight: 900,
  },

  goodieApprovedEyebrow: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "2px",
  },

  goodieApprovedTitle: {
    margin:
      "6px 0 30px",
    fontSize: 44,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-1px",
  },

  goodieApprovedName: {
    fontSize: 25,
    fontWeight: 800,
  },

  goodieApprovedProgress: {
    marginTop: 7,
    fontSize: 16,
    opacity: 0.9,
  },

  goodieApprovedInstruction: {
    margin:
      "34px 0 28px",
    fontSize: 19,
    lineHeight: 1.4,
    fontWeight: 700,
  },

  goodieApprovalError: {
    padding: 12,
    marginBottom: 15,
    borderRadius: 9,
    background:
      "rgba(255,255,255,0.16)",
    fontSize: 12,
    lineHeight: 1.4,
  },

  goodieReceivedButton: {
    width: "100%",
    padding: 18,
    border: 0,
    borderRadius: 10,
    background: "#FFFFFF",
    color: GREEN,
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: "0.4px",
    cursor: "pointer",
  },

  goodieSuccessScreen: {
    position: "fixed",
    inset: 0,
    zIndex: 10001,
    overflowY: "auto",
    background: "#FFFFFF",
  },

  goodieSuccessContent: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxSizing: "border-box",
    padding:
      "34px 0",
    textAlign: "center",
  },

  goodieFinalLogo: {
    width: 90,
    display: "block",
    margin:
      "0 auto 30px",
  },

  goodieThankYou: {
    maxWidth: 360,
    margin:
      "0 auto 36px",
    padding:
      "0 24px",
    color: BLACK,
    fontSize: 27,
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },

  goodiePanorama: {
    width: "100%",
    height: 245,
    backgroundImage:
      'url("/goodie-bag-success.png")',
    backgroundRepeat:
      "no-repeat",
    backgroundSize:
      "auto 100%",
    backgroundPosition:
      "left center",
    animation:
      "goodiePan 14s linear infinite alternate",
  },

  goodieDoneButton: {
    width:
      "calc(100% - 40px)",
    maxWidth: 390,
    padding: 16,
    margin:
      "34px auto 0",
    border: 0,
    borderRadius: 8,
    background: RED,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
};
