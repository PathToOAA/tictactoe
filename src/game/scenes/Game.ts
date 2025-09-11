import { Scene } from 'phaser';
import Board from '../elements/Board';
import Cell from '../elements/Cell';
import { Mark } from '../elements/Cell';
import Logger from '../../util/Logger';

type BoardState = [
    Mark | null,
    Mark | null,
    Mark | null,
    Mark | null,
    Mark | null,
    Mark | null,
    Mark | null,
    Mark | null,
    Mark | null,
];

type TurnResult = 'X-WIN' | 'O-WIN' | 'DRAW' | 'GO';

export class Game extends Scene {
    board: Board;
    cells: Cell[];
    player: Mark; // 현재 차례인 플레이어
    marked: BoardState;
    turn: number;

    constructor() {
        super('Game');
    }

    preload() {}

    create() {
        this.board = new Board(this);
        this.cells = this.board.createCells();
        this.player = 'X';
        this.marked = [null, null, null, null, null, null, null, null, null];
        this.turn = 1;
        this.events.on('cell:clicked', this.onCellClicked, this);
    }

    private onCellClicked(id: number) {
        // 클릭 당한 id 의 Cell 에서 turn 에 해당하는 이미지 표시
        this.cells[id].showMark(this.player);
        this.marked[id] = this.player;

        // 승패무 판정
        const turnResult = this.evaluateBoard(this.marked, this.player);

        // 게임 진행 분기
        if (turnResult === 'X-WIN') {
            // 게임 중단
            this.gameStop();
            // 승자 표시
            Logger.say('Game.onCellClicked', 'Winner is X!');
        } else if (turnResult === 'O-WIN') {
            this.gameStop();
            Logger.say('Game.onCellClicked', 'Winner is O!');
        } else if (turnResult === 'DRAW') {
            // 게임 중단
            this.gameStop();
            Logger.say('Game.onCellClicked', 'Draw...');
        }

        // turn 넘기기
        this.turn = this.turn + 1;
        if (this.player === 'X') {
            this.player = 'O';
            console.log('[Game.onCellClicked] this.turn: ', this.player);
        } else {
            this.player = 'X';
            console.log('[Game.onCellClicked] this.turn: ', this.player);
        }
    }

    private evaluateBoard(marked: BoardState, player: Mark): TurnResult {
        // 승리 조건
        if (player === marked[0] && player === marked[1] && player === marked[2])
            return `${player}-WIN`;
        if (player === marked[3] && player === marked[4] && player === marked[5])
            return `${player}-WIN`;
        if (player === marked[6] && player === marked[7] && player === marked[8])
            return `${player}-WIN`;
        if (player === marked[0] && player === marked[3] && player === marked[6])
            return `${player}-WIN`;
        if (player === marked[1] && player === marked[4] && player === marked[7])
            return `${player}-WIN`;
        if (player === marked[2] && player === marked[5] && player === marked[8])
            return `${player}-WIN`;
        if (player === marked[0] && player === marked[4] && player === marked[8])
            return `${player}-WIN`;
        if (player === marked[2] && player === marked[4] && player === marked[6])
            return `${player}-WIN`;

        // 무승부 조건
        if (this.turn === 9) return 'DRAW';

        // 나머지는 진행
        return 'GO';
    }

    private gameStop() {
        // Cell 인터랙션 잠금
        this.cells.map((c) => {
            c.lock();
        });
    }
}
