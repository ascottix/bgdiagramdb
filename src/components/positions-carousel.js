/*
    Backgammon diagram database
    Positions carousel
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
import { setClass } from '../utils/helpers.js';

import { BaseComponent } from './base-component.js';
import './position-pane.js';

export class PositionsCarousel extends BaseComponent {
    constructor() {
        super();
    }

    resetHtml() {
        this.innerHTML = `
<style>
.carousel-control-prev,
.carousel-control-next {
    filter: invert(1);
    width: initial;
}
</style>
<div id="positionCarousel" class="carousel slide" data-bs-touch="true" data-bs-interval="false">
    <div class="carousel-inner">
        <div class="carousel-item" data-slide="0"></div>
        <div class="carousel-item active" data-slide="1"></div>
        <div class="carousel-item" data-slide="2"></div>
    </div>

    <!-- Navigation controls -->
    <button class="carousel-control-prev" type="button" data-bs-target="#positionCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">${t('prev')}</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#positionCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">${t('next')}</span>
    </button>
</div>
        `;
    }

    async init(index, count, setPositionHtml, onPositionChange) {
        // Reset active element and remove event listeners
        this.resetHtml();

        const updateSlide = async (slideIndex, posIndex) => {
            if (posIndex < 0 || posIndex >= count) return;

            setPositionHtml(this.$(`[data-slide="${slideIndex}"]`), posIndex);
        }

        const updateNavigation = () => {
            onPositionChange(index);
            setClass(this.$('.carousel-control-prev'), 'visually-hidden', index == 0);
            setClass(this.$('.carousel-control-next'), 'visually-hidden', index == count - 1);
        }

        await updateSlide(0, index - 1);
        await updateSlide(1, index);
        await updateSlide(2, index + 1);

        updateNavigation();

        this.on('#positionCarousel', 'slid.bs.carousel', (event) => {
            const direction = event.direction == 'left' ? 1 : -1;

            index = (index + direction + count) % count;
            const slideIndex = (parseInt(document.querySelector('[data-slide].active').getAttribute('data-slide')) + direction + 3) % 3;

            updateSlide(slideIndex, index + direction);
            updateNavigation();
        });
    }

    next() {
        this.$('.carousel-control-next').click();
    }

    prev() {
        this.$('.carousel-control-prev').click();
    }
}

customElements.define('positions-carousel', PositionsCarousel);
