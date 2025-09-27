import { Mark } from '../elements/Cell';

export type TurnResult = 'X-WIN' | 'O-WIN' | 'DRAW' | 'GO';

export enum GamePhase {
    READY = 'READY',
    PLAYING = 'PLAYING',
    FINISHED = 'FINISHED',
}

// 승리 조합
const WINNING_SETS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export default class GameState {
    board: (Mark | null)[];
    currentPlayer: Mark;
    moveCount: number;
    phase: GamePhase;

    constructor() {
        this.board = new Array(9).fill(null);
        this.currentPlayer = 'X';
        this.moveCount = 0;
        this.phase = GamePhase.READY;
    }

    resetRound() {
        this.board = new Array(9).fill(null);
        this.currentPlayer = 'X';
        this.moveCount = 0;
        this.phase = GamePhase.READY;
    }

    startRound() {
        this.phase = GamePhase.PLAYING;
    }

    canPlaceCell(index: number): boolean {
        return this.phase === GamePhase.PLAYING && this.board[index] === null;
    }

    applyMove(index: number): TurnResult {
        if (!this.canPlaceCell(index)) {
            return 'GO';
        }

        const player = this.currentPlayer;
        this.board[index] = player;
        this.moveCount += 1;

        if (this.hasMarkWon(player)) {
            this.phase = GamePhase.FINISHED;
            return `${player}-WIN` as TurnResult;
        }

        if (this.moveCount >= 9) {
            this.phase = GamePhase.FINISHED;
            return 'DRAW';
        }

        this.togglePlayer();
        return 'GO';
    }

    // 후보수 탐색
    getAvailableMoves(): number[] {
        const moves: number[] = [];
        this.board.forEach((mark, index) => {
            if (mark === null) {
                moves.push(index);
            }
        });
        return moves;
    }

    // 승리 판정
    isWinningMove(mark: Mark, index: number): boolean {
        const original = this.board[index];
        if (original !== null) {
            return false;
        }

        this.board[index] = mark;
        const didWin = this.hasMarkWon(mark);
        this.board[index] = original;
        return didWin;
    }

    // 특정 플레이어에 대한 승리 판정
    private hasMarkWon(mark: Mark): boolean {
        return WINNING_SETS.some(([a, b, c]) => {
            return this.board[a] === mark && this.board[b] === mark && this.board[c] === mark;
        });
    }

    private togglePlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
}
