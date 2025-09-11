import Phaser from 'phaser';
import Cell from './Cell';
import Logger from '../../util/Logger';

export default class Board {
    scene: Phaser.Scene;
    boardX: number;
    boardY: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.boardX = scene.scale.width / 2;
        this.boardY = scene.scale.height / 2;

        // 렌더링
        this.createBoard(scene);
        Logger.say('Board', 'createBoard 실행 완료');

        // 데이터 모델
    }

    createBoard(scene: Phaser.Scene) {
        const factory = scene.add;

        factory.rectangle(this.boardX, this.boardY, 360, 360, 0x9d9d9d);

        // 가로 세로 분리선 그리기
        // factory.rectangle(this.boardX, this.boardY - 60, 360, 4, 0x484848);
        // factory.rectangle(this.boardX, this.boardY + 60, 360, 4, 0x484848);

        // factory.rectangle(this.boardX - 60, this.boardY, 4, 360, 0x484848);
        // factory.rectangle(this.boardX + 60, this.boardY, 4, 360, 0x484848);
    }

    createCells() {
        const cells: Cell[] = [];
        for (let idx = 0; idx < 9; idx++) {
            const cell = new Cell(this.scene, idx, this.boardX - 180, this.boardY - 180);

            // 데이터 모델에 cells 등록
            cells[idx] = cell;
        }
        return cells;
    }
}
