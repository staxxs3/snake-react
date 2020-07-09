import React, {Component} from 'react';
import Cells from './Cells';
import './style.css';
import {START, BODY, KEYS, COLS, ROWS, FOOD, DIRS, STONE} from './const';

class game extends Component {
    constructor(props){
    super(props);

    this.state = {

        board: [],
        snake: [],
        direction: null,
        gameOver: false
    };

    this.start = this.start.bind(this);
    this.frame = this.frame.bind(this);
    this.handleKey = this.handleKey.bind(this);
    }

    componentDidMount(){
        this.start();
    }

    start(){
        const board = [];
        const snake = [START];
        board[START] = BODY;



        this.setState({
            board,
            snake,
            direction: KEYS.right
        }, () => {
            this.frame();
        });

    }




    frame(){

        let {snake, board, direction} = this.state;
        const head = this.getNextIndex(snake[0], direction);
        const food = board[head] === FOOD || snake.length === 1;
        const stone = board[head] === STONE;
        let points = 0;



        if(food){
            const maxCells = ROWS * COLS;
            points += 100;
            let i;
            let j;
            do{
                i = Math.floor(Math.random() * maxCells);
                j = Math.floor(Math.random() * maxCells)
            }while (board[i]);
            board[i] = FOOD;
            board[j] = STONE
        }else{
            board[snake.pop()] = null;

        }


        if(snake.indexOf(head) !== -1 || stone){
            this.setState({gameOver: true});
            return
        }



        board[head] = BODY;
        snake.unshift(head);    //dodaje nowa pozycje na poczatku tablicy




        if(this.nextDirection){
            direction = this.nextDirection;
            this.nextDirection = null;

        }

        this.setState({
            board,
            snake,
            direction,
            points
        }, () => {
            setTimeout(this.frame, 90)
        })



    }

    handleKey = (event) => {
        const direction = event.nativeEvent.keyCode;
        const diff = Math.abs(this.state.direction - direction);

        if(DIRS[direction] && diff !== 0 && diff !== 2){
            this.nextDirection = direction;
        }
    };

    getNextIndex(head, direction){
         let x = head % COLS;
         let y = Math.floor(head / COLS);

         switch(direction){
             case KEYS.up: y = y <= 0 ? ROWS - 1: y - 1; break;
             case KEYS.down: y = y >= ROWS ? 0: y + 1; break;
             case KEYS.left: x = x <= 0 ? COLS - 1: x - 1; break;
             case KEYS.right: x = x >= COLS - 1 ? 0: x + 1; break;

             default: return;
         }

         return (COLS * y) + x;
    }

    render(){
        const {board} = this.state;
        return (<Cells handleKey={this.handleKey} board={board} />)
    }
}

export default game;
