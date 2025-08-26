import Phaser from 'phaser';

export default class Board {
    constructor(scene: Phaser.Scene) {
        // 렌더링
        this.createBoard(scene);

        // 데이터 모델
    }

    createBoard(scene: Phaser.Scene) {
        const factory = scene.add;

        const bX = scene.scale.width / 2;
        const bY = scene.scale.height / 2;
        factory.rectangle(bX, bY, 360, 360, 0x9D9D9D);
    }
}