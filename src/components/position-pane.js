/*
    Backgammon diagram database
    Position pane
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
import { copyToClipboard, openAnalysis, showToast, stripXgidAnnotations, xgidToSvg } from '../utils/helpers.js';
import { escapeHtmlAttr, getUniqueId } from '../utils/fields.js';
import { BgBoard } from '../utils/bgboard.js';

import { BaseComponent } from './base-component.js';
import './tag-pills.js';

export class PositionPane extends BaseComponent {
    constructor() {
        super();

        this._isCard = this.getAttribute('card') != null;
        this._diagramOptions = { compact: this.getAttribute('compact') != null };
    }

    set pos(pos) {
        this._pos = pos;
        this.refresh();
    }

    // Convert the comment markdown to HTML and add the preview buttons
    resolveMarkdown(markdown) {
        let html = window.marked.marked(markdown || '');

        // Look for XGID image placeholders
        // Note: image placeholders may contain moves as annotations, so they must be resolved
        // before creating the preview buttons for the actual moves in the description
        const XgidPlaceholder = /\[(XGID=[-a-oA-O]{26}:\d+:-?[01]:-?1:(00|[DBR]|[1-6]{2}):\d+:\d+:[0-3]:\d+:\d+(:.+?)?)]/g;

        html = html.replace(XgidPlaceholder, (_, xgid) => {
            const svg = xgidToSvg(xgid, {
                ...this._diagramOptions,
                classNames: ['bgd-embedded-diagram', 'border', 'bgdiagram']
            });

            return svg;
        });

        // Look for playable moves in the description, and add preview buttons
        const OneMove = '(?:bar|\\d+)\\/(?:off|\\d+)(?:\\*|\\([234]\\))?';
        const re = new RegExp(`${OneMove}(?:[,\\s]\\s*${OneMove})*`, 'gm');

        html = html.replace(re, function (match) {
            return `
<span style="white-space:nowrap;"><span class="move"><i class="bi bi-eye me-1"></i>${match}</span>
<button class="ms-2 btn btn-outline-secondary btn-sm-inline" data-move="${match}" data-action="preview-arrow" title="${t('tooltip-preview-arrow')}"><i class="bi bi-arrow-down-left"></i></button>
<button class="ms-1 btn btn-outline-secondary btn-sm-inline" data-move="${match}" data-action="preview-board" title="${t('tooltip-preview-board')}"><i class="bi bi-eye"></i></button>
</span>`.replace(/\n/g, '');
        });

        return html;
    }

    renderPosContentCard() {
        return `
<div class="flip-card__container">
    <div class="flip-card">
        <div class="flip-card__front tab-content border rounded p-3 markdown">
            ${this.resolveMarkdown(this._pos.question)}
        </div>
        <div class="flip-card__back tab-content border rounded p-3 markdown">
            ${this.resolveMarkdown(this._pos.comment)}
        </div>
    </div>
</div>
    `;
    }

    renderPosContentFull() {
        const pos = this._pos;

        if (!pos.question) {
            return this.resolveMarkdown(pos.comment);
        } else {
            const tab1 = getUniqueId();
            const tab2 = getUniqueId();
            return `<div>
                <!-- Tab navigation -->
                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="${tab1}-tab" data-bs-toggle="tab" data-bs-target="#${tab1}"
                        type="button" role="tab" aria-controls="${tab1}" aria-selected="true">
                        ${t('question')}
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="${tab2}-tab" } data-bs-toggle="tab" data-bs-target="#${tab2}" type="button"
                        role="tab" aria-controls="${tab2}" aria-selected="false">
                        ${t('comment')}
                        </button>
                    </li>
                </ul>
                <!-- Tab panels -->
                <div class="tab-content border border-top-0 rounded-bottom p-3">
                    <div class="tab-pane fade show active" id="${tab1}" role="tabpanel" aria-labelledby="${tab1}-tab">
                        ${this.resolveMarkdown(pos.question)}
                    </div>
                    <div class="tab-pane fade" id="${tab2}" role="tabpanel" aria-labelledby="${tab2}-tab">
                        ${this.resolveMarkdown(pos.comment)}
                    </div>
                </div>
            </div>`;
        }
    }

    flip() {
        this.$('.flip-card').classList.toggle('flip-card__flipped');
        this.$('.hide-if-front-card').classList.toggle('d-none');
    }

    isLegalPos() {
        const board = new BgBoard();
        board.set(this._pos.xgid);
        return board.isLegal();
    }

    refresh() {
        const ToolbarBtnClass = 'btn btn-outline-secondary btn-sm-inline ms-2';
        const pos = this._pos;
        const svg = xgidToSvg(pos.xgid, this._diagramOptions);

        this.innerHTML = `
<style>
.move > i {
    display: none;
}

.move.mark {
    cursor: pointer;
}

.move.mark > i {
    display: inline;
}

button.btn-sm-inline {
    padding: 0.15rem 0.3rem;
    margin-bottom: 0.15rem;
}
</style>
<div class="container-fluid p-0" data-xgid="${escapeHtmlAttr(pos.xgid)}">
  <div class="row">
    <div class="d-flex align-items-center justify-content-center">
      <div class="fs-3 mb-2">${pos.title || ''}</div> ${this._isCard ? '' : '<tag-pills class="ms-3 mb-2" tags="' + pos.tags.join(',') + '"></tag-pills>'}
    </div>
    <div class="col-12 col-md-6 mb-3">
      <div id="mainDiagram" class="card border rounded overflow-hidden">${svg}</div>
      <div class="${this._isCard ? 'hide-if-front-card d-none ' : ''}d-flex align-items-center justify-content-center mt-2">
        <button data-action="copy-xgid" class="${ToolbarBtnClass}" aria-label="${t('copy-to-clipboard')}" title="${t('copy-to-clipboard')}"><i class="bi bi-clipboard"></i> ${t('copy')}</button>
        <button data-action="analyze" class="${this.isLegalPos() ? ToolbarBtnClass : 'd-none'}" aria-label="${t('analyze-position-title')}" title="${t('analyze-position-title')}"><i class="bi bi-lightbulb"></i> ${t('analyze-position')}</button>
      </div>
    </div>
    <div class="col-12 col-md-6">
      ${this._isCard ? this.renderPosContentCard() : this.renderPosContentFull()}
    </div>
  </div>
</div>
        `;
    }

    connectedCallback() {
        const Highlight = ['mark', 'rounded', 'text-bg-primary', 'p-1'];

        this.on('click', async (event) => {
            // Remove all highlights
            this.$$('span').forEach((span) => {
                span.classList.remove(...Highlight);
            });

            // Handle preview buttons
            const target = event.target.closest('button');
            const container = event.target.closest('[data-xgid]');
            let xgid = container?.getAttribute('data-xgid');

            this.$('#mainDiagram').classList.remove('bgd-move-preview');

            if (target) {
                const move = target.getAttribute('data-move');
                const action = target.getAttribute('data-action');

                if (action == 'copy-xgid') {
                    await copyToClipboard(stripXgidAnnotations(xgid));
                    showToast(t('toast-xgid-copied-to-clipboard'));
                } else if (action == 'analyze') {
                    openAnalysis(xgid);
                } else if (action && move) {
                    // Highlight the move text
                    const span = target.closest('span').firstElementChild;
                    span.classList.add(...Highlight);

                    if (action == 'preview-arrow') {
                        // Just show the arrows
                        xgid += ':' + move + '!!';
                    }
                    else if (action == 'preview-board') {
                        // Play the move and display the new position
                        const board = new BgBoard();
                        board.set(xgid);
                        board.playMove(BgBoard.parseMove(move));
                        this.$('#mainDiagram').classList.add('bgd-move-preview');
                        xgid = board.get();
                    }
                }
            }

            // Update the diagram
            if (xgid) {
                const svg = xgidToSvg(xgid, this._diagramOptions);
                container.querySelector('.card').innerHTML = svg;
            }
        });
    }
}

customElements.define('position-pane', PositionPane);
