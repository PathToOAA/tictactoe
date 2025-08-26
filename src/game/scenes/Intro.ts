import Phaser from 'phaser';

export class Intro extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
    }

    create() {
        this.scene.start("Game");
    }
}