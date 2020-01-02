import React, { useReducer } from 'react';
import App from './App';
import { GAME_STATUS, MINE_QUANTITY, CELL_QUANTITY } from './constants';

const getLastDigit = x => {
  const str = JSON.stringify(x)
  return str[str.length - 1]
}

export const getCloseCells = (cell, allCells) => {
  const cells = allCells
  const position = cell.position
  const closeCells = {}
  const isTop = (position < 10)
  const isLeft = (position % 10 === 0)
  const isBottom = (position >= (cells.length - 10))
  const isRight = (getLastDigit(position) === '9')

  if (!isTop)
    closeCells[position - 10] = cells[position - 10]

  if (!isTop && !isLeft)
    closeCells[position - 11] = cells[position - 11]

  if (!isLeft)
    closeCells[position - 1] = cells[position - 1]

  if (!isLeft && !isBottom)
    closeCells[position + 9] = cells[position + 9]

  if (!isBottom)
    closeCells[position + 10] = cells[position + 10]

  if (!isBottom && !isRight)
    closeCells[position + 11] = cells[position + 11]

  if (!isRight)
    closeCells[position + 1] = cells[position + 1]

  if (!isTop && !isRight)
    closeCells[position - 9] = cells[position - 9]

  return closeCells
}

const getMines = (cells, mines) => {
  const candidatePosition = Math.floor(Math.random() * cells.length)

  if (cells[candidatePosition].type !== 'mine') {
    cells[candidatePosition].type = 'mine'
    return (mines === 1) ? cells : getMines(cells, mines -= 1)
  }
  else return getMines(cells, mines)
}

const getNewGameCells = () => {
  const emptyList = [...Array(CELL_QUANTITY).keys()].map(position => ({
    type: '',
    position,
    hidden: true,
    flag: false,
  }))

  const cellsWithMines = getMines(emptyList, MINE_QUANTITY)

  return cellsWithMines
    .map(cell => {
      if (cell.type === 'mine')
        return cell

      else {
        const position = cell.position
        const closeCells = getCloseCells(cell, cellsWithMines)
        const mines = Object.values(closeCells).filter(({ type }) => type === 'mine').length
        return { type: 'clean', position, mines, hidden: true }
      }
    })
}

export const DataContext = React.createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'RESTART':
      return { ...state, status: GAME_STATUS.PLAYING, cells: getNewGameCells() };

    case 'SET_CELLS':
      return { ...state, cells: action.payload };

    case 'CHANGE_GAME_STATUS':
      return { ...state, status: action.payload };

    default:
      throw new Error();
  }
}

const DataProvider = () => {
  const [state, dispatch] = useReducer(reducer, {
    status: GAME_STATUS.PLAYING,
    cells: getNewGameCells(),
  });

  return (
    <DataContext.Provider value={[state, dispatch]}>
      <App state={state} dispatch={dispatch} />
    </DataContext.Provider>
  );
};

export default DataProvider;
