import React, { Component } from 'react';
import FlagIcon from 'ionicons/dist/svg/ios-flag.svg';
import FlameIcon from 'ionicons/dist/svg/md-flame.svg';
import { GAME_STATUS, COLORS } from './constants';

const CELL_STYLE = {
  position: 'relative',
  width: '10%',
  height: '10%',
  border: '1px solid black',
  display: 'inline-block',
  verticalAlign: 'top',
  boxSizing: 'border-box',
  cursor: 'pointer',
};

const MINE_STYLE = { width: '100%' };
const FLAG_STYLE = { width: '100%' };
const QUANTITY_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = { cells: this.getNewGameCells() };
  }

  componentWillReceiveProps({ nbTry: nextNbTry }) {
    if (this.props.nbTry !== nextNbTry)
      this.setState({ cells: this.getNewGameCells() });
  }

  getNewGameCells = () => {
    const { cellQuantity, mineQuantity } = this.props;

    const emptyList = [...Array(cellQuantity).keys()].map(position => ({
      type: '',
      position,
      hidden: true,
      flag: false,
    }));

    const cellsWithMines = this.getMines(emptyList, mineQuantity);

    return cellsWithMines
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

    return isWon;
  }

  getMines = (cells, mines) => {
    const candidatePosition = Math.floor(Math.random() * cells.length);

    if (cells[candidatePosition].type !== 'mine') {
      cells[candidatePosition].type = 'mine';
      return (mines === 1) ? cells : this.getMines(cells, mines -= 1);
    }
    else return this.getMines(cells, mines);
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
      return flag
        ? <img src={FlagIcon} style={FLAG_STYLE} alt="flag" />
        : '';

    return (type === 'mine')
      ? <img src={FlameIcon} style={MINE_STYLE} alt="flame" />
      : <span style={QUANTITY_STYLE}>{ mines }</span>;
  }

  findNullCells = cells => {
    const nextMines = cells
      .map(cell => [ cell, ...Object.values(this.getCloseCells(cell)) ]
          .filter(cell => (cell.type === 'clean' && cell.mines === 0))
      );

    const flattenNextMines = [].concat(...nextMines);

    let uniqCells = {};
    flattenNextMines.forEach(cell => {
      uniqCells[cell.position] = cell;
    });
    uniqCells = Object.values(uniqCells);

    return (cells.length === uniqCells.length)
      ? uniqCells
      : this.findNullCells(uniqCells);
  }

  onClickCell = cellClicked => () => {
    const { cells } = this.state;
    const { status, onLose, onWin } = this.props;

    if (cellClicked.flag || status !== GAME_STATUS.PLAYING)
      return;

    if (cellClicked.type === 'mine')
      onLose();

    const cellsToShow = (cellClicked.type === 'clean' && cellClicked.mines === 0)
      ? this.findNullCells([cellClicked]).map(({ position }) => position)
      : [cellClicked.position];

    const newCells = cells.map(cell => (cellsToShow.includes(cell.position))
        ? { ...cell, hidden: false }
        : cell);

    if (this.isGameWon(newCells))
      onWin();

    this.setState({ cells: newCells });
  }

  onContextMenu = cellClicked => e => {
    if (cellClicked.hidden === true) {
      e.preventDefault();

      const newCells = this.state.cells.map(cell => (cell.position === cellClicked.position)
          ? { ...cell, flag: !cell.flag }
          : cell);

      this.setState({ cells: newCells });
    }
  }

  getCellStyle = cell => {
    if (cell.hidden)
      return CELL_STYLE;

    if (cell.type === 'mine')
      return { ...CELL_STYLE, backgroundColor: COLORS.cell };

    return { ...CELL_STYLE, backgroundColor: COLORS.cell, color: COLORS[`mines${cell.mines}`] };
  }

  render() {
    return this.state.cells.map(cell =>
      <div
        key={cell.position}
        style={this.getCellStyle(cell)}
        onClick={this.onClickCell(cell)}
        onContextMenu={this.onContextMenu(cell)}
      >
        { this.displayCell(cell) }
      </div>
    );
  }
}

export default Game;
