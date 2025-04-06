/*
    Backgammon diagram database
    Tag pills
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
export class TagPills extends HTMLElement {
    constructor() {
        super();

        const tags = this.getAttribute('tags').split(',');
        const html = tags.map(tag => `<span class="badge text-bg-info rounded-pill ms-1 me-1">${tag}</span>`).join('');

        this.innerHTML = html;
    }
}

customElements.define('tag-pills', TagPills);
