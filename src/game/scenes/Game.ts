import { Scene } from 'phaser';
import Board from '../elements/Board';
import Cell from '../elements/Cell';
import { Mark } from '../elements/Cell';

export class Game extends Scene {
    board: Board;
    cells: Cell[];
    turn: Mark; // 현재 차례인 플레이어

    constructor() {
        super('Game');
    }

    preload() {}

    create() {
        this.board = new Board(this);
        this.cells = this.board.createCells();
        this.events.on('cell:clicked', this.onCellClicked, this);
    }

    private onCellClicked(id: number) {
        // 클릭 당한 id 의 Cell 에서 turn 에 해당하는 이미지 표시
        this.cells[id].showMark(this.turn);

        // turn 넘기기
        if (this.turn === 'X') {
            this.turn = 'O';
            console.log('[Game.onCellClicked] this.turn: ', this.turn);
        } else {
            this.turn = 'X';
            console.log('[Game.onCellClicked] this.turn: ', this.turn);
        }
    }
}
