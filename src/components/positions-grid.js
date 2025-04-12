/*
    Backgammon diagram database
    Positions grid
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

import './position-card.js';

export class PositionsGrid extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4"></div>
    `;
    }

    async show(page, collectionsCache) {
        const html = [];

        page.data.forEach(({ id }) => {
            html.push(`<position-card data-posid="${id}"></position-card>`);
        });

        this.querySelector('.row').innerHTML = html.join('\n');

        for (const pos of page.data) {
            const card = this.querySelector(`[data-posid="${pos.id}"]`);
            card.pos = pos;
            if (!collectionsCache[pos.id_coll]) {
                collectionsCache[pos.id_coll] = await app.db.getCollection(pos.id_coll);
            }
            card.collection = collectionsCache[pos.id_coll];
        }
    }
}

customElements.define('positions-grid', PositionsGrid);
