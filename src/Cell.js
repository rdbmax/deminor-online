import React from 'react'
import styled from 'styled-components'
import FlagIcon from 'ionicons/dist/ionicons/svg/ios-flag.svg'
import FlameIcon from 'ionicons/dist/ionicons/svg/md-flame.svg'
import { COLORS } from './constants'

const CellStyled = styled('div')`
  position: relative
  width: 10%
  height: 10%
  border: 1px solid black
  display: inline-block
  vertical-align: top
  box-sizing: border-box
  cursor: pointer
  background-color: ${({ cell }) => (cell.hidden)
    ? COLORS.hiddenCell
    : COLORS.cell}
  ${({ cell }) => (cell.type !== 'mine' && !cell.hidden)
    ? `color: ${COLORS[`mines${cell.mines}`]}`
    : ''}
`

const NumberStyled = styled('span')`
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
`

const IconStyled = styled('img')`
  width: 100%
`

const Cell = ({ cell, onClick, children, onContextClick }) => (
  <CellStyled cell={cell} onClick={onClick} onContextMenu={onContextClick}>
    {
      cell.hidden
        ? (cell.flag
          ? <IconStyled src={FlagIcon} alt="flag" />
          : '')
        : (cell.type === 'mine'
          ?  <IconStyled src={FlameIcon} alt="flame" />
          : <NumberStyled>{ cell.mines }</NumberStyled>)
    }
  </CellStyled>
)

export default Cell
