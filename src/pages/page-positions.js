/*
    Backgammon diagram database
    Positions page
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
import { Idb } from '../utils/indexeddb.js';
import { getDataAttributes, removeTooltip, initTooltips, setClass, showToast } from '../utils/helpers.js';
import { sanitizePosition, synchSpacedRepetitionFlag } from '../utils/db-utils.js';
import { getQueryParams, setQueryParams } from '../utils/router.js';

import { BaseComponent } from '../components/base-component.js';
import '../components/positions-filter.js';
import '../components/positions-grid.js';
import '../components/positions-carousel.js';
import '../modals/modal-edit-position.js';
import '../modals/modal-warning.js';

class PagePositions extends BaseComponent {
    constructor() {
        super();

        this._collectionsCache = {};

        this.innerHTML = `
<div data-type="grid">
    <div class="d-flex justify-content-between align-items-center mb-2">
        <h1>${t('positions')}</h1>
        <button data-action="add-new" class="btn btn-primary"><i class="bi bi-plus-lg"></i> ${t('add')}</button>
    </div>
    <positions-filter></positions-filter>
    <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">${t('loading')}</span>
        </div>
    </div>
    <div class="content d-none">
        <p ${DataTranslate}="positions-found"></p>
        <div>
        <positions-grid></positions-grid>
        </div>
        <nav data-if-empty="hide" aria-label="${t('positions-page-nav')}" class="mt-3">
            <ul class="pagination justify-content-center">
                <li data-action="prev-page" class="page-item"><button class="page-link">${t('previous')}</button></li>
                <li data-action="next-page" class="page-item"><button class="page-link">${t('next')}</button></li>
            </ul>
        </nav>
    </div>
</div>

<div data-type="carousel" class="d-none">
    <div class="d-flex align-items-center mb-2">
        <button data-action="show-grid" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> ${t('back-to-grid')}</button>
        <h1 class="mx-3 d-none" ${DataTranslate}="position-i-of-n"></h1>
    </div>
    <positions-carousel></positions-carousel>
</div>

<modal-warning></modal-warning>
<modal-edit-position></modal-edit-position>
        `;
    }

    positionsCursorFactory() {
        if (!this._filter.category) {
            return app.db.getPositionsIndexByCollection().openCursor(this._filter.collection || undefined);
        } else {
            return app.db.getPositionsIndexByCategory().openCursor(this._filter.category);
        }
    }

    positionsFilterFactory() {
        // If both collection and category are selected, index is by category and we need to filter by collection
        if (this._filter.category && this._filter.collection) {
            return (pos) => pos.id_coll == this._filter.collection;
        }
    }

    async updatePage(scroll) {
        const page = await this._pager.read();

        setClass(this.$('[data-if-empty="show"]'), 'd-none', page.data.length != 0);
        setClass(this.$('[data-if-empty="hide"]'), 'd-none', page.data.length == 0);

        this.$('positions-grid').show(page, this._collectionsCache);

        setClass(this.$('[data-action="prev-page"]'), 'disabled', page.page == 0);
        setClass(this.$('[data-action="next-page"]'), 'disabled', page.last);

        if (scroll) {
            document.querySelector('positions-filter').scrollIntoView({
                behavior: 'instant'
            });
        }

        initTooltips(this);
    }

    async refresh() {
        const spinner = this.$('.spinner-border');
        const content = this.$('.content');

        // Start spinner with a short delay to avoid it flashing on fast operations (which should be the norm)
        const spinTimer = setTimeout(() => spinner.classList.remove('d-none'), 50);
        content.classList.add('d-none');

        // Initialize pager
        this._pagesize = this.getAttribute('pagesize') || 60;
        this._pager = Idb.pagedIterator(() => this.positionsCursorFactory(), this._pagesize, this.positionsFilterFactory());
        this._pagerSize = await this._pager.size();

        // Build content page
        translateComponent(this, {
            'positions': this._pagerSize.count,
            'positions-found': this._pagerSize.count,
        });

        // Update content
        if (getQueryParams().mode == 'browser') {
            // If invoked in browser mode, show the first position
            setQueryParams({ mode: '' });
            const page = await this._pager.read();
            if (page.data.length > 0) {
                this.viewPosition(page.data[0].id);
            }
        } else {
            // Show the current page
            this.updatePage();
        }

        // Remove spinner
        clearTimeout(spinTimer);
        spinner.classList.add('d-none');
        content.classList.remove('d-none');
    }

    async viewPosition(id) {
        let page = await this._pager.read();
        const index = page.data.findIndex(p => p.id == id) + page.page * this._pagesize;
        const carouselContainer = this.$('[data-type="carousel"]');
        const carousel = this.$('positions-carousel');

        const getPositionFn = async (index) => {
            const p = Math.floor(index / this._pagesize);
            if (p < page.page) this._pager.prev();
            if (p > page.page) this._pager.next();
            if (p != page.page) page = await this._pager.read();
            index = index % this._pagesize;
            return page.data[index];
        }

        const setPositionHtml = async (element, posIndex) => {
            const pos = await getPositionFn(posIndex);

            const html = `
<div class="px-5">
  <position-pane></position-pane>
</div>
        `;

            element.innerHTML = html;
            element.querySelector('position-pane').pos = pos;
        };

        const onPositionChange = (index) => {
            translateComponent(carouselContainer, {
                i: index + 1,
                n: this._pagerSize.count
            });

            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        carousel.init(index, this._pagerSize.count, setPositionHtml, onPositionChange);

        this.$('[data-type="grid"]').classList.add('d-none');
        carouselContainer.classList.remove('d-none');
    }

    async connectedCallback() {
        // Filter handler
        this._filter = this.$('positions-filter');
        this._filter.addEventListener('positions-filter-change', () => this.refresh());

        // Click handler
        this.on('click', async (event) => {
            removeTooltip();

            const target = event.target.closest('[data-action]');

            if (target && !target.classList.contains('disabled')) {
                const detail = { ...getDataAttributes(target.closest('[data-posid]')), ...getDataAttributes(target) };

                switch (detail.action) {
                    case 'add-new':
                        {
                            // Add new position
                            const data = await this.querySelector('modal-edit-position').open(t('new-position'), t('add'), { title: '', xgid: '', tags: [], question: '', comment: '' });
                            if (data) {
                                data.id_coll = Number(data.id_coll);
                                data.id = await app.db.addPosition(sanitizePosition(data));
                                synchSpacedRepetitionFlag(app.db, data.id_coll, data);
                                showToast(t('toast-position-added'));
                                this.refresh();
                            }
                        }
                        break;
                    case 'view-pos':
                        this.viewPosition(detail['posid']);
                        break;
                    case 'show-grid':
                        this.updatePage();
                        this.$('[data-type="carousel"]').classList.add('d-none');
                        this.$('[data-type="grid"]').classList.remove('d-none');
                        break;
                    case 'edit-pos':
                        {
                            // Edit position
                            const pos = await app.db.getPosition(Number(detail.posid));
                            let data = await this.querySelector('modal-edit-position').open(t('edit-position'), t('save'), structuredClone(pos));
                            if (data) {
                                data.id_coll = Number(data.id_coll);
                                data = sanitizePosition(data);
                                data.id = pos.id; // Must set ID after sanitize
                                await app.db.updatePosition(data);
                                synchSpacedRepetitionFlag(app.db, data.id_coll, data);
                                this.refresh();
                                showToast(t('toast-position-updated'));
                            }
                        }
                        break;
                    case 'delete-pos':
                        {
                            // Delete position
                            const pos = await app.db.getPosition(Number(detail.posid));
                            const coll = await app.db.getCollection(pos.id_coll);
                            const confirm = await this.$('modal-warning').open(t('confirm-delete-position', { name: pos.title, coll: coll.name }), t('delete'));
                            if (confirm) {
                                await app.db.deletePosition(pos.id);
                                this.refresh();
                                showToast(t('toast-position-deleted'));
                            }
                        }
                        break;
                    case 'prev-page':
                        this._pager.prev();
                        this.updatePage(true);
                        break;
                    case 'next-page':
                        this._pager.next();
                        this.updatePage(true);
                        break;
                    case 'prev-card':
                        this.$('positions-carousel').prev();
                        break;
                    case 'next-card':
                        this.$('positions-carousel').next();
                        break;
                }
            }
        });

        // Initial refresh
        await this._filter.ready();

        this.refresh();
    }
}

customElements.define('page-positions', PagePositions);
