/*
    Backgammon diagram database
    Checkbox field
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

export class CheckboxField extends HTMLElement {
    constructor() {
        super();

        const id = getUniqueId();

        this.innerHTML = `
<div class="form-check form-switch mb-2">
    <input id="${id}" ${DataField}="${this.getAttribute('name')}" type="checkbox" role="switch" class="form-check-input">
    <label for="${id}" class="form-check-label">${this.getAttribute('label')}</label>
</div>
    `;
    }
}

customElements.define('checkbox-field', CheckboxField);
