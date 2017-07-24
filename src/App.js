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
            if (move){
                const square = this.state.history[move].position;
                const position = '(' + square.row + ', ' + square.col + ')';
                desc = 'Move Position: #' + position; // description with each move done.
            }
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

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
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;