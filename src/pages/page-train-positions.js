/*
    Backgammon diagram database
    Train positions page
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
import { Settings, app } from '../app.js';
import { DataTranslate, t, translateComponent } from '../utils/lang.js';
import { getQueryParams, setQueryParams } from '../utils/router.js';
import { fsrs45, State, Rating } from '../utils/fsrs45.js';
import { populateFields } from '../utils/fields.js';
import { humanizeTimeInterval, shuffleArray } from '../utils/helpers.js';

import { BaseComponent } from '../components/base-component.js';
import '../components/collapsible-howto.js';
import '../components/select-field.js';
import '../components/slide-carousel.js';
import '../components/train-positions-stats.js';

class PageTrainPositions extends BaseComponent {
    constructor() {
        super();

        this._fsrs45 = fsrs45({
            requestRetention: app.settings[Settings.TrainPosDefaultRetention]
        });

        this.innerHTML = `
<style>
#tp-card-toolbar > button {
    padding: 0.1em 1em;
}

button > small {
    margin-bottom: -0.3em;
    display: block;
}
</style>
<div id="tp-controls" class="">
    <h1 class="display-5">${t('train')}<i class="bi bi-arrow-right-short fs-3"></i>${t('train-positions')}</h1>
    <div>${t('train-pos-caption')} <collapsible-howto></collapsible-howto></div>
    <div class="mt-3 d-flex justify-content-center align-items-end gap-2">
        <select-field name="collections" label="${t('collection')}"></select-field>
        <button data-action="start" class="btn btn-primary mb-3"><i class="bi bi-arrow-right"></i> ${t('start')}</button>
    </div>
    <div class="d-flex justify-content-center align-items-end gap-2">
        <div class="fs-5" ${DataTranslate}="train-pos-session-preview"></div>
    </div>
</div>

<div id="tp-header" class="d-none d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
  <h1 class="h4 mb-2 mb-md-0">${t('train')}<i class="bi bi-arrow-right-short fs-3"></i>${t('train-positions')}</h1>
  <train-positions-stats></train-positions-stats>
</div>

<div id="tp-card" class="d-none">
    <div id="tp-card-toolbar" class="d-flex justify-content-center gap-3 mb-2">
        <button class="invisible btn"><small>&nbsp;</small>&nbsp;</button>
        <button class="btn btn-secondary" data-action="show-answer"><i class="bi bi-eye"></i> ${t('show-answer')}</button>
        <button class="btn btn-danger d-none" data-ui="s" data-mode="card-back" data-action="rate-again"><i class="bi bi-x"></i> ${t('train-pos-rate-simple-again')}</button>
        <button class="btn btn-success d-none" data-ui="s" data-mode="card-back" data-action="rate-good"><i class="bi bi-check-lg"></i> ${t('train-pos-rate-simple-good')}</button>
        <button class="btn btn-danger" data-ui="a" data-mode="card-back" data-action="rate-again"><small data-field="int_again"></small><i class="bi bi-emoji-expressionless"></i> ${t('train-pos-rate-again')}</button>
        <button class="btn btn-warning" data-ui="a" data-mode="card-back" data-action="rate-hard"><small data-field="int_hard"></small><i class="bi bi-emoji-neutral"></i> ${t('train-pos-rate-hard')}</button>
        <button class="btn btn-primary" data-ui="a" data-mode="card-back" data-action="rate-good"><small data-field="int_good"></small><i class="bi bi-emoji-smile"></i> ${t('train-pos-rate-good')}</button>
        <button class="btn btn-success" data-ui="a" data-mode="card-back" data-action="rate-easy"><small data-field="int_easy"></small><i class="bi bi-emoji-sunglasses"></i> ${t('train-pos-rate-easy')}</button>
        <button class="invisible btn"><small>&nbsp;</small>&nbsp;</button>
    </div>
    <slide-carousel></slide-carousel>
</div>
<div id="tp-summary" class="d-none">
    <h2>${t('well-done')}</h2>
    <div class="fs-5" ${DataTranslate}="train-pos-session-summary"></div>
    <div class="fs-5">${t('train-pos-no-more-positions')}</div>
    <button class="btn btn-secondary mt-3" data-action="close-summary"><i class="bi bi-arrow-left"></i> ${t('train-pos-back-home')}</button>
</div>
        `;
    }

    // Returns the current time in milliseconds (useful to mock the current time for testing)
    now() {
        return Date.now();
    }

    getMaxNewCards(n) {
        return Math.min(n, app.settings[Settings.TrainPosMaxNewCardsPerSession]);
    }

    getMaxTotalCards(n) {
        return Math.min(n, app.settings[Settings.TrainPosMaxCardsPerSession]);
    }

    async onCollectionChange() {
        // Update the URL with the selected collection
        setQueryParams({ collection: this._collections.value });

        // Get and display the number of new and due cards in the selected collection
        const idCollection = parseInt(this._collections.value);

        const newcards = await app.db.findCardsInState(idCollection, State.New, true);
        const duecards = await app.db.findDueCards(idCollection, this.now(), true);

        translateComponent(this, {
            newcards: this.getMaxNewCards(newcards),
            duecards: this.getMaxTotalCards(duecards)
        });
        this.$('[data-action="start"]').disabled = (newcards + duecards) == 0;
    }

    async appendDueCardsToDeck(now) {
        const dueCardsList = await app.db.findDueCards(this._idCollection, now);

        this._deck.push(...dueCardsList);
    }

    async createNewDeck() {
        // Remember the selected collection, because later on we'll try to append more due cards from it
        this._idCollection = parseInt(this._collections.value); // 0 = all

        // Initialize the deck with new cards, capping it at the maximum number of new cards per session
        this._deck = await app.db.findCardsInState(this._idCollection, State.New);
        this._deckIndex = 0;
        this._deck = this._deck.slice(0, this.getMaxNewCards(this._deck.length));

        // Append due cards from the selected collection, capping it at the maximum number of cards per session
        await this.appendDueCardsToDeck(this.now());
        this._deck = this._deck.slice(0, this.getMaxTotalCards(this._deck.length));

        // Shuffle the deck
        shuffleArray(this._deck);

        // Remember the start time of the session, so we can show the session duration at the end
        this._sessionStartTime = Date.now();
        this._sessionWrong = 0;
    }

    showCurrentQuestion() {
        const carousel = this.$('slide-carousel');
        const id = 'card-' + this._deckIndex;
        const html = `<position-pane card id="${id}"></position-pane>`;
        if (this._deckIndex == 0) {
            carousel.init(html);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            carousel.next(html);
        }
        this.$('#' + id).pos = this._deck[this._deckIndex];

        this.hide('#tp-controls');
        this.show('#tp-card');
        this.show('#tp-header');
        this.show('[data-action="show-answer"]');
        this.$$('[data-mode="card-back"]').forEach(e => this.hide(e));
    }

    showCurrentAnswer() {
        this._currentCardAnswerTime = this.now();

        const intervals = this._fsrs45.previewIntervalBeforeNextReview(this._deck[this._deckIndex].sr, this._currentCardAnswerTime).map(i => humanizeTimeInterval(i / 1000))
        populateFields(this, { int_again: intervals[0], int_hard: intervals[1], int_good: intervals[2], int_easy: intervals[3] });

        this.$('#card-' + this._deckIndex).flip();

        setTimeout(() => { // Allow the card animation to complete
            this.hide('[data-action="show-answer"]');
            this.$$('[data-mode="card-back"]').forEach(e => this.show(e));
            this.$$(`[data-ui="${this._isAdvanced ? 's' : 'a'}"]`).forEach(e => this.hide(e));
        }, 550);
    }

    async rateCurrentCard(rating) {
        // Do not modify the deck, it would alter the final stats
        const pos = structuredClone(this._deck[this._deckIndex]);

        pos.sr = this._fsrs45.updateCardAfterReview(pos.sr, this._currentCardAnswerTime, rating);

        await app.db.updatePosition(pos);

        if(rating == Rating.Again) {
            this._sessionWrong++;
        }

        const totalCards = this._deckIndex + 1;
        const sessionRight = totalCards - this._sessionWrong;
        const sessionDuration = Date.now() - this._sessionStartTime;
        const sessionDurationMin = Math.max(1, Math.round(sessionDuration / 1000 / 60));

        this.$('train-positions-stats').updateStats(totalCards, sessionRight, this._sessionWrong, sessionDurationMin);

        this.advanceToNextCard();
    }

    async advanceToNextCard() {
        this._deckIndex++;

        if (this._deckIndex >= this._deck.length) {
            // The deck is finished, but in the meanwhile there may be more due cards to review
            if (this._deck.length < this.getMaxTotalCards(+Infinity)) {
                await this.appendDueCardsToDeck(this.now() + 60 * 1000); // Include one minute in the future
                this._deck = this._deck.slice(0, this.getMaxTotalCards(this._deck.length));
            }

            // If there are no new cards to show, we're done
            if (this._deckIndex >= this._deck.length) {
                this.showSessionSummary();
                return;
            }
        }

        this.showCurrentQuestion();
    }

    async showSessionSummary() {
        const totalCards = this._deck.length;
        const newCards = this._deck.filter(c => c.sr.state == State.New).length;
        const reviewCards = totalCards - newCards;
        const sessionDuration = Date.now() - this._sessionStartTime;
        const sessionDurationMin = Math.max(1, Math.round(sessionDuration / 1000 / 60));

        translateComponent(this, { totalCards, newCards, reviewCards, sessionDurationMin });

        this.hide('#tp-card');
        this.show('#tp-summary');
    }

    async connectedCallback() {
        this._isAdvanced = !!app.settings[Settings.TrainPosRatingSystem];

        // Init the user interface
        this.$('collapsible-howto').description = `
${t('train-pos-intro')}
<div class="${this._isAdvanced ? 'alert alert-info d-flex align-items-start gap-2 mt-4' : 'd-none'}" role="alert">
    <i class="bi bi-info-circle fs-4"></i>
    <div>${t('train-pos-advanced-note')}</div>
</div>`;

        // Populate the collection list
        const collections = await app.db.listCollections();
        collections.sort((a, b) => a.name.localeCompare(b.name));
        collections.unshift({ id: 0, name: t('all') });
        this._collections = this.$(`[name="collections"]`);
        this._collections.set(collections.map(coll => ({ value: coll.id, text: coll.name })));
        this._collections.value = getQueryParams().collection || '0';

        this._collections.addEventListener('change', () => this.onCollectionChange());
        this.onCollectionChange();

        this.on('click', async (event) => {
            const target = event.target.closest('button');
            const action = target?.getAttribute('data-action');

            switch (action) {
                case 'start':
                    await this.createNewDeck();
                    this.showCurrentQuestion();
                    break;
                case 'show-answer':
                    this.showCurrentAnswer();
                    break;
                case 'rate-again':
                    this.rateCurrentCard(Rating.Again);
                    break;
                case 'rate-hard':
                    this.rateCurrentCard(Rating.Hard);
                    break;
                case 'rate-good':
                    this.rateCurrentCard(Rating.Good);
                    break;
                case 'rate-easy':
                    this.rateCurrentCard(Rating.Easy);
                    break;
                case 'close-summary':
                    this.hide('#tp-summary');
                    this.show('#tp-controls');
                    this.onCollectionChange();
                    break;
            }
        });
    }
}

customElements.define('page-train-positions', PageTrainPositions);
