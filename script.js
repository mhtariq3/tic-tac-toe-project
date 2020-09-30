class Board {
  theBoard;
  markCount;

  constructor() {
    this.markCount = 0;

    this.theBoard = [
      [document.getElementById("0"), document.getElementById("1"), document.getElementById("2")],
      [document.getElementById("3"), document.getElementById("4"), document.getElementById("5")],
      [document.getElementById("6"), document.getElementById("7"), document.getElementById("8")]
    ]

    for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				this.theBoard[i][j].textContent = "";
      }
    }
  }

  getMark(row, col) {
    return this.theBoard[row][col].textContent;
  }

  isFull() {
    return this.markCount == 9;
  }

  xWins() {
    return this.checkWinner("X") == 1;
  }

  oWins() {
    return this.checkWinner("O") == 1;
  }

  addMark(row, col, mark) {
    this.theBoard[row][col].textContent = mark;
    this.markCount++;
  }

  removeMark(row, col) {
    this.theBoard[row][col].textContent = "";
    this.markCount--;
  }

  clear() {
    for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				this.theBoard[i][j].textContent = "";
      }
    }
		this.markCount = 0;
  }

  checkWinner(mark) {
    let row, col;
		let result = 0;

		for (row = 0; result == 0 && row < 3; row++) {
			let row_result = 1;
			for (col = 0; row_result == 1 && col < 3; col++)
				if (this.theBoard[row][col].textContent != mark)
					row_result = 0;
			if (row_result != 0)
				result = 1;
		}

		for (col = 0; result == 0 && col < 3; col++) {
			let col_result = 1;
			for (row = 0; col_result != 0 && row < 3; row++)
				if (this.theBoard[row][col].textContent != mark)
					col_result = 0;
			if (col_result != 0)
				result = 1;
		}

		if (result == 0) {
			let diag1Result = 1;
			for (row = 0; diag1Result != 0 && row < 3; row++)
				if (this.theBoard[row][row].textContent != mark)
					diag1Result = 0;
			if (diag1Result != 0)
				result = 1;
		}

		if (result == 0) {
			let diag2Result = 1;
			for (row = 0; diag2Result != 0 && row < 3; row++)
				if (this.theBoard[row][3 - 1 - row].textContent != mark)
					diag2Result = 0;
			if (diag2Result != 0)
				result = 1;
		}
		return result;
  }
}

if(sessionStorage.getItem('gameType') == 'vsPlayer') {
  let title = document.querySelector(".title");
  let playerOne = "X";
  let playerTwo = "O";

  const board = new Board();

  let currPlayer = playerOne;
  title.textContent = "Player 1's turn";
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      board.theBoard[i][j].addEventListener("click", function() {

        if(board.getMark(i,j) == "") {
          board.addMark(i,j,currPlayer);
          if(currPlayer == playerOne) {
            currPlayer = playerTwo;
            title.textContent = "Player 2's turn";
          } else {
            currPlayer = playerOne;
            title.textContent = "Player 1's turn";
          }
        }


        if(board.xWins()) {
          sessionStorage.setItem('winner', 'X');
          location.assign("endGame.html");
        } else if(board.oWins()) {
          sessionStorage.setItem('winner', 'O');
          location.assign("endGame.html");
        } else if(board.isFull()) {
          sessionStorage.setItem('winner', 'tie');
          location.assign("endGame.html");
        }
      });
    }
  }
}
else { //AI PLAYER

  let humanPlayer = "X";
  let aiPlayer = "O";

  let board = new Board();

  function bestMove() {
    let bestScore = -1000;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if(board.getMark(i,j) == "") {
          board.addMark(i,j,currPlayer);
          let score = minimax(board, 0, false);
          board.removeMark(i,j);
          if(score > bestScore) {
            bestScore = score;
            move = {i,j};
          }
        }
      }
    }
    board.addMark(move.i, move.j, currPlayer);
    currPlayer = humanPlayer;
  }

  let scores = {
    "X": -1,
    "O": 1,
    "tie": 0
  }

  function minimax(board, depth, isMaximizing) {
    let result = null;
    if(board.xWins()) {
      result = "X";
    } else if (board.oWins()) {
      result = "O";
    } else if (board.isFull()) {
      result = "tie";
    }

    if(result != null) {
      return scores[result];
    }

    if(isMaximizing) {
      let bestScore = -1000;
      for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
          if(board.getMark(i,j) == "") {
            board.addMark(i,j,aiPlayer);
            let score = minimax(board, depth + 1, false);
            board.removeMark(i,j);
            if(score > bestScore) {
              bestScore = score;
            }
          }
        }
      }
      return bestScore;
    }
    else {
      let bestScore = 1000;
      for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
          if(board.getMark(i,j) == "") {
            board.addMark(i,j,humanPlayer);
            let score = minimax(board, depth + 1, true);
            board.removeMark(i,j);
            if(score < bestScore) {
              bestScore = score;
            }
          }
        }
      }
      return bestScore;
    }
  }



  let currPlayer = humanPlayer;

  let x = 1;
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      board.theBoard[i][j].addEventListener("click", function() {

        if(board.getMark(i,j) == "") {
          board.addMark(i,j,currPlayer);

          if(board.xWins()) {
            sessionStorage.setItem('winner', 'X');
            location.assign("endGameAI.html");
          } else if(board.oWins()) {
            sessionStorage.setItem('winner', 'O');
            location.assign("endGameAI.html");
          } else if(board.isFull()) {
            sessionStorage.setItem('winner', 'tie');
            location.assign("endGameAI.html");
          }

          currPlayer = aiPlayer;
          bestMove();
        }



        if(board.xWins()) {
          sessionStorage.setItem('winner', 'X');
          location.assign("endGameAI.html");
        } else if(board.oWins()) {
          sessionStorage.setItem('winner', 'O');
          location.assign("endGameAI.html");
        } else if(board.isFull()) {
          sessionStorage.setItem('winner', 'tie');

          location.assign("endGameAI.html");
        }
      });
    }
  }
}
