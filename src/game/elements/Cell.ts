export type Mark = 'X' | 'O';

export default class Cell {
    id: number;
    scene: Phaser.Scene;
    board_x0: number;
    board_y0: number;
    cell: Phaser.GameObjects.Rectangle;
    locked: boolean;
    x: number;
    y: number;
    imgO?: Phaser.GameObjects.Image;
    imgX?: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, id: number, x_start: number, y_start: number) {
        this.id = id;
        this.scene = scene;
        this.board_x0 = x_start;
        this.board_y0 = y_start;
        this.locked = false;
        this.createCell(scene);
    }

    private createCell(scene: Phaser.Scene) {
        const factory = scene.add;

        const x_idx = this.id % 3;
        const y_idx = Math.floor(this.id / 3);

        this.x = 60 + x_idx * 120;
        this.y = 60 + y_idx * 120;

        this.cell = factory
            .rectangle(this.board_x0 + this.x, this.board_y0 + this.y, 116, 116, 0x333333, 1)
            .setInteractive();

        this.cell.on('pointerdown', () => {
            this.scene.events.emit('cell:clicked', this.id);
        });

        this.imgX = this.scene.add.image(this.cell.x, this.cell.y, 'xMarker').setVisible(false);
        this.imgO = this.scene.add.image(this.cell.x, this.cell.y, 'oMarker').setVisible(false);
        this.imgX.setDisplaySize(116, 116);
        this.imgO.setDisplaySize(116, 116);
    }

    showMark(mark: Mark) {
        if (mark === 'X') {
            this.imgX?.setVisible(true);
        } else {
            this.imgO?.setVisible(true);
        }

        this.lock();
    }

    lock() {
        this.locked = true;
        this.cell.disableInteractive();
    }

    reset() {
        this.locked = false;
        this.cell.setInteractive();
        this.imgX?.setVisible(false);
        this.imgO?.setVisible(false);
    }

    setInputActive(active: boolean) {
        if (active && !this.locked) {
            this.cell.setInteractive();
            return;
        }

        this.cell.disableInteractive();
    }
}
