// game is an object which props are functions and values
// state of the game is located on the DOM

var gameOfLife = {
  width: 10,
  height: 10, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game
  board: document.getElementById('board'),
  clearBtn: document.getElementById('clear_btn'),
  resetBtn: document.getElementById('reset_btn'),
  playBtn: document.getElementById('play_btn'),
  allCells: null,

  createAndShowBoard: function() {
    let generateBody = (height, width) => {
      let tableBody = '';
      for (let h = 0; h < height; h++) {
        tableBody += "<tr id='row+" + h + "'>";
        for (let w = 0; w < width; w++) {
          tableBody += "<td data-status='dead' id='" + w + '-' + h + "'></td>";
        }
        tableBody += '</tr>';
      }
      return `<tbody>${tableBody}</tbody>`;
    };

    this.board.innerHTML = generateBody(this.height, this.width);

    this.setupBoardEvents();
  },

  setupBoardEvents: function() {
    // we can attacha listener to the board then we can read the target
    // and apply the nessasary changes to the target
    this.step = this.step.bind(this);
    this.allCells = this.board.querySelectorAll('td');
    this.clear = this.clear.bind(this); // need to bind because clear is called in different context!
    this.random = this.random.bind(this);
    this.playBtn.addEventListener('click', this.step);
    this.clearBtn.addEventListener('click', this.clear);
    this.resetBtn.addEventListener('click', this.random);
    this.board.addEventListener('click', this.onCellClick);
  },

  onCellClick(e) {
    let cell = e.target;
    let status = cell.dataset.status == 'dead' ? 'alive' : 'dead';
    cell.className = status;
    cell.dataset.status = status;
  },

  setDead(cell) {
    cell.className = 'dead';
    cell.dataset.status = 'dead';
  },

  setAlive(cell) {
    cell.className = 'alive';
    cell.dataset.status = 'alive';
  },

  setRandom(cell) {
    let random = Math.floor(Math.random() * 2);
    cell.className = random ? 'alive' : 'dead';
    cell.dataset.status = random ? 'alive' : 'dead';
  },

  random() {
    this.allCells.forEach(cell => this.setRandom(cell));
  },

  clear() {
    this.allCells.forEach(cell => this.setDead(cell));
  },

  // 1. if it's alive and 2 more alive => alive
  // 2. if it's dead and 3 or more alive => alive
  // 3. if no matter the state if < 2 are aleve => dead

  step: function() {
    let row;
    let newState = []

    let getStatus = (table, x, y) => {
      let cell = table[x].cells[y];
      // status is a sum of neighbour statuses
      let neighbours, total
      if (x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1) {
        neighbours = [
          table[x - 1].cells[y - 1],
          table[x].cells[y - 1],
          table[x + 1].cells[y - 1],
          table[x - 1].cells[y],
          table[x + 1].cells[y],
          table[x - 1].cells[y + 1],
          table[x].cells[y + 1],
          table[x + 1].cells[y + 1]
        ];
        total = neighbours.reduce((total, elt) => {
          return (total += elt.dataset.status === 'alive');
        }, 0);
        // these cells have all neigbours! Total for them
      } else {
        // for border cells ???!!!!!!
      }
      if (cell.dataset.status === 'alive' && total >= 2) {
        return 'alive'
      } else if (total >= 3) {
        return 'alive'
      } else {
        return 'dead'
      }
    };

    for (let i = 0; i < this.board.rows.length; i++) {
      row = this.board.rows[i].cells;
      for (let j = 0; j < row.length; j++) {
        // we can calculate the cell only if i and j are within width and height bounds
        // if they are not cell status is dead
        cell = this.board.rows[i].cells[j];
        newState.push(getStatus(this.board.rows, i, j))
      }
    }
    
    this.allCells.forEach((cell, idx) => {
      cell.className = newState[idx];
      cell.dataset.status = newState[idx];
    })
    // console.log(newState)
    // for 1-1 => 0-0, 1-0, 2-0 | 0   1   2
    // 0-1,      2-1 | 10 |11| 12
    // 0-2, 1-2, 2-2 | 20  21  22
    // ???
    // ?x?
    // ???
    // difference depends on the width! % width
    // we don't mutate our array, but create a new one
    // after checking loop is done we loop again and assign the new state
  },

  enableAutoPlay: function() {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
  }
};

gameOfLife.createAndShowBoard();
