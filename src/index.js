import React from 'react';
import ReactDOM from "react-dom";
import './index.css';
  
class Board extends React.Component {
    renderSquare(i) {
        console.log('i ', i);
        let fieldSelected = (this.props.field === i) ? true : false;
        if (this.props.winner && this.props.winner.length) {
            for (let j = 0, length = this.props.winner.length; j < length; j ++) {
                if (i === this.props.winner[j]) {
                    fieldSelected = true;
                }
            }
        }

        return (
            <Square 
                value={this.props.squares[i]}
                fieldSelected= {fieldSelected}
                winner={this.props.winner}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div> 
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            fields: [],
            fieldSelected: '',
            jumpTo: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        const fields = this.state.fields.concat(i);
        if (calculateWinner(squares)){
            alert(`to play again click on 'Go to game start', please`);
            return;
        } else if (this.state.jumpTo) {
            alert('To keep playing go to the last move, please');
            return;
        } else if (squares[i]) {
            return;
        } else {
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            this.setState({
                history: history.concat([{
                    squares: squares,
                }]),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext,
                fields: fields.concat(),
                fieldSelected: i,
            });
        }
    }

    jumpTo(step) {
        if (step === 0) {
            this.setState({
                history: [{
                    squares: Array(9).fill(null),
                }],
                stepNumber: 0,
                xIsNext: true,
                fields: [],
                fieldSelected: '',
                jumpTo: false,
            });
        } else {
            this.setState({
                stepNumber: step,
                xIsNext: (step % 2) === 0,
                fieldSelected:  this.state.fields[step - 1],
                jumpTo: (this.state.fields[step - 1] === this.state.fields[this.state.fields.length - 1]) ? false : true,
            });
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner =  calculateWinner(current.squares);
        const moves =  history.map((step, move) => {
            const desc = move ?
                `Go to move# + ${move} (field: ${this.state.fields[move - 1] + 1})` :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        let status;
        if (winner && winner.length) {
            status = 'The Winner is: ' + this.state.history[this.state.history.length - 1].squares[winner[0]];
        } else if (winner && !winner.length) {
            status = 'The game has ended in a draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    field={this.state.fieldSelected}
                    winner={winner}
                    onClick={(i) => this.handleClick(i)}/>
            </div>
            <div className="game-info">
                <div>{ status }</div>
                <ol>{ moves }</ol>
            </div>
            </div>
        );
    }
}

function Square(props) {
    let fieldSelected = (props.fieldSelected) ? 'square selected' : 'square';
    return (
        <button className={fieldSelected} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

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
    ]
    let boardNotCompleted;
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (!squares[a] || !squares[b] || !squares[c]) {
            boardNotCompleted = true;
        }
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    if (!boardNotCompleted) {
        return true;
    }
    return null;
}
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  