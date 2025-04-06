/*
    Backgammon diagram database
    Positions filter
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
import { t } from '../utils/lang.js';
import { getQueryParams, setQueryParams } from '../utils/router.js';

import { BaseComponent } from '../components/base-component.js';
import './input-field.js';
import './select-field.js';

// Panel with controls to filter positions
export class PositionsFilter extends BaseComponent {
    constructor() {
        super();

        this._readyPromise = new Promise((resolve) => {
            this._resolveReadyPromise = resolve;
        });

        this.innerHTML = `
<div class=" card bg-body-secondary mb-3">
    <div class="container-fluid p-2">
        <form>
            <div class="row">
                <div class="col-md-6 col-xl-4">
                    <select-field name="collections" label="${t('collection')}"></select-field>
                </div>
                <div class="col-md-6 col-xl-4">
                    <select-field name="categories" label="${t('category')}"></select-field>
                </div>
            </div>
        </form>
    </div>
</div>
        `;
    }

    async refresh() {
        const params = getQueryParams();

        // Populate the collection list
        const collections = await app.db.listCollections();
        collections.sort((a, b) => a.name.localeCompare(b.name));
        collections.unshift({ id: 0, name: t('all') });
        this._collections.set(collections.map(coll => ({ value: coll.id, text: coll.name })));
        this._collections.value = params.collection || '0';

        // Populate the category list
        let categories = await app.db.getUniquePositionCategories();
        categories.sort((a, b) => a.localeCompare(b));
        categories = categories.map(cat => ({ value: cat, text: cat }));
        categories.unshift({ value: '', text: t('all') });
        this._categories.set(categories);
        this._categories.value = params.category || '';
    }

    get collection() {
        const id = this._collections.value;
        return id && parseInt(id);
    }

    get category() {
        return this._categories.value;
    }

    get search() {
        return this.$('[name="filter-text"]')?.value;
    }

    ready() {
        return this._readyPromise;
    }

    dispatchChange() {
        setQueryParams({
            collection: this.collection || '',
            category: this.category || ''
        });
        this.dispatchEvent(new CustomEvent('positions-filter-change', {
            detail: {
                collection: this.collection,
                category: this.category,
                search: this.search
            },
            bubbles: true
        }));
    }

    async connectedCallback() {
        this._collections = this.$(`[name="collections"]`);
        this._categories = this.$(`[name="categories"]`);

        this.on('.card', 'change', (event) => this.dispatchChange(event));

        await this.refresh();

        this._resolveReadyPromise();
    }
}

customElements.define('positions-filter', PositionsFilter);
