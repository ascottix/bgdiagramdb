/*
    Backgammon diagram database
    Language management
    Copyright (c) 2025 Alessandro Scotti

    This file is part of BgDiagramDb.

    BgDiagramDb is free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    BgDiagramDb is distributed in the hope that it will be useful, but WITHOUT ANY
    WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
    PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with
    BgDiagramDb. If not, see <https://www.gnu.org/licenses/>.
*/
import { app } from '../app.js';

export const DataTranslate = 'data-translate';

const catalog = {
    "en": {
        "messages": {
            "add": "Add",
            "all": "All",
            "actions": "Actions",
            "back-to-grid": "Back to positions list",
            "bold": "Bold",
            "cancel": "Cancel",
            "category": "Category",
            "choose-collection": "Choose a collection",
            "close": "Close",
            "collection": "Collection",
            "collections": "Collections",
            "comment": "Comment",
            "confirm": "Confirm",
            "confirm-delete-collection": "Are you sure you want to delete the collection <b>{name}</b>? It contains {positions}.",
            "confirm-delete-position": "Are you sure you want to delete the position <b>{name}</b>? It will also be removed from collection <b>{coll}</b>.",
            "continue": "Continue",
            "create": "Create",
            "create-new-collection": "Create",
            "db-empty": "Your database is empty.",
            "db-summary": "Your database contains {collections} and {positions}.",
            "delete": "Delete",
            "description": "Description",
            "diagram": "Diagram",
            "edit": "Edit",
            "edit-collection": "Edit collection",
            "edit-position": "Edit position",
            "enter-valid-xgid": "Enter a valid XGID to generate a diagram.",
            "error": "Error",
            "error-import-collection": "Could not import the collection. Error: {error}",
            "error-import-collection-duplicate": "Could not import the collection, because a collection named <b>{name}</b> already exists. You should rename or delete it before trying again.",
            "error-import-collection-version": "Could not import the data, because it was created with a newer version of the application. Please update the application and try again.",
            "error-restore-backup": "Could not restore the backup. Error: {error}",
            "error-restore-backup-data": "The backup data is missing or invalid. Make sure you selected a valid backup file and try again.",
            "error-restore-backup-version": "Could not restore the backup, because it was created with a newer version of the application. Please update the application and try again.",
            "export": "Export",
            "field-required": "This field is required.",
            "heading1": "Heading 1",
            "heading2": "Heading 2",
            "heading3": "Heading 3",
            "hide-pipcount": "Hide pipcount",
            "hide-point-numbers": "Hide point numbers",
            "home": "Home",
            "home-board-left": "Home board on the left",
            "home-page-header": "Hello, welcome to BgDiagramDb!",
            "home-page-subheader": "Improve your backgammon, one position at a time.",
            "home-page-text": "This app helps you collect, study, and review backgammon positions—from your own mistakes to problems from books, videos, and online matches.<br></br>Organize positions into custom collections, add tags to find them easily, and study them Anki-style: with interactive diagrams, questions and answers, and a spaced repetition system for long-term memory.<br></br>Practice your pip counting too, and track your progress.<br></br>All directly in your browser, with your data stored locally.",
            "horiz-rule": "Horizontal rule",
            "import": "Import",
            "invalid-xgid": "Invalid XGID.",
            "italic": "Italic",
            "language": "Language",
            "left": "Left",
            "link": "Link",
            "list": "List",
            "loading": "Loading...",
            "markdown-guide-link": "Guide (external link)",
            "name": "Name",
            "new-collection": "New collection",
            "new-position": "New position",
            "next": "Next",
            "numbered-list": "Numbered list",
            "ok": "Ok",
            "optional-question": "If present, this question will be used in the {#train}: {#train-positions} section.",
            "position-i-of-n": "Position {i} of {n}",
            "positions": "Positions",
            "positions-found": "{positions} found.",
            "positions-page-nav": "Navigation for the positions grid",
            "previous": "Previous",
            "question": "Question",
            "right": "Right",
            "save": "Save",
            "settings": "Settings",
            "settings-about": "About",
            "settings-about-text": "BgDiagramDb is distributed as free software under the <a href='https://www.gnu.org/licenses/gpl-3.0.en.html' target='_blank' rel='noopener'>GNU General Public License v3.0</a>.<p><p>The source code is freely available, modifiable, and redistributable under the terms of the license. The project is hosted on {#_githubHomepageLink}.",
            "settings-about-acknowledgements": "Credits",
            "settings-about-acknowledgements-text": "BgDiagramDb makes use of the following components:",
            "settings-about-ack-bgdiagram": "Library for SVG diagrams of backgammon positions.",
            "settings-about-ack-bootstrap": "CSS framework for responsive layouts and UI components.",
            "settings-about-ack-dompurify": "DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG.",
            "settings-about-ack-marked": "Fast and flexible Markdown parser written in JavaScript.",
            "settings-about-contacts": "Contacts",
            "settings-about-contacts-text": "For feedback or bug reports, please visit the project page on {#_githubHomepageLink}.",
            "settings-general": "General",
            "settings-train-pos": "{#train}",
            "settings-diagrams": "Diagrams",
            "settings-backup-restore": "Backup and restore",
            "settings-backup-restore-intro": "You can save a copy of your data or restore it from a backup file.",
            "settings-backup": "Download backup",
            "settings-restore": "Restore backup",
            "settings-fsrs-advanced-note": "Advanced settings are recommended only if you are already familiar with Anki and spaced repetition algorithms.",
            "settings-fsrs-max-cards-per-session": "Total positions per session (limit)",
            "settings-fsrs-max-new-cards-per-session": "New positions per session (limit)",
            "settings-fsrs-rating-ui": "Rating system",
            "settings-fsrs-rating-ui-advanced": "Advanced",
            "settings-fsrs-rating-ui-standard": "Standard",
            "settings-fsrs-retention": "Desired retention level",
            "settings-fsrs-retention-80": "Standard (less reviews)",
            "settings-fsrs-retention-85": "Strong",
            "settings-fsrs-retention-90": "High",
            "settings-fsrs-retention-95": "Maximum (more reviews)",
            "show-answer": "Show answer",
            "size": "Size",
            "start": "Start",
            "strikethrough": "Strikethrough",
            "table": "Table",
            "theme": "Theme",
            "theme-auto": "Auto",
            "theme-dark": "Dark",
            "theme-light": "Light",
            "title": "Title",
            "toast-collection-deleted": "Collection <b>{name}</b> deleted.",
            "toast-collection-imported": "Collection <b>{name}</b> imported.",
            "toast-collection-updated": "Collection <b>{name}</b> updated.",
            "toast-copied-to-clipboard": "Copied to clipboard.",
            "toast-database-restored": "Backup restored successfully.",
            "toast-position-added": "Position added.",
            "toast-position-deleted": "Position deleted.",
            "toast-position-updated": "Position updated.",
            "tooltip-delete-collection": "Delete this collection and all the positions it contains",
            "tooltip-delete-position": "Delete this position",
            "tooltip-edit-collection": "Edit this collection name and description",
            "tooltip-edit-position": "Edit this position",
            "tooltip-export-collection": "Export this collection to a file",
            "tooltip-preview-arrow": "Show the move with arrows",
            "tooltip-preview-board": "Show the move on the board",
            "tooltip-train-pip-time-stats": "Answer time: average / min - max",
            "tooltip-view-collection": "View this collection content",
            "train": "Training",
            "train-pipcount": "Pipcount",
            "train-pip-caption": "Want to improve your speed and accuracy when counting pips? This mode helps you practice quickly and effectively!",
            "train-pip-comment": "#### Top player:\n# {bpc} ({bpdiff})\n<br/>\n\n#### Bottom player:\n# {wpc} ({wpdiff})",
            "train-pip-intro": "You'll be shown a random backgammon position: your goal is to count the pips for both players without any help.<p><p>Once you think you’ve got it, click <span class='badge bg-primary'><i class='bi bi-eye'></i> {#show-answer}</span> to reveal the correct count.<p>Then mark whether your answer was correct or wrong to track your progress.<p>At the top right, you'll see your session stats: number of positions viewed and your timing (average, fastest, and slowest).<p>When you're ready, hit <span class='badge bg-primary'><i class='bi bi-arrow-right'></i> {#start}</span> to begin!",
            "train-pip-question": "How many pips?",
            "train-pip-rate-wrong": "Almost...",
            "train-pip-rate-right": "On point!",
            "train-positions": "Positions",
            "train-pos-advanced-note": "<strong>Note:</strong> you’re using the <strong>Advanced</strong> interface.<p><p>After each answer, you’ll choose from <strong>four options</strong>: <em>{#train-pos-rate-again}</em> if you got it wrong, or <em>{#train-pos-rate-hard}</em>, <em>{#train-pos-rate-good}</em>, or <em>{#train-pos-rate-easy}</em> if you were correct, depending on how difficult it was to recall.<p class=mb-0>Each option also shows the <strong>estimated time</strong> before you'll see the position again.",
            "train-pos-back-home": "Back to {#train}: {#train-positions}",
            "train-pos-caption": "Recognizing the right positions can make the difference! With this training, you’ll sharpen your memory and fine-tune your intuition, step by step.",
            "train-pos-intro-toggle": "How does it work?",
            "train-pos-intro": "You’ll be shown positions taken from your collections, often accompanied by a question or a short description. Your task is to decide the best move: it could be offering or accepting the cube, or choosing between different plays.<p><p>Once you've made your decision, click <span class='badge bg-primary'><i class='bi bi-eye'></i> {#show-answer}</span> to reveal the solution.Then mark whether your answer was correct or wrong — this helps the system understand how well you’ve memorized the position.<p>Positions aren’t shown at random: they’re selected using a spaced repetition algorithm designed to help you memorize key patterns and retain them over time. If you make a mistake, the position will come back soon. If you get it right, you’ll see it again later, with longer and longer intervals.<p>The goal isn’t just to get the right answer once — it’s to recognize key situations at a glance.<p>The session ends automatically when there are no more positions to review. At the end, you’ll see a summary of your progress.<p>When you’re ready, choose what to study and hit <span class='badge bg-primary'><i class='bi bi-arrow-right'></i> {#start}</span> to begin!",
            "train-pos-rate-again": "Again",
            "train-pos-rate-hard": "Hard",
            "train-pos-rate-good": "Good",
            "train-pos-rate-easy": "Easy",
            "train-pos-rate-simple-again": "Missed...",
            "train-pos-rate-simple-good": "Got it!",
            "train-pos-session-preview": "New: <b>{newcards}</b>, to review: <b>{duecards}</b>",
            "train-pos-session-summary": "You have studied {totalCards:positions} (<b>{newCards}</b> new, <b>{reviewCards}</b> reviewed) in {sessionDurationMin:minutes}.",
            "train-pos-no-more-positions": "There are no more positions to study for now, check back later to keep training!",
            "unit-seconds": "{n}s",
            "warning": "Warning",
            "warning-restore-backup": "<strong>Warning:</strong> restoring a backup will delete all current data and replace it with the contents of the selected file.<p>This operation is <strong>irreversible</strong>.</p><p>To continue, type <kbd>ok</kbd> in the field below and press <strong>{#continue}</strong>.</p>",
            "well-done": "Well done!",
            "write-here": "Write here...",
            "write-ok-to-continue": "Write ok to continue"
        },
        "params": {
            "collections": {
                "one": "<b>{n}</b> collection",
                "other": "<b>{n}</b> collections"
            },
            "days": {
                "one": "{n} day",
                "other": "{n} days"
            },
            "hours": {
                "one": "{n} hour",
                "other": "{n} hours"
            },
            "minutes": {
                "one": "{n} minute",
                "other": "{n} minutes"
            },
            "months": {
                "one": "{n} month",
                "other": "{n} months"
            },
            "positions": {
                "one": "<b>{n}</b> position",
                "other": "<b>{n}</b> positions"
            },
            "weeks": {
                "one": "{n} week",
                "other": "{n} weeks"
            },
            "years": {
                "one": "{n} year",
                "other": "{n} years"
            }
        }
    },
    "it": {
        "messages": {
            "add": "Aggiungi",
            "all": "Tutte",
            "actions": "Azioni",
            "back-to-grid": "Torna alla lista delle posizioni",
            "bold": "Grassetto",
            "cancel": "Annulla",
            "continue": "Continua",
            "category": "Categoria",
            "choose-collection": "Scegli una raccolta",
            "close": "Chiudi",
            "collection": "Raccolta",
            "collections": "Raccolte",
            "comment": "Commento",
            "confirm": "Conferma",
            "confirm-delete-collection": "Vuoi davvero eliminare la raccolta <b>{name}</b>? Contiene {positions}.",
            "confirm-delete-position": "Vuoi davvero eliminare la posizione <b>{name}</b>? Sarà rimossa anche dalla raccolta <b>{coll}</b>.",
            "create": "Crea",
            "create-new-collection": "Crea",
            "db-empty": "Il tuo database è vuoto.",
            "db-summary": "Il tuo database contiene {collections} e {positions}.",
            "delete": "Elimina",
            "description": "Descrizione",
            "diagram": "Diagramma",
            "edit": "Modifica",
            "edit-collection": "Modifica raccolta",
            "edit-position": "Modifica posizione",
            "enter-valid-xgid": "Inserisci un XGID valido per generare un diagramma.",
            "error": "Errore",
            "error-import-collection": "Non è stato possibile importare la raccolta",
            "error-import-collection-generic": "{#error-import-collection}. Errore: {error}",
            "error-import-collection-duplicate": "{#error-import-collection}, perché esiste già una raccolta chiamata <b>{name}</b>. Dovresti rinominarla o eliminarla prima di provare ancora.",
            "error-import-collection-version": "{#error-import-collection}, perché sono stati creati con una versione più recente dell'applicazione. Aggiorna l'applicazione e riprova.",
            "error-restore-backup": "Non è stato possibile ripristinare il backup. Errore: {error}",
            "error-restore-backup-data": "Dati di backup mancanti o non validi. Assicurati di selezionare un file di backup valido e riprova.",
            "error-restore-backup-version": "Non è stato possibile ripristinare il backup, perché è stato creato con una versione più recente dell'applicazione. Aggiorna l'applicazione e riprova.",
            "export": "Esporta",
            "field-required": "Questo campo è obbligatorio.",
            "heading1": "Intestazione 1",
            "heading2": "Intestazione 2",
            "heading3": "Intestazione 3",
            "hide-pipcount": "Nascondi il pipcount",
            "hide-point-numbers": "Nascondi gli indicatori delle punte",
            "home": "Home",
            "home-board-left": "Casa a sinistra",
            "home-page-header": "Ciao, benvenuto in BgDiagramDb!",
            "home-page-subheader": "Migliora il tuo backgammon, una posizione alla volta.",
            "home-page-text": "Questa app ti aiuta a raccogliere, studiare e ripassare posizioni di backgammon: dai tuoi errori ai problemi tratti da libri, video e partite online.<br></br>Organizza le posizioni in raccolte personalizzate, aggiungi tag per ritrovarle facilmente, e studiale come su Anki: con diagrammi interattivi, domande e risposte, e un sistema di ripasso basato sulla memoria a lungo termine.<br></br>Allenati anche sul pip count, e tieni traccia dei tuoi progressi.<br></br>Tutto direttamente nel tuo browser, con i tuoi dati salvati in locale.",
            "horiz-rule": "Riga orizzontale",
            "import": "Importa",
            "invalid-xgid": "XGID non valido.",
            "italic": "Corsivo",
            "language": "Lingua",
            "left": "Sinistra",
            "link": "Link",
            "list": "Lista",
            "loading": "Caricamento...",
            "markdown-guide-link": "Guida (link esterno)",
            "name": "Nome",
            "new-collection": "Nuova raccolta",
            "new-position": "Nuova posizione",
            "next": "Avanti",
            "numbered-list": "Lista numerata",
            "ok": "Ok",
            "optional-question": "Se presente, questa domanda sarà usata nella sezione {#train}: {#train-positions}.",
            "position-i-of-n": "Posizione {i} di {n}",
            "positions": "Posizioni",
            "positions-found": "{positions-found}.",
            "positions-page-nav": "Navigazione per la griglia delle posizioni",
            "previous": "Precedente",
            "question": "Domanda",
            "right": "Destra",
            "save": "Salva",
            "settings": "Impostazioni",
            "settings-about": "Informazioni",
            "settings-about-text": "BgDiagramDb è distribuito come software libero sotto licenza <a href='https://www.gnu.org/licenses/gpl-3.0.en.html' target='_blank' rel='noopener'>GNU General Public License v3.0</a>.<p><p>Il codice sorgente è liberamente consultabile, modificabile e redistribuibile nel rispetto della licenza. Il progetto è disponibile su {#_githubHomepageLink}.",
            "settings-about-acknowledgements": "Riconoscimenti",
            "settings-about-acknowledgements-text": "BgDiagramDb fa uso dei seguenti componenti:",
            "settings-about-ack-bgdiagram": "Libreria per diagrammi vettoriali di posizioni di backgammon.",
            "settings-about-ack-bootstrap": "Framework CSS per layout responsivi e componenti UI.",
            "settings-about-ack-dompurify": "Sanitizzatore XSS basato su DOM, super veloce e ultra tollerante per HTML, MathML e SVG.",
            "settings-about-ack-marked": "Parser Markdown veloce e flessibile in JavaScript.",
            "settings-about-contacts": "Contatti",
            "settings-about-contacts-text": "Per feedback o segnalazioni, visita la pagina del progetto su {#_githubHomepageLink}.",
            "settings-general": "Generali",
            "settings-train-pos": "{#train}",
            "settings-diagrams": "Diagrammi",
            "settings-backup-restore": "Backup e ripristino",
            "settings-backup-restore-intro": "Puoi salvare una copia dei tuoi dati o ripristinarli da un file di backup.",
            "settings-backup": "Scarica backup",
            "settings-restore": "Ripristina backup",
            "settings-fsrs-advanced-note": "Le impostazioni avanzate sono consigliate solo se hai già familiarità con Anki e con gli algoritmi di ripassi programmati.",
            "settings-fsrs-max-cards-per-session": "Posizioni totali per sessione (limite)",
            "settings-fsrs-max-new-cards-per-session": "Nuove posizioni per sessione (limite)",
            "settings-fsrs-rating-ui": "Sistema di valutazione",
            "settings-fsrs-rating-ui-advanced": "Avanzato",
            "settings-fsrs-rating-ui-standard": "Standard",
            "settings-fsrs-retention": "Livello di memorizzazione desiderato",
            "settings-fsrs-retention-80": "Normale (meno ripassi)",
            "settings-fsrs-retention-85": "Solido",
            "settings-fsrs-retention-90": "Elevato",
            "settings-fsrs-retention-95": "Massimo (più ripassi)",
            "show-answer": "Mostra risposta",
            "size": "Dimensione",
            "start": "Inizia",
            "strikethrough": "Barrato",
            "table": "Tabella",
            "theme": "Tema",
            "theme-auto": "Automatico",
            "theme-dark": "Scuro",
            "theme-light": "Chiaro",
            "title": "Titolo",
            "toast-collection-deleted": "Raccolta <b>{name}</b> eliminata.",
            "toast-collection-imported": "Raccolta <b>{name}</b> importata.",
            "toast-collection-updated": "Raccolta <b>{name}</b> aggiornata.",
            "toast-copied-to-clipboard": "Copiato negli appunti.",
            "toast-database-restored": "Backup ripristinato con successo.",
            "toast-position-added": "Posizione aggiunta.",
            "toast-position-deleted": "Posizione eliminata.",
            "toast-position-updated": "Posizione aggiornata.",
            "tooltip-delete-collection": "Elimina questa raccolta e tutte le posizioni che contiene",
            "tooltip-delete-position": "Elimina questa posizione",
            "tooltip-edit-collection": "Modifica il nome e la descrizione di questa raccolta",
            "tooltip-edit-position": "Modifica questa posizione",
            "tooltip-export-collection": "Esporta questa raccolta in un file",
            "tooltip-preview-arrow": "Mostra la mossa con le frecce",
            "tooltip-preview-board": "Mostra la mossa sul board",
            "tooltip-train-pip-time-stats": "Tempo di risposta: medio / min - max",
            "tooltip-view-collection": "Guarda il contenuto di questa raccolta",
            "train": "Allenamento",
            "train-pipcount": "Pipcount",
            "train-pip-caption": "Vuoi migliorare la tua velocità e precisione nel contare i pip? Questa modalità ti aiuta a farlo in modo semplice ed efficace!",
            "train-pip-comment": "#### Giocatore in alto:\n# {bpc} ({bpdiff})\n<br/>\n\n#### Giocatore in basso:\n# {wpc} ({wpdiff})",
            "train-pip-intro": "Ti verrà mostrata una posizione casuale di backgammon: il tuo obiettivo è contare i pip di ciascun giocatore senza aiuti. Quando pensi di avere la risposta, clicca su <span class='badge bg-primary'><i class='bi bi-eye'></i> {#show-answer}</span> per vedere il conteggio corretto.<p><p>Poi indica se la tua risposta era giusta o sbagliata per tenere traccia dei tuoi progressi.<p>In alto a destra troverai le statistiche della tua sessione: quante posizioni hai visto e i tuoi tempi (medio, minimo e massimo).<p>Quando sei pronto, premi <span class='badge bg-primary'><i class='bi bi-arrow-right'></i> {#start}</span> per cominciare!",
            "train-pip-question": "Quanti sono i pip dei giocatori?",
            "train-pip-rate-wrong": "Quasi...",
            "train-pip-rate-right": "Perfetto!",
            "train-positions": "Posizioni",
            "train-pos-advanced-note": "<strong>Nota:</strong> stai usando l’interfaccia <strong>Avanzata</strong>.<p><p>Dopo ogni risposta potrai scegliere tra <strong>quattro opzioni</strong>: <em>{#train-pos-rate-again}</em> se hai sbagliato, oppure <em>{#train-pos-rate-hard}</em>, <em>{#train-pos-rate-good}</em> o <em>{#train-pos-rate-easy}</em> se hai risposto correttamente, in base a quanto ti è costato ricordarla.<p class=mb-0>Ogni scelta mostra anche il <strong>tempo previsto</strong> prima di rivedere la posizione.",
            "train-pos-back-home": "Torna a {#train}: {#train-positions}",
            "train-pos-caption": "Riconoscere le posizioni giuste può fare la differenza! Con questo allenamento migliori la memoria e affini l’intuito, in modo graduale.",
            "train-pos-intro-toggle": "Come funziona?",
            "train-pos-intro": "Ti verranno presentate posizioni prese dalle tue raccolte, spesso accompagnate da una domanda o una breve descrizione. Il tuo compito è decidere la mossa migliore: potrebbe trattarsi di offrire o accettare il cubo, oppure di scegliere tra diverse mosse.<p><p>Quando hai preso una decisione, clicca su <span class='badge bg-primary'><i class='bi bi-eye'></i> {#show-answer}</span> per scoprire la soluzione. Poi indica se la tua risposta era giusta o sbagliata: questo aiuta il sistema a capire quanto hai memorizzato la posizione.<p>Le posizioni infatti non vengono mostrate a caso: sono selezionate da un algoritmo di <em>ripassi programmati</em>, pensato per aiutarti a memorizzare le situazioni e a ricordarle nel tempo. Se sbagli, la posizione tornerà presto. Se rispondi correttamente, la rivedrai più avanti, con intervalli sempre più lunghi.<p>L’obiettivo non è solo rispondere bene una volta, ma riconoscere le situazioni chiave a colpo d’occhio.<p>La sessione termina automaticamente quando non ci sono più posizioni da rivedere. Al termine, verrà mostrato un riepilogo dei tuoi progressi.<p>Quando sei pronto, scegli cosa studiare e premi <span class='badge bg-primary'><i class='bi bi-arrow-right'></i> {#start}</span> per cominciare!",
            "train-pos-rate-again": "Riprova",
            "train-pos-rate-hard": "Difficile",
            "train-pos-rate-good": "Normale",
            "train-pos-rate-easy": "Facile",
            "train-pos-rate-simple-again": "No...",
            "train-pos-rate-simple-good": "Giusto!",
            "train-pos-session-preview": "Nuove: <b>{newcards}</b>, da rivedere: <b>{duecards}</b>",
            "train-pos-session-summary": "Hai studiato {totalCards:positions} (nuove: <b>{newCards}</b>, ripassate: <b>{reviewCards}</b>) in {sessionDurationMin:minutes}.",
            "train-pos-no-more-positions": "Non ci sono altre posizioni da studiare per ora, ritorna più tardi per continuare ad allenarti!",
            "unit-seconds": "{n}s",
            "warning": "Attenzione",
            "warning-restore-backup": "<strong>Attenzione:</strong> il ripristino di un backup eliminerà tutti i dati attualmente presenti e li sostituirà con quelli contenuti nel file selezionato.<p>Questa operazione è <strong>irreversibile</strong>.</p><p>Per continuare, scrivi <kbd>ok</kbd> nel campo sottostante e premi <strong>{#continue}</strong>.</p>",
            "well-done": "Ben fatto!",
            "write-here": "Scrivi qui...",
            "write-ok-to-continue": "Scrivi ok per continuare"
        },
        "params": {
            "collections": {
                "one": "<b>{n}</b> raccolta",
                "other": "<b>{n}</b> raccolte"
            },
            "days": {
                "one": "{n} giorno",
                "other": "{n} giorni"
            },
            "hours": {
                "one": "{n} ora",
                "other": "{n} ore"
            },
            "minutes": {
                "one": "{n} minuto",
                "other": "{n} minuti"
            },
            "months": {
                "one": "{n} mese",
                "other": "{n} mesi"
            },
            "positions": {
                "one": "<b>{n}</b> posizione",
                "other": "<b>{n}</b> posizioni"
            },
            "positions-found": {
                "one": "<b>{n}</b> posizione trovata",
                "other": "<b>{n}</b> posizioni trovate"
            },
            "weeks": {
                "one": "{n} settimana",
                "other": "{n} settimane"
            },
            "years": {
                "one": "{n} anno",
                "other": "{n} anni"
            }
        }
    }
};

function onCatalogLoaded(lang) {
    catalog[lang].pluralRules = new Intl.PluralRules(lang, { type: 'cardinal' });
    catalog[lang].messages._githubHomepageLink = '<a href="https://github.com/" target="_blank" rel="noopener">GitHub</a>';
}

onCatalogLoaded('en');
onCatalogLoaded('it');

/**
 * Get the default user language based on the browser's language settings.
 *
 * @returns {string} The default language code.
 */
export function getDefaultUserLanguage() {
    const supportedLanguages = Object.keys(catalog);
    const userLang = navigator.language.slice(0, 2);

    return supportedLanguages.includes(userLang) ? userLang : supportedLanguages[0];
}

/**
 * Fetch the language data from the server and add it to the catalog.
 * @param {string} lang - The language code to fetch.
 */
export async function fetchLanguage(lang) {
    if (!catalog[lang]) {
        const response = await fetch(`./lang/${lang}.json`);
        const data = await response.json();

        catalog[lang] = data;

        onCatalogLoaded(lang);
    }
}

/**
 * Translate a message key to the current language, with optional parameters.
 *
 * @param {string} key - The message key to translate.
 * @param {Object} [params] - The parameters for the message.
 * @returns {string} The translated message.
 */
export function t(key, params) {
    const lang = app.settings.appLanguage;
    const data = catalog[lang] || catalog['en'];
    let message = data.messages[key] || key;

    if (params) {
        message = message.replace(/\{(.*?)\}/g, (_, key) => {
            const [keyValue, keyParam] = key.split(':');
            const value = params[keyValue];

            if (typeof value == 'number') {
                // Handle plural rules
                const param = data.params[keyParam || keyValue];

                if (param) {
                    const pluralRule = data.pluralRules.select(value);
                    const pluralForm = param[pluralRule] || param.other;

                    return pluralForm.replace("{n}", value);
                }
            }

            // Standard replacement
            return value;
        });
    }

    // Replace references to other keys
    message = message.replace(/\{#(.*?)\}/g, (_, refKey) => {
        if (data.messages[refKey]) {
            return t(refKey, params);
        } else {
            return `{#${refKey}}`;
        }
    });


    return message;
}

/**
 * Translate all elements within a component that have the data-translate attribute.
 *
 * @param {HTMLElement} component - The component to translate.
 * @param {Object} [params] - The parameters for the translation.
 */
export function translateComponent(component, params) {
    component.querySelectorAll(`[${DataTranslate}]`).forEach((el) => {
        const key = el.getAttribute(DataTranslate);
        el.innerHTML = t(key, params);
    });
}
