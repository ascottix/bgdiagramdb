/*
    Backgammon diagram database
    Collections page
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
import { downloadDataAsJson, initTooltips, showToast } from '../utils/helpers.js';
import { exportCollection, importCollection, synchSpacedRepetitionFlag } from '../utils/db-utils.js';

import { BaseComponent } from '../components/base-component.js';
import '../modals/modal-edit-collection.js';
import '../modals/modal-error.js';
import '../modals/modal-warning.js';

class PageCollections extends BaseComponent {
    constructor() {
        super();

        this.innerHTML = `
<div class="d-flex justify-content-between align-items-center">
    <h1>${t('collections')}</h1>
    <span>
        <input type="file" id="importCollection" accept="application/json" style="display: none;">
        <button class="btn btn-primary me-2" onclick="document.getElementById('importCollection').click()"><i class="bi bi-box-arrow-in-up"></i> ${t('import')}</button>
        <button data-action="create" class="btn btn-primary"><i class="bi bi-folder-plus"></i> ${t('create-new-collection')}</button>
    </span>
</div>

<p ${DataTranslate}="db-summary"></p>

<div class="container border rounded"></div>
<modal-warning></modal-warning>
<modal-error></modal-error>
<modal-edit-collection></modal-edit-collection>
        `;
    }

    async refresh() {
        const html = [];

        html.push(`
<div class="row p-1 border-bottom rounded-top bg-body-secondary d-none d-md-flex">
    <div class="col-12 col-md-3"><strong>${t('name')}</strong></div>
    <div class="col-12 col-md-6"><strong>${t('description')}</strong></div>
    <div class="col-12 col-lg-2 col-md-1"><strong>${t('positions')}</strong></div>
    <div class="col-12 col-md-1"><strong>${t('actions')}</strong></div>
</div>
        `);

        const collections = await app.db.listCollections(true);

        collections.sort((a, b) => a.name.localeCompare(b.name));

        collections.forEach((coll, index) => {
            html.push(`
<div class="row p-1 pt-2${index == collections.length - 1 ? '' : ' border-bottom'}">
    <div class="col-12 col-md-3">${coll.name}</div>
    <div class="col-12 col-md-6">${coll.desc || ''}</div>
    <div class="col-12 col-lg-2 col-md-1"><span class="d-md-none">${t('positions')}: </span>${coll.size}</div>
    <div data-coll-id="${coll.id}" class="col-12 col-md-1 d-flex gap-2 align-items-start">
        <a data-action="view" href="#positions?collection=${coll.id}" title="${t('tooltip-view-collection')}" class="btn btn-outline-success btn-sm"><i class="bi bi-eye-fill"></i></a>
        <!-- When on mobile, show all the buttons on a separate line -->
        <button data-action="edit" title="${t('tooltip-edit-collection')}" class="d-md-none pe-0 btn btn-outline-secondary btn-sm"><i class="bi bi-pencil-fill me-2"></i></button>
        <button data-action="delete" title="${t('tooltip-delete-collection')}" class="d-md-none pe-0 btn btn-outline-secondary btn-sm"><i class="bi bi-trash-fill me-2"></i></button>
        <button data-action="export" title="${t('tooltip-export-collection')}" class="d-md-none pe-0 btn btn-outline-secondary btn-sm"><i class="bi bi-box-arrow-down me-2"></i></button>
        <!-- When on desktop, show the buttons in a column, in a dropdown menu -->
        <div class="btn-group d-none d-md-inline">
            <button type="button" class="btn btn-sm dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false"></button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><button data-action="edit" title="${t('tooltip-edit-collection')}" class="dropdown-item" href="#"><i class="bi bi-pencil-fill me-2"></i>${t('edit')}</button></li>
                <li><button data-action="delete" title="${t('tooltip-delete-collection')}" class="dropdown-item" href="#"><i class="bi bi-trash-fill me-2"></i>${t('delete')}</button></li>
                <li><button data-action="export" title="${t('tooltip-export-collection')}" class="dropdown-item" href="#"><i class="bi bi-box-arrow-down me-2"></i>${t('export')}</button></li>
            </ul>
        </div>
    </div>
</div>
    `);
        });

        this.$('.container').innerHTML = html.join('\n');

        translateComponent(this, {
            collections: collections.length,
            positions: collections.reduce((acc, coll) => acc + coll.size, 0),
        });

        initTooltips(this);
    }

    async connectedCallback() {
        this.refresh();

        this.on('#importCollection', 'change', async () => {
            // Import collection
            const fileInput = this.$('#importCollection');
            const file = fileInput.files[0];
            if (!file) return;

            try {
                const json = await file.text();
                const data = JSON.parse(json);

                if (await app.db.existsCollection(data.name)) {
                    this.$('modal-error').open(t('error-import-collection-duplicate', data));
                    return;
                }

                await importCollection(app.db, data);

                showToast(t('toast-collection-imported', data));

                this.refresh();
            } catch (e) {
                const msg = t(e.message);
                this.$('modal-error').open(msg != e.message ? msg : t('error-import-collection-generic', { error: msg }));
            }

            fileInput.value = ''; // Reset the input field
        });

        this.on('[data-action="create"]', 'click', async () => {
            // Create new collection
            const data = await this.$('modal-edit-collection').open(t('new-collection'), t('create'), {});
            if (data) {
                await app.db.createCollection(data);
                this.refresh();
            }
        });

        // Handle clicks on any button in the collections list
        const handleButtonClick = async (button) => {
            const action = button.getAttribute('data-action');
            const div = button.closest('[data-coll-id]');
            const collId = parseInt(div.getAttribute('data-coll-id'));
            const collection = await app.db.getCollection(collId);

            if (action == 'delete') {
                // Delete collection
                const size = await app.db.countPositions(collId);
                const confirm = await this.$('modal-warning').open(t('confirm-delete-collection', { name: collection.name, positions: size }), t('delete'));
                if (confirm) {
                    await app.db.deleteCollection(collId);
                    this.refresh();
                    showToast(t('toast-collection-deleted', collection));
                }
            } else if (action == 'edit') {
                // Edit collection
                const data = await this.$('modal-edit-collection').open(t('edit-collection'), t('save'), collection);
                if (data) {
                    data.id = collId;
                    await app.db.updateCollection(data);
                    synchSpacedRepetitionFlag(app.db, collId);
                    this.refresh();
                    showToast(t('toast-collection-updated', collection));
                }
            } else if (action == 'export') {
                // Export collection
                const data = await exportCollection(app.db, collId);
                downloadDataAsJson(data, `${collection.name}.json`);
            }
        }

        this.on('.container', 'click', async (event) => {
            const button = event.target.closest('button');
            if (button) {
                handleButtonClick(button);
            }
        });
    }
}

customElements.define('page-collections', PageCollections);
