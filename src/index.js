import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
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
      itemSelected: false,
      selectedNum: 0,
      removeMiddle: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    this.setState ({ removeMiddle: false, });
    if (calculateWinner(squares)) {
      return;
    }
    if (this.state.itemSelected && !squares[i]) {
      if (this.state.selectedNum !== 4) {
        if ((squares[4] === 'X' && this.state.xIsNext) || (squares[4] === 'O' && !this.state.xIsNext)) {
          squares[this.state.selectedNum] = null;
          squares[i] = this.state.xIsNext ? 'X' : 'O';
          if (calculateWinner(squares)) {
            this.setState({
              history: history.concat([{
                squares: squares
              }]),
              xIsNext: !this.state.xIsNext,
              stepNumber: history.length,
            });
            return;
          }
          squares[i] = null;
          squares[this.state.itemSelected] = this.state.xIsNext ? 'X' : 'O';
          this.setState({ removeMiddle: true, });
          return;
        }
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      squares[this.state.selectedNum] = null;
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
        itemSelected: false,
      });
    }
    else if (this.state.stepNumber >= 6) {
      if ((squares[i] === 'X' && this.state.xIsNext) || (squares[i] === 'O' && !this.state.xIsNext)) {
        squares[i] = null;
        this.setState({
          itemSelected: true,
          selectedNum: i,
        });
      }
    } else {
      if (squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    }
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

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move:
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let itemInfo;
    if(this.state.itemSelected) {
      itemInfo = 'Piece in square ' + String(this.state.selectedNum+1) + ' selected.';
    } else {
      itemInfo = 'No piece selected.';
    }

    let moveInfo;
    if(this.state.removeMiddle) {
      moveInfo = 'You need to either leave middle or win this turn.';
    } else {
      moveInfo = '';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{itemInfo}</div>
          <div>{moveInfo}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
