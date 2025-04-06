/*
    Backgammon diagram database
    Test page
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

// This page is not part of the app UI, it's used for internal testing only
class PageTest extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
<h1>Test page</h1>
        `;
    }

    async connectedCallback() {
    }
}

customElements.define('page-test', PageTest);
