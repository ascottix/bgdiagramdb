/*
    Backgammon diagram database
    Warning message modal dialog
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
import { showModal } from '../utils/helpers.js';
import { t } from '../utils/lang.js';

class ModalError extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
<div class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-body-secondary">
                <h5 class="modal-title text-danger">
                    <i class="bi bi-x-circle-fill me-2"></i> ${t('error')}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" data-bs-dismiss="modal" class="btn btn-secondary">${t('ok')}</button>
            </div>
        </div>
    </div>
</div>
        `;
    }

    async open(message) {
        this.querySelector('.modal-body').innerHTML = message;

        return showModal(this.querySelector('.modal'));
    }
}

customElements.define('modal-error', ModalError);
