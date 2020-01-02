import React from 'react'
import styled from 'styled-components'
import { DataContext } from './DataProvider'

const ToolsWrapper = styled('div')`
  position: absolute;
  top: -15px;
  left: 0;
  width: 100%;
  transform: translateY(-100%);
  color: white;
  padding: 10px 0px;
`

const ToolSpan = styled('span')`
  margin-right: 10px;
`

const ToolButton = styled('button')`
  margin-right: 10px;
`

const Tools = ({ remainingMine, onRestart }) => (
  <ToolsWrapper>
    <ToolButton onClick={onRestart}>restart</ToolButton>
    <DataContext.Consumer>{ ([state]) => (
      <ToolSpan>{ `time : ${state.time}` }</ToolSpan>
    ) }</DataContext.Consumer>
    <ToolSpan>{ `remaining : ${remainingMine}` }</ToolSpan>
  </ToolsWrapper>
)

export default Tools
