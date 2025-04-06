/*
    Backgammon diagram database
    Combobox field
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

export class ComboboxField extends HTMLElement {
    constructor() {
        super();

        const id = getUniqueId();

        this.innerHTML = `
<div class="mb-3">
    <label for="${id}" class="form-label">${this.getAttribute('label')}</label>
    <div class="input-group">
        <input id="${id}" ${DataField}="${this.getAttribute('name')}" type="text" class="form-control" >
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu dropdown-menu-end"></ul>
    </div>
</div>
    `;
    }

    set(options) {
        const html = options.map(option => `<li><span role="button" class="dropdown-item">${option}</span></li>`);
        this.querySelector('ul').innerHTML = html.join('');
    }

    connectedCallback() {
        this.addEventListener('click', (event) => {
            event.stopPropagation();
            if (event.target.getAttribute('role') === 'button') {
                this.querySelector('input').value = event.target.textContent;
                const menu = this.querySelector('ul');
                const bsCollapse = new window.bootstrap.Collapse(menu, { toggle: false });
                bsCollapse.hide();
            }
        });
    }
}

customElements.define('combobox-field', ComboboxField);
