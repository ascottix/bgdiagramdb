/*
    Backgammon diagram database
    Edit collection modal dialog
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
import { showModal } from '../utils/helpers.js';
import { collectFields, populateFields, validateFields } from '../utils/fields.js';
import { DataField } from '../utils/fields.js';

import '../components/input-field.js';
import '../components/textarea-field.js';

class ModalEditCollection extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
<div class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-body-secondary">
                <h5 class="modal-title">${t('edit-collection')}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
            </div>
            <div class="modal-body">
                <input-field name="name" label="${t('name')}"></input-field>
                <textarea-field name="desc" label="${t('description')}"></textarea-field>
                <div class="form-check">
                    <input ${DataField}="sr" class="form-check-input" type="checkbox" id="includeInTraining">
                    <label class="form-check-label" for="includeInTraining">${t('coll-sr')}</label>
                </div>
                <div class="form-text">${t('coll-sr-desc')}</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary">${t('cancel')}</button>
                <button type="submit" data-action="save" class="btn btn-primary">${t('save')}</button>
            </div>
        </div>
    </div>
</div>
        `;
    }

    async open(titleText, submitText, data) {
        this.querySelector('.modal-title').textContent = titleText;
        this.querySelector('[data-action="save"]').textContent = submitText;

        populateFields(this, data);

        const action = await showModal(this.querySelector('.modal'), (action) => {
            if (action == 'save') {
                return validateFields(this, (data, errors) => {
                    if(!data.name) errors.push({ name: '' });
                });
            }

            return true;
        });

        return action == 'save' ? collectFields(this) : null;
    }
}

customElements.define('modal-edit-collection', ModalEditCollection);
