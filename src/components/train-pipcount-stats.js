/*
    Backgammon diagram database
    Trained positions stats
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

import { BaseComponent } from './base-component.js';
import { destroyTooltips, initTooltips } from '../utils/helpers.js';

export class TrainPipcountStats extends BaseComponent {
    constructor() {
        super();

        this.innerHTML = `
  <div class="d-flex flex-wrap gap-3 align-items-center text-muted">
    <div>
        <strong>${t('positions')}:</strong> <span id="stat-total">0</span>
        <i class="bi bi-check-circle-fill text-success ms-1"></i> <span id="stat-correct">0</span>
        <i class="bi bi-x-circle-fill text-danger ms-1"></i> <span id="stat-wrong">0</span>
    </div>
    <div title="${t('tooltip-train-pip-time-stats')}">
      <i class="bi bi-stopwatch-fill text-primary"></i>
      <span id="stat-avg">0.0s</span> /
      <span id="stat-min">0.0s</span> –
      <span id="stat-max">0.0s</span>
    </div>
  </div>
    `;
    }

    updateStats(total, correct, wrong, avgTime, minTime, maxTime) {
        this.$('#stat-total').textContent = total;
        this.$('#stat-correct').textContent = correct;
        this.$('#stat-wrong').textContent = wrong;
        this.$('#stat-avg').textContent = t('unit-seconds', { n: avgTime.toFixed(1) });
        this.$('#stat-min').textContent = t('unit-seconds', { n: minTime.toFixed(1) });
        this.$('#stat-max').textContent = t('unit-seconds', { n: maxTime.toFixed(1) });
    }

    disconnectedCallback() {
        destroyTooltips(this);
    }

    connectedCallback() {
        this.updateStats(0, 0, 0, 0, 0, 0);
        initTooltips(this, { trigger: 'click hover' });
    }
}

customElements.define('train-pipcount-stats', TrainPipcountStats);
