/*
    Backgammon diagram database
    Message catalog for English
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
export const EnCatalog = {
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
        "error-import-collection": "Could not import the collection",
        "error-import-collection-generic": "{#error-import-collection}. Error: {error}",
        "error-import-collection-duplicate": "{#error-import-collection}, because a collection named <b>{name}</b> already exists. You should rename or delete it before trying again.",
        "error-import-collection-version": "{#error-import-collection}, because it was created with a newer version of the application. Please update the application and try again.",
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
};
