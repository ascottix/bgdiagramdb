/*
    Backgammon board
    Copyright (c) 2025 Alessandro Scotti
    MIT License
*/
export class BgBoard {
    constructor(id) {
        this.reset();
        this.set(id);
    }

    // Reset the board
    reset() {
        this.board = Array(26).fill(0); // 0 is Black's bar, 25 is White's bar
        this.cubePosition = 0;
        this.cubeValue = 0;
        this.maxCubeValue = 6; // 2^6 = 64
        this.turn = 1; // 1 is the bottom player (White/X), -1 is the top player (Black/O)
        this.dice = '00';
        this.scoreBlack = 0;
        this.scoreWhite = 0;
        this.matchLength = 0;
        this.crawfordGame = false;
        this.jacoby = false;
        this.beaver = false;
    }

    setFromXGID(xgid) {
        this.reset();

        // Remove prefix
        if (xgid.startsWith('XGID=')) {
            xgid = xgid.substring(5);
        }

        // Tokenize
        const part = xgid.split(':');
        const token = part.map(Number);

        // Checkers
        for (let pos = 0; pos <= 25; pos++) {
            let count = xgid.codePointAt(pos) - 64;
            if (count > 0) {
                if (count > 15) {
                    count = 32 - count;
                }
                this.board[pos] = count;
            }
        }

        // Cube
        this.cubeValue = token[1];
        this.cubePosition = token[2];

        // Turn
        this.turn = token[3];

        // Dice
        this.dice = part[4];

        // Match information
        this.scoreWhite = token[5];
        this.scoreBlack = token[6];
        this.matchLength = token[8];

        if (this.matchLength > 0) {
            this.crawfordGame = token[7] == 1;
        } else {
            this.jacoby = (token[7] & 1) != 0;
            this.beaver = (token[7] & 2) != 0;
        }

        // Max cube value
        this.maxCubeValue = token[9];
    }

    setFromGnuBgId(id) {
        this.reset();

        // Transforms a GNU Backgammon ID string into a bit array
        function gnuIdToBitArray(base64String) {
            const bitArray = [];

            for (let byte of atob(base64String)) {
                const bits = byte.charCodeAt(0).toString(2).padStart(8, '0'); // Convert to binary and pad with zeros
                bitArray.push(...bits.split('').reverse()); // Bytes are little-endian, so reverse the bits
            }

            return bitArray.map(Number);
        }

        // Separate the position id and the match id
        const [position, match] = id.split(':').map(gnuIdToBitArray);

        // Parse the match id
        let offset = 0;

        function read(bits) {
            let value = 0;
            for (let i = 0; i < bits; i++) {
                value |= match[offset++] << i;
            }
            return value;
        }

        // Cube
        this.cubeValue = read(4);
        this.maxCubeValue = 15;
        switch (read(2)) {
            case 0: this.cubePosition = -1; break;
            case 1: this.cubePosition = 1; break;
        }

        // Player on roll
        this.turn = read(1) * 2 - 1;

        // Crawford flag
        this.crawfordGame = read(1) != 0;

        // Skip game state and player turn
        read(3 + 1);

        // Dice
        if (read(1)) {
            this.dice = 'D';
            read(2 + 3 + 3); // Skip resignation and dice values
        } else {
            read(2); // Skip resignation
            this.dice = `${read(3)}${read(3)}`;
        }

        // Match info
        this.matchLength = read(15);
        this.scoreBlack = read(15);
        this.scoreWhite = read(15);

        // Parse the position id
        offset = 0;

        for (let player = this.turn; Math.abs(player) == 1; player -= 2 * this.turn) {
            for (let point = 1; point <= 25; point++) {
                while (position[offset++]) this.board[player < 0 ? point : 25 - point] += player;
            }
        }
    }

    // Set board from XGID or GNU Backgammon ID string
    set(id) {
        if (BgBoard.isValidXgid(id)) {
            this.setFromXGID(id);
        } else if (BgBoard.isValidGnuBgId(id)) {
            this.setFromGnuBgId(id);
        } else {
            return true;
        }
    }

    // Set board to the initial position
    setInitialPosition() {
        this.setFromXGID('XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:0:0:6');
    }

    // Return the board as a XGID string
    get() {
        const board = this.board.map(count =>
            count == 0 ? '-' : count > 0 ?
                String.fromCodePoint(64 + count) :
                String.fromCodePoint(96 - count));

        const xgid = [
            board.join(''),
            this.cubeValue,
            this.cubePosition,
            this.turn,
            this.dice,
            this.scoreWhite,
            this.scoreBlack,
            this.crawfordGame ? 1 : 0,
            this.matchLength,
            this.maxCubeValue
        ];

        return 'XGID=' + xgid.join(':');
    }

    // Check if a string looks like a valid XGID
    static isValidXgid(xgid) {
        return /^XGID=[-a-oA-O]{26}:\d+:-?[01]:-?1:(00|[DBR]|[1-6]{2}):\d+:\d+:[0-3]:\d+:\d+$/.test(xgid);
    }

    // Check if a string looks like a valid GNU Backgammon ID
    static isValidGnuBgId(id) {
        return /^[A-Za-z0-9+/]{14}:[A-Za-z0-9+/]{12}$/.test(id);
    }

    // Clone the board
    clone() {
        return new BgBoard(this.get());
    }

    // Virtually flip the board if Black is to move. The idea is that,
    // regardless of color, the player to move:
    // - has positive point values (the opponent has negative point values);
    // - has the bar at 25;
    // - bears off at 0.
    vpos = (pos) => this.turn < 0 ? 25 - pos : pos;

    vboard = (p) => this.turn < 0 ? -this.board[25 - p] : this.board[p];

    // Check if a single play (i.e. a single checker movement) is legal
    isLegalPlay(from, to) {
        // Check bounds
        if (from < 0 || from > 25 || to < 0 || to > 25 || from <= to) return false;

        // Check if player to move has a checker on the source
        if (this.vboard(from) <= 0) return false;

        // If on the bar, must come off
        if (this.vboard(25) > 0 && from != 25) return false;

        // Normal move
        if (to > 0) {
            return this.vboard(to) > -2; // Destination must have less than 2 checkers of the opposite color
        }

        // Bearoff: make sure player is bearing off from the farthest point
        for (let i = 24; i > this.vpos(from); i--) if (this.vboard(i) > 0) return false;

        return this.vpos(from) <= 6; // Point must be in the home board
    }

    // Check if a full move (i.e. up to four checker movements) is legal
    isLegalMove(move) {
        const board = [...this.board]; // Save board state
        let ok = true;

        for (let i = 0; i < move.length; i++) {
            const { from, to } = move[i];

            if (this.isLegalPlay(from, to)) {
                this.moveSingleChecker(from, to);
            } else {
                ok = false;
                break;
            }
        }

        this.board = board; // Restore board state

        return ok;
    }

    // Play the specified move on the board, without checking for legality
    moveSingleChecker(from, to) {
        const capture = this.vboard(to) < 0;

        this.board[this.vpos(from)] -= this.turn;

        if (to != 0) {
            if (capture) {
                // Move opponent to bar
                this.board[this.vpos(0)] -= this.turn;
                this.board[this.vpos(to)] = 0;
            }

            this.board[this.vpos(to)] += this.turn;
        }

        return capture;
    }

    playMove(move) {
        move.forEach(m => this.moveSingleChecker(m.from, m.to));
    }

    flipTurn() {
        this.turn = -this.turn;
    }

    acceptDouble(cubeOwner) {
        this.cubeValue = Math.min(this.maxCubeValue, this.cubeValue + 1);
        this.cubePosition = cubeOwner;
    }

    acceptRedouble() {
        this.acceptDouble(-this.cubePosition);
    }

    // Convert move to text
    describeMove(move) {
        const list = move.map(({ from, to }) => ({
            t: `${from == 25 ? 'bar' : from}/${to == 0 ? 'off' : to}${this.vboard(to) < 0 ? '*' : ''}`,
            c: 1
        }));

        // Compress duplicates
        for (let i = 1; i < list.length; i++) {
            if (list[i].t == list[i - 1].t) {
                list[i].c += list[i - 1].c;
                list[i - 1].c = 0;
            }
        }

        return list.filter(m => m.c > 0).map(m => m.c > 1 ? `${m.t}(${m.c})` : m.t).join(' ');
    }

    // Convert text to move
    static parseMove(text) {
        const move = [];

        for (let m of text.split(/[,\s]\s*/)) {
            // Count how many times the move is repeated
            let count = 1;

            if (/\([234]\)$/.test(m)) {
                count = Number(m.slice(-2, -1));
                m = m.slice(0, -3);
            }

            // Parse the move
            const [from, to] = m.replace(/[*!?]+$/, '').replace('bar', 25).replace('off', 0).split('/').map(Number);

            if (isNaN(from) || isNaN(to)) {
                return null;
            }

            // Add the move to the result
            move.push(...Array(count).fill({ from, to }));
        }

        return move;
    }

    // Get the pipcount
    getWhitePipCount = () => this.board.map((c, i) => c > 0 ? i * c : 0).reduce((a, c) => a + c, 0);
    getBlackPipCount = () => this.board.map((c, i) => c < 0 ? (25 - i) * c : 0).reduce((a, c) => a - c, 0);

    // Get the checker count
    getWhiteCheckersCount = () => this.board.filter(c => c > 0).length;
    getBlackCheckersCount = () => this.board.filter(c => c < 0).length;

    // Return a text representation of the board
    toDiagram() {
        const frame = [
            '+13-14-15-16-17-18------19-20-21-22-23-24-+',
            '|                  |BAR|                  |',
            '+12-11-10--9--8--7-------6--5--4--3--2--1-+'];
        const out = [];

        // Return the checker representation for a specific point height
        const s = (c, t) => (t == 4 && Math.abs(c) > 5) ?
            Math.abs(c).toString().padStart(2, ' ') + ' ' : // Too many checkers, show number
            c > t ? ' X ' : c < -t ? ' O ' : '   ';

        // Top half
        out.push(frame[1 - this.turn]);

        for (let i = 0; i < 5; i++) {
            const row = [];

            for (let j = 13; j <= 24; j++) {
                row.push(s(this.board[j], i));
                if (j == 18) row.push(`|${s(this.board[25], i)}|`);
            }

            out.push(`|${row.join('')}|`);
        }

        // Center
        out.push(frame[1]);

        // Bottom half
        for (let i = 4; i >= 0; i--) {
            const row = [];

            for (let j = 12; j >= 1; j--) {
                row.push(s(this.board[j], i));
                if (j == 7) row.push(`|${s(this.board[0], i)}|`);
            }

            out.push(`|${row.join('')}|`);
        }

        out.push(frame[this.turn + 1]);

        // Cube
        const row = 5 + this.cubePosition * 4;
        if (this.crawfordGame) {
            out[row + 1] += ' Crawford';
        } else {
            out[row + 0] += ' +---+';
            out[row + 1] += ` |${(1 << this.cubeValue).toString().padStart(2, ' ')} |`;
            out[row + 2] += ' +---+';
        }

        // Other info
        out.push('');
        out.push(`Match X-O: ${this.scoreWhite}-${this.scoreBlack}/${this.matchLength}, pips: X=${this.getWhitePipCount()} O=${this.getBlackPipCount()},${s(this.turn, 0)}to play ${this.dice}`);

        return out.join('\n');
    }

    // Print the board
    print() {
        console.log(this.toDiagram());
    }
}
