import Phaser from 'phaser';
import Cell from './Cell';

export default class Board {
    scene: Phaser.Scene;
    boardX: number;
    boardY: number;
    cells: Cell[];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.boardX = scene.scale.width / 2;
        this.boardY = scene.scale.height / 2;

        // 렌더링
        this.createBoard(scene);
        console.log('[Board] createBoard 실행 완료');

        // 데이터 모델
    }

    createBoard(scene: Phaser.Scene) {
        const factory = scene.add;

        factory.rectangle(this.boardX, this.boardY, 360, 360, 0x9d9d9d);
        this.cells = this.createCells();
    }

    createCells(): Cell[] {
        const cells: Cell[] = [];
        for (let idx = 0; idx < 9; idx++) {
            const cell = new Cell(this.scene, idx, this.boardX - 180, this.boardY - 180);

            // 데이터 모델에 cells 등록
            cells[idx] = cell;
        }
        return cells;
    }
}
