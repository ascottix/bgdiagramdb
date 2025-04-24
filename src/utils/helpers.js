/*
    Backgammon diagram database
    Miscellaneous utilities
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
import { t } from './lang.js';
import { Settings, app } from '../app.js';
import { BgDiagram } from 'https://cdn.jsdelivr.net/gh/ascottix/bgdiagram@v1.0.3/dist/bgdiagram.min.js';

const ClickEvent = 'click';
const HiddenModalEvent = 'hidden.bs.modal';
const ShownModalEvent = 'shown.bs.modal';

/**
 * Shows a modal and resolves a promise based on user action.
 *
 * @param {HTMLElement} modalElement - The modal element to be shown.
 * @param {Function} validateAction - A function to validate the action taken by the user.
 * @returns {Promise<string>} - Resolves with the action taken (empty string if the modal is closed).
 */
export async function showModal(modalElement, validateAction = () => true) {
    return new Promise((resolve) => {
        const modal = new window.bootstrap.Modal(modalElement);

        // Handle focusing on the first input field when the modal is shown
        function onModalShown() {
            modalElement.querySelector('input, select, textarea')?.focus();
        }

        modalElement.addEventListener(ShownModalEvent, onModalShown);

        // Handle clicking on a button
        function onButtonClick(event) {
            if (event.target.tagName != 'BUTTON') return;

            const action = event.target.getAttribute('data-action');

            if (validateAction(action)) {
                resolve(action);
                modal.hide();
            }
        }

        modalElement.addEventListener(ClickEvent, onButtonClick);

        // Handle the closing event
        function onModalHidden() {
            // Cleanup
            modalElement.removeEventListener(ClickEvent, onButtonClick);
            modalElement.removeEventListener(HiddenModalEvent, onModalHidden);
            modalElement.removeEventListener(ShownModalEvent, onModalShown);

            resolve(''); // This is ignored if the promise has already been resolved
        }

        modalElement.addEventListener(HiddenModalEvent, onModalHidden);

        // Show the modal
        modal.show();
    });
}

/**
 * Sets or removes a class from an element based on a condition.
 *
 * @param {HTMLElement} element - The element to which the class will be added or removed.
 * @param {string} className - The class name to be added or removed.
 * @param {boolean} condition - The condition to determine whether to add or remove the class.
 */
export function setClass(element, className, condition) {
    if (element) {
        if (condition) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }
}

/**
 * Extracts data attributes from an element and returns them as an object.
 *
 * @param {HTMLElement} element - The element from which data attributes will be extracted.
 * @returns {Object} - An object containing the data attributes.
 */
export function getDataAttributes(element) {
    const data = {};

    if (element) {
        for (const attr of element.attributes) {
            if (attr.name.startsWith('data-')) {
                data[attr.name.substring(5)] = attr.value;
            }
        }
    }

    return data;
}

const TooltipOptions = {
    delay: { show: 500, hide: 100 }
};

/**
 * Initializes tooltips for elements with a title attribute.
 *
 * @param {HTMLElement} element - The container element within which tooltips will be initialized.
 */
export function initTooltips(element, options = {}) {
    element.querySelectorAll('[title]').forEach(e => {
        new window.bootstrap.Tooltip(e, { ...TooltipOptions, ...options });
    });
}

/**
 * Destroys tooltips for elements with a title attribute.
 *
 * @param {HTMLElement} element - The container element within which tooltips will be destroyed.
 */
export function destroyTooltips(element) {
    element.querySelectorAll('[title]').forEach(e => {
        window.bootstrap.Tooltip.getInstance(e)?.dispose();
    });
}

/**
 * Removes any visible tooltip.
 */
export function removeTooltip() {
    const tooltip = document.querySelector('.tooltip');

    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Shows a toast message with a specified type and delay.
 *
 * @param {string} message - The message to be displayed in the toast.
 * @param {string} [type="primary"] - The type of the toast (e.g., primary, success, danger).
 * @param {number} [delay=3000] - The delay in milliseconds before the toast disappears.
 */
export function showToast(message, type = 'success', delay = 3000) {
    const container = document.getElementById('toast-container');

    const isAlert = (type == 'warning') || (type == 'danger');

    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', isAlert ? 'alert' : 'status');
    toast.setAttribute('aria-live', isAlert ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('data-bs-delay', delay);

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="${t('close')}"></button>
      </div>
    `;

    // Add to container and show
    container.appendChild(toast);

    const bsToast = new window.bootstrap.Toast(toast);

    bsToast.show();
}

function simpleHashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
}

export function getAutoThemeFromXgid(xgid) {
    const Themes = ['serene-sky', 'petal-pink', 'aqua-green', 'soft-lavender', 'delicate-coral'];

    return 'bgdiagram__theme--' + Themes[simpleHashCode(xgid) % Themes.length];
}

/**
 * Converts an XGID string to an SVG representation.
 *
 * @param {string} xgid - The XGID string representing the backgammon position.
 * @param {Object} [options={}] - Additional options for the SVG conversion.
 * @returns {string} - The SVG representation of the backgammon position.
 */
export function xgidToSvg(xgid, options = {}) {
    options.homeOnLeft = app.settings[Settings.BgdHomeBoardAtLeft];

    const svg = BgDiagram.fromXgid(xgid, options);

    return svg;
}

/**
 * Exports data as a JSON file with the specified filename.
 *
 * @param {Object} data - The data to be exported.
 * @param {string} filename - The name of the file to be created.
 */
export function downloadDataAsJson(data, filename) {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Create a Blob object
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a link element to start the download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);

    // Start the download
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

/**
 * Copies the provided text to the clipboard.
 *
 * @param {string} text - The text to be copied to the clipboard.
 */
export function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(resolve).catch(reject);
        } else {
            reject(new Error('Clipboard API is not available.'));
        }
    });
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 *
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array (same as input).
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Converts a time interval in seconds to a human-readable string.
 *
 * @param {number} seconds - The time interval in seconds.
 * @returns {string} The human-readable string representation of the time interval.
 */
export function humanizeTimeInterval(seconds) {
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(seconds / 3600);
    const days = Math.round(seconds / 86400);
    const weeks = Math.round(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 60) {
        return '< ' + t('{minutes}', { minutes });
    } else if (hours < 24) {
        return t('{hours}', { hours });
    } else if (days < 14) {
        return t('{days}', { days });
    } else if (days < 49) { // 7 settimane
        return t('{weeks}', { weeks });
    } else if (days < 365) {
        return '> ' + t('{months}', { months });
    } else {
        const halfYears = Math.round((days % 365) / 182.5) * 0.5; // 182.5 ≈ half year
        return t('{years}', { years: years + halfYears });
    }
}

export function wrapTextOnSpaces(text, wordWrapSize) {
    const words = text.split(/\s+/); // Split by any whitespace
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        if (currentLine.length == 0) {
            currentLine = word;
        } else if (currentLine.length + 1 + word.length <= wordWrapSize) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    return lines;
}

export function openAnalysis(xgid) {
    const params = [];

    function addParam(name, value) {
        value && params.push(`${name}=${encodeURIComponent(value)}`);
    }

    addParam('xgid', xgid);
    addParam('d', 2);
    addParam('_ts', Date.now());
    addParam('lang', app.settings[Settings.AppLanguage]);
    addParam('appTheme', app.settings[Settings.AppTheme]);
    addParam('bgdTheme', app.settings[Settings.BgdTheme]);

    const bgdHL = app.settings[Settings.BgdHomeBoardAtLeft];
    if (bgdHL) {
        addParam('bgdHL', 1);
    }

    const currentDir = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    const url = currentDir + 'analysis.html?' + params.join('&');

    window.open(url, 'bgddb-analysis');
}
