/*
    Backgammon diagram database
    Tag list input field
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
import { getUniqueId } from '../utils/fields.js';

export class TaglistInputField extends HTMLElement {
    constructor() {
        super();

        this._tags = new Set();

        this._tagInputId = getUniqueId();
        this._tagContainerId = getUniqueId();
        this._tagSuggestionsId = getUniqueId();

        this.innerHTML = `
<div class="mb-3">
  <label for="${this._tagInputId}" class="form-label">${this.getAttribute('label')}</label>
  <div class="form-control d-flex flex-wrap gap-2" id="${this._tagContainerId}" style="min-height: 3rem;">
    <!-- ...tag chips... -->
    <input type="text" class="border-0 flex-grow-1" id="${this._tagInputId}" placeholder="${t('placeholder-add-tag')}" list="${this._tagSuggestionsId}">
    <datalist id="${this._tagSuggestionsId}"></datalist>
  </div>
</div>
    `;
    }

    setSuggestions(list) {
        const html = list.map(suggestion => `<option value="${suggestion}">`);
        this.querySelector(`#${this._tagSuggestionsId}`).innerHTML = html.join('');
    }

    get value() {
        return [...this._tags];
    }

    set value(tags) {
        console.log(222, tags);
        this._tags = new Set(typeof tags == 'string' ? tags.split(',') : tags);
        this.renderTags();
    }

    // Rebuild the chip list
    renderTags() {
        const tagContainer = this.querySelector(`#${this._tagContainerId}`);

        tagContainer.querySelectorAll('.tag-chip').forEach(el => el.remove());

        for (const tag of this._tags) {
            const chip = document.createElement('span');
            chip.className = 'badge bg-primary tag-chip d-flex align-items-center';
            chip.innerHTML = `${tag}<button data-tag="${tag}" type="button" class="btn-close btn-close-white btn-sm ms-2" aria-label="Rimuovi"></button>`;
            tagContainer.insertBefore(chip, this._tagInput);
        }
    }

    addTag(tag) {
        if (this._tags.size >= 9) return;
        tag = tag.trim().replace(/[<>"'`;&=()\[\]{},\\\/]/g, '');
        if (tag && !this._tags.has(tag)) {
            this._tags.add(tag);
            this.renderTags();
        }
        this._tagInput.value = '';
    }

    connectedCallback() {
        this._tagInput = this.querySelector(`#${this._tagInputId}`);

        this._tagInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === ',' || e.key === 'Tab') {
                e.preventDefault();
                this.addTag(this._tagInput.value);
            }
        });

        this._tagInput.addEventListener('blur', () => {
            this.addTag(this._tagInput.value); // Save if user clicks away
        });

        this.addEventListener('click', (event) => {
            const tag = event.target.getAttribute('data-tag');
            if (tag) {
                this._tags.delete(tag);
                this.renderTags();
            }
        });
    }
}

customElements.define('taglist-input-field', TaglistInputField);
