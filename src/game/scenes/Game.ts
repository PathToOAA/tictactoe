import { Scene } from 'phaser';
import Board from '../elements/Board';

export class Game extends Scene
{
    board: Board;

    constructor ()
    {
        super('Game');
    }

    preload ()
    {

    }

    create ()
    {
        this.board = new Board(this);
    }
}
