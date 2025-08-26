import Phaser from 'phaser';

export class Boot extends Phaser.Scene {
    constructor() {
        super();
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