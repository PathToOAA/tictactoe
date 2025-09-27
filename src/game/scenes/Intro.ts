import Phaser from 'phaser';

export class Intro extends Phaser.Scene {
    constructor() {
        console.log('[Intro] 진입');
        super('Intro');
    }

    preload() {}

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.add
            .text(centerX, centerY - 140, 'Tic Tac Toe', {
                fontSize: '80px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        this.createModeButton(centerX, centerY, 'Player vs Player', 'PVP');
        this.createModeButton(centerX, centerY + 140, 'Player vs AI', 'PVE');
    }

    // UI 요소 생성 함수
    private createModeButton(x: number, y: number, label: string, mode: 'PVP' | 'PVE') {
        const buttonWidth = 420;
        const buttonHeight = 110;

        // 버튼 배경
        const background = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0xd9d9d9, 1);
        background.setStrokeStyle(4, 0x101010); // 테두리 지정

        // 좌표, label 텍스트를 전부 주입 받아서 활용
        const text = this.add
            .text(x, y, label, {
                fontSize: '32px',
                color: '#101010',
            })
            .setOrigin(0.5);

        background.setInteractive({ useHandCursor: true }); // 화살표 커서

        background.on('pointerover', () => {
            background.setFillStyle(0xf2f2f2, 1);
        }); // hover 시 색상 변경

        background.on('pointerout', () => {
            background.setFillStyle(0xd9d9d9, 1);
        }); // hover out 색상

        background.on('pointerdown', () => {
            this.startGame(mode);
        }); // mode 주입

        text.setDepth(background.depth + 1);
    }

    // Game 씬에 mode 주입
    startGame(mode: 'PVP' | 'PVE') {
        this.scene.start('Game', { mode });
    }
}
