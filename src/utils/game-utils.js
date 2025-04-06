/*
    Backgammon diagram database
    Compressed game management utilities
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
import { Flags, decodeGame } from './game-encoder.js';
import { BgBoard } from './bgboard.js';

export function extractGamePositions(encodedGame) {
    const game = decodeGame(encodedGame);
    const positions = [];
    const board = new BgBoard();

    board.setInitialPosition();
    board.jacoby = (game.flags & Flags.Jacoby) != 0;
    board.beaver = (game.flags & Flags.Beaver) != 0;
    board.matchLength = game.matchLength;
    board.scoreBlack = game.score[0];
    board.scoreWhite = game.score[1];

    for (let i = 0; i < game.plays.length; i++) {
        const play = game.plays[i];
        if (play) {
            const player = i & 1 ? -1 : 1;
            if (play[0] == 't') {
                board.acceptDouble(player);
            } else {
                // Dice + moves
                const move = play.split(':')[1];
                if (move) {
                    board.playMove(BgBoard.parseMove(move));
                    positions.push(board.get());
                } // ...else player is on the bar and dances
            }
        }

        board.flipTurn();
    }

    return positions;
}

const SkippedInitialPositions = 6;
const SkippedFinalPositions = 6;

function getUsablePositionsCount(encodedGame) {
    const positions = extractGamePositions(encodedGame);
    let count = positions.length - SkippedInitialPositions; // Remove the first few positions, which are too similar
    if (!encodedGame.endsWith('c')) count -= SkippedFinalPositions; // Remove the last few positions too, which may be too empty
    return Math.max(count, 0);
}

export function getPositionsCumulativeCounts(encodedGames) {
    const lengths = encodedGames.map(encodedGame => getUsablePositionsCount(encodedGame));
    const cumulative = [];
    let acc = 0;
    for (const len of lengths) {
        acc += len;
        cumulative.push(acc);
    }
    return cumulative;
}

export function getRandomPositionIndex(cumulativeCounts) {
    const totalPositions = cumulativeCounts[cumulativeCounts.length - 1];

    return Math.floor(Math.random() * totalPositions);
}

export function getPositionAtIndex(encodedGames, cumulativeCounts, posIndex) {
    let gameIndex = 0;
    while (cumulativeCounts[gameIndex] <= posIndex) gameIndex++;

    const positions = extractGamePositions(encodedGames[gameIndex]);
    const localIndex = SkippedInitialPositions + posIndex - (gameIndex > 0 ? cumulativeCounts[gameIndex - 1] : 0);

    return positions[localIndex];
}
