/*
    Backgammon diagram database
    Settings page
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
import { t } from '../utils/lang.js';
import { downloadDataAsJson, showModal, showToast, xgidToSvg } from '../utils/helpers.js';
import { collectFields, populateFields } from '../utils/fields.js';
import { exportDatabase, importDatabase } from '../utils/db-utils.js';

import '../components/checkbox-field.js';
import '../components/select-field.js';
import '../modals/modal-error.js';

class PageSettings extends HTMLElement {
    constructor() {
        super();
    }

    rebuild() {
        this.innerHTML = `
<h1 class="display-5 mb-4">${t('settings')}</h1>

<div class="accordion mb-4" id="settingsAccordion">
  <!-- General settings -->
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingGeneral">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapseGeneral" aria-expanded="false" aria-controls="collapseGeneral">
        ${t('settings-general')}
      </button>
    </h2>
    <div id="collapseGeneral" class="accordion-collapse collapse" aria-labelledby="headingGeneral"
      data-bs-parent="#settingsAccordion">
      <div class="accordion-body">
        <div class="row g-3">
          <div class="col-md-6"><select-field name="${Settings.AppLanguage}" label="${t('language')}"></select-field>
          </div>
          <div class="col-md-6"><select-field name="${Settings.AppTheme}" label="${t('theme')}"></select-field></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Training -->
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTraining">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapseTraining" aria-expanded="false" aria-controls="collapseTraining">
        ${t('settings-train-pos')}
      </button>
    </h2>
    <div id="collapseTraining" class="accordion-collapse collapse" aria-labelledby="headingTraining"
      data-bs-parent="#settingsAccordion">
      <div class="accordion-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="maxNewCardsPerSession"
              class="form-label">${t('settings-fsrs-max-new-cards-per-session')}</label>
            <input type="number" data-field="${Settings.TrainPosMaxNewCardsPerSession}" class="form-control"
              id="maxNewCardsPerSession" min="1" max="99">
          </div>

          <div class="col-md-6">
            <label for="maxTotalCardsPerSession" class="form-label">${t('settings-fsrs-max-cards-per-session')}</label>
            <input type="number" data-field="${Settings.TrainPosMaxCardsPerSession}" class="form-control"
              id="maxTotalCardsPerSession" min="1" max="999">
          </div>

          <div class="col-md-6">
            <label for="fsrsRatingSystem" class="form-label">${t('settings-fsrs-rating-ui')}</label>
            <select data-field="${Settings.TrainPosRatingSystem}" id="fsrsRatingSystem" class="form-select">
              <option value="">${t('settings-fsrs-rating-ui-standard')}</option>
              <option value="a">${t('settings-fsrs-rating-ui-advanced')}</option>
            </select>
          </div>

          <div class="col-md-6">
            <label for="fsrsDesiredRetention" class="form-label">${t('settings-fsrs-retention')}</label>
            <select data-field="${Settings.TrainPosDefaultRetention}" id="fsrsDesiredRetention" class="form-select">
              <option value="0.80">${t('settings-fsrs-retention-80')}</option>
              <option value="0.85">${t('settings-fsrs-retention-85')}</option>
              <option value="0.90">${t('settings-fsrs-retention-90')}</option>
              <option value="0.95">${t('settings-fsrs-retention-95')}</option>
            </select>
          </div>

          <div class="small mb-3 text-muted">${t('settings-fsrs-advanced-note')}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Diagrams -->
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingDiagrams">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapseDiagrams" aria-expanded="false" aria-controls="collapseDiagrams">
        ${t('settings-diagrams')}
      </button>
    </h2>
    <div id="collapseDiagrams" class="accordion-collapse collapse" aria-labelledby="headingDiagrams"
      data-bs-parent="#settingsAccordion">
      <div class="accordion-body">
        <div class="row g-3">
          <div class="col-md-6">
            <select-field name="${Settings.BgdTheme}" label="${t('theme')}"></select-field>
            <checkbox-field name="${Settings.BgdHomeBoardAtLeft}" label="${t('home-board-left')}"></checkbox-field>
            <checkbox-field name="${Settings.BgdHidePipcount}" label="${t('hide-pipcount')}"></checkbox-field>
            <checkbox-field name="${Settings.BgdHidePointNumbers}" label="${t('hide-point-numbers')}"></checkbox-field>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="card border rounded overflow-hidden mt-3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Backup and restore -->
<div class="card">
  <div class="card-header">
    ${t('settings-backup-restore')}
  </div>
  <div class="card-body">
    <p class="mb-3">${t('settings-backup-restore-intro')} <span id="lastBackupInfo"></span></p>

    <div class="d-flex flex-column flex-sm-row gap-2">
      <button data-action="backup" class="btn btn-outline-primary" id="backupBtn">${t('settings-backup')}</button>
      <button data-action="restore" class="btn btn-outline-secondary" id="restoreBtn">${t('settings-restore')}</button>
      <input type="file" id="restoreInput" accept=".json" hidden>
    </div>
  </div>
</div>

<!-- About -->
<div class="card mt-4 mb-3">
  <div class="card-header">
    ${t('settings-about')}
  </div>
  <div class="card-body">
    <p>Copyright (c) 2025 Alessandro Scotti</p>
    <p>${t('settings-about-text')}</p>
    <h1 class="h4 mt-3">${t('settings-about-acknowledgements')}</h2>
    <p>${t('settings-about-acknowledgements-text')}</p>
    <ul class="mb-3">
      <li><a href="https://github.com/ascottix/bgdiagram" target="_blank" rel="noopener">BgDiagram</a> – ${t('settings-about-ack-bgdiagram')}</li>
      <li><a href="https://getbootstrap.com/" target="_blank" rel="noopener">Bootstrap</a> – ${t('settings-about-ack-bootstrap')}</li>
      <li><a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noopener">DOMPurify</a> – ${t('settings-about-ack-dompurify')}</li>
      <li><a href="https://marked.js.org/" target="_blank" rel="noopener">Marked</a> – ${t('settings-about-ack-marked')}</li>
    </ul>
    <h1 class="h4 mt-3">${t('settings-about-contacts')}</h2>
    <p>${t('settings-about-contacts-text')}</p>
  </div>
</div>

<!-- Confirm restore modal -->
<div class="modal fade" id="restoreConfirmModal" tabindex="-1" aria-labelledby="restoreConfirmLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">

      <div class="modal-header bg-body-secondary">
        <h5 class="modal-title text-warning" id="restoreConfirmLabel"><i class="bi bi-exclamation-triangle-fill me-2"></i> ${t('warning')}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
      </div>

      <div class="modal-body">
        <p>${t('warning-restore-backup')}</p>
        <input type="text" class="form-control" placeholder="${t('write-ok-to-continue')}" id="confirmRestoreInput" autocomplete="off">
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('cancel')}</button>
        <button type="button" data-action="restore" class="btn btn-danger" id="confirmRestoreBtn">${t('continue')}</button>
      </div>

    </div>
  </div>
</div>

<modal-error></modal-error>
    `;

        this.querySelector(`[name="${Settings.AppLanguage}"]`).set([
            { text: 'Auto', value: '' },
            { text: 'English', value: 'en' },
            { text: 'Italiano', value: 'it' },
            { text: '中文', value: 'zh' }]);

        this.querySelector(`[name="${Settings.AppTheme}"]`).set([
            { text: t('theme-auto'), value: '' },
            { text: t('theme-light'), value: 'light' },
            { text: t('theme-dark'), value: 'dark' }]);

        this.querySelector(`[name="${Settings.BgdTheme}"]`).set([
            { text: 'Fluo', value: 'fluo' },
            { text: 'Marina', value: 'marina' },
            { text: 'Mirage', value: 'mirage' },
            { text: 'Monochrome', value: 'mono' },
            { text: 'Mountain', value: 'mountain' },
            { text: 'Patriot', value: 'patriot' },
            { text: 'Pastels - Aqua Green', value: 'aqua-green' },
            { text: 'Pastels - Clear Sky', value: 'serene-sky' },
            { text: 'Pastels - Coral', value: 'delicate-coral' },
            { text: 'Pastels - Lavender', value: 'soft-lavender' },
            { text: 'Pastels - Pink', value: 'petal-pink' },
        ]);

        const confirmInput = this.querySelector('#confirmRestoreInput');
        const confirmButton = this.querySelector('#confirmRestoreBtn');

        confirmInput.addEventListener('input', () => {
            const value = confirmInput.value.trim().toLowerCase();
            confirmButton.disabled = value !== 'ok';
        });

        this.querySelector('[data-action="backup"]').addEventListener('click', async () => {
            // Download backup
            const backup = await exportDatabase(app.db);
            const timestamp = new Date().toISOString().substring(0, 17).replace(/[-:]/g, '').replace('T', '_');
            const filename = 'bgdiagramdb_backup_' + timestamp + '.json';
            downloadDataAsJson(backup, filename);
            await app.refreshSettings();
            this.updateBackupStatus();
        });

        this.querySelector('[data-action="restore"]').addEventListener('click', async () => {
            // Restore backup
            confirmInput.value = '';
            confirmButton.disabled = true;
            const confirm = await showModal(this.querySelector('#restoreConfirmModal'));
            if (confirm != 'restore') return;
            const fileInput = this.querySelector('#restoreInput');
            fileInput.value = ''; // Reset the input field
            fileInput.click();
        });
    }

    updateBackupStatus() {
        const lastBackup = app.settings[Settings._LastBackupTime];
        const isActualBackup = app.settings[Settings._LastBackupNumCollections] != null;
        const daysSinceLastBackup = Math.round((Date.now() - lastBackup) / (24 * 60 * 60 * 1000));

        const msg = isActualBackup ? t('days-since-last-backup', { 'elapsed-days': daysSinceLastBackup }) : t('no-backups-found');

        this.querySelector('#lastBackupInfo').innerHTML = msg;
    }

    async refresh(rebuild) {
        await app.refreshSettings();

        if (rebuild) {
            this.rebuild();
            document.getElementById('navbar').innerHTML = '<app-navbar></app-navbar>';
        }

        populateFields(this, app.settings);

        this.updateBackupStatus();

        // Diagram preview
        this.querySelector('.card').innerHTML = xgidToSvg('XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:0:0:6');
    }

    async connectedCallback() {
        this.refresh(true);

        this.addEventListener('input', async (event) => {
            if (event.target.getAttribute('type') == 'file') {
                // Restore backup
                const file = event.target.files[0];

                if (!file) return;

                if (!file.name.endsWith('.json')) {
                    return;
                }

                try {
                    const json = await file.text();
                    const data = JSON.parse(json);

                    await importDatabase(app.db, data);

                    await app.refreshSettings();
                    this.updateBackupStatus();
                    showToast(t('toast-database-restored', data));
                } catch (e) {
                    const msg = t(e.message);
                    this.querySelector('modal-error').open(msg != e.message ? msg : t('error-restore-backup', { error: msg }));
                }

                event.target.value = ''; // Reset the input field
                return;
            }

            const fields = collectFields(event.target.closest('div'));

            const clamp = (name, min, max) => {
                let value = fields[name];
                if (value == null) return;
                value = Number(value);
                if (isNaN(value)) value = 0;
                fields[name] = Math.min(Math.max(value, min), max);
            }

            clamp(Settings.TrainPosMaxCardsPerSession, 1, 999);
            clamp(Settings.TrainPosMaxNewCardsPerSession, 1, 99);

            for (const key in fields) {
                await app.db.setSetting(key, fields[key]);
            }

            this.refresh(fields[Settings.AppLanguage] != null);
        });
    }
}

customElements.define('page-settings', PageSettings);
