/*
    Backgammon diagram database
    Database access layer
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
import { Idb, IdbIndex, IdbStore } from './indexeddb.js';

const DbVersion = 1;

const DbName = 'BgDiagramDb';
const StoreCollections = 'collections';
const StorePositions = 'positions';
const StoreSettings = 'settings';
const IndexPositionByCollection = 'idx_pos_id_coll';
const IndexPositionByCategory = 'idx_pos_cat';
const IndexPositionByCardDue = 'idx_pos_due';
const IndexPositionByCardState = 'idx_pos_state';
const IndexCollectionByName = 'idx_coll_name';

export class BgDiagramDb {
    constructor(db) {
        this.db = db;
    }

    static async open(onUpgradeNeededCallback) {
        const db = await Idb.open(DbName, DbVersion, (db) => {
            // Collections
            const collections = db.createObjectStore(StoreCollections, { keyPath: 'id', autoIncrement: true });

            collections.createIndex(IndexCollectionByName, 'name', { unique: true });

            // Positions
            const positions = db.createObjectStore(StorePositions, { keyPath: 'id', autoIncrement: true });

            positions.createIndex(IndexPositionByCollection, 'id_coll');
            positions.createIndex(IndexPositionByCategory, 'tags', { multiEntry: true });
            positions.createIndex(IndexPositionByCardState, 'sr.state');
            positions.createIndex(IndexPositionByCardDue, 'sr.due');

            // Settings
            db.createObjectStore(StoreSettings, { keyPath: 'name' });

            // Populate database
            collections.transaction.oncomplete = () => {
                // Add default collection
                const tx = db.transaction([StoreCollections, StorePositions], 'readwrite');
                const store = tx.objectStore(StoreCollections);
                store.add({ name: 'Default' });
            }

            // Invoke callback if specified
            onUpgradeNeededCallback && onUpgradeNeededCallback(db);
        });

        return new BgDiagramDb(db);
    }

    // Metadata
    get version() {
        return DbVersion;
    }

    get objectStoreNames() {
        return [...this.db.objectStoreNames];
    }

    // Transactions
    transaction(storeNames, readwrite) {
        return this.db.transaction(storeNames || this.objectStoreNames, readwrite ? "readwrite" : "readonly");
    }

    // Stores
    collections() {
        return new IdbStore(this.db, StoreCollections);
    }

    positions() {
        return new IdbStore(this.db, StorePositions);
    }

    settings() {
        return new IdbStore(this.db, StoreSettings);
    }

    // Collections
    async createCollection(coll, tx) {
        return this.collections().add(coll, tx);
    }

    async getCollection(id, tx) {
        return this.collections().get(id, tx);
    }

    async deleteCollection(id, tx) {
        tx = tx || this.transaction([StoreCollections, StorePositions], Idb.Writable);

        // Delete all positions in this collection
        const index = this.positions().index(IndexPositionByCollection, Idb.Writable, tx);
        const positions = index.openCursor(id);

        await Idb.iterateCursor(positions, (_, cursor) => cursor.delete());

        // Delete the collection
        return this.collections().delete(id, tx);
    }

    async updateCollection(coll, tx) {
        return this.collections().put(coll, tx);
    }

    async listCollections(count, tx) {
        const collections = await this.collections().list(tx);

        if (count) {
            for (const coll of collections) {
                coll.size = await this.countPositions(coll.id, tx);
            }
        }

        return collections;
    }

    async existsCollection(name) {
        return new IdbIndex(this.collections(), IndexCollectionByName).get(name).then(e => e != null);
    }

    // Positions
    async addPosition(pos, tx) {
        return this.positions().add(pos, tx);
    }

    async getPosition(id, tx) {
        return this.positions().get(id, tx);
    }

    async deletePosition(id, tx) {
        return this.positions().delete(id, tx);
    }

    async updatePosition(pos, tx) {
        return this.positions().put(pos, tx);
    }

    async listPositions(id_coll) {
        const index = new IdbIndex(this.positions(), IndexPositionByCollection);

        return index.all(id_coll);
    }

    async countPositions(id_coll) {
        const index = new IdbIndex(this.positions(), IndexPositionByCollection);

        return index.count(id_coll);
    }

    async getUniquePositionCategories() {
        const tags = [];
        const index = this.positions().index(IndexPositionByCategory);
        const filter = (_, cursor) => {
            tags.push(cursor.key);
            return true;
        }
        await Idb.iterateCursor(index.openCursor(undefined, 'nextunique'), filter);
        return tags;
    }

    getPositionsIndexByCategory() {
        return this.positions().index(IndexPositionByCategory);
    }

    getPositionsIndexByCollection() {
        return this.positions().index(IndexPositionByCollection);
    }

    async findCardsInState(id_coll, state, countOnly) {
        if (id_coll) {
            const positions = await this.listPositions(id_coll);
            const result = positions.filter(pos => pos.sr?.state == state);
            return countOnly ? result.length : result;
        } else {
            const index = new IdbIndex(this.positions(), IndexPositionByCardState);
            const range = Idb.range(state);
            return countOnly ? index.count(range) : index.all(range);
        }
    }

    async findDueCards(id_coll, now, countOnly) {
        now = now || Date.now();

        if (id_coll) {
            const positions = await this.listPositions(id_coll);
            const result = positions.filter(pos => pos.sr?.due <= now);
            return countOnly ? result.length : result;
        } else {
            const index = new IdbIndex(this.positions(), IndexPositionByCardDue);
            const range = Idb.range(0, now);
            return countOnly ? index.count(range) : index.all(range);
        }
    }

    // Settings
    async getSetting(name) {
        return this.settings().get(name).then(e => e?.value);
    }

    async setSetting(name, value) {
        return this.settings().put({ name, value });
    }

    async getAllSettings() {
        return this.settings().list().then(list => list.reduce((acc, e) => { acc[e.name] = e.value; return acc; }, {}));
    }
}
