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
// CONFIG
// ==================================================

const RED = "#CF2D36";
const BLACK = "#111111";
const LIGHT = "#F5F5F5";
const BORDER = "#E7E7E7";

const GREEN = "#209447";
const GREEN_BG = "rgba(32, 148, 71, 0.18)";

const USER_STORAGE_KEY = "impoJubiUserV2";
const VISITED_STORAGE_KEY = "impoJubiVisitedV2";
const GOODIE_STORAGE_KEY = "impoJubiGoodieV1";
const SESSIONS_STORAGE_KEY = "impoJubiSessionsV1";
const LANGUAGE_STORAGE_KEY = "impoJubiLanguageV1";
const PENDING_VISITS_STORAGE_KEY =
  "impoJubiPendingVisitsV1";

// ==================================================
// TEST MODE
// ==================================================
//
// TEST MODE:
// - GISADA QR works for every booth
// - after first scan only that booth is green
// - after 2 different booths all booths are green
// - Goodie Bag unlocks after 2 booths
//
// LIVE MODE:
// - every booth gets its own QR
// - only visited booths are green
// - Goodie Bag unlocks after 14 / 16
//
// IMPORTANT:
// Supabase is currently also configured for TEST MODE.
// Before going live we switch BOTH to live mode.
//
const TEST_MODE = true;

const TEST_QR_VALUE = "GISADA";
const TEST_UNLOCK_AT = 2;

const GOODIE_UNLOCK_AT = 14;
const GOODIE_QR_VALUE = "GOODIE-BAG-2026";

const SUPPORTED_LANGUAGES = [
  "de",
  "fr",
  "it",
  "en",
];

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

    nameRequired:
      "Please enter your first and last name.",

    registrationError:
      "We could not connect to the event database. Please check your internet connection and try again.",

    anniversaryLabel:
      "50 YEARS IMPORT PARFUMERIE",

    hello: (name) => `Hi ${name}!`,

    welcomeEvent:
      "Welcome to our anniversary event.",

    boothsVisited: "Booths visited",

    brandPass: "Your brand pass",

    tapBooth:
      "Tap on a booth to scan its QR code.",

    visited: "Visited",
    notVisited: "Not visited",

    mapNotFound: "Map image not found.",

    mapUploadBefore:
      "Upload the original image to the",

    mapUploadAfter: "folder as:",

    alreadyVisited: (name) =>
      `✓ ${name} already visited.`,

    boothCollected: (name) =>
      `✓ ${name} successfully collected.`,

    boothSavedOffline: (name) =>
      `✓ ${name} saved on this device. The central database will be updated automatically when the connection is available.`,

    scanQr: "Scan QR code",

    startingCamera: "Starting camera...",

    scannerCouldNotLoad:
      "Scanner could not be loaded.",

    cameraReady:
      "Camera ready – point it at the QR code.",

    testScanBooth:
      "TEST MODE – scan the GISADA QR code.",

    testScanGoodie:
      "TEST MODE – scan the GISADA QR code to approve the Goodie Bag.",

    wrongTestQr: (value) =>
      `Wrong test QR. Detected: ${value}`,

    wrongGoodieQr:
      "Wrong Goodie Bag QR code.",

    wrongBoothQr: (name) =>
      `Wrong QR code. Please scan the QR code for ${name}.`,

    cameraCouldNotStart:
      "Camera could not be started.",

    cameraPermission:
      "Please allow camera access and try again.",

    close: "CLOSE",

    goodieBag: "Goodie Bag",

    goodieCollected:
      "✓ Goodie Bag collected",

    goodieReady: "You're ready!",

    testGoodieReady:
      "Test completed. Goodie Bag collection is now available.",

    goodieLiveReady: (visited) =>
      `${visited} / 16 booths visited`,

    testGoodieInstruction:
      "TEST MODE – scan 2 different booths to unlock the Goodie Bag.",

    liveGoodieInstruction:
      "Visit at least 14 of 16 booths to unlock your Goodie Bag.",

    remainingOne:
      "1 more booth to go",

    remainingMany: (count) =>
      `${count} more booths to go`,

    collectGoodie:
      "COLLECT GOODIE BAG",

    goodieConnection:
      "A connection to the event database is required before the Goodie Bag can be approved. Please try again.",

    goodieApprovedEyebrow:
      "GOODIE BAG",

    approved: "APPROVED",

    testApproval:
      "Test approval successful",

    boothsVisitedApproval:
      (visited, total) =>
        `${visited} / ${total} booths visited`,

    mayHandOver:
      "You may hand over the Goodie Bag.",

    goodieReceived:
      "GOODIE BAG RECEIVED",

    confirmingGoodie:
      "CONFIRMING...",

    goodieConfirmError:
      "The Goodie Bag could not be confirmed in the database. Please check the connection and try again.",

    recoveryLost:
      "Lost your session?",

    recoveryTitle:
      "Restore your session",

    recoveryText:
      "Enter your personal recovery code.",

    recoveryButton:
      "RESTORE SESSION",

    restoring:
      "RESTORING...",

    recoveryRequired:
      "Please enter your recovery code.",

    recoveryNotFound:
      "No session was found for this recovery code.",

    recoveryInvalid:
      "The saved session is invalid.",

    recoveryConnectionError:
      "The database could not be reached. Please check your internet connection and try again.",

    recoveryCodeLabel:
      "Your recovery code",

    recoveryCodeText:
      "Keep this code in case you need to restore your session.",

    thankYou:
      "Thank you for celebrating our 50th anniversary with us today. Have a safe trip home!",

    done: "DONE",

    mapAlt: "Brand fair map",

    logoAlt:
      "Import Parfumerie",

    anniversaryAlt:
      "50 Years Import Parfumerie",

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

    nameRequired:
      "Bitte Vorname und Nachname eingeben.",

    registrationError:
      "Die Verbindung zur Event-Datenbank konnte nicht hergestellt werden. Bitte prüfe deine Internetverbindung und versuche es erneut.",

    anniversaryLabel:
      "50 JAHRE IMPORT PARFUMERIE",

    hello: (name) =>
      `Hallo ${name}!`,

    welcomeEvent:
      "Willkommen an unserem Jubiläumsevent.",

    boothsVisited:
      "Besuchte Stände",

    brandPass:
      "Dein Brand Pass",

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
      `✓ ${name} wurde auf diesem Gerät gespeichert. Die zentrale Datenbank wird automatisch aktualisiert, sobald die Verbindung wieder verfügbar ist.`,

    scanQr:
      "QR-Code scannen",

    startingCamera:
      "Kamera wird gestartet...",

    scannerCouldNotLoad:
      "Der Scanner konnte nicht geladen werden.",

    cameraReady:
      "Kamera bereit – richte sie auf den QR-Code.",

    testScanBooth:
      "TESTMODUS – scanne den GISADA QR-Code.",

    testScanGoodie:
      "TESTMODUS – scanne den GISADA QR-Code für die Goodie-Bag-Freigabe.",

    wrongTestQr: (value) =>
      `Falscher Test-QR. Erkannt: ${value}`,

    wrongGoodieQr:
      "Falscher Goodie-Bag-QR-Code.",

    wrongBoothQr: (name) =>
      `Falscher QR-Code. Bitte scanne den QR-Code von ${name}.`,

    cameraCouldNotStart:
      "Die Kamera konnte nicht gestartet werden.",

    cameraPermission:
      "Bitte erlaube den Kamerazugriff und versuche es erneut.",

    close: "SCHLIESSEN",

    goodieBag: "Goodie Bag",

    goodieCollected:
      "✓ Goodie Bag abgeholt",

    goodieReady:
      "Du bist bereit!",

    testGoodieReady:
      "Test abgeschlossen. Das Goodie Bag kann jetzt abgeholt werden.",

    goodieLiveReady: (visited) =>
      `${visited} / 16 Stände besucht`,

    testGoodieInstruction:
      "TESTMODUS – scanne 2 verschiedene Stände, um das Goodie Bag freizuschalten.",

    liveGoodieInstruction:
      "Besuche mindestens 14 von 16 Ständen, um dein Goodie Bag freizuschalten.",

    remainingOne:
      "Noch 1 Stand",

    remainingMany: (count) =>
      `Noch ${count} Stände`,

    collectGoodie:
      "GOODIE BAG ABHOLEN",

    goodieConnection:
      "Für die Freigabe des Goodie Bags wird eine Verbindung zur Event-Datenbank benötigt. Bitte versuche es erneut.",

    goodieApprovedEyebrow:
      "GOODIE BAG",

    approved: "FREIGEGEBEN",

    testApproval:
      "Testfreigabe erfolgreich",

    boothsVisitedApproval:
      (visited, total) =>
        `${visited} / ${total} Stände besucht`,

    mayHandOver:
      "Das Goodie Bag darf übergeben werden.",

    goodieReceived:
      "GOODIE BAG ÜBERGEBEN",

    confirmingGoodie:
      "WIRD BESTÄTIGT...",

    goodieConfirmError:
      "Die Übergabe konnte nicht in der Datenbank bestätigt werden. Bitte prüfe die Verbindung und versuche es erneut.",

    recoveryLost:
      "Session verloren?",

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

    recoveryInvalid:
      "Die gespeicherte Session ist ungültig.",

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

    logoAlt:
      "Import Parfumerie",

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

    anniversaryLabel:
      "50 ANS IMPORT PARFUMERIE",

    hello: (name) =>
      `Bonjour ${name} !`,

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
      `✓ ${name} a été enregistré sur cet appareil. La base de données centrale sera mise à jour automatiquement dès que la connexion sera disponible.`,

    scanQr:
      "Scanner le code QR",

    startingCamera:
      "Démarrage de la caméra...",

    scannerCouldNotLoad:
      "Le scanner n'a pas pu être chargé.",

    cameraReady:
      "Caméra prête – dirigez-la vers le code QR.",

    testScanBooth:
      "MODE TEST – scannez le code QR GISADA.",

    testScanGoodie:
      "MODE TEST – scannez le code QR GISADA pour valider le Goodie Bag.",

    wrongTestQr: (value) =>
      `Mauvais QR de test. Détecté : ${value}`,

    wrongGoodieQr:
      "Mauvais code QR du Goodie Bag.",

    wrongBoothQr: (name) =>
      `Mauvais code QR. Veuillez scanner le code QR de ${name}.`,

    cameraCouldNotStart:
      "La caméra n'a pas pu démarrer.",

    cameraPermission:
      "Veuillez autoriser l'accès à la caméra et réessayer.",

    close: "FERMER",

    goodieBag: "Goodie Bag",

    goodieCollected:
      "✓ Goodie Bag récupéré",

    goodieReady:
      "C'est bon !",

    testGoodieReady:
      "Test terminé. Le Goodie Bag peut maintenant être récupéré.",

    goodieLiveReady: (visited) =>
      `${visited} / 16 stands visités`,

    testGoodieInstruction:
      "MODE TEST – scannez 2 stands différents pour débloquer le Goodie Bag.",

    liveGoodieInstruction:
      "Visitez au moins 14 des 16 stands pour débloquer votre Goodie Bag.",

    remainingOne:
      "Encore 1 stand",

    remainingMany: (count) =>
      `Encore ${count} stands`,

    collectGoodie:
      "RÉCUPÉRER LE GOODIE BAG",

    goodieConnection:
      "Une connexion à la base de données de l'événement est nécessaire pour valider le Goodie Bag. Veuillez réessayer.",

    goodieApprovedEyebrow:
      "GOODIE BAG",

    approved: "VALIDÉ",

    testApproval:
      "Validation test réussie",

    boothsVisitedApproval:
      (visited, total) =>
        `${visited} / ${total} stands visités`,

    mayHandOver:
      "Le Goodie Bag peut être remis.",

    goodieReceived:
      "GOODIE BAG REMIS",

    confirmingGoodie:
      "CONFIRMATION...",

    goodieConfirmError:
      "La remise n'a pas pu être confirmée dans la base de données. Vérifiez la connexion et réessayez.",

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

    recoveryInvalid:
      "La session enregistrée n'est pas valide.",

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

    anniversaryLabel:
      "50 ANNI IMPORT PARFUMERIE",

    hello: (name) =>
      `Ciao ${name}!`,

    welcomeEvent:
      "Benvenuto al nostro evento anniversario.",

    boothsVisited:
      "Stand visitati",

    brandPass:
      "Il tuo Brand Pass",

    tapBooth:
      "Tocca uno stand per scansionare il suo codice QR.",

    visited: "Visitato",
    notVisited: "Non visitato",

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
      `✓ ${name} è stato salvato su questo dispositivo. Il database centrale verrà aggiornato automaticamente quando la connessione sarà disponibile.`,

    scanQr:
      "Scansiona il codice QR",

    startingCamera:
      "Avvio della fotocamera...",

    scannerCouldNotLoad:
      "Impossibile caricare lo scanner.",

    cameraReady:
      "Fotocamera pronta – inquadra il codice QR.",

    testScanBooth:
      "MODALITÀ TEST – scansiona il codice QR GISADA.",

    testScanGoodie:
      "MODALITÀ TEST – scansiona il codice QR GISADA per approvare il Goodie Bag.",

    wrongTestQr: (value) =>
      `QR di test errato. Rilevato: ${value}`,

    wrongGoodieQr:
      "Codice QR del Goodie Bag errato.",

    wrongBoothQr: (name) =>
      `Codice QR errato. Scansiona il codice QR di ${name}.`,

    cameraCouldNotStart:
      "Impossibile avviare la fotocamera.",

    cameraPermission:
      "Consenti l'accesso alla fotocamera e riprova.",

    close: "CHIUDI",

    goodieBag: "Goodie Bag",

    goodieCollected:
      "✓ Goodie Bag ritirato",

    goodieReady:
      "Ci siamo!",

    testGoodieReady:
      "Test completato. Ora puoi ritirare il Goodie Bag.",

    goodieLiveReady: (visited) =>
      `${visited} / 16 stand visitati`,

    testGoodieInstruction:
      "MODALITÀ TEST – scansiona 2 stand diversi per sbloccare il Goodie Bag.",

    liveGoodieInstruction:
      "Visita almeno 14 dei 16 stand per sbloccare il tuo Goodie Bag.",

    remainingOne:
      "Manca ancora 1 stand",

    remainingMany: (count) =>
      `Mancano ancora ${count} stand`,

    collectGoodie:
      "RITIRA IL GOODIE BAG",

    goodieConnection:
      "È necessaria una connessione al database dell'evento per approvare il Goodie Bag. Riprova.",

    goodieApprovedEyebrow:
      "GOODIE BAG",

    approved: "APPROVATO",

    testApproval:
      "Approvazione test riuscita",

    boothsVisitedApproval:
      (visited, total) =>
        `${visited} / ${total} stand visitati`,

    mayHandOver:
      "Il Goodie Bag può essere consegnato.",

    goodieReceived:
      "GOODIE BAG CONSEGNATO",

    confirmingGoodie:
      "CONFERMA...",

    goodieConfirmError:
      "La consegna non può essere confermata nel database. Controlla la connessione e riprova.",

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

    recoveryInvalid:
      "La sessione salvata non è valida.",

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
    qrValue: "GISADA",
    area: {
      left: 15.0,
      top: 4.6,
      width: 25.5,
      height: 5.9,
    },
  },
  {
    id: 2,
    name: "P&I Parfums",
    qrValue: "PI-PARFUMS",
    area: {
      left: 48.6,
      top: 3.1,
      width: 15.4,
      height: 9.0,
    },
  },
  {
    id: 3,
    name: "Karikaturist",
    qrValue: "KARIKATURIST",
    area: {
      left: 66.8,
      top: 3.2,
      width: 12.5,
      height: 8.0,
    },
  },
  {
    id: 4,
    name: "Jean-Pierre Rossellet",
    qrValue: "JEAN-PIERRE-ROSSELLET",
    area: {
      left: 43.9,
      top: 12.2,
      width: 5.1,
      height: 10.2,
    },
  },
  {
    id: 5,
    name: "Nobilis Group",
    qrValue: "NOBILIS-GROUP",
    area: {
      left: 48.6,
      top: 12.0,
      width: 15.4,
      height: 8.9,
    },
  },
  {
    id: 6,
    name: "Flariel",
    qrValue: "FLARIEL",
    area: {
      left: 43.9,
      top: 22.4,
      width: 5.1,
      height: 10.4,
    },
  },
  {
    id: 7,
    name: "Bode Studios",
    qrValue: "BODE-STUDIOS",
    area: {
      left: 48.6,
      top: 20.8,
      width: 15.4,
      height: 11.8,
    },
  },
  {
    id: 8,
    name: "L'Oréal Luxe",
    qrValue: "LOREAL-LUXE",
    shape: "circle",
    area: {
      left: 40.3,
      top: 37.0,
      width: 26.4,
      height: 24.8,
    },
  },
  {
    id: 9,
    name: "Clarins",
    qrValue: "CLARINS",
    area: {
      left: 48.0,
      top: 68.2,
      width: 15.3,
      height: 7.8,
    },
  },
  {
    id: 10,
    name: "Bvlgari",
    qrValue: "BVLGARI",
    area: {
      left: 48.0,
      top: 76.3,
      width: 15.3,
      height: 7.5,
    },
  },
  {
    id: 11,
    name: "Shiseido",
    qrValue: "SHISEIDO",
    area: {
      left: 48.0,
      top: 89.0,
      width: 15.3,
      height: 8.3,
    },
  },
  {
    id: 12,
    name: "Deurocos Cosmetic",
    qrValue: "DEUROCOS-COSMETIC",
    rotate: -45,
    area: {
      left: 20.8,
      top: 68.0,
      width: 15.5,
      height: 8.0,
    },
  },
  {
    id: 13,
    name: "Give Back Beauty",
    qrValue: "GIVE-BACK-BEAUTY",
    rotate: -45,
    area: {
      left: 25.1,
      top: 75.0,
      width: 12.0,
      height: 5.3,
    },
  },
  {
    id: 14,
    name: "Coty",
    qrValue: "COTY",
    area: {
      left: 13.6,
      top: 87.7,
      width: 25.3,
      height: 8.5,
    },
  },
  {
    id: 15,
    name: "Puig",
    qrValue: "PUIG",
    area: {
      left: 27.2,
      top: 14.4,
      width: 7.2,
      height: 23.2,
    },
  },
  {
    id: 16,
    name: "Estée Lauder",
    qrValue: "ESTEE-LAUDER",
    area: {
      left: 3.3,
      top: 18.7,
      width: 10.0,
      height: 68.3,
    },
  },
];

// ==================================================
// HELPERS
// ==================================================

function loadJSON(key, fallback) {
  try {
    const value =
      localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // Ignore storage errors.
  }
}

function normalizeRecoveryCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function getSessionKey(code) {
  return normalizeRecoveryCode(code);
}

function normalizeQR(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function uniqueNumbers(values) {
  return [
    ...new Set(
      values
        .map(Number)
        .filter(
          (value) =>
            Number.isInteger(value) &&
            value >= 1 &&
            value <= 16
        )
    ),
  ];
}

function detectInitialLanguage() {
  try {
    const saved =
      localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );

    if (
      SUPPORTED_LANGUAGES.includes(
        saved
      )
    ) {
      return saved;
    }
  } catch {
    // Ignore.
  }

  const browserLanguage =
    String(
      navigator.language || "en"
    )
      .slice(0, 2)
      .toLowerCase();

  return SUPPORTED_LANGUAGES.includes(
    browserLanguage
  )
    ? browserLanguage
    : "en";
}

// ==================================================
// SUPABASE RPC
// ==================================================

async function supabaseRpc(
  functionName,
  payload
) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/${functionName}`,
    {
      method: "POST",

      headers: {
        apikey:
          SUPABASE_PUBLISHABLE_KEY,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

  const text =
    await response.text();

  if (!response.ok) {
    console.error(
      `Supabase RPC ${functionName}:`,
      text
    );

    throw new Error(
      `Supabase request failed: ${response.status}`
    );
  }

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

function userFromServerState(
  state
) {
  return {
    id: state.id,

    firstname:
      state.firstname,

    lastname:
      state.lastname,

    language:
      state.language,

    recoveryCode:
      state.recoveryCode,

    dbSynced: true,
  };
}

// ==================================================
// APP
// ==================================================

export default function App() {
  const [
    showSplash,
    setShowSplash,
  ] = useState(true);

  const [
    language,
    setLanguage,
  ] = useState(
    detectInitialLanguage
  );

  const t =
    translations[language] ||
    translations.en;

  const [user, setUser] =
    useState(() =>
      loadJSON(
        USER_STORAGE_KEY,
        null
      )
    );

  const [form, setForm] =
    useState({
      firstname: "",
      lastname: "",
    });

  const [
    visited,
    setVisited,
  ] = useState(() =>
    uniqueNumbers(
      loadJSON(
        VISITED_STORAGE_KEY,
        []
      )
    )
  );

  const [
    goodieData,
    setGoodieData,
  ] = useState(() =>
    loadJSON(
      GOODIE_STORAGE_KEY,
      {
        collectedAt: null,
      }
    )
  );

  const [
    scanTarget,
    setScanTarget,
  ] = useState(null);

  const [
    scannerStatus,
    setScannerStatus,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    mapError,
    setMapError,
  ] = useState(false);

  const [
    goodieApproved,
    setGoodieApproved,
  ] = useState(false);

  const [
    goodieApprovalError,
    setGoodieApprovalError,
  ] = useState("");

  const [
    goodieReceiving,
    setGoodieReceiving,
  ] = useState(false);

  const [
    showGoodieSuccess,
    setShowGoodieSuccess,
  ] = useState(false);

  const [
    recoveryOpen,
    setRecoveryOpen,
  ] = useState(false);

  const [
    recoveryInput,
    setRecoveryInput,
  ] = useState("");

  const [
    recoveryMessage,
    setRecoveryMessage,
  ] = useState("");

  const [
    restoring,
    setRestoring,
  ] = useState(false);

  const [
    registering,
    setRegistering,
  ] = useState(false);

  const [
    registrationError,
    setRegistrationError,
  ] = useState("");

  const scannerRef =
    useRef(null);

  const scanLockedRef =
    useRef(false);

  const scannerSectionRef =
    useRef(null);

  const mapSectionRef =
    useRef(null);

  const legacyMigrationRef =
    useRef(false);

  const scannerId =
    "qr-reader-region";

  // ==================================================
  // DERIVED STATE
  // ==================================================

  const testCompleted =
    TEST_MODE &&
    visited.length >=
      TEST_UNLOCK_AT;

  const goodieEligible =
    TEST_MODE
      ? visited.length >=
        TEST_UNLOCK_AT
      : visited.length >=
        GOODIE_UNLOCK_AT;

  const goodieCollected =
    Boolean(
      goodieData.collectedAt
    );

  const progress =
    Math.round(
      (visited.length /
        booths.length) *
        100
    );

  // ==================================================
  // LANGUAGE
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

  // ==================================================
  // SPLASH
  // ==================================================

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setShowSplash(false);
        },
        2200
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, []);

  // ==================================================
  // LOCAL STORAGE
  // ==================================================

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

  // ==================================================
  // LOCAL RECOVERY COPY
  // ==================================================

  useEffect(() => {
    if (
      !user?.recoveryCode
    ) {
      return;
    }

    const sessions =
      loadJSON(
        SESSIONS_STORAGE_KEY,
        {}
      );

    const key =
      getSessionKey(
        user.recoveryCode
      );

    sessions[key] = {
      user,
      visited,
      goodieData,
      language,
      savedAt:
        new Date().toISOString(),
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
  // PENDING VISITS
  // ==================================================

  const queuePendingVisit = (
    boothId
  ) => {
    const current =
      uniqueNumbers(
        loadJSON(
          PENDING_VISITS_STORAGE_KEY,
          []
        )
      );

    if (
      current.includes(
        boothId
      )
    ) {
      return;
    }

    saveJSON(
      PENDING_VISITS_STORAGE_KEY,
      [
        ...current,
        boothId,
      ]
    );
  };

  const syncPendingVisits =
    async (
      recoveryCode
    ) => {
      if (!recoveryCode) {
        return false;
      }

      const pending =
        uniqueNumbers(
          loadJSON(
            PENDING_VISITS_STORAGE_KEY,
            []
          )
        );

      if (
        pending.length === 0
      ) {
        return true;
      }

      let lastState = null;

      for (
        let index = 0;
        index <
        pending.length;
        index += 1
      ) {
        const boothId =
          pending[index];

        try {
          lastState =
            await supabaseRpc(
              "record_visit",
              {
                p_recovery_code:
                  recoveryCode,

                p_booth_id:
                  boothId,
              }
            );
        } catch {
          const remaining =
            pending.slice(index);

          saveJSON(
            PENDING_VISITS_STORAGE_KEY,
            remaining
          );

          return false;
        }
      }

      saveJSON(
        PENDING_VISITS_STORAGE_KEY,
        []
      );

      if (
        lastState?.visited
      ) {
        const serverVisited =
          uniqueNumbers(
            lastState.visited
          );

        setVisited(
          (current) =>
            uniqueNumbers([
              ...current,
              ...serverVisited,
            ])
        );
      }

      if (
        lastState
          ?.goodieCollectedAt
      ) {
        setGoodieData({
          collectedAt:
            lastState
              .goodieCollectedAt,
        });
      }

      return true;
    };

  // ==================================================
  // REFRESH FROM DATABASE
  // ==================================================

  const refreshServerState =
    async (
      recoveryCode
    ) => {
      try {
        const state =
          await supabaseRpc(
            "get_participant_state",
            {
              p_recovery_code:
                recoveryCode,
            }
          );

        if (!state) {
          return false;
        }

        const serverVisited =
          uniqueNumbers(
            state.visited || []
          );

        setVisited(
          (current) =>
            uniqueNumbers([
              ...current,
              ...serverVisited,
            ])
        );

        if (
          state.goodieCollectedAt
        ) {
          setGoodieData({
            collectedAt:
              state.goodieCollectedAt,
          });
        }

        return true;
      } catch {
        return false;
      }
    };

  // ==================================================
  // AUTOMATIC BACKGROUND SYNC
  // ==================================================

  useEffect(() => {
    if (
      !user?.dbSynced ||
      !user?.recoveryCode
    ) {
      return undefined;
    }

    const syncNow =
      async () => {
        await syncPendingVisits(
          user.recoveryCode
        );

        await refreshServerState(
          user.recoveryCode
        );
      };

    syncNow();

    window.addEventListener(
      "online",
      syncNow
    );

    return () => {
      window.removeEventListener(
        "online",
        syncNow
      );
    };
  }, [
    user?.dbSynced,
    user?.recoveryCode,
  ]);

  // ==================================================
  // MIGRATE EXISTING TEST SESSION
  //
  // This allows an existing browser session from the
  // previous localStorage-only version to continue.
  // ==================================================

  useEffect(() => {
    if (
      !user ||
      user.dbSynced ||
      legacyMigrationRef.current
    ) {
      return;
    }

    legacyMigrationRef.current =
      true;

    let cancelled = false;

    const migrate =
      async () => {
        try {
          const state =
            await supabaseRpc(
              "register_participant",
              {
                p_first_name:
                  user.firstname,

                p_last_name:
                  user.lastname,

                p_language:
                  user.language ||
                  language,
              }
            );

          if (
            cancelled ||
            !state
          ) {
            return;
          }

          const migratedUser =
            userFromServerState(
              state
            );

          saveJSON(
            USER_STORAGE_KEY,
            migratedUser
          );

          setUser(
            migratedUser
          );

          const oldVisits =
            uniqueNumbers(
              visited
            );

          saveJSON(
            PENDING_VISITS_STORAGE_KEY,
            oldVisits
          );

          await syncPendingVisits(
            migratedUser.recoveryCode
          );

          if (
            goodieData.collectedAt
          ) {
            try {
              const goodieState =
                await supabaseRpc(
                  "collect_goodie_bag",
                  {
                    p_recovery_code:
                      migratedUser.recoveryCode,
                  }
                );

              if (
                goodieState
                  ?.goodieCollectedAt
              ) {
                setGoodieData({
                  collectedAt:
                    goodieState
                      .goodieCollectedAt,
                });
              }
            } catch {
              // Do not block migration.
            }
          }
        } catch (
          error
        ) {
          console.error(
            "Legacy session migration failed:",
            error
          );

          legacyMigrationRef.current =
            false;
        }
      };

    migrate();

    return () => {
      cancelled = true;
    };
  }, [
    user,
    language,
  ]);

  // ==================================================
  // REGISTER
  // ==================================================

  const register =
    async () => {
      const firstname =
        form.firstname.trim();

      const lastname =
        form.lastname.trim();

      setRegistrationError(
        ""
      );

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

      try {
        const state =
          await supabaseRpc(
            "register_participant",
            {
              p_first_name:
                firstname,

              p_last_name:
                lastname,

              p_language:
                language,
            }
          );

        if (!state) {
          throw new Error(
            "Empty registration response"
          );
        }

        const newUser =
          userFromServerState(
            state
          );

        const newVisited =
          uniqueNumbers(
            state.visited || []
          );

        const newGoodieData =
          {
            collectedAt:
              state.goodieCollectedAt ||
              null,
          };

        saveJSON(
          USER_STORAGE_KEY,
          newUser
        );

        saveJSON(
          VISITED_STORAGE_KEY,
          newVisited
        );

        saveJSON(
          GOODIE_STORAGE_KEY,
          newGoodieData
        );

        saveJSON(
          PENDING_VISITS_STORAGE_KEY,
          []
        );

        setVisited(
          newVisited
        );

        setGoodieData(
          newGoodieData
        );

        setUser(newUser);
      } catch (
        error
      ) {
        console.error(
          "Registration failed:",
          error
        );

        setRegistrationError(
          t.registrationError
        );
      } finally {
        setRegistering(
          false
        );
      }
    };

  // ==================================================
  // APPLY RESTORED SERVER SESSION
  // ==================================================

  const applyRestoredState = (
    state
  ) => {
    const restoredUser =
      userFromServerState(
        state
      );

    const restoredVisited =
      uniqueNumbers(
        state.visited || []
      );

    const restoredGoodie = {
      collectedAt:
        state.goodieCollectedAt ||
        null,
    };

    const restoredLanguage =
      SUPPORTED_LANGUAGES.includes(
        state.language
      )
        ? state.language
        : language;

    restoredUser.language =
      restoredLanguage;

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

    saveJSON(
      PENDING_VISITS_STORAGE_KEY,
      []
    );

    try {
      localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        restoredLanguage
      );
    } catch {
      // Ignore.
    }

    setVisited(
      restoredVisited
    );

    setGoodieData(
      restoredGoodie
    );

    setLanguage(
      restoredLanguage
    );

    setUser(
      restoredUser
    );

    setGoodieApproved(
      false
    );

    setShowGoodieSuccess(
      false
    );
  };

  // ==================================================
  // LOCAL FALLBACK RESTORE
  // ==================================================

  const restoreLocalSession = (
    recoveryCode
  ) => {
    const sessions =
      loadJSON(
        SESSIONS_STORAGE_KEY,
        {}
      );

    const key =
      getSessionKey(
        recoveryCode
      );

    const session =
      sessions[key];

    if (
      !session?.user
    ) {
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

    saveJSON(
      USER_STORAGE_KEY,
      session.user
    );

    saveJSON(
      VISITED_STORAGE_KEY,
      restoredVisited
    );

    saveJSON(
      GOODIE_STORAGE_KEY,
      restoredGoodie
    );

    setVisited(
      restoredVisited
    );

    setGoodieData(
      restoredGoodie
    );

    setLanguage(
      restoredLanguage
    );

    setUser(
      session.user
    );

    return true;
  };

  // ==================================================
  // RESTORE SESSION
  // ==================================================

  const restoreSession =
    async () => {
      const recoveryCode =
        recoveryInput.trim();

      setRecoveryMessage(
        ""
      );

      if (
        !normalizeRecoveryCode(
          recoveryCode
        )
      ) {
        setRecoveryMessage(
          t.recoveryRequired
        );

        return;
      }

      setRestoring(true);

      try {
        const state =
          await supabaseRpc(
            "get_participant_state",
            {
              p_recovery_code:
                recoveryCode,
            }
          );

        if (!state) {
          setRecoveryMessage(
            t.recoveryNotFound
          );

          return;
        }

        applyRestoredState(
          state
        );

        setRecoveryMessage(
          ""
        );

        setRecoveryInput(
          ""
        );

        setRecoveryOpen(
          false
        );
      } catch (
        error
      ) {
        console.error(
          "Recovery failed:",
          error
        );

        const localRestored =
          restoreLocalSession(
            recoveryCode
          );

        if (
          !localRestored
        ) {
          setRecoveryMessage(
            t.recoveryConnectionError
          );
        }
      } finally {
        setRestoring(
          false
        );
      }
    };

  // ==================================================
  // SCROLL
  // ==================================================

  const scrollToScanner =
    () => {
      window.setTimeout(
        () => {
          scannerSectionRef.current
            ?.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start",
            });
        },
        250
      );
    };

  const scrollToMap =
    () => {
      window.setTimeout(
        () => {
          mapSectionRef.current
            ?.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start",
            });
        },
        250
      );
    };

  // ==================================================
  // STOP SCANNER
  // ==================================================

  const stopScanner =
    async () => {
      const scanner =
        scannerRef.current;

      if (!scanner) {
        return;
      }

      try {
        if (
          scanner.isScanning
        ) {
          await scanner.stop();
        }
      } catch (
        error
      ) {
        console.log(
          "Scanner stop:",
          error
        );
      }

      try {
        scanner.clear();
      } catch (
        error
      ) {
        console.log(
          "Scanner clear:",
          error
        );
      }

      scannerRef.current =
        null;
    };

  // ==================================================
  // CLOSE SCANNER
  // ==================================================

  const closeScanner =
    async () => {
      scanLockedRef.current =
        true;

      await stopScanner();

      setScanTarget(null);

      setScannerStatus("");

      scanLockedRef.current =
        false;

      scrollToMap();
    };

  // ==================================================
  // OPEN BOOTH SCANNER
  // ==================================================

  const openBoothScanner =
    async (
      booth
    ) => {
      if (
        visited.includes(
          booth.id
        )
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

  // ==================================================
  // OPEN GOODIE SCANNER
  // ==================================================

  const openGoodieScanner =
    async () => {
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

  // ==================================================
  // AUTO SCROLL TO SCANNER
  // ==================================================

  useEffect(() => {
    if (!scanTarget) {
      return;
    }

    scrollToScanner();
  }, [scanTarget]);

  // ==================================================
  // QR SCANNER
  // ==================================================

  useEffect(() => {
    if (!scanTarget) {
      return;
    }

    let cancelled =
      false;

    const startScanner =
      async () => {
        scanLockedRef.current =
          false;

        setScannerStatus(
          t.startingCamera
        );

        await new Promise(
          (resolve) =>
            window.setTimeout(
              resolve,
              400
            )
        );

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

        try {
          const scanner =
            new Html5Qrcode(
              scannerId
            );

          scannerRef.current =
            scanner;

          const handleSuccess =
            async (
              decodedText
            ) => {
              if (
                scanLockedRef.current
              ) {
                return;
              }

              scanLockedRef.current =
                true;

              const scannedValue =
                normalizeQR(
                  decodedText
                );

              let isCorrectQR =
                false;

              // ======================================
              // TEST QR
              // ======================================

              if (TEST_MODE) {
                isCorrectQR =
                  scannedValue.includes(
                    normalizeQR(
                      TEST_QR_VALUE
                    )
                  );
              }

              // ======================================
              // LIVE GOODIE QR
              // ======================================

              else if (
                scanTarget.type ===
                "goodie"
              ) {
                isCorrectQR =
                  scannedValue ===
                  normalizeQR(
                    GOODIE_QR_VALUE
                  );
              }

              // ======================================
              // LIVE BOOTH QR
              // ======================================

              else {
                isCorrectQR =
                  scannedValue ===
                  normalizeQR(
                    scanTarget
                      .booth
                      .qrValue
                  );
              }

              if (
                !isCorrectQR
              ) {
                setMessage(
                  TEST_MODE
                    ? t.wrongTestQr(
                        decodedText
                      )
                    : scanTarget.type ===
                        "goodie"
                      ? t.wrongGoodieQr
                      : t.wrongBoothQr(
                          scanTarget
                            .booth
                            .name
                        )
                );

                scanLockedRef.current =
                  false;

                return;
              }

              // ======================================
              // GOODIE BAG QR
              // ======================================

              if (
                scanTarget.type ===
                "goodie"
              ) {
                const synced =
                  await syncPendingVisits(
                    user
                      ?.recoveryCode
                  );

                if (
                  !synced
                ) {
                  setMessage(
                    t.goodieConnection
                  );

                  scanLockedRef.current =
                    false;

                  return;
                }

                await stopScanner();

                setScanTarget(
                  null
                );

                setScannerStatus(
                  ""
                );

                setGoodieApprovalError(
                  ""
                );

                setGoodieApproved(
                  true
                );

                scanLockedRef.current =
                  false;

                return;
              }

              // ======================================
              // BOOTH QR
              // ======================================

              const booth =
                scanTarget.booth;

              const already =
                visited.includes(
                  booth.id
                );

              if (!already) {
                setVisited(
                  (current) =>
                    uniqueNumbers([
                      ...current,
                      booth.id,
                    ])
                );

                queuePendingVisit(
                  booth.id
                );
              }

              setMessage(
                t.boothCollected(
                  booth.name
                )
              );

              await stopScanner();

              setScanTarget(
                null
              );

              setScannerStatus(
                ""
              );

              scanLockedRef.current =
                false;

              scrollToMap();

              const synced =
                await syncPendingVisits(
                  user
                    ?.recoveryCode
                );

              if (
                !synced
              ) {
                setMessage(
                  t.boothSavedOffline(
                    booth.name
                  )
                );
              }
            };

          await scanner.start(
            {
              facingMode:
                "environment",
            },

            {
              fps: 10,

              qrbox: (
                width,
                height
              ) => {
                const size =
                  Math.floor(
                    Math.min(
                      width,
                      height
                    ) * 0.9
                  );

                return {
                  width:
                    size,

                  height:
                    size,
                };
              },

              disableFlip:
                false,
            },

            handleSuccess,

            () => {
              // No QR visible yet.
            }
          );

          if (!cancelled) {
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
          }
        } catch (
          error
        ) {
          console.error(
            "QR scanner error:",
            error
          );

          scannerRef.current =
            null;

          setScannerStatus(
            t.cameraCouldNotStart
          );

          setMessage(
            t.cameraPermission
          );
        }
      };

    startScanner();

    return () => {
      cancelled = true;
    };
  }, [
    scanTarget,
    language,
    user?.recoveryCode,
  ]);

  // ==================================================
  // GOODIE BAG RECEIVED
  // ==================================================

  const confirmGoodieReceived =
    async () => {
      if (
        goodieReceiving
      ) {
        return;
      }

      setGoodieApprovalError(
        ""
      );

      setGoodieReceiving(
        true
      );

      try {
        const synced =
          await syncPendingVisits(
            user
              ?.recoveryCode
          );

        if (!synced) {
          throw new Error(
            "Pending visits could not sync"
          );
        }

        const state =
          await supabaseRpc(
            "collect_goodie_bag",
            {
              p_recovery_code:
                user
                  ?.recoveryCode,
            }
          );

        if (
          !state ||
          !state.goodieCollectedAt
        ) {
          throw new Error(
            "Goodie confirmation failed"
          );
        }

        const newGoodieData =
          {
            collectedAt:
              state.goodieCollectedAt,
          };

        saveJSON(
          GOODIE_STORAGE_KEY,
          newGoodieData
        );

        setGoodieData(
          newGoodieData
        );

        if (
          state.visited
        ) {
          setVisited(
            uniqueNumbers(
              state.visited
            )
          );
        }

        setGoodieApproved(
          false
        );

        setShowGoodieSuccess(
          true
        );
      } catch (
        error
      ) {
        console.error(
          "Goodie confirmation failed:",
          error
        );

        setGoodieApprovalError(
          t.goodieConfirmError
        );
      } finally {
        setGoodieReceiving(
          false
        );
      }
    };

  // ==================================================
  // SPLASH
  // ==================================================

  if (showSplash) {
    return (
      <Splash t={t} />
    );
  }

  // ==================================================
  // REGISTRATION
  // ==================================================

  if (!user) {
    return (
      <Page>
        <Header t={t} />

        <main
          style={
            styles.registrationContent
          }
        >
          <LanguageSelector
            language={
              language
            }
            setLanguage={
              setLanguage
            }
            t={t}
          />

          <div
            style={
              styles.jubiLogoWrapper
            }
          >
            <img
              src="/LogoJubi.png"
              alt={
                t.anniversaryAlt
              }
              style={
                styles.jubiLogo
              }
            />
          </div>

          <h1
            style={
              styles.registrationTitle
            }
          >
            {t.welcome}
          </h1>

          <p
            style={
              styles.registrationIntro
            }
          >
            {t.intro}
          </p>

          <label
            style={
              styles.label
            }
          >
            {t.firstName}
          </label>

          <input
            style={
              styles.input
            }
            value={
              form.firstname
            }
            placeholder={
              t.firstName
            }
            autoComplete="given-name"
            disabled={
              registering
            }
            onChange={(
              event
            ) =>
              setForm(
                (current) => ({
                  ...current,

                  firstname:
                    event
                      .target
                      .value,
                })
              )
            }
          />

          <label
            style={
              styles.label
            }
          >
            {t.lastName}
          </label>

          <input
            style={
              styles.input
            }
            value={
              form.lastname
            }
            placeholder={
              t.lastName
            }
            autoComplete="family-name"
            disabled={
              registering
            }
            onChange={(
              event
            ) =>
              setForm(
                (current) => ({
                  ...current,

                  lastname:
                    event
                      .target
                      .value,
                })
              )
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
            disabled={
              registering
            }
            onClick={
              register
            }
          >
            {registering
              ? t.starting
              : t.start}
          </button>

          {registrationError && (
            <div
              style={
                styles.errorBox
              }
            >
              {
                registrationError
              }
            </div>
          )}

          <RecoveryPanel
            open={
              recoveryOpen
            }
            setOpen={
              setRecoveryOpen
            }
            value={
              recoveryInput
            }
            setValue={
              setRecoveryInput
            }
            message={
              recoveryMessage
            }
            onRestore={
              restoreSession
            }
            restoring={
              restoring
            }
            t={t}
          />
        </main>
      </Page>
    );
  }

  // ==================================================
  // BRAND PASS
  // ==================================================

  return (
    <Page>
      <Header t={t} />

      <main
        style={
          styles.content
        }
      >
        <p
          style={
            styles.eyebrow
          }
        >
          {
            t.anniversaryLabel
          }
        </p>

        <h1
          style={
            styles.passTitle
          }
        >
          {t.hello(
            user.firstname
          )}
        </h1>

        <p
          style={
            styles.intro
          }
        >
          {t.welcomeEvent}
        </p>

        <Progress
          visited={
            visited.length
          }
          total={
            booths.length
          }
          progress={
            progress
          }
          t={t}
        />

        {/* ======================================= */}
        {/* MAP */}
        {/* ======================================= */}

        <section
          ref={
            mapSectionRef
          }
          style={
            styles.mapSection
          }
        >
          <h2
            style={
              styles.sectionTitle
            }
          >
            {t.brandPass}
          </h2>

          <p
            style={
              styles.mapIntro
            }
          >
            {t.tapBooth}
          </p>

          <div
            style={
              styles.mapCard
            }
          >
            {!mapError ? (
              <div
                style={
                  styles.mapWrapper
                }
              >
                <img
                  src="/brand-map.png"
                  alt={
                    t.mapAlt
                  }
                  style={
                    styles.mapImage
                  }
                  onError={() =>
                    setMapError(
                      true
                    )
                  }
                />

                {booths.map(
                  (booth) => {
                    const isVisited =
                      testCompleted ||
                      visited.includes(
                        booth.id
                      );

                    return (
                      <button
                        key={
                          booth.id
                        }
                        type="button"
                        aria-label={
                          booth.name
                        }
                        title={
                          booth.name
                        }
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
                              : 2,

                          background:
                            isVisited
                              ? GREEN_BG
                              : "transparent",

                          border:
                            isVisited
                              ? `1.5px solid ${GREEN}`
                              : "1.5px solid transparent",
                        }}
                      />
                    );
                  }
                )}
              </div>
            ) : (
              <div
                style={
                  styles.mapError
                }
              >
                <strong>
                  {
                    t.mapNotFound
                  }
                </strong>

                <div
                  style={{
                    marginTop:
                      8,
                  }}
                >
                  {
                    t.mapUploadBefore
                  }{" "}
                  <strong>
                    public
                  </strong>{" "}
                  {
                    t.mapUploadAfter
                  }
                </div>

                <code
                  style={
                    styles.code
                  }
                >
                  brand-map.png
                </code>
              </div>
            )}
          </div>

          <div
            style={
              styles.legend
            }
          >
            <Legend
              color={
                GREEN_BG
              }
              border={
                GREEN
              }
              label={
                t.visited
              }
            />

            <Legend
              color="#FFFFFF"
              border="#BBBBBB"
              label={
                t.notVisited
              }
            />
          </div>

          {message && (
            <div
              style={
                styles.message
              }
            >
              {message}
            </div>
          )}
        </section>

        {/* ======================================= */}
        {/* GOODIE BAG */}
        {/* ======================================= */}

        <GoodieBag
          visited={
            visited.length
          }
          eligible={
            goodieEligible
          }
          collected={
            goodieCollected
          }
          onCollect={
            openGoodieScanner
          }
          t={t}
        />

        {/* ======================================= */}
        {/* SCANNER */}
        {/* ======================================= */}

        {scanTarget && (
          <Scanner
            scanTarget={
              scanTarget
            }
            status={
              scannerStatus
            }
            scannerSectionRef={
              scannerSectionRef
            }
            onClose={
              closeScanner
            }
            t={t}
          />
        )}

        {/* ======================================= */}
        {/* RECOVERY CODE */}
        {/* ======================================= */}

        <section
          style={
            styles.recoveryInfo
          }
        >
          <div
            style={
              styles.recoveryInfoLabel
            }
          >
            {
              t.recoveryCodeLabel
            }
          </div>

          <div
            style={
              styles.recoveryCode
            }
          >
            {
              user.recoveryCode
            }
          </div>

          <div
            style={
              styles.recoveryInfoText
            }
          >
            {
              t.recoveryCodeText
            }
          </div>
        </section>
      </main>

      {/* ======================================= */}
      {/* GOODIE APPROVED */}
      {/* ======================================= */}

      {goodieApproved && (
        <GoodieApprovedScreen
          user={user}
          visited={
            visited.length
          }
          total={
            booths.length
          }
          onReceived={
            confirmGoodieReceived
          }
          working={
            goodieReceiving
          }
          error={
            goodieApprovalError
          }
          t={t}
        />
      )}

      {/* ======================================= */}
      {/* FINAL THANK YOU */}
      {/* ======================================= */}

      {showGoodieSuccess && (
        <GoodieSuccessScreen
          onDone={() =>
            setShowGoodieSuccess(
              false
            )
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

function Page({
  children,
}) {
  return (
    <div
      style={
        styles.page
      }
    >
      <div
        style={
          styles.app
        }
      >
        {children}
      </div>
    </div>
  );
}

function Header({
  t,
}) {
  return (
    <header
      style={
        styles.header
      }
    >
      <img
        src="/impo_logo.png"
        alt={
          t.logoAlt
        }
        style={
          styles.logo
        }
      />
    </header>
  );
}

function Splash({
  t,
}) {
  return (
    <div
      style={
        styles.splash
      }
    >
      <img
        src="/LogoJubi.png"
        alt={
          t.anniversaryAlt
        }
        style={
          styles.splashLogo
        }
      />
    </div>
  );
}

// ==================================================
// LANGUAGE SELECTOR
// ==================================================

function LanguageSelector({
  language,
  setLanguage,
  t,
}) {
  const options = [
    {
      code: "de",
      label: "DE",
    },
    {
      code: "fr",
      label: "FR",
    },
    {
      code: "it",
      label: "IT",
    },
    {
      code: "en",
      label: "EN",
    },
  ];

  return (
    <div
      style={
        styles.languageSection
      }
    >
      <div
        style={
          styles.languageLabel
        }
      >
        {
          t.chooseLanguage
        }
      </div>

      <div
        style={
          styles.languageButtons
        }
      >
        {options.map(
          (option) => {
            const active =
              language ===
              option.code;

            return (
              <button
                key={
                  option.code
                }
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
                {
                  option.label
                }
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

// ==================================================
// PROGRESS
// ==================================================

function Progress({
  visited,
  total,
  progress,
  t,
}) {
  return (
    <div
      style={
        styles.progressCard
      }
    >
      <div
        style={
          styles.progressTop
        }
      >
        <div>
          <div
            style={
              styles.progressNumber
            }
          >
            {visited} / {total}
          </div>

          <div
            style={
              styles.progressLabel
            }
          >
            {
              t.boothsVisited
            }
          </div>
        </div>

        <div
          style={
            styles.percent
          }
        >
          {progress}%
        </div>
      </div>

      <div
        style={
          styles.progressBackground
        }
      >
        <div
          style={{
            ...styles.progressBar,

            width:
              `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function Legend({
  color,
  border,
  label,
}) {
  return (
    <div
      style={
        styles.legendItem
      }
    >
      <span
        style={{
          ...styles.legendBox,

          background:
            color,

          border:
            `1px solid ${border}`,
        }}
      />

      <span>
        {label}
      </span>
    </div>
  );
}

// ==================================================
// RECOVERY
// ==================================================

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
    <section
      style={
        styles.recoveryPanel
      }
    >
      <button
        type="button"
        style={
          styles.recoveryToggle
        }
        onClick={() =>
          setOpen(
            !open
          )
        }
      >
        {
          t.recoveryLost
        }
      </button>

      {open && (
        <div
          style={
            styles.recoveryBody
          }
        >
          <div
            style={
              styles.recoveryTitle
            }
          >
            {
              t.recoveryTitle
            }
          </div>

          <p
            style={
              styles.recoveryText
            }
          >
            {
              t.recoveryText
            }
          </p>

          <input
            type="text"
            value={
              value
            }
            placeholder="ABCD-1234"
            autoCapitalize="characters"
            autoComplete="off"
            disabled={
              restoring
            }
            style={
              styles.recoveryInput
            }
            onChange={(
              event
            ) =>
              setValue(
                event.target.value
                  .toUpperCase()
              )
            }
          />

          {message && (
            <div
              style={
                styles.recoveryMessage
              }
            >
              {message}
            </div>
          )}

          <button
            type="button"
            disabled={
              restoring
            }
            style={{
              ...styles.recoveryButton,

              opacity:
                restoring
                  ? 0.65
                  : 1,
            }}
            onClick={
              onRestore
            }
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

// ==================================================
// GOODIE BAG
// ==================================================

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
      required -
        visited,
      0
    );

  const goodieProgress =
    Math.min(
      visited /
        required,
      1
    ) * 100;

  return (
    <section
      style={
        styles.goodieCard
      }
    >
      <div
        style={
          styles.goodieIcon
        }
      >
        🎁
      </div>

      <div
        style={
          styles.goodieTitle
        }
      >
        {t.goodieBag}
      </div>

      {collected ? (
        <div
          style={
            styles.goodieCollected
          }
        >
          {
            t.goodieCollected
          }
        </div>
      ) : eligible ? (
        <>
          <div
            style={
              styles.goodieUnlocked
            }
          >
            {
              t.goodieReady
            }
          </div>

          <div
            style={
              styles.goodieText
            }
          >
            {TEST_MODE
              ? t.testGoodieReady
              : t.goodieLiveReady(
                  visited
                )}
          </div>
        </>
      ) : (
        <>
          <div
            style={
              styles.goodieText
            }
          >
            {TEST_MODE
              ? t.testGoodieInstruction
              : t.liveGoodieInstruction}
          </div>

          <div
            style={
              styles.goodieCount
            }
          >
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

          <div
            style={
              styles.goodieRemaining
            }
          >
            {remaining ===
            1
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
          disabled={
            !eligible
          }
          onClick={
            onCollect
          }
          style={{
            ...styles.goodieButton,

            ...(eligible
              ? styles.goodieButtonActive
              : styles.goodieButtonDisabled),
          }}
        >
          {
            t.collectGoodie
          }
        </button>
      )}
    </section>
  );
}

// ==================================================
// SCANNER
// ==================================================

function Scanner({
  scanTarget,
  status,
  scannerSectionRef,
  onClose,
  t,
}) {
  const label =
    scanTarget.type ===
    "goodie"
      ? t.goodieBag
      : scanTarget
          .booth
          .name;

  return (
    <div
      ref={
        scannerSectionRef
      }
      style={
        styles.scannerCard
      }
    >
      <div
        style={
          styles.scannerHeader
        }
      >
        <div>
          <div
            style={
              styles.scannerTitle
            }
          >
            {t.scanQr}
          </div>

          <div
            style={
              styles.scannerSubtitle
            }
          >
            {label}
          </div>
        </div>

        <div
          style={
            styles.scannerBadge
          }
        >
          QR
        </div>
      </div>

      <div
        style={
          styles.scannerStatus
        }
      >
        {status}
      </div>

      <div
        id="qr-reader-region"
        style={
          styles.scannerRegion
        }
      />

      <button
        type="button"
        style={
          styles.secondaryButton
        }
        onClick={
          onClose
        }
      >
        {t.close}
      </button>
    </div>
  );
}

// ==================================================
// GOODIE APPROVED SCREEN
// ==================================================

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
    <div
      style={
        styles.goodieApprovedScreen
      }
    >
      <div
        style={
          styles.goodieApprovedContent
        }
      >
        <div
          style={
            styles.goodieApprovedCheck
          }
        >
          ✓
        </div>

        <div
          style={
            styles.goodieApprovedEyebrow
          }
        >
          {
            t.goodieApprovedEyebrow
          }
        </div>

        <h1
          style={
            styles.goodieApprovedTitle
          }
        >
          {t.approved}
        </h1>

        <div
          style={
            styles.goodieApprovedName
          }
        >
          {
            user.firstname
          }{" "}
          {
            user.lastname
          }
        </div>

        <div
          style={
            styles.goodieApprovedProgress
          }
        >
          {TEST_MODE
            ? t.testApproval
            : t.boothsVisitedApproval(
                visited,
                total
              )}
        </div>

        <div
          style={
            styles.goodieApprovedInstruction
          }
        >
          {
            t.mayHandOver
          }
        </div>

        {error && (
          <div
            style={
              styles.goodieApprovalError
            }
          >
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={
            working
          }
          style={{
            ...styles.goodieReceivedButton,

            opacity:
              working
                ? 0.7
                : 1,
          }}
          onClick={
            onReceived
          }
        >
          {working
            ? t.confirmingGoodie
            : t.goodieReceived}
        </button>
      </div>
    </div>
  );
}

// ==================================================
// FINAL THANK-YOU SCREEN
// ==================================================

function GoodieSuccessScreen({
  onDone,
  t,
}) {
  return (
    <div
      style={
        styles.goodieSuccessScreen
      }
    >
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

      <div
        style={
          styles.goodieSuccessContent
        }
      >
        <img
          src="/impo_logo.png"
          alt={
            t.logoAlt
          }
          style={
            styles.goodieFinalLogo
          }
        />

        <h1
          style={
            styles.goodieThankYou
          }
        >
          {t.thankYou}
        </h1>

        <div
          className="goodie-panorama"
          style={
            styles.goodiePanorama
          }
          role="img"
          aria-label={
            t.panoramaAlt
          }
        />

        <button
          type="button"
          style={
            styles.goodieDoneButton
          }
          onClick={
            onDone
          }
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
    padding: "26px 20px 50px",
  },

  jubiLogoWrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "4px 0 30px",
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
    margin: "12px 0 30px",
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
    boxSizing: "border-box",
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
    padding: "28px 20px 60px",
  },

  eyebrow: {
    margin: 0,
    color: RED,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1.2px",
  },

  passTitle: {
    margin: "6px 0 8px",
    fontSize: 34,
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  intro: {
    margin: "12px 0 26px",
    color: "#666666",
    fontSize: 16,
    lineHeight: 1.5,
  },

  progressCard: {
    padding: 20,
    margin: "26px 0 28px",
    borderRadius: 14,
    background: RED,
    color: "#FFFFFF",
  },

  progressTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    margin: "6px 0 14px",
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
    boxSizing: "border-box",
    padding: 0,
    margin: 0,
    outline: "none",
    cursor: "pointer",
    WebkitTapHighlightColor:
      "transparent",
    transition:
      "background 0.2s ease, border 0.2s ease",
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
    display: "inline-block",
    padding: "6px 10px",
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
    background: "transparent",
    color: "#999999",
    fontSize: 12,
    textDecoration: "underline",
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
    margin: "6px 0 12px",
    color: "#777777",
    fontSize: 13,
    lineHeight: 1.4,
  },

  recoveryInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: 14,
    border:
      `1px solid ${BORDER}`,
    borderRadius: 8,
    background: "#FFFFFF",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "2px",
    textAlign: "center",
    textTransform: "uppercase",
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
    textTransform: "uppercase",
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
    margin: "7px auto 0",
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
    justifyContent: "space-between",
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
    padding: "0 8px",
    borderRadius: 8,
    background: RED,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: 800,
  },

  scannerStatus: {
    margin: "10px 0 14px",
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
    margin: "0 auto 26px",
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
    margin: "6px 0 30px",
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
    margin: "34px 0 28px",
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
    padding: "34px 0",
    textAlign: "center",
  },

  goodieFinalLogo: {
    width: 90,
    display: "block",
    margin: "0 auto 30px",
  },

  goodieThankYou: {
    maxWidth: 360,
    margin: "0 auto 36px",
    padding: "0 24px",
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
    margin: "34px auto 0",
    border: 0,
    borderRadius: 8,
    background: RED,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
};
