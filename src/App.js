import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// each square on the board
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
        {props.value}
        </button>
    );
}

// checks if a player has won
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
        }
    }
    return null;
}

// whole board component
class Board extends Component {

    renderSquare(i, pos) {
        return (
            <Square key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i, pos)}
            />
        );
    }

    render() {
        let count = 0;
        let pos;
        let rows = [];

        // 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
        for(let row=1; row<=3; row++){
            let squares = [];
            for(let col=1; col<=3; col++){
                pos = {row: row, col: col}; // added an object to determine position
                // creating squares
                squares.push(this.renderSquare(count,pos));
                count++;
            }
            // creating a row of 3 squares
            rows.push(<div key={count} className="board-row">{squares}</div>);
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends Component {
    constructor(){
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            position: null,
            xIsNext: true,
            sortBy: 'asc',
        };
    }

    // handles events after a square is clicked
    handleClick(i,pos){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                position: { row: pos.row, col: pos.col},
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    // switches from sortBy value to ascending or descending
    // 4. Add a toggle button that lets you sort the moves in either ascending or descending order.
    toggleSort () {
        this.setState({
            sortBy: (this.state.sortBy === 'asc' ? 'desc' : 'asc')
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((step, move) => {
            let desc = 'Game start' // initial game start description
            let current;
            if (move){
                // 1. Display the move locations in the format "(1, 3)" instead of "6".
                const square = this.state.history[move].position;
                const position = '(' + square.row + ', ' + square.col + ')';
                desc = 'Move Position: #' + position; // description with each move done.

                // set current the class of move item on the list.
                // 2. Bold the currently-selected item in the move list.
                current = (move === this.state.stepNumber ? 'selected' : 'not-selected' )
            }

            return (
                // move list
                <li key={move}>
                    <a href="#" className={current} onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

        let order;
        if (this.state.sortBy !== 'asc') {
            moves.sort((a,b) => b.key - a.key);
            order = 'Ascending';
        } else {
            order = 'Descending';
        }



        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React TicTacToe Game</h2>
                </div>
                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={(i, pos) => this.handleClick(i, pos)}
                        />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <a onClick={() => this.toggleSort()}>Change to {order}</a>
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;