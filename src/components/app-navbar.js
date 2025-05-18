/*
    Backgammon diagram database
    Navigation bar
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
import { setActivePage } from '../utils/router.js';

export class AppNavbar extends HTMLElement {
    constructor() {
        super();

        window.setActivePage = setActivePage;

        this.innerHTML = `
<nav class="bg-body-secondary navbar navbar-expand-lg fixed-top">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">BgDiagramDb <span class="badge bg-warning text-dark rounded-pill">Beta</span></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="setActivePage('home')" data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show">${t('home')}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="setActivePage('collections')" data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show">${t('collections')}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="setActivePage('positions')" data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show">${t('positions')}</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${t('train')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onclick="setActivePage('train-positions')" data-bs-toggle="collapse"
                            data-bs-target=".navbar-collapse.show">${t('train-positions')}</a>
                        <a class="dropdown-item" href="#" onclick="setActivePage('train-pipcount')"
                            data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">${t('train-pipcount')}</a>
                        <hr class="dropdown-divider">
                        <a class="dropdown-item" href="#" onclick="setActivePage('analyze')"
                            data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">${t('analyze-position')}</a>

                    </div>
                </li>
                <li class="nav-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                    <a class="nav-link" href="#" onclick="setActivePage('settings')">${t('settings')}</a>
                </li>
            </ul>
        </div>
    </div>
</nav>`;
    }
}

customElements.define('app-navbar', AppNavbar);
