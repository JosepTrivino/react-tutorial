import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
	return(
		<button 
		  className="square" 
		  onClick={props.onClick}
		  style={{color: props.color}}
		  >
			{props.value}
		</button>
	);
}

function calculatePosition(index){
	const position = [
 		[1,1],
 		[1,2],
 		[1,3],
 		[2,1],
 		[2,2],
 		[2,3],
 		[3,1],
 		[3,2],
 		[3,3],
	];
	return position[index];
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
  for (let i = 0; i < lines.length; i++){
  	const [a, b, c] = lines[i];
  	if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]){
  		return  [a, b, c];
  	}
  }
 return null;
}

class Board extends React.Component {

  renderSquare(i) {
  	let color = 'black';
  	if (this.props.winner && this.props.winner.includes(i)){
  		color = 'red';
  	}
    return <Square
     value={this.props.squares[i]}
     color={color}
     onClick={()=> this.props.onClick(i)} 
    />;
  }

  render() {
  	const size = 3;
  	const items = [];
  	for(let i = 0; i < 9; i=i+3){
  		const squares = [];
  		for(let j = 0; j < size; j++){
  			squares.push(this.renderSquare(i+j));
  		}
  		items.push(<div className="board-row">{squares}</div>);
  	}
    return (
      <div>
        {items}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		history: [{
  			squares: Array(9).fill(null),
  			positionClicked: null,
  		}],
  		xIsNext: true,
  		stepNumber: 0,
   		reverse: true,
  	};
  }

  handleClick(i){
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();
  	const position = calculatePosition(i);
  	if (calculateWinner(squares) || squares[i]){
  		return
  	}
  	squares[i] = this.state.xIsNext ? 'X' : 'O';

  	this.setState({
  		history: history.concat([{
  			squares: squares,
  			positionClicked: position,
  		}]),
  		xIsNext: !this.state.xIsNext,
  		stepNumber: history.length,
  	});
  }

  jumpTo(step){
  	this.setState({
  		stepNumber: step,
  		xIsNext: (step % 2) === 0,
  	});
  }

  changeOrder(){
  	this.setState({reverse: !this.state.reverse,});
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move +' ('+step.positionClicked+')':
        'Go to game start';
      let bold = move === this.state.stepNumber ? 'bold' : '';
      return (
        <li key={move}>
          <button 
          	onClick={() => this.jumpTo(move)} 
          	style={{fontWeight: bold}}
          >
          	{desc}
		  </button>
        </li>
      );
    });

    let status;
    if (winner){
    	status = 'Winner: ' + current.squares[winner[0]];
    } 
    else if (stepNumber === 9) {
    	status = 'Draw';
    }
    else{
    	status = 'Next player: '+ (this.state.xIsNext ? 'X': 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.reverse ? moves : moves.reverse()}</ol>
          <button onClick={() => this.changeOrder() }>Change order</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
