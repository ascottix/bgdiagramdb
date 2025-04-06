/*
    Backgammon diagram database
    Game encoding and decoding
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
export const Flags = Object.freeze({
    Crawford: 1,
    Beaver: 2,
    Jacoby: 4
});

function encodeNumber(n) {
    return String.fromCharCode(65 + n); // 0=A, 1=B, etc.
}

function decodeNumber(c) {
    return c.charCodeAt(0) - 65;
}

function encodeMove(movelist) {
    return movelist ? movelist.split(/[ ,]/).map(move => {
        const [from, to] = move.replace('*', '').split('/').map(Number);
        return `${encodeNumber(from)}${encodeNumber(to)}`;
    }).join('') : '';
}

function encodePlay(play) {
    if (!play) return ' ';
    switch (play[0]) {
        case 'd':
            return ''; // Drops are not encoded
        case 't':
        case 'c':
            return play[0];
        default:
            return play.substring(0, 2) + encodeMove(play.split(':')[1]);
    }
}

function decodePlay(play) {
    switch (play[0]) {
        case ' ':
            return null;
        case 't':
        case 'c':
            return play[0];
        default:
            {
                const dice = play.substring(0, 2);
                const moves = [];
                for (let i = 2; i < play.length; i += 2) {
                    const from = decodeNumber(play[i]);
                    const to = decodeNumber(play[i + 1]);
                    moves.push(`${from}/${to}`);
                }
                return dice + ':' + moves.join(' ');
            }
    }
}

function encodeMatchProps(match) {
    const prop = (name) => match.props[name] == 'On' ? 1 : 0;

    return prop('Crawford') * Flags.Crawford + prop('Beaver') * Flags.Beaver + prop('Jacoby') * Flags.Jacoby;
}

// Encodes a backgammon game (as a list of actions) into a single string.
// If the game is part of a match, then the most important match properties are encoded as well,
// so that the game string can be decoded independently from the match.
export function encodeGame(game, match) {
    const encodedPlays = game.plays.map(encodePlay).join('').trimEnd();
    const flags = encodeNumber(match ? encodeMatchProps(match) : 0);
    const score = match ? `${encodeNumber(match.length)}${encodeNumber(game.score[0])}${encodeNumber(game.score[1])}` : encodeNumber(0);
    return `${flags}${score}${encodedPlays}`;
}

export function decodeGame(game) {
    const hasHeader = game[0] >= 'A' && game[0] <= 'Z';
    const flags = hasHeader ? decodeNumber(game[0]) : 0;
    const matchLength = hasHeader ? decodeNumber(game[1]) : 0;
    const scoreBlack = matchLength ? decodeNumber(game[2]) : 0;
    const scoreWhite = matchLength ? decodeNumber(game[3]) : 0;
    const encodedMatch = hasHeader ? (matchLength ? game.slice(4) : game.slice(2)) : game;
    const encodedPlays = encodedMatch.replace(/( |c|t|[1-6][1-6])/g, ',$1').substring(1);
    const plays = encodedPlays.split(',').map(decodePlay);

    return {
        flags,
        matchLength, // 0 if money game, otherwise the match length
        score: [scoreBlack, scoreWhite], // Match score at the start of the game
        plays // List of actions: c for cube, t for take, else the dice values and a list of moves
    };
}
