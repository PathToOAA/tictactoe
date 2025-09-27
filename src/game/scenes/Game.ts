import Phaser from 'phaser';
import Board from '../elements/Board';
import Cell, { Mark } from '../elements/Cell';
import GameState, { GamePhase, TurnResult } from '../state/GameState';

type GameMode = 'PVP' | 'PVE';

// init 함수에 전달 될 props type
type GameSceneData = {
    mode?: GameMode;
};

export class Game extends Phaser.Scene {
    board: Board;
    cells: Cell[];
    state: GameState;
    resultObjects: Phaser.GameObjects.GameObject[];
    gameMode: GameMode;
    aiTimer?: Phaser.Time.TimerEvent;

    constructor() {
        super('Game');
        this.gameMode = 'PVP';
    }

    init(data: GameSceneData) {
        this.gameMode = data?.mode ?? 'PVP';
    }

    preload() {}

    create() {
        this.board = new Board(this);
        this.cells = this.board.cells;
        this.state = new GameState();
        this.resultObjects = [];

        // 이벤트 초기화
        this.events.off('cell:clicked', this.onCellClicked, this);
        this.events.on('cell:clicked', this.onCellClicked, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.clearAiTimer();
            this.events.off('cell:clicked', this.onCellClicked, this);
        });

        this.enterReady();
    }

    private enterReady() {
        this.clearResultOverlay();
        this.clearAiTimer();
        this.state.resetRound();
        this.cells.forEach((cell) => cell.reset());
        this.state.startRound();
        this.configureTurn(); // 턴 집행 엔트리 포인트
    }

    // 이벤트 버스로 관리
    private onCellClicked(id: number) {
        this.processMove(id);
    }

    // 착수 적용
    private processMove(id: number) {
        if (!this.state.canPlaceCell(id)) {
            return;
        }

        const currentPlayer: Mark = this.state.currentPlayer;

        this.cells[id].showMark(currentPlayer); // Cell 에 마킹
        const turnResult = this.state.applyMove(id); // GameState 갱신

        if (turnResult === 'GO') {
            this.configureTurn(); // 턴 판정 및 집행
            return;
        }

        this.finishRound(turnResult);
    }

    // timer 파괴, 인터랙션 잠금, 결과 UI 생성
    private finishRound(result: TurnResult) {
        this.clearAiTimer();
        this.cells.forEach((cell) => cell.lock());
        this.showResult(result);
    }

    // 턴 판정
    private configureTurn() {
        // PLAYING 상태 검증
        if (this.state.phase !== GamePhase.PLAYING) {
            this.disableBoardInput();
            return;
        }

        // AI 의 턴 집행
        if (this.gameMode === 'PVE' && this.state.currentPlayer === 'O') {
            this.disableBoardInput();
            this.scheduleAiMove();
            return;
        }

        // PLAYER 의 턴 집행
        this.clearAiTimer();
        this.enableBoardInput();
    }

    // 450ms 지연 실행
    private scheduleAiMove() {
        this.clearAiTimer();
        this.aiTimer = this.time.delayedCall(450, () => this.performAiMove());
    }

    // AI 행동 원리
    private performAiMove() {
        this.aiTimer = undefined;

        if (this.state.phase !== GamePhase.PLAYING) {
            return;
        }

        // 에러 처리: 상태 데이터가 꼬였을 경우 턴 재판정
        if (this.gameMode !== 'PVE' || this.state.currentPlayer !== 'O') {
            this.configureTurn();
            return;
        }

        const move = this.pickAiMove();
        if (move === undefined) {
            this.configureTurn();
            return;
        }

        this.processMove(move);
    }

    // AI 의 착수 결정
    // TODO: 난이도 상승을 위한 알고리즘 개선 필요
    private pickAiMove(): number | undefined {
        // 후보수 판정
        const available = this.state.getAvailableMoves();
        if (!available.length) {
            return undefined;
        }

        // 1. 한 수 메이트 탐색
        const aiMark: Mark = 'O';
        const winningMove = available.find((index) => this.state.isWinningMove(aiMark, index));
        if (winningMove !== undefined) {
            return winningMove;
        }

        // 2. 한 수 메이트 방어수 탐색
        const blockMove = available.find((index) => this.state.isWinningMove('X', index));
        if (blockMove !== undefined) {
            return blockMove;
        }

        // 3. 가능하다면 중앙 차지
        if (available.includes(4)) {
            return 4;
        }

        // 4. 코너 탐색
        const corners = [0, 2, 6, 8].filter((index) => available.includes(index));
        if (corners.length) {
            return corners[Math.floor(Math.random() * corners.length)];
        }

        // 5. 가장자리 탐색
        const edges = [1, 3, 5, 7].filter((index) => available.includes(index));
        if (edges.length) {
            return edges[Math.floor(Math.random() * edges.length)];
        }

        // 6. 이도 저도 아니면 가능한 수 중 가장 빠른 index 선택
        return available[0];
    }

    // Interaction 복구
    private enableBoardInput() {
        this.cells.forEach((cell) => cell.setInputActive(true));
    }

    // Interaction 일괄 해제
    private disableBoardInput() {
        this.cells.forEach((cell) => cell.setInputActive(false));
    }

    // timer 객체 파괴
    private clearAiTimer() {
        if (!this.aiTimer) {
            return;
        }

        this.aiTimer.remove(false);
        this.aiTimer = undefined;
    }

    // 게임 결과 UI 오브젝트 파괴
    private clearResultOverlay() {
        if (!this.resultObjects?.length) {
            return;
        }

        this.resultObjects.forEach((obj) => obj.destroy());
        this.resultObjects = [];
    }

    // Scene 에 UI 표시하고 각 UI 요소들의 접근자 집합을 반환
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
