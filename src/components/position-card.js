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
import { Settings, app } from '../app.js';
import { t } from '../utils/lang.js';
import { setClass, wrapTextOnSpaces, xgidToSvg } from '../utils/helpers.js';
import { BgBoard } from '../utils/bgboard.js';

export class PositionCard extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
<style>
button[data-action="view-pos"] {
    all: unset;
    cursor: pointer;
}
</style>
<div class="col">
    <div class="card h-100">
        <button data-action="view-pos"></button>
        <div class="card-body">
            <div class="small text-truncate"></div>
            <div class="display-6 fs-4 text-truncate"></div>
        </div>
        <div class="card-footer text-end">
            <button class="btn btn-outline-success btn-sm" data-action="analyze-pos" title="${t('analyze-position-title')}"><i class="bi bi-lightbulb"></i></button>
            <button class="btn btn-outline-primary btn-sm" data-action="edit-pos" title="${t('tooltip-edit-position')}"><i class="bi bi-pencil-fill"></i></button>
            <button class="btn btn-outline-danger btn-sm" data-action="delete-pos" title="${t('tooltip-delete-position')}"><i class="bi bi-trash-fill"></i></button>
        </div>
    </div>
</div>
        `;
    }

    set pos(pos) {
        this._pos = pos;
        this.querySelector('.card.h-100 > button').innerHTML = this.diagram();
        this.querySelector('.card-body > div:nth-child(2)').textContent = this._pos.title;
        const board = new BgBoard(pos.xgid);
        setClass(this.querySelector('[data-action="analyze-pos"]'), 'd-none', !board.isLegal());
    }

    set collection(collection) {
        this.querySelector('.card-body > div:first-child').textContent = collection.name;
    }

    diagram() {
        let xgid = this._pos.xgid;
        if (!xgid) return '';

        // Automatically generate a diagram title if the XGID doesn't already have one
        if (app.settings[Settings.AppAutoTitleDiagrams] && !/:T/.test(xgid)) {
            // At the normal size, diagram fits 14 'W' and about 25 average characters
            // At larger size (enabled by CSS), diagram fits 12 'W' and about 22 average characters
            const lines = wrapTextOnSpaces(this._pos.title, 20);
            const gap = 1.2; // Gap between lines (1 is enough at the normal size)
            const y = 4.15 + gap * (lines.length - 1) / 2;
            lines.forEach((line, i) => xgid += `:T0,${y - i * gap}-${line.replace(/:/g, '꞉').replace(/-/g, '–').replace(/\.\.\./, '…')}`);
        }

        return xgidToSvg(xgid, { classNames: ['card-img-top'] });
    }
}

customElements.define('position-card', PositionCard);
