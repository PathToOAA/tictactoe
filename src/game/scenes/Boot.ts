import Phaser from 'phaser';
import Logger from '../../util/Logger';

export class Boot extends Phaser.Scene {
    constructor() {
        Logger.say('Boot', '진입');
        super('Boot');
    }

    preload() {
        this.load.setPath('assets');

        this.load.image('oMarker', 'circle.png');
        this.load.image('xMarker', 'ex.png');
    }

    create() {
        this.scene.start('Intro');
    }
}
