import React, { Component } from 'react'
import Cell from './Cell'
import { getCloseCells } from './DataProvider';
import { GAME_STATUS } from './constants'

class Game extends Component {

  isGameWon = allCells => {
    const cells = allCells || this.props.cells
    const isWon = cells.reduce((acc, { type, hidden }) => {
      if (acc === false)
        return false

      if ((type === 'mine' && hidden === true) || (type === 'clean' && hidden === false))
        return true

      return false
    }, true)

    return isWon
  }

  findNullCells = cells => {
    const nextMines = cells
      .map(cell => [ cell, ...Object.values(getCloseCells(cell, this.props.cells)) ]
          .filter(cell => (cell.type === 'clean' && cell.mines === 0))
      )

    const flattenNextMines = [].concat(...nextMines)

    let uniqCells = {}
    flattenNextMines.forEach(cell => {
      uniqCells[cell.position] = cell
    })
    uniqCells = Object.values(uniqCells)

    return (cells.length === uniqCells.length)
      ? uniqCells
      : this.findNullCells(uniqCells)
  }

  onClickCell = cellClicked => () => {
    const { cells } = this.props
    const { status, onLose, onWin } = this.props

    if (cellClicked.flag || status !== GAME_STATUS.PLAYING)
      return

    if (cellClicked.type === 'mine')
      onLose()

    const cellsToShow = (cellClicked.type === 'clean' && cellClicked.mines === 0)
      ? this.findNullCells([cellClicked]).map(({ position }) => position)
      : [cellClicked.position]

    const newCells = cells.map(cell => (cellsToShow.includes(cell.position))
        ? { ...cell, hidden: false }
        : cell)

    if (this.isGameWon(newCells))
      onWin()

      this.props.dispatch({ type: 'SET_CELLS', payload: newCells })
  }

  onContextMenu = cellClicked => e => {
    const { onPutFlag } = this.props

    if (cellClicked.hidden === true) {
      e.preventDefault()

      const newCells = this.props.cells.map(cell => (cell.position === cellClicked.position)
          ? { ...cell, flag: !cell.flag }
          : cell)

      const flagAmount = newCells.filter(({ flag }) => flag).length
      onPutFlag(flagAmount)

      this.props.dispatch({ type: 'SET_CELLS', payload: newCells })
    }
  }

  render() {
    return this.props.cells.map(cell =>
      <Cell
        key={cell.position}
        cell={cell}
        onClick={this.onClickCell(cell)}
        onContextClick={this.onContextMenu(cell)}
      />
    )
  }
}

export default Game
