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

const Tools = ({ onRestart }) => (
  <DataContext.Consumer>{ ([state]) => (
    <ToolsWrapper>
      <ToolButton onClick={onRestart}>restart</ToolButton>
      
        <ToolSpan>{ `time : ${state.time}` }</ToolSpan>
      
      <ToolSpan>{ `remaining : ${state.remainingMine}` }</ToolSpan>
    </ToolsWrapper>
  ) }</DataContext.Consumer>
)

export default Tools
