const start = document.querySelector('#start');




class Game {
    constructor(height, width, p1Color, p2Color) {
        this.height = height;
        this.width = width;
        this.p1Color = p1Color;
        this.p2Color = p2Color;
        this.board = [];
        this.currPlayer = 1;
        this.makeBoard();
        this.makeHtmlBoard(); 
    }

        makeBoard() {
            for (let y = 0; y < this.height; y++) {
            this.board.push(Array.from({ length: this.width }));
            }
        }

        makeHtmlBoard() {
            const board = document.getElementById('board');
        
            // make column tops (clickable area for adding a piece to that column)
            const top = document.createElement('tr');
            top.setAttribute('id', 'column-top');
            top.addEventListener('click', this.handleClick);
        
            for (let x = 0; x < this.width; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
            }
        
            board.append(top);
        
            // make main part of board
            for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');
        
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }
        
            board.append(row);
            }
        }

        findSpotForCol(x) {
            for (let y = this.height - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
            }
            return null;
        }
        
        placeInTable(y, x) {
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.style.color = currPlayer === 1 ? this.p1Color : this.p2Color;
            piece.style.top = -50 * (y + 2);
            const spot = document.getElementById(`${y}-${x}`);
            spot.append(piece);
        }

        endGame(msg) {
            alert(msg);
        }
        
        handleClick(evt){
            const x = +evt.target.id;
    
        // get next spot in column (if none, ignore click)
        const y = findSpotForCol(x);
        if (y === null) {
        return;
        }
    
        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);
        
        // check for win
        if (this.checkForWin()) {
        return this.endGame(`Player ${this.currPlayer} won!`);
        }
        
        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Nice one, losers!');
        }
        
        // switch players
        this.currPlayer = this.currPlayer === 1 ? 2 : 1;
        }

        checkForWin() {
            function _win(cells) {
                return cells.every(
                    ([y, x]) =>
                    y >= 0 &&
                    y < HEIGHT &&
                    x >= 0 &&
                    x < WIDTH &&
                    this.board[y][x] === this.currPlayer
                );
                }
            
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    // get "check list" of 4 cells (starting here) for each of the different
                    // ways to win
                    const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                    const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                    const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                    const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
                
                    // find winner (only checking each win-possibility as needed)
                    if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                    }
                }
            }
        }
}

start.addEventListener('click', (e) => {
    e.preventDefault();
    const p1Color = document.querySelector('input[name="p1color"]').value;
    const p2Color = document.querySelector('input[name="p2color"]').value;
    const wide = document.querySelector('input[name="wide"]').value;
    const high = document.querySelector('input[name="high"]').value;
    new Game(high, wide, p1Color, p2Color)
    
});

