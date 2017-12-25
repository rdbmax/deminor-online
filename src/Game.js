import React, { Component } from 'react';

const CELL_STYLE = {
  width: '50px',
  height: '50px',
  border: '1px solid black',
  display: 'inline-block',
  verticalAlign: 'top',
  boxSizing: 'border-box',
  cursor: 'pointer',
};

class Game extends Component {
  constructor(props) {
    super(props);

    const emptyList = [...Array(props.cellQuantity).keys()].map(position => ({
      type: '',
      position,
      hidden: true,
      flag: false,
    }));
    const cellsWithMines = this.getMines(emptyList, props.mineQuantity);
    const fullCells = cellsWithMines
      .map(cell => {
        if (cell.type === 'mine')
          return cell;
        else {
          const position = cell.position;
          const closeCells = this.getCloseCells(cell, cellsWithMines);
          const mines = Object.values(closeCells).filter(({ type }) => type === 'mine').length;
          return { type: 'clean', position, mines, hidden: true };
        }
      });

    this.state = { cells: fullCells, status: 'playing' };
  }

  isGameWon = allCells => {
    const cells = allCells || this.state.cells;
    const isWon = cells.reduce((acc, { type, hidden }) => {
      if (acc === false)
        return false;

      if ((type === 'mine' && hidden === true) || (type === 'clean' && hidden === false))
        return true;

      return false;
    }, true);

    if (isWon)
      this.props.onWin();

    return isWon;
  }

  getMines = (cells, mines) => {
    const candidatePosition = Math.floor(Math.random() * cells.length);
    if (cells[candidatePosition].type !== 'mine') {
      cells[candidatePosition].type = 'mine';

      if (mines === 1)
        return cells;
      else
        return this.getMines(cells, mines -= 1);
    }
    else
      return this.getMines(cells, mines);
  }

  getCloseCells = (cell, allCells) => {
    const cells = allCells || this.state.cells;
    const position = cell.position;
    const closeCells = {};
    const isTop = (position < 10);
    const isLeft = (position % 10 === 0);
    const isBottom = (position >= (cells.length - 10));
    const isRight = (this.getLastDigit(position) === '9');

    if (!isTop)
      closeCells[position - 10] = cells[position - 10];

    if (!isTop && !isLeft)
      closeCells[position - 11] = cells[position - 11];

    if (!isLeft)
      closeCells[position - 1] = cells[position - 1];

    if (!isLeft && !isBottom)
      closeCells[position + 9] = cells[position + 9];

    if (!isBottom)
      closeCells[position + 10] = cells[position + 10];

    if (!isBottom && !isRight)
      closeCells[position + 11] = cells[position + 11];

    if (!isRight)
      closeCells[position + 1] = cells[position + 1];

    if (!isTop && !isRight)
      closeCells[position - 9] = cells[position - 9];

    return closeCells;
  }

  getLastDigit = x => {
    const str = JSON.stringify(x);
    return str[str.length - 1];
  }

  displayCell = ({ type, position, mines, hidden, flag }) => {
    if (hidden)
      return flag ? 'flag' : '';

    return (type === 'mine')
      ? type
      : mines;
  }

  findNextNullMinesCellsIndex = (firstCell, list) => Object
    .values(this.getCloseCells(firstCell))
    .filter(({ hidden, mines }) => (mines === 0 && hidden === true))
    .map(({ position }) => position);

  onClickCell = cellClicked => () => {
    const { cells } = this.state;

    if (cellClicked.flag)
      return;

    if (cellClicked.type === 'mine')
      this.props.onLose()

    const cellsToShow = (cellClicked.type === 'clean' && cellClicked.mines === 0)
      ? [cellClicked.position, ...this.findNextNullMinesCellsIndex(cellClicked)]
      : [cellClicked.position];

    const newCells = cells.map(cell => {
      if (cellsToShow.includes(cell.position))
        return { ...cell, hidden: false };
      else
        return cell;
    });

    const status = this.isGameWon(newCells) ? 'won' : this.state.status;

    this.setState({ cells: newCells, status });
  }

  onContextMenu = cellClicked => e => {
    if (cellClicked.hidden === true) {
      e.preventDefault();
      const newCells = this.state.cells.map(cell => {
        if (cell.position === cellClicked.position)
          return { ...cell, flag: !cell.flag }

        return cell
      });

      this.setState({ cells: newCells });
    }
  }

  render() {
    return this.state.cells.map((cell, index) =>
      <div
        key={cell.position}
        style={CELL_STYLE}
        onClick={this.onClickCell(cell)}
        onContextMenu={this.onContextMenu(cell)}
      >
        { this.displayCell(cell) }
      </div>
    );
  }
}

export default Game;
