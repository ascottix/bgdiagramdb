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

export function sanitizeCollection(coll) {
    coll.name = sanitizeHtml(coll.name);
    coll.desc = sanitizeHtml(coll.desc);
    coll.sr = !!coll.sr;

    return coll;
}

export function sanitizePosition(pos) {
    pos.title = sanitizeHtml(pos.title);
    pos.xgid = sanitizeHtml(pos.xgid);
    if (!Array.isArray(pos.tags)) pos.tags = [];
    pos.tags = pos.tags.map(t => sanitizeHtml(t));
    pos.question = sanitizeHtml(pos.question);
    pos.comment = sanitizeHtml(pos.comment);

    return pos;
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

    // TODO: should be in a single transaction
    const coll = sanitizeCollection({ name: data.name, desc: data.desc, sr: data.sr });
    const id_coll = await db.createCollection(coll);

    for(const pos of data.positions) {
        pos.id_coll = id_coll;
        pos.sr = coll.sr ? { state: State.New } : undefined; // Ensure spaced repetition flag is set correctly
        sanitizePosition(pos);
        await db.addPosition(pos); // Make sure positions are added in the original order (don't async)
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
 * @param {string} id_coll - The ID of the collection to synchronize.
 * @param {number} [pos] - The specific position to synchronize. If not provided, all positions in the collection will be synchronized.
 * @returns {Promise<void>} A promise that resolves when the synchronization is complete.
 */
export async function synchSpacedRepetitionFlag(db, id_coll, pos) {
    let coll = await db.getCollection(id_coll);
    let positions = pos ? [pos] : await db.listPositions(id_coll);

    const promises = [];

    for (let pos of positions) {
        if (coll.sr != !!pos.sr) {
            pos.sr = coll.sr ? { state: State.New } : undefined;
            promises.push(db.updatePosition(pos));
        }
    }

    return Promise.all(promises);
}

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

export async function importDatabase(db, backup) {
    if (!backup.version || isNaN(backup.version) || backup.version > db.version) {
        throw new Error('error-restore-backup-version');
    }

    const data = backup.data;

    if (!data || !Array.isArray(data.collections) || !Array.isArray(data.positions)) {
        throw new Error('error-restore-backup-data');
    }

    const tx = db.transaction(null, Idb.Writable);

    db.collections().clear(tx);
    db.positions().clear(tx);

    for (const coll of data.collections) {
        sanitizeCollection(coll);
        await db.collections().put(coll, tx);
    }

    for (const pos of data.positions) {
        sanitizePosition(pos);
        await db.positions().put(pos, tx);
    }
}
