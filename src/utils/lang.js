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
import { EnCatalog } from './lang-en.js';
import { ItCatalog } from './lang-it.js';

export const DataTranslate = 'data-translate';

const catalog = {};

function onCatalogLoaded(lang) {
    catalog[lang].pluralRules = new Intl.PluralRules(lang, { type: 'cardinal' });
    catalog[lang].messages._githubHomepageLink = '<a href="https://github.com/" target="_blank" rel="noopener">GitHub</a>';
}

// Preload English and Italian
catalog.en = EnCatalog;
catalog.it = ItCatalog;
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
 *
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
