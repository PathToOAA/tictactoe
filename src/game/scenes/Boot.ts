import Phaser from 'phaser';

export class Boot extends Phaser.Scene {
    constructor() {
        console.log("[Boot] 진입");
        super("Boot");
    }

    preload() {
        this.load.setPath('assets');

        this.load.image('circle', 'cicle.png');
        this.load.image('ex', 'ex.png');
    }

    create() {
        this.scene.start("Intro");
    }
}