export type Mark = 'X' | 'O';

export default class Cell {
    id: number; // 식별자
    scene: Phaser.Scene; // Game Scene
    board_x0: number; // Board left-top 좌표
    board_y0: number;
    cell: Phaser.GameObjects.Rectangle; // 인터랙션 메인 요소
    locked: Boolean; // 상호 작용 가능 여부
    x: number; // Board 내 offset
    y: number;
    imgO?: Phaser.GameObjects.Image; // O X 이미지
    imgX?: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, id: number, x_start: number, y_start: number) {
        this.id = id;
        this.scene = scene;
        this.board_x0 = x_start;
        this.board_y0 = y_start;
        this.createCell(scene);
    }

    createCell(scene: Phaser.Scene) {
        const factory = scene.add;

        const x_idx = this.id % 3;
        const y_idx = Math.floor(this.id / 3);

        this.x = 60 + x_idx * 120;
        this.y = 60 + y_idx * 120;

        this.cell = factory
            .rectangle(this.board_x0 + this.x, this.board_y0 + this.y, 116, 116, 0x333333, 1)
            .setInteractive();

        // 마우스 오버 이벤트
        this.cell.on('pointerdown', () => {
            // 'cell:clicked' 호출과 함께 id 전달
            this.scene.events.emit('cell:clicked', this.id);
        });

        // 미리 X/O 이미지를 만들고 숨겨둠
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
        this.lock(); // 한번 선택이 되면 더 이상 선택 불가능
    }

    lock() {
        this.locked = true;
        this.cell.disableInteractive();
    }
}
