/*
    Backgammon diagram database
    Select field
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

export class SelectField extends HTMLElement {
    constructor() {
        super();

        const id = getUniqueId();

        this.innerHTML = `
<div class="mb-3">
    <label for="${id}" class="form-label">${this.getAttribute('label')}</label>
    <select id="${id}" ${DataField}="${this.getAttribute('name')}" class="form-select"></select>
    <div class="invalid-feedback"></div>
</div>
    `;

        this._select = this.querySelector('select');
    }

    set(options) {
        const html = options.map(option => `<option value="${option.value}">${option.text}</option>`);
        this._select.innerHTML = html.join('');
    }

    get value() {
        return this._select.value;
    }

    set value(value) {
        this._select.value = value;
    }
}

customElements.define('select-field', SelectField);
