/*
    Backgammon diagram database
    Collapsible howto section
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
import { getUniqueId } from "../utils/fields.js";

export class CollapsibleHowto extends HTMLElement {
    constructor() {
        super();

        this._idToggle = getUniqueId();
        this._idDescription = getUniqueId();

        this.innerHTML = `
<button
    class="btn btn-link p-0 align-baseline"
    data-bs-toggle="collapse"
    data-bs-target="#${this._idDescription}"
    aria-expanded="false"
    aria-controls="${this._idDescription}"
    id="${this._idToggle}">
    ${this.getAttribute('label') || t('train-pos-intro-toggle')}
</button>
<div class="collapse mt-3" id="${this._idDescription}" aria-labelledby="${this._idToggle}">
</div>
        `;
    }

    set description(description) {
        this.querySelector('#' + this._idDescription).innerHTML = description;
    }
}

customElements.define('collapsible-howto', CollapsibleHowto);
