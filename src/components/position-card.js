/*
    Backgammon diagram database
    Position card
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
import { xgidToSvg } from '../utils/helpers.js';

export class PositionCard extends HTMLElement {
    constructor() {
        super();

        this._pos = JSON.parse(this.getAttribute('pos'));

        this.innerHTML = `
<style>
button[data-action="view-pos"] {
    all: unset;
    cursor: pointer;
}
</style>
<div class="col">
    <div class="card h-100">
        <button data-action="view-pos">
            ${this.diagram()}
        </button>
        <div class="card-body">
            <div class="fs-5 fw-bold text-truncate">${this._pos.title}</div>
        </div>
        <div class="card-footer text-end">
            <button class="btn btn-outline-primary btn-sm" data-action="edit-pos" title="${t('tooltip-edit-position')}"><i class="bi bi-pencil-fill"></i></button>
            <button class="btn btn-outline-danger btn-sm" data-action="delete-pos" title="${t('tooltip-delete-position')}"><i class="bi bi-trash-fill"></i></button>
        </div>
    </div>
</div>
        `;
    }

    set pos(pos) {
        this._pos = pos;
        this.querySelector('.card.h-100 > div:first-child').innerHTML = this.diagram();
        this.querySelector('.card-body > div').textContent = this._pos.title;
    }

    diagram() {
        return xgidToSvg(this._pos.xgid, { classNames: ['card-img-top'] });
    }
}

customElements.define('position-card', PositionCard);
