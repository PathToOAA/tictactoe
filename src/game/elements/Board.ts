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
        factory.rectangle(bX, bY, 360, 360, 0x9d9d9d);

        // 가로 세로 분리선 그리기
        factory.rectangle(bX, bY - 60, 360, 4, 0x484848);
        factory.rectangle(bX, bY + 60, 360, 4, 0x484848);

        factory.rectangle(bX - 60, bY, 4, 360, 0x484848);
        factory.rectangle(bX + 60, bY, 4, 360, 0x484848);
    }
}
