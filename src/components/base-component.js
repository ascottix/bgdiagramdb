/*
    Backgammon diagram database
    Base component for custom elements
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
export class BaseComponent extends HTMLElement {
    constructor() {
        super();
    }

    $(selector) {
        return typeof selector == 'string' ? this.querySelector(selector) : selector;
    }

    $$(selector) {
        return this.querySelectorAll(selector);
    }

    show(element) {
        this.$(element).classList.remove('d-none');
    }

    hide(element) {
        this.$(element).classList.add('d-none');
    }

    on(selector, event, callback) {
        if (typeof event == 'function') { // Selector is missing, default to this
            this.addEventListener(selector, event);
        } else {
            this.$(selector).addEventListener(event, callback);
        }
    }
}

customElements.define('base-component', BaseComponent);
