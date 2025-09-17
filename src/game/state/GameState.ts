import { Mark } from '../elements/Cell';

export type TurnResult = 'X-WIN' | 'O-WIN' | 'DRAW' | 'GO';

export enum GamePhase {
    READY = 'READY',
    PLAYING = 'PLAYING',
    FINISHED = 'FINISHED',
}

export default class GameState {
    board: (Mark | null)[]; // Board 객체가 아닌 자체 기록용 리스트
    currentPlayer: Mark;
    moveCount: number; // 9턴 도착 시 게임 종료 판정
    phase: GamePhase;

    constructor() {
        this.board = new Array(9).fill(null);
        this.currentPlayer = 'X';
        this.moveCount = 0;
        this.phase = GamePhase.READY;
    }

    // 모든 상태 정보 초기화
    resetRound() {
        this.board = new Array(9).fill(null);
        this.currentPlayer = 'X';
        this.moveCount = 0;
        this.phase = GamePhase.READY;
    }

    // 게임 시작
    startRound() {
        this.phase = GamePhase.PLAYING;
    }

    // 착수 가능 판정
    canPlaceCell(index: number): boolean {
        // 조건 1) PLAYING 상태여야 함
        // 조건 2) 클릭한 Cell 이 비어있어야 함
        return this.phase === GamePhase.PLAYING && this.board[index] === null;
    }

    // 착수 작용
    applyMove(index: number): TurnResult {
        if (!this.canPlaceCell(index)) {
            return 'GO';
        }

        this.board[index] = this.currentPlayer;
        this.moveCount += 1;

        // 착수 결과는 총 2가지이다

        // 결과 1) 방금 착수한 player 의 승리
        if (this.didCurrentPlayerWin()) {
            this.phase = GamePhase.FINISHED;
            return `${this.currentPlayer}-WIN` as TurnResult;
        }

        // 결과 2) 무승부
        if (this.moveCount >= 9) {
            this.phase = GamePhase.FINISHED;
            return 'DRAW';
        }

        // 차례를 넘김
        this.togglePlayer();
        return 'GO';
    }

    // 방금 착수한 플레이어의 승리 판정
    private didCurrentPlayerWin(): boolean {
        const player = this.currentPlayer;
        const board = this.board;

        // 승리하는 경우의 수
        const winningSets = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // 방금 착수한 player 의 mark 가 winningSets 조합 중 하나를 완성할 경우
        return winningSets.some(([a, b, c]) => {
            return board[a] === player && board[b] === player && board[c] === player;
        });
    }

    // player 변경
    private togglePlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
}
