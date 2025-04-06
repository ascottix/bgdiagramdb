/*
    Backgammon diagram database
    IndexedDB wrapper
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
export class Idb {
    static Readonly = false;
    static Writable = true;

    static async open(name, version, upgradeCallback) {
        const request = indexedDB.open(name, version);

        request.onupgradeneeded = function () {
            upgradeCallback(request.result);
        }

        return Idb.handleRequest(request);
    }

    static async handleRequest(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Create a key range between lower and upper, with optional open or closed ends
    // (open end means the corresponding value is not included in the range)
    static range(lower, upper, lowerOpen, upperOpen) {
        return (upper == null) ?
            IDBKeyRange.only(lower) :
            IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
    }

    // Iterate over a cursor, with optional filter and pagination
    static iterateCursor(cursor, filter, offset, limit) {
        filter = filter || (() => true);

        return new Promise((resolve) => {
            const data = [];

            cursor.onsuccess = function (event) {
                const cursor = event.target.result;

                if (cursor) {
                    if (offset) {
                        cursor.advance(offset);
                        offset = 0;
                    } else {
                        if (filter(cursor.value, cursor)) {
                            data.push(cursor.value);
                        }
                        if (limit && data.length >= limit) {
                            resolve(data);
                        } else {
                            cursor.continue();
                        }
                    }
                } else {
                    resolve(data);
                }
            }
        });
    }

    // Paged iterator for IndexedDB cursors, with support for custom filters
    static pagedIterator(cursorFactory, pageSize, filter) {
        const pageIndex = [0];
        let currPage = 0;

        async function size() {
            const cursor = await cursorFactory();
            let count = 0;

            return new Promise((resolve) => {
                cursor.onsuccess = function (event) {
                    const cursor = event.target.result;

                    if (cursor) {
                        if (!filter || filter(cursor.value)) {
                            count++;
                        }
                        cursor.continue();
                    } else {
                        resolve({
                            count,
                            pages: Math.ceil(count / pageSize)
                        });
                    }
                }
            });
        }

        async function read() {
            const cursor = await cursorFactory();
            const data = [];
            let index = -1;

            return new Promise((resolve) => {
                cursor.onsuccess = function (event) {
                    const cursor = event.target.result;

                    if (cursor) {
                        if (index < 0) {
                            // First, initialize the index and seek to the page start
                            index = pageIndex[currPage];

                            if (index > 0) {
                                cursor.advance(index);

                                return;
                            }
                        }

                        // Add the record to the page if it matches the filter
                        if (!filter || filter(cursor.value)) {
                            if (data.length == pageSize) {
                                // We read an extra record to know if there are more pages to come
                                resolve({
                                    data,
                                    page: currPage,
                                    last: false
                                });

                                if (currPage == pageIndex.length - 1) {
                                    pageIndex.push(index);
                                }

                                return;
                            }

                            data.push(cursor.value);
                        }

                        // Iterate over the records, keeping track of the index
                        index++;
                        cursor.continue();
                    } else {
                        // No more records, return the last page
                        resolve({
                            data,
                            page: currPage,
                            last: true
                        });
                    }
                }
            });
        }

        function next() {
            seek(currPage + 1);
        }

        function prev() {
            seek(currPage - 1);
        }

        function seek(page) {
            if (page >= 0 && page < pageIndex.length) {
                currPage = page;
            }
        }

        async function last() {
            while (true) {
                const result = await read();

                if (result.last) {
                    return result;
                }

                next();
            }
        }

        // Return the paged iterator interface
        return {
            read, // Read the current page
            next, // Go to the next page
            prev, // Go to the previous page
            seek, // Go to a specific page
            size, // Get the total number of records and pages
            last  // Read the last page
        };
    }
}

export class IdbStore {
    constructor(idb, name) {
        this.idb = idb;
        this.name = name;
    }

    store(readwrite, tx) {
        tx = tx || this.idb.transaction(this.name, readwrite ? "readwrite" : "readonly");

        return tx.objectStore(this.name);
    }

    index(name, readwrite, tx) {
        return this.store(readwrite, tx).index(name);
    }

    async get(key, tx) {
        return Idb.handleRequest(this.store(Idb.Readonly, tx).get(key));
    }

    async add(data, tx) {
        return Idb.handleRequest(this.store(Idb.Writable, tx).add(data));
    }

    async put(data, tx) {
        return Idb.handleRequest(this.store(Idb.Writable, tx).put(data));
    }

    async delete(key, tx) {
        return Idb.handleRequest(this.store(Idb.Writable, tx).delete(key));
    }

    async list(tx) {
        return Idb.handleRequest(this.store(Idb.Readonly, tx).getAll());
    }

    async filter(filter, tx) {
        return Idb.iterateCursor(this.store(Idb.Readonly, tx).openCursor(), filter);
    }

    async clear(tx) {
        return Idb.handleRequest(this.store(Idb.Writable, tx).clear());
    }
}

export class IdbIndex {
    constructor(idbStore, name) {
        this.idbStore = idbStore;
        this.name = name;
    }

    #index() {
        return this.idbStore.index(this.name);
    }

    async get(key) {
        return Idb.handleRequest(this.#index().get(key));
    }

    async all(query) {
        return Idb.handleRequest(this.#index().getAll(query)); // Optional query can be a key or range
    }

    async count(query) {
        return Idb.handleRequest(this.#index().count(query)); // Optional query can be a key or range
    }

    async list(query, filter) {
        return Idb.iterateCursor(this.#index().openCursor(query), filter);
    }

    async unique() {
        return Idb.iterateCursor(this.#index().openCursor(undefined, 'nextunique'));
    }

    async keys() {
        return Idb.handleRequest(this.#index().getAllKeys());
    }

    async page(offset, limit, filter) {
        return Idb.iterateCursor(this.#index().openCursor(), filter, offset, limit);
    }
}
