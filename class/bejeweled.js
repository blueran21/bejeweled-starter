const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {

  constructor() {

    this.playerTurn = "O";

    // Initialize this
    this.fruits = ['🥝', '🍓', '🥥', '🍇', '🍊' ];
    this.grid = [];

    for (let j = 0; j < 8; j += 1) {
      let array = [];
      for (let i = 0; i < 8; i += 1) {
        let randomIndex = Math.floor(Math.random() * 5);
        array.push(this.fruits[randomIndex]);
      }
      this.grid.push(array);
    }

    this.cursor = new Cursor(8, 8);

    Screen.initialize(8, 8);
    Screen.setGridlines(true);

    for (let r = 0; r < 8; r += 1) {
      for (let c = 0; c < 8; c += 1) {
        Screen.setGrid(r, c, this.grid[r][c]);
      }
    }

    // add commands.
    Screen.addCommand('w', 'move up', this.cursor.up.bind(this.cursor));
    Screen.addCommand('s', 'move down', this.cursor.down.bind(this.cursor));
    Screen.addCommand('a', 'move left', this.cursor.left.bind(this.cursor));
    Screen.addCommand('d', 'move right', this.cursor.right.bind(this.cursor));

    Screen.addCommand('j', 'swap left', this.swappingLeft.bind(this));
    Screen.addCommand('l', 'swap right', this.swappingRight.bind(this));
    Screen.addCommand('i', 'swap up', this.swappingUp.bind(this));
    Screen.addCommand('k', 'swap down', this.swappingDown.bind(this));

    this.cursor.setBackgroundColor();
    Screen.render();
  }

  // static checkForMatches(grid) {

  //   // Fill this in

  // }

  swappingLeft() {
    let ifSwapping = Bejeweled.swapLeft(this.grid, this.cursor.row, this.cursor.col);
    if (ifSwapping) {
      let combo = Bejeweled.calculateCombo(this.grid, this.fruits);
      if (combo > 1) {
        console.log(`Great Job, You Have ${combo} combos!`);
      }
    }
  }

  swappingRight() {
    let ifSwapping = Bejeweled.swapRight(this.grid, this.cursor.row, this.cursor.col);
    if (ifSwapping) {
      let combo = Bejeweled.calculateCombo(this.grid, this.fruits);
      if (combo > 1) {
        console.log(`Great Job, You Have ${combo} combos!`);
      }
    }
  }

  swappingUp() {
    let ifSwapping = Bejeweled.swapUp(this.grid, this.cursor.row, this.cursor.col);
    if (ifSwapping) {
      let combo = Bejeweled.calculateCombo(this.grid, this.fruits);
      if (combo > 1) {
        console.log(`Great Job, You Have ${combo} combos!`);
      }
    }
  }

  swappingDown() {
    let ifSwapping = Bejeweled.swapDown(this.grid, this.cursor.row, this.cursor.col);
    if (ifSwapping) {
      let combo = Bejeweled.calculateCombo(this.grid, this.fruits);
      if (combo > 1) {
        console.log(`Great Job, You Have ${combo} combos!`);
      }
    }
  }

  static calculateCombo(grid, fruits) {
    let combo = 0;
    let loop = true;
    while (loop) {
      let curCombo = Bejeweled.removeFruit(grid);
      if (curCombo === 0) {
        loop = false;
      }
      combo += curCombo;
      // if (combo > 1) {
      //   console.log(`Great Job, You Have ${combo} combos!`);
      // }
      Bejeweled.dropDown(grid);
      Bejeweled.replaceFruits(grid, fruits);
    }
    return combo;
  }

  static swapLeft(grid, row, col) {
    if (col === 0) {
      return false;
    }
    if (grid[row][col - 1] === grid[row][col]) {
      return false;
    }
    let curFruit = grid[row][col];
    let leftFruit = grid[row][col - 1];

    if (Bejeweled.checkLeft(grid, row, col - 2, curFruit) || Bejeweled.checkRight(grid, row, col + 1, leftFruit)) {
      [grid[row][col], grid[row][col - 1]] = [grid[row][col - 1], grid[row][col]];
      Screen.setGrid(row, col, leftFruit);
      Screen.setGrid(row, col - 1, curFruit);
      Screen.render();
      return true;
    }

    if (Bejeweled.checkVertical(grid, row, col - 1, curFruit) || Bejeweled.checkVertical(grid, row, col, leftFruit)) {
      [grid[row][col], grid[row][col - 1]] = [grid[row][col - 1], grid[row][col]];
      Screen.setGrid(row, col, leftFruit);
      Screen.setGrid(row, col - 1, curFruit);
      Screen.render();
      return true;
    }
    return false;
  }

  static swapRight(grid, row, col) {
    if (col === grid[0].length - 1) {
      return false;
    }
    let curFruit = grid[row][col];
    let rightFruit = grid[row][col + 1];

    if (curFruit === rightFruit) {
      return false;
    }

    if (Bejeweled.checkLeft(grid, row, col - 1, rightFruit) || Bejeweled.checkRight(grid, row, col + 2, curFruit)) {
      [grid[row][col], grid[row][col + 1]] = [grid[row][col + 1], grid[row][col]];
      Screen.setGrid(row, col, rightFruit);
      Screen.setGrid(row, col + 1, curFruit);
      Screen.render();
      return true;
    }

    if (Bejeweled.checkVertical(grid, row, col, rightFruit) || Bejeweled.checkVertical(grid, row, col + 1, curFruit)) {
      [grid[row][col], grid[row][col + 1]] = [grid[row][col + 1], grid[row][col]];
      Screen.setGrid(row, col, rightFruit);
      Screen.setGrid(row, col + 1, curFruit);
      Screen.render();
      return true;
    }
    return false;

  }

  static swapUp(grid, row, col) {
    if (row === 0) {
      return false;
    }
    let curFruit = grid[row][col];
    let upFruit = grid[row - 1][col];

    if (curFruit === upFruit) {
      return false;
    }

    if (Bejeweled.checkUp(grid, row - 2, col, curFruit) || Bejeweled.checkDown(grid, row + 1, col, upFruit)) {
      [grid[row][col], grid[row - 1][col]] = [grid[row - 1][col], grid[row][col]];
      Screen.setGrid(row, col, upFruit);
      Screen.setGrid(row - 1, col, curFruit);
      Screen.render();
      return true;
    }

    if (Bejeweled.checkHorizontal(grid, row - 1, col, curFruit) || Bejeweled.checkHorizontal(grid, row, col, upFruit)) {
      [grid[row][col], grid[row - 1][col]] = [grid[row -1][col], grid[row][col]];
      Screen.setGrid(row, col, upFruit);
      Screen.setGrid(row - 1, col, curFruit);
      Screen.render();
      return true;
    }

    return false;
  }

  static swapDown(grid, row, col) {
    if (row === grid.length - 1) {
      return false;
    }

    let curFruit = grid[row][col];
    let downFruit = grid[row + 1][col];

    if (curFruit === downFruit) {
      return false;
    }

    if (Bejeweled.checkUp(grid, row - 1, col, downFruit) || Bejeweled.checkDown(grid, row + 2, col, curFruit)) {
      [grid[row][col], grid[row + 1][col]] = [grid[row + 1][col], grid[row][col]];
      Screen.setGrid(row, col, downFruit);
      Screen.setGrid(row + 1, col, curFruit);
      Screen.render();
      return true;
    }

    if (Bejeweled.checkHorizontal(grid, row, col, downFruit) || Bejeweled.checkHorizontal(grid, row + 1, col, curFruit)) {
      [grid[row][col], grid[row + 1][col]] = [grid[row + 1][col], grid[row][col]];
      Screen.setGrid(row, col, downFruit);
      Screen.setGrid(row + 1, col, curFruit);
      Screen.render();
      return true;
    }

    return false;
  }


  static checkLeft(grid, row, col, target) {
    let left = col;
    let count = 1;
    while (left >= 0 && grid[row][left] === target) {
      count += 1;
      if (count === 3) {
        return true;
      }
      left -= 1;
    }
    return false;
  }

  static checkRight(grid, row, col, target) {
    let right = col;
    let count = 1;
    while (right < grid.length && grid[row][right] === target) {
      count += 1;
      if (count === 3) {
        return true;
      }
      right += 1;
    }
    return false;
  }

  static checkVertical(grid, row, col, target) {
    let up = row - 1;
    let down = row + 1;
    let count = 1;
    while (up >= 0 && grid[up][col] === target) {
      count += 1;
      if (count === 3) {
        return true;
      }
      up -= 1;
    }
    while (down < grid.length && grid[down][col] === target) {
      count += 1;
      if (count === 3) {
        return true;
      }
      down += 1;
    }
    return false;
  }

  static checkUp(grid, row, col, target) {
    let up = row;
    let count = 1;
    while (up >= 0 && grid[up][col] === target) {
      count += 1;
      if (count === 3) {
        return true;
      }
      up -= 1;
    }
    return false;
  }

  static checkDown(grid, row, col, target) {
    let down = row;
    let count = 1;
    while (down < grid.length && grid[down][col] === target) {
      count += 1;
      if (count === 3) {
        return true;
      }
      down += 1;
    }
    return false;
  }

  static checkHorizontal(grid, row, col, target) {
    let left = col - 1;
    let right = col + 1;
    let count = 1;
    while (left >= 0 & grid[row][left] === target) {
      count += 1;
      if (count === 3) {
        return true;
      }
      left -= 1;
    }
    while (right < grid[0].length && grid[row][right] === target) {
      count += 1;
      if (count === 3) {
        return true;
      }
      right += 1;
    }
    return false;
  }

  static checkVerticalDeleted(grid) {
    let willDeletedFruits = [];
    let combo = 0;
    for (let c = 0; c < grid[0].length; c += 1) {
      let r = 0;
      let start = 0;
      let count = 0;
      while (r < grid.length) {
        if (grid[r][c] === grid[start][c]) {
          count += 1
          r += 1;
        } else {
          if (count >= 3) {
            combo += 1;
            for (let i = start; i < r; i += 1) {
              willDeletedFruits.push({row: i, col: c})
            }
          }
          start = r;
          count = 0;
        }
      }
      if (count >= 3) {
        combo += 1
        for (let j = start; j < r; j += 1) {
          willDeletedFruits.push({row: j, col: c})
        }
      }
    }
    return [willDeletedFruits, combo];
  }

  static checkHorizontalDeleted(grid) {
    let willDeletedFruits = [];
    let combo = 0;
    for (let r = 0; r < grid.length; r += 1) {
      let c = 0;
      let start = 0;
      let count = 0;
      while (c < grid[0].length) {
        if (grid[r][c] === grid[r][start]) {
          count += 1
          c += 1;
        } else {
          if (count >= 3) {
            combo += 1;
            for (let i = start; i < c; i += 1) {
              willDeletedFruits.push({row: r, col: i})
            }
          }
          start = c;
          count = 0;
        }
      }
      if (count >= 3) {
        combo += 1;
        for (let j = start; j < c; j += 1) {
          willDeletedFruits.push({row: r, col: j})
        }
      }
    }
    return [willDeletedFruits, combo];
  }

  static removeFruit(grid) {
    let [fromRows, rowCombo] = Bejeweled.checkHorizontalDeleted(grid);
    let [fromCols, colCombo] = Bejeweled.checkVerticalDeleted(grid);

    if (fromCols) {
      for (let i = 0; i < fromCols.length; i += 1) {
        let obj = fromCols[i];
        grid[obj.row][obj.col] = '  ';
        Screen.setGrid(obj.row, obj.col, '  ');
        Screen.render();
      }
    }
    if (fromRows) {
      for (let i = 0; i < fromRows.length; i += 1) {
        let obj = fromRows[i];
        grid[obj.row][obj.col] = '  ';
        Screen.setGrid(obj.row, obj.col, '  ');
        Screen.render();
      }
    }
    return rowCombo + colCombo;

  }

  static dropDown(grid) {
    for (let c = 0; c < grid[0].length; c += 1) {
      let r = grid.length - 1;
      while (r >= 0 && grid[r][c] !== '  ') {
        r -= 1;
      }
      let slow = r;

      for (let fast = r; fast >= 0; fast -= 1) {
        if (grid[fast][c] !== '  ') {
          [grid[slow][c], grid[fast][c]] = [grid[fast][c], grid[slow][c]];
          Screen.setGrid(slow, c, grid[slow][c]);
          Screen.setGrid(fast, c, grid[fast][c]);
          Screen.render();
          slow -= 1;
        }
      }
    }
  }

  static replaceFruits(grid, fruits) {
    for (let r = 0; r < grid.length; r += 1) {
      for (let c = 0; c < grid[0].length; c += 1) {
        if (grid[r][c] === '  ') {
          let randomIndex = Math.floor(Math.random() * 5);
          grid[r][c] = fruits[randomIndex];
          Screen.setGrid(r, c, fruits[randomIndex]);
          Screen.render();
        }
      }
    }
  }

}

module.exports = Bejeweled;
