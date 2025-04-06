/*
    Spaced repetition scheduler (implements the FSRS 4.5 algorithm)
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
const Decay = -0.5;
const Factor = 19 / 81;
const DefaultW = [0.5701, 1.4436, 4.1386, 10.9355, 5.1443, 1.2006, 0.8627, 0.0362, 1.629, 0.1342, 1.0166, 2.1174, 0.0839, 0.3204, 1.4676, 0.219, 2.8237];
const DefaultRequestRetention = 0.9; // 90%
const DefaultMaximumInterval = 36500; // 100 years

export const Rating = Object.freeze({
    Again: 1,
    Hard: 2,
    Good: 3,
    Easy: 4,
});

export const State = Object.freeze({
    New: 0,
    Learning: 1,
    Review: 2,
    Relearning: 3,
});

const MsPerMinute = 1000 * 60;
const MsPerDay = MsPerMinute * 60 * 24;

function daysBetweenDates(date1, date2) {
    return Math.floor((date1 - date2) / MsPerDay);
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function fsrs45(options) {
    // Setup parameters
    const w = options?.w || DefaultW;
    const requestRetention = clamp(options?.requestRetention || DefaultRequestRetention, 0, 0.99);
    const maximumInterval = clamp(options?.maximumInterval || DefaultMaximumInterval, 1, +Infinity);

    function initialDifficulty(rating) {
        return w[4] - (rating - 3) * w[5];
    }

    function nextDifficulty(difficulty, rating) {
        const result = w[7] * initialDifficulty(Rating.Good) + (1 - w[7]) * (difficulty - w[6] * (rating - 3));

        return clamp(result, 1, 10);
    }

    function initialStability(rating) {
        return w[rating - 1];
    }

    // Calculates the next stability value after a review, in days
    function nextStability(difficulty, stability, retrievability, rating) {
        const result = rating == Rating.Again ?
            w[11] *
            Math.pow(difficulty, -w[12]) *
            (Math.pow(stability + 1, w[13]) - 1) *
            Math.exp(w[14] * (1 - retrievability))
            :
            stability * (1 +
                Math.exp(w[8]) *
                (11 - difficulty) *
                Math.pow(stability, -w[9]) *
                (Math.exp(w[10] * (1 - retrievability)) - 1) *
                (rating == Rating.Hard ? w[15] : rating == Rating.Easy ? w[16] : 1));

        return clamp(result, 0.01, DefaultMaximumInterval);
    }

    function retrievabilityAfterInterval(elapsedDays, stability) {
        return Math.pow(1 + Factor * elapsedDays / stability, Decay);
    }

    function retrievabilityAtTime(card, time) {
        const elapsedDays = card.state == State.New ? 0 : daysBetweenDates(time, card.lastReview); // Days since last review

        return retrievabilityAfterInterval(elapsedDays, card.stability);
    }

    function daysUntilNextReview(stability) {
        const result = Math.round(stability * ((Math.pow(requestRetention, 1 / Decay) - 1) / Factor));

        return clamp(result, 1, maximumInterval);
    }

    function createNewCard() {
        return {
            state: State.New
        };
    }

    function nextState(state, rating) {
        switch (state) {
            case State.New:
                return rating == Rating.Easy ? State.Review : State.Learning;
            case State.Learning:
            case State.Relearning:
                return rating >= Rating.Good ? State.Review : state;
            case State.Review:
                return rating == Rating.Again ? State.Relearning : State.Review;
        }
    }

    function previewIntervalBeforeNextReview(card, timeOfCurrentReview) {
        let intervalBeforeNextReview;

        const retrievability = retrievabilityAtTime(card, timeOfCurrentReview);

        const hardStability = nextStability(card.difficulty, card.stability, retrievability, Rating.Hard);
        const goodStability = nextStability(card.difficulty, card.stability, retrievability, Rating.Good);
        const easyStability = nextStability(card.difficulty, card.stability, retrievability, Rating.Easy);

        const hardInterval = daysUntilNextReview(hardStability, Rating.Hard);
        const goodInterval = daysUntilNextReview(goodStability, Rating.Good);
        const easyInterval = daysUntilNextReview(easyStability, Rating.Easy);

        switch (card.state) {
            case State.New:
                intervalBeforeNextReview = [
                    1 * MsPerMinute,
                    5 * MsPerMinute,
                    10 * MsPerMinute,
                    daysUntilNextReview(0, Rating.Easy) * MsPerDay];
                break;
            case State.Learning:
            case State.Relearning:
                intervalBeforeNextReview = [
                    5 * MsPerMinute,
                    10 * MsPerMinute,
                    goodInterval * MsPerDay,
                    Math.max(easyInterval, goodInterval + 1) * MsPerDay];
                break;
            case State.Review:
                intervalBeforeNextReview = [
                    5 * MsPerMinute,
                    Math.min(hardInterval, goodInterval) * MsPerDay,
                    Math.max(goodInterval, hardInterval + 1) * MsPerDay,
                    Math.max(easyInterval, goodInterval + 1) * MsPerDay];
                break;
        }

        return intervalBeforeNextReview;
    }

    function updateCardAfterReview(card, timeOfReview, rating) {
        const updatedCard = {
            state: nextState(card.state, rating),
            reps: (card.reps || 0) + 1,
            lapses: (card.lapses || 0) + (card.state == State.Review && rating == Rating.Again ? 1 : 0),
            lastReview: timeOfReview
        }

        // Update stability and difficulty
        switch (card.state) {
            case State.New:
                updatedCard.stability = initialStability(rating);
                updatedCard.difficulty = initialDifficulty(rating);
                break;
            case State.Learning:
            case State.Relearning:
                updatedCard.stability = card.stability;
                updatedCard.difficulty = card.difficulty;
                break;
            case State.Review:
                updatedCard.stability = nextStability(card.difficulty, card.stability, retrievabilityAtTime(card, timeOfReview), rating);
                updatedCard.difficulty = nextDifficulty(card.difficulty, rating);
                break;
        }

        // Update due
        const intervalBeforeNextReview = previewIntervalBeforeNextReview(card, timeOfReview);
        const intervalUntilDue = intervalBeforeNextReview[rating - 1];

        updatedCard.due = timeOfReview + intervalUntilDue;

        return updatedCard;
    }

    function getScheduledDays(card) {
        return card.due ? daysBetweenDates(card.due, card.lastReview) : 0;
    }

    const api = {
        createNewCard,
        getScheduledDays,
        previewIntervalBeforeNextReview,
        updateCardAfterReview
    };

    return options?.test ? {
        ...api,
        w,
        requestRetention,
        maximumInterval,
        initialDifficulty,
        initialStability,
        nextDifficulty,
        nextStability,
        daysUntilNextReview,
        retrievabilityAfterInterval,
        retrievabilityAtTime
    } : api;
}
