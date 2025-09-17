import Phaser from 'phaser';
import Board from '../elements/Board';
import Cell, { Mark } from '../elements/Cell';
import GameState, { TurnResult } from '../state/GameState';

export class Game extends Phaser.Scene {
    board: Board;
    cells: Cell[];
    state: GameState;
    resultObjects: Phaser.GameObjects.GameObject[];

    constructor() {
        super('Game');
    }

    preload() {}

    create() {
        this.board = new Board(this);
        this.cells = this.board.cells;
        this.state = new GameState();
        this.resultObjects = [];

        this.events.off('cell:clicked', this.onCellClicked, this);
        this.events.on('cell:clicked', this.onCellClicked, this);

        this.enterReady();
    }

    private enterReady() {
        this.clearResultOverlay();
        this.state.resetRound(); // Game 상태 초기화
        this.cells.forEach((cell) => cell.reset()); // 실제 interaction 주체인 cell 초기화
        this.state.startRound();
    }

    private onCellClicked(id: number) {
        if (!this.state.canPlaceCell(id)) {
            return;
        }

        const currentPlayer: Mark = this.state.currentPlayer;

        this.cells[id].showMark(currentPlayer);
        const turnResult = this.state.applyMove(id);

        if (turnResult === 'GO') {
            return;
        }

        this.finishRound(turnResult);
    }

    private finishRound(result: TurnResult) {
        this.cells.forEach((cell) => cell.lock());
        this.showResult(result);
    }

    private clearResultOverlay() {
        if (!this.resultObjects?.length) {
            return;
        }

        this.resultObjects.forEach((obj) => obj.destroy());
        this.resultObjects = [];
    }

    private showResult(message: string) {
        const { width, height } = this.scale;

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

        const resultText = this.add
            .text(width / 2, height / 2 - 50, message, {
                fontSize: '32px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        const restartText = this.add
            .text(width / 2, height / 2 + 30, 'Restart', {
                fontSize: '28px',
                backgroundColor: '#222222',
                padding: { left: 10, right: 10, top: 5, bottom: 5 },
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setInteractive();

        restartText.on('pointerover', () => {
            restartText.setStyle({ backgroundColor: '#444444' });
        });
        restartText.on('pointerout', () => {
            restartText.setStyle({ backgroundColor: '#222222' });
        });

        restartText.on('pointerdown', () => {
            this.enterReady();
        });

        this.resultObjects = [overlay, resultText, restartText];
    }
}
