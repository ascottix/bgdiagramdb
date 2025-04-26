/*
    Backgammon diagram database
    Fields management
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

export const DataField = 'data-field';

let uniqueIdCounter = 0;

/**
 * Generates a unique ID with an optional prefix.
 *
 * @param {string} [prefix='id'] - The prefix for the unique ID.
 * @returns {string} - The generated unique ID.
 */
export function getUniqueId(prefix = 'id') {
    return `${prefix}-${uniqueIdCounter++}`;
}

/**
 * Sanitizes HTML to prevent XSS attacks.
 *
 * @param {string} html - The HTML string to be sanitized.
 * @returns {string} - The sanitized text content.
 */
export function sanitizeHtml(html, keepTextOnly = true) {
    const options = keepTextOnly ? { ALLOWED_TAGS: [] } : {};

    return window.DOMPurify.sanitize(html, options);
}

export function escapeHtmlAttr(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Populates fields within an element with data.
 *
 * @param {HTMLElement} element - The container element with fields to be populated.
 * @param {Object} data - The data object used to populate the fields.
 */
export function populateFields(element, data = {}) {
    for (const key in data) {
        const field = element.querySelector(`[${DataField}="${key}"]`);

        if (field) {
            if (field.type == 'checkbox') {
                field.checked = data[key];
            } else if ('value' in field) {
                field.value = data[key];
            } else {
                field.innerHTML = data[key];
            }
        }
    }

    clearInvalidElements(element);
}

/**
 * Collects data from fields within an element.
 *
 * @param {HTMLElement} element - The container element with fields to be collected.
 * @returns {Object} - An object containing the collected data.
 */
export function collectFields(element) {
    const sanitize = (s) => typeof s == 'string' ? sanitizeHtml(s.trim(), false) : s;

    const data = {};
    const fields = element.querySelectorAll(`[${DataField}]`);
    fields.forEach(field => {
        const key = field.getAttribute(DataField);
        let val = field.type == 'checkbox' ? field.checked : field.value;

        if (Array.isArray(val)) {
            val = val.map(sanitize);
        } else {
            val = sanitize(val);
        }

        data[key] = val;
    });

    return data;
}

/**
 * Clears invalid elements within a form.
 *
 * @param {HTMLElement} form - The form element containing invalid elements.
 */
export function clearInvalidElements(form) {
    form.querySelectorAll('.is-invalid').forEach(element => {
        element.classList.remove('is-invalid');
    });
}

/**
 * Sets an element as invalid with a message.
 *
 * @param {HTMLElement} element - The element to be marked as invalid.
 * @param {string} message - The validation message to be displayed.
 */
export function setElementInvalid(element, message) {
    element.classList.add('is-invalid');
    element.nextElementSibling.innerHTML = message;
}

/**
 * Validates fields within an element using a custom validator function,
 * marking invalid fields and displaying error messages.
 *
 * @param {HTMLElement} element - The container element with fields to be validated.
 * @param {Function} validator - The custom validator function.
 * @returns {boolean} - Returns true if validation passes, otherwise false.
 */
export function validateFields(element, validator) {
    const data = collectFields(element);
    const errors = []; // Array of objects like { field: 'message' }

    validator(data, errors);

    clearInvalidElements(element);

    errors.forEach(error => {
        const key = Object.keys(error)[0];
        const field = element.querySelector(`[${DataField}="${key}"]`);
        setElementInvalid(field, error[key] || t('field-required'));
    });

    return errors.length == 0;
}
