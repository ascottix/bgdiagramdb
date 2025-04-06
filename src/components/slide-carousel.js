/*
    Backgammon diagram database
    Slide carousel
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
import { BaseComponent } from './base-component.js';

/*
    Slide carousel hides the standard carousel controls and provides
    a programmatic way to navigate between slides.
*/
export class SlideCarousel extends BaseComponent {
    constructor() {
        super();
    }

    resetHtml() {
        this.innerHTML = `
<div id="slideCarousel" class="carousel slide" data-bs-touch="true" data-bs-interval="false">
    <div class="carousel-inner">
        <div class="carousel-item active" data-slide="0"></div>
        <div class="carousel-item" data-slide="1"></div>
    </div>

    <button class="d-none carousel-control-prev" type="button" data-bs-target="#slideCarousel" data-bs-slide="prev" aria-hidden="true"></button>
    <button class="d-none carousel-control-next" type="button" data-bs-target="#slideCarousel" data-bs-slide="next" aria-hidden="true"></button>
</div>
        `;
    }

    init(html) {
        this.resetHtml();
        this.$('[data-slide="0"]').innerHTML = html;
    }

    setHiddenSlideHtml(html) {
        const activeSlideIndex = parseInt(this.$('[data-slide].active').getAttribute('data-slide'));
        this.$(`[data-slide="${1 - activeSlideIndex}"]`).innerHTML = html;
    }

    next(html) {
        this.setHiddenSlideHtml(html);
        this.$('.carousel-control-next').click();
    }

    prev(html) {
        this.setHiddenSlideHtml(html);
        this.$('.carousel-control-prev').click();
    }
}

customElements.define('slide-carousel', SlideCarousel);
