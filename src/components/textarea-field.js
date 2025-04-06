/*
    Backgammon diagram database
    Textarea field
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
import { DataField, getUniqueId } from '../utils/fields.js';

export class TextareaField extends HTMLElement {
    constructor() {
        super();

        const id = getUniqueId();

        this.innerHTML = `
<div class="mb-3">
    <label for="${id}" class="form-label">${this.getAttribute('label')}</label>
    <textarea id="${id}" ${DataField}="${this.getAttribute('name')}" rows="3" class="form-control"></textarea>
    <div class="invalid-feedback"></div>
</div>
    `;
    }
}

customElements.define('textarea-field', TextareaField);
