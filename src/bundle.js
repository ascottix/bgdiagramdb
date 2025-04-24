/*
    Backgammon diagram database
    Main script
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
import { app } from './app.js';
import { removeQueryFromHash, setActivePage, showPage } from './utils/router.js';

// Register web components
import './components/app-navbar.js';
import './pages/page-home.js';
import './pages/page-collections.js';
import './pages/page-positions.js';
import './pages/page-settings.js';
import './pages/page-test.js';
import './pages/page-train-pipcount.js';
import './pages/page-train-positions.js';

// Initialization
document.addEventListener('DOMContentLoaded', async function () {
    await app.init();

    // Add routing listener
    const onHashChange = (defaultPage) => {
        const hash = removeQueryFromHash(location.hash);
        const page = hash.substring(1) || defaultPage || 'home';
        showPage(page);
    };

    window.addEventListener('hashchange', onHashChange);

    // Fix aria issue with Bootstrap modals
    window.addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    });

    // Add the navbar
    document.getElementById('navbar').innerHTML = '<app-navbar></app-navbar>';

    // Show the home panel by default
    onHashChange('home');
});
