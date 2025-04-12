/*
    Backgammon diagram database
    Edit position modal dialog
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
import { app } from '../app.js';
import { DataTranslate, t, translateComponent } from '../utils/lang.js';
import { initTooltips, showModal, xgidToSvg } from '../utils/helpers.js';
import { DataField, collectFields, populateFields, validateFields } from '../utils/fields.js';
import { BgBoard } from '../utils/bgboard.js';

import '../components/input-field.js';
import '../components/select-field.js';
import '../components/combobox-field.js';
import '../components/markdown-editor.js';

class ModalEditPosition extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
<div class="modal fade" data-bs-backdrop="static" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header bg-body-secondary">
        <h5 class="modal-title">${t('edit-position')}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6">
            <select-field name="id_coll" label="${t('collection')}"></select-field>
            <input-field name="title" label="${t('title')}"></input-field>
            <taglist-input-field ${DataField}="tags" label="${t('tags')}"></taglist-input-field>
            <input-field name="xgid" label="XGID"></input-field>
          </div>
          <!-- Diagram -->
          <div class="col-md-6">
            <span class="form-label">${t('diagram')}</span>
            <div data-diagram class="border rounded overflow-hidden mt-1"></div>
          </div>
        </div>

        <!-- Comment -->
        <div class="mt-3 mt-md-0">
          <markdown-editor ${DataField}="comment" label="${t('comment')}" height="30vh"></markdown-editor>
        </div>

        <!-- Question -->
        <div class="row mt-3">
          <p class="text-small text-muted mb-2" ${DataTranslate}="optional-question"></p>
          <markdown-editor ${DataField}="question" label="${t('question')}" height="30vh"></markdown-editor>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" data-action="cancel" class="btn btn-secondary">${t('cancel')}</button>
        <button type="submit" data-action="save" class="btn btn-primary">${t('save')}</button>
      </div>
    </div>
  </div>
</div>
        `;
    }

    refreshDiagram() {
        const diagram = this.querySelector('[data-diagram]');
        const xgidInput = this.querySelector('[data-field="xgid"]');
        let xgid = xgidInput.value;

        if (BgBoard.isValidGnuBgId(xgid)) { // Convert GNU Backgammon ID to XGID
            const board = new BgBoard();
            board.setFromGnuBgId(xgid);
            xgid = board.get();
            xgidInput.value = xgid;
        }

        if (BgBoard.isValidXgid(xgid)) {
            diagram.innerHTML = xgidToSvg(xgid);
        } else {
            diagram.innerHTML = `<div class="text-muted text-center my-5">${t('enter-valid-xgid')}</div>`;
        }
    }

    async open(titleText, submitText, data) {
        this.querySelector('.modal-title').textContent = titleText;
        this.querySelector('[data-action="save"]').textContent = submitText;

        // Populate collection select
        const collections = await app.db.listCollections();
        collections.sort((a, b) => a.name.localeCompare(b.name));
        collections.unshift({ id: 0, name: t('choose-collection') });
        this.querySelector('select-field[name="id_coll"]').set(collections.map(coll => ({ value: coll.id, text: coll.name })));

        // Populate category suggestions
        const categories = await app.db.getUniquePositionCategories();
        categories.sort((a, b) => a.localeCompare(b));
        this.querySelector('taglist-input-field').setSuggestions(categories);

        populateFields(this, data);

        translateComponent(this);

        initTooltips(this);

        this.refreshDiagram();

        this.addEventListener('paste', (event) => {
            const target = event.target;
            if (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') return;

            let pastedText = (event.clipboardData || window.clipboardData).getData('text');

            if (BgBoard.isValidGnuBgId(pastedText) || BgBoard.isValidXgid(pastedText)) {
                this.querySelector('[data-field="xgid"]').value = pastedText;
                this.refreshDiagram();
            }
        });

        this.querySelector('[data-field="xgid"]').addEventListener('input', () => {
            this.refreshDiagram();
        });

        const action = await showModal(this.querySelector('.modal'), (action) => {
            if (action == 'save') {
                return validateFields(this, (data, errors) => {
                    if (!Number(data.id_coll)) errors.push({ id_coll: '' });
                    if (!data.title) errors.push({ title: '' });
                    if (!data.xgid) errors.push({ xgid: '' });
                    if (data.xgid && !BgBoard.isValidXgid(data.xgid)) errors.push({ xgid: t('invalid-xgid') });
                    console.log(data, errors);
                });
            }

            return action == 'cancel';
        });

        // TODO: remove the listeners
        // TODO: remove the tooltips

        return action == 'save' ? collectFields(this) : null;
    }
}

customElements.define('modal-edit-position', ModalEditPosition);
