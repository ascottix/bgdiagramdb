/*
    Backgammon diagram database
    Markdown editor
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

const MarkdownTableExample = `
This is just an example, feel free to add or remove columns and rows.
| Roll | Move | Comment |
| - | - | - |
| 21 | 13/11, 24/23 | Can also slot with 6/5 |
| 31 | 8/6, 6/5 | Best move by far |
`;

// Simple markdown editor with preview
export class MarkdownEditor extends HTMLElement {
    constructor() {
        super();

        const height = this.getAttribute('height') || '50vh';
        const id = getUniqueId();

        this.innerHTML = `
<style>
/* Add left border if preview is to the right */
@media (min-width: 992px) {
    .border-lg-start {
        border-left: 1px solid var(--bs-border-color);
    }
}
/* Add top border if preview is below */
@media (max-width: 992px) {
    .border-md-top {
        border-top: 1px solid var(--bs-border-color);
    }
}
</style>
<label for="${id}" class="form-label">${this.getAttribute('label')}</label>
<div class="border rounded">
    <!-- Toolbar -->
    <div class="bg-body-secondary p-1 rounded-top">
        <button title="${t('heading1')}" class="btn" data-placeholder="${t('heading1').toLowerCase()}" data-markdown="# $"><i class="bi bi-type-h1"></i></button>
        <button title="${t('heading2')}" class="btn" data-markdown="## $"><i class="bi bi-type-h2"></i></button>
        <button title="${t('heading3')}" class="btn" data-markdown="### $"><i class="bi bi-type-h3"></i></button>
        <button title="${t('bold')}" class="btn" data-placeholder="${t('bold').toLowerCase()}" data-markdown="**$**"><i class="bi bi-type-bold"></i></button>
        <button title="${t('italic')}" class="btn" data-placeholder="${t('italic').toLowerCase()}" data-markdown="*$*"><i class="bi bi-type-italic"></i></button>
        <button title="${t('strikethrough')}" class="btn" data-placeholder="${t('strikethrough').toLowerCase()}" data-markdown="~~$~~"><i class="bi bi-type-strikethrough"></i></button>
        <button title="${t('numbered-list')}" class="btn" data-markdown="\n1. $"><i class="bi bi-list-ol"></i></button>
        <button title="${t('list')}" class="btn" data-markdown="\n- $"><i class="bi bi-list-ul"></i></button>
        <button title="${t('horiz-rule')}" class="btn" data-markdown="$\n\n---\n"><i class="bi bi-hr"></i></button>
        <button title="${t('table')}" class="btn" data-markdown="${MarkdownTableExample}"><i class="bi bi-table"></i></button>
        <button title="${t('link')}" class="btn" data-placeholder="Wikipedia" data-markdown="[$](https://www.wikipedia.org)"><i class="bi bi-link"></i></button>
        <a style="float:right;" title="${t('markdown-guide-link')}" href="https://www.markdownguide.org/getting-started/" target="_blank" rel="noopener" class="btn"><i class="bi bi-question-lg"></i></a>
    </div>

    <!-- Editor and preview -->
    <div class="row g-0">
        <div class="col-12 col-lg-6">
            <textarea style="height:${height};resize:none;"class="form-control border-0" placeholder="${t('write-here')}" id="${id}"></textarea>
        </div>
        <div class="col-12 col-lg-6">
            <div style="height:${height};overflow-y:auto;" class="markdown border-lg-start border-md-top p-3"></div>
        </div>
    </div>
</div>
        `;

        this._editor = this.querySelector('textarea');
        this._preview = this.querySelector('.border-lg-start');
    }

    set value(value) {
        this._editor.value = value;
        this.updatePreview();
    }

    get value() {
        return this._editor.value;
    }

    updatePreview() {
        this._preview.innerHTML = window.marked.marked(this._editor.value);
    }

    async connectedCallback() {
        this.updatePreview();

        const toolbarButtons = this.querySelectorAll('.btn[data-markdown]');

        // Handle toolbar buttons
        toolbarButtons.forEach(button => {
            button.addEventListener('click', () => {
                const markdown = button.getAttribute('data-markdown');
                const placeholder = button.getAttribute('data-placeholder') || '';
                const selectionStart = this._editor.selectionStart;
                const selectionEnd = this._editor.selectionEnd;
                const selectedText = this._editor.value.slice(selectionStart, selectionEnd);
                const resolvedMarkdown = markdown.replace('$', selectedText || placeholder);

                // Add markdown to editor
                this._editor.setRangeText(resolvedMarkdown, selectionStart, selectionEnd, 'end');

                // For better usability, keep the bold/italic/strikethrough selection
                const match = resolvedMarkdown.match(/([*~]+)(\w+)[*~]/);
                if (match) {
                    const cursorPosition = selectionStart + match[1].length;
                    this._editor.setSelectionRange(cursorPosition, cursorPosition + match[2].length);
                }

                this._editor.focus();
                this.updatePreview();
            });
        });

        // Update preview after every input
        this._editor.addEventListener('input', () => this.updatePreview());
    }
}

customElements.define('markdown-editor', MarkdownEditor);
