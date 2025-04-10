/*
    Backgammon diagram database
    Home page
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
import { t } from '../utils/lang.js';

class PageHome extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
<h1 class="mb-4">${t('home-page-header')}</h1>
<h2 class="h3">${t('home-page-subheader')}</h2>
<p>${t('home-page-text')}</p>
        `;
    }

    async connectedCallback() {
    }
}

customElements.define('page-home', PageHome);
