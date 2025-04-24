/*
    Backgammon diagram database
    Database utilities
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
import { sanitizeHtml } from './fields.js';
import { State } from './fsrs45.js';
import { Idb } from './indexeddb.js';
import { BgBoard } from './bgboard.js';

/**
 * Sanitizes a collection object.
 *
 * @param {Object} coll - The collection object to be sanitized.
 * @returns {Object} - The sanitized collection object.
 */
export function sanitizeCollection(coll) {
    return {
        name: sanitizeHtml(coll.name),
        desc: sanitizeHtml(coll.desc),
        sr: !!coll.sr
    }
}

/**
 * Sanitizes a position object.
 *
 * @param {Object} pos - The position object to be sanitized.
 * @returns {Object} - The sanitized position object.
 */
export function sanitizePosition(pos) {
    const result = {
        id_coll: Number.isInteger(pos.id_coll) ? pos.id_coll : 0,
        title: sanitizeHtml(pos.title),
        xgid: BgBoard.isValidXgid(pos.xgid) ? sanitizeHtml(pos.xgid) : 'XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:0:0:6',
        tags: Array.isArray(pos.tags) ? pos.tags.map(t => sanitizeHtml(t)) : [],
        question: sanitizeHtml(pos.question),
        comment: sanitizeHtml(pos.comment)
    }

    if (typeof pos.sr == 'object') {
        const state = pos.sr.state;
        if (
            (state == State.New || state == State.Learning || state == State.Relearning || state == State.Review)
            && Number.isInteger(pos.sr.reps)
            && Number.isInteger(pos.sr.lapses)
            && Number.isInteger(pos.sr.lastReview)
            && Number.isFinite(pos.sr.stability)
            && Number.isFinite(pos.sr.difficulty)
            && Number.isInteger(pos.sr.due)
        ) {
            result.sr = {
                state,
                reps: pos.sr.reps,
                lapses: pos.sr.lapses,
                lastReview: pos.sr.lastReview,
                stability: pos.sr.stability,
                difficulty: pos.sr.difficulty,
                due: pos.sr.due
            }
        }
    }

    return result;
}

/**
 * Exports a collection from the database.
 *
 * @param db - The database instance.
 * @param id - The identifier of the collection to export.
 * @returns A promise that resolves to an object containing the collection data.
 */
export async function exportCollection(db, id) {
    const collection = await db.getCollection(id);
    const positions = await db.listPositions(id);

    const data = {
        version: db.version,
        name: collection.name,
        desc: collection.desc,
        sr: collection.sr,
        positions: positions.map(pos => ({
            title: pos.title,
            xgid: pos.xgid,
            tags: pos.tags,
            question: pos.question,
            comment: pos.comment
        }))
    }

    return data;
}

/**
 * Imports a collection into the database.
 *
 * @param {Object} db - The database instance.
 * @param {Object} data - The collection data to import.
 * @returns {Promise<number>} - A promise that resolves to the ID of the created collection.
 * @throws {Error} - Throws an error if the data version is greater than the database version.
 */
export async function importCollection(db, data) {
    if (data.version > db.version) {
        throw new Error('error-import-collection-version');
    }

    const tx = db.transaction(null, Idb.Writable);

    const coll = sanitizeCollection(data);
    const id_coll = await db.createCollection(coll, tx);

    for (const pos of data.positions) {
        pos.id_coll = id_coll;
        pos.sr = coll.sr ? { state: State.New } : undefined; // Ensure spaced repetition flag is set correctly
        await db.addPosition(sanitizePosition(pos), tx); // Make sure positions are added in the original order (don't async)
    }

    return id_coll;
}

/**
 * Synchronizes the spaced repetition flag for positions in a collection.
 *
 * This function updates the spaced repetition (sr) flag for positions within a collection.
 * If the collection has the spaced repetition flag enabled and a position does not, the flag is added to the position.
 * Conversely, if the collection does not have the spaced repetition flag and a position does, the flag is removed from the position.
 *
 * @param {BgDiagramDb} db - The database instance.
 * @param {string} id_coll - The ID of the collection to synchronize.
 * @param {number} [target_pos] - The specific position to synchronize. If not provided, all positions in the collection will be synchronized.
 * @returns {Promise<void>} A promise that resolves when the synchronization is complete.
 */
export async function synchSpacedRepetitionFlag(db, id_coll, target_pos) {
    let coll = await db.getCollection(id_coll);
    let positions = target_pos ? [target_pos] : await db.listPositions(id_coll);

    const promises = [];

    for (const pos of positions) {
        if (coll.sr != !!pos.sr) {
            pos.sr = coll.sr ? { state: State.New } : undefined;
            promises.push(db.updatePosition(pos));
        }
    }

    return Promise.all(promises);
}

/**
 * Exports the database as a JSON object.
 *
 * @param {BgDiagramDb} db - The database instance.
 * @returns {Promise<Object>} A promise that resolves to an object containing the database data.
 */
export async function exportDatabase(db) {
    const data = {};

    const tx = db.transaction(null, Idb.Readonly);

    data.collections = await db.collections().list(tx);
    data.positions = await db.positions().list(tx);

    return {
        version: db.version,
        timestamp: new Date().toISOString(),
        data
    };
}

/**
 * Imports a database backup into the database.
 *
 * @param {BgDiagramDb} db - The database instance.
 * @param {Object} backup - The backup data to import.
 * @returns {Promise<void>} A promise that resolves when the import is complete.
 */
export async function importDatabase(db, backup) {
    if (!backup.version || isNaN(backup.version) || backup.version > db.version) {
        throw new Error('error-restore-backup-version');
    }

    const data = backup.data;

    if (!data || !Array.isArray(data.collections) || !Array.isArray(data.positions)) {
        throw new Error('error-restore-backup-data');
    }

    const collIdIndex = {}

    const tx = db.transaction(null, Idb.Writable);

    db.collections().clear(tx);
    db.positions().clear(tx);

    for (const coll of data.collections) {
        if(!Number.isInteger(coll.id)) continue;
        const newId = await db.createCollection(sanitizeCollection(coll), tx);
        collIdIndex[coll.id] = newId; // Remember the new ID of the collection
    }

    for (const pos of data.positions) {
        if(!Number.isInteger(pos.id)) continue;
        const collId = collIdIndex[pos.id_coll];
        if(!collId) continue;
        pos.id_coll = collId; // Remap the old collection ID to the new one
        await db.addPosition(sanitizePosition(pos), tx);
    }
}
