export default class Cell {
    id: number;
    x_start: number;
    y_start: number;

    constructor(scene: Phaser.Scene, id: number, x_start: number, y_start: number) {
        this.id = id;
        this.x_start = x_start;
        this.y_start = y_start;
        this.createCell(scene);
    }

    createCell(scene: Phaser.Scene) {
        const factory = scene.add;

        const x_idx = this.id % 3;
        const y_idx = Math.floor(this.id / 3);

        const x_pos = 60 + x_idx * 120;
        const y_pos = 60 + y_idx * 120;

        const cell = factory.rectangle(
            this.x_start + x_pos,
            this.y_start + y_pos,
            116,
            116,
            0x1188ff,
            1,
        );
    }
}
