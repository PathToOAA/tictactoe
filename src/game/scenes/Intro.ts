import Phaser from 'phaser';
import Logger from '../../util/Logger';

export class Intro extends Phaser.Scene {
    constructor() {
        Logger.say('Intro', '진입');
        super('Intro');
    }

    preload() {}

    create() {
        const rectX = this.scale.width / 2;
        const rectY = this.scale.height / 2;

        // rectangle 생성
        // 그 위에 text 생성
        const button = this.add.rectangle(rectX, rectY, 400, 120, 0xd9d9d9);
        this.add.text(rectX, rectY, 'Start Game', { fontSize: '60px' }).setOrigin(0.5);

        // interactive 켜주기 (안 켜주면 처 놀고 일 안함)
        button.setInteractive();

        // GameObjects 종류에 종속성 없이 어디서나 .on 으로 이벤트 추가 가능
        button.on('pointerdown', () => {
            this.startGame();
        });
    }

    startGame() {
        this.scene.start('Game');
    }
}
