/*
    Backgammon diagram database
    Train pipcount page
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
import { getPositionsCumulativeCounts, getPositionAtIndex, getRandomPositionIndex } from '../utils/game-utils.js';
import { BgBoard } from '../utils/bgboard.js';

import { BaseComponent } from '../components/base-component.js';
import '../components/collapsible-howto.js';
import '../components/slide-carousel.js';
import '../components/train-pipcount-stats.js';

class PageTrainPipcount extends BaseComponent {
    constructor() {
        super();

        this.innerHTML = `
<div id="tp-controls">
    <h1>${t('train')} → ${t('train-pipcount')}</h1>
    <div>${t('train-pip-caption')} <collapsible-howto></collapsible-howto></div>
    <div class="d-flex justify-content-center mt-3">
        <button data-action="start" class="btn btn-primary"><i class="bi bi-arrow-right"></i> ${t('start')}</button>
    </div>
</div>

<div id="tp-header" class="d-none d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
  <h1 class="h4 mb-2 mb-md-0">${t('train')}<i class="bi bi-arrow-right-short fs-3"></i>${t('train-pipcount')}</h1>
  <train-pipcount-stats></train-pipcount-stats>
</div>

<div id="tp-card" class="d-none bgd-hide-point-numbers bgd-hide-pipcount">
    <div id="tp-card-toolbar" class="d-flex justify-content-center gap-3 mb-2">
        <button class="btn btn-primary" data-action="show-answer"><i class="bi bi-eye"></i> ${t('show-answer')}</button>
        <button class="btn btn-danger d-none" data-mode="card-back" data-action="count-wrong"><i class="bi bi-x"></i> ${t('train-pip-rate-wrong')}</button>
        <button class="btn btn-success d-none" data-mode="card-back" data-action="count-right"><i class="bi bi-check-lg"></i> ${t('train-pip-rate-right')}</button>
    </div>
    <slide-carousel></slide-carousel>
</div>
        `;
    }

    showCurrentQuestion() {
        function signed(n) {
            return n == 0 ? '=' : (n > 0 ? '+' : '') + n;
        }

        this._currentPosIndex = getRandomPositionIndex(this._gamesCumulativeCounts);
        this._currentPosStartTime = Date.now();
        const carousel = this.$('slide-carousel');
        const id = 'card-' + this._currentPosIndex;
        const html = `<position-pane card compact id="${id}"></position-pane>`;
        if (this._cards.length == 0) {
            carousel.init(html);
        } else {
            carousel.next(html);
        }
        const xgid = getPositionAtIndex(this._games, this._gamesCumulativeCounts, this._currentPosIndex);
        const board = new BgBoard(xgid);
        board.setFromXGID(xgid);
        const wpc = board.getWhitePipCount();
        const bpc = board.getBlackPipCount();
        const pos = {
            xgid,
            question: t('train-pip-question'),
            comment: t('train-pip-comment', { bpc, wpc, bpdiff: signed(bpc - wpc), wpdiff: signed(wpc - bpc) })
        }
        this.$('#' + id).pos = pos;

        this.show('[data-action="show-answer"]');
        this.$$('[data-mode="card-back"]').forEach(e => this.hide(e));
        this.$('#tp-card').classList.remove('d-none');
        this.$('#tp-card').classList.add('bgd-hide-pipcount');
    }

    showCurrentAnswer() {
        this.$('#card-' + this._currentPosIndex).flip();
        setTimeout(() => { // Allow the card animation to complete
            this.hide('[data-action="show-answer"]');
            this.$$('[data-mode="card-back"]').forEach(e => this.show(e));
            this.$('#tp-card').classList.remove('bgd-hide-pipcount');
        }, 550);
    }

    rateCurrentCard(isAnswerCorrect) {
        this._cards.push({
            idx: this._currentPosIndex,
            time: (Date.now() - this._currentPosStartTime) / 1000,
            success: isAnswerCorrect
        });

        this.advanceToNextCard();
    }

    advanceToNextCard() {
        // Update stats
        const totalCards = this._cards.length;
        const rightCards = this._cards.filter(c => c.success).length;
        const wrongCards = totalCards - rightCards;
        const avgTime = this._cards.reduce((acc, c) => acc + c.time, 0) / this._cards.length;
        const minTime = Math.min(...this._cards.map(c => c.time));
        const maxTime = Math.max(...this._cards.map(c => c.time));

        this.$('train-pipcount-stats').updateStats(totalCards, rightCards, wrongCards, avgTime, minTime, maxTime);

        // Go to the next card
        this.showCurrentQuestion();
    }

    async connectedCallback() {
        this.$('collapsible-howto').description = t('train-pip-intro');

        // Load games
        const response = await fetch(`./assets/pipcount-games.json`);
        this._games = await response.json();
        this._gamesCumulativeCounts = getPositionsCumulativeCounts(this._games);
        this._cards = [];

        this.on('click', async (event) => {
            const target = event.target.closest('button');
            const action = target?.getAttribute('data-action');

            switch (action) {
                case 'start':
                    this.hide('#tp-controls');
                    this.show('#tp-header');
                    this.showCurrentQuestion();
                    break;
                case 'show-answer':
                    this.showCurrentAnswer();
                    break;
                case 'count-right':
                    this.rateCurrentCard(true);
                    break;
                case 'count-wrong':
                    this.rateCurrentCard(false);
                    break;
            }
        });
    }
}

customElements.define('page-train-pipcount', PageTrainPipcount);
