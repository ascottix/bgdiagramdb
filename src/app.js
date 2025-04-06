/*
    Backgammon diagram database
    Application state
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
import { BgDiagramDb } from './utils/db-api.js';
import { fetchLanguage, getDefaultUserLanguage } from './utils/lang.js';
import { setClass } from './utils/helpers.js';

export const Settings = Object.freeze({
    AppLanguage: 'appLanguage',
    AppTheme: 'appTheme',
    BgdTheme: 'bgdTheme',
    BgdHomeBoardAtLeft: 'bgdHomeBoardAtLeft',
    BgdHidePipcount: 'bgdHidePipcount',
    BgdHidePointNumbers: 'bgdHidePointNumbers',
    TrainPosRatingSystem: 'trainPosRatingSystem',
    TrainPosMaxCardsPerSession: 'trainPosMaxCardsPerSession', // Max total cards per session
    TrainPosMaxNewCardsPerSession: 'trainPosMaxNewCardsPerSession', // Max new cards per session
    TrainPosDefaultRetention: 'trainPosDefaultRetention', // Default retention threshold
    _LastBackupTime: '_lastBackupTime',
    _LastBackupNumCollections: '_lastBackupNumCollections',
    _LastBackupNumPositions: '_lastBackupNumPositions',
});

class App {
    constructor() {
        this.version = '0.1';
    }

    async init() {
        console.log('Initializing the application...');

        // Open the database
        this.db = await BgDiagramDb.open();

        // Load settings
        await this.refreshSettings();

        console.log('Application initialized');
    }

    async refreshSettings() {
        this.settings = await this.db.getAllSettings();

        const setDefault = (key, value) => this.settings[key] = this.settings[key] || value;

        setDefault(Settings.BgdTheme, 'marina');
        setDefault(Settings.TrainPosMaxCardsPerSession, 100);
        setDefault(Settings.TrainPosMaxNewCardsPerSession, 20);
        setDefault(Settings.TrainPosDefaultRetention, 0.85);

        // Set the language
        const lang = this.settings[Settings.AppLanguage] || getDefaultUserLanguage();
        await fetchLanguage(lang);
        document.documentElement.lang = lang;

        // Set the color theme
        const theme = this.settings[Settings.AppTheme] || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-bs-theme', theme);

        // BgDiagram settings
        const bgdThemeClasses = [...document.body.classList].filter(c => c.startsWith('bgdiagram__theme--'));
        document.body.classList.remove(...bgdThemeClasses);
        document.body.classList.add('bgdiagram__theme--' + this.settings[Settings.BgdTheme]);
        setClass(document.body, 'bgd-hide-pipcount', this.settings[Settings.BgdHidePipcount]);
        setClass(document.body, 'bgd-hide-point-numbers', this.settings[Settings.BgdHidePointNumbers]);
    }
}

export const app = new App();
