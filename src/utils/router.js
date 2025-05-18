/*
    Backgammon diagram database
    Routing utilities
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
import { openAnalysisWindow, removeTooltip } from './helpers.js';

/**
 * Removes the query string from the hash part of the URL.
 *
 * @param {string} hash - The hash string from which the query will be removed.
 * @returns {string} - The hash string without the query.
 */
export function removeQueryFromHash(hash) {
    return hash.split('?')[0];
}

/**
 * Retrieves query parameters from the hash part of the URL.
 *
 * @returns {Object} - An object containing the query parameters.
 */
export function getQueryParams() {
    const params = {};
    const query = window.location.hash.split('?')[1] || '';
    const pairs = query.split('&').filter(p => p);

    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = value;
    });

    return params;
}

/**
 * Sets query parameters in the hash part of the URL.
 *
 * @param {Object} params - An object containing the query parameters to be set.
 */
export function setQueryParams(params) {
    const query = Object.keys(params)
        .filter(key => params[key])
        .map(key => `${key}=${params[key]}`)
        .join('&');
    const hash = window.location.hash.split('?')[0];
    history.replaceState(null, '', `${hash}?${query}`);
}

/**
 * Updates query parameters in the hash part of the URL.
 * @param {Object} params - An object containing the query parameters to be updated.
 */
export function updateQueryParams(params) {
    setQueryParams({ ...getQueryParams(), ...params });
}

/**
 * Shows a specific page by updating the page content.
 *
 * @param {string} page - The page identifier to be shown.
 */
export function showPage(page) {
    // Make sure no tooltip is hanging around
    removeTooltip();

    // Set the page content
    document.getElementById('page').innerHTML = `<page-${page}></page-${page}>`;
}

/**
 * Sets the active page by updating the hash part of the URL.
 *
 * @param {string} page - The page identifier to be set as active.
 */
export function setActivePage(page) {
    if(page == 'analyze') {
        // This opens in a different window
        openAnalysisWindow();
    } else {
        location.hash = '#' + page;
    }
}
