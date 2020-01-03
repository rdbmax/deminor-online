import React from 'react'
import styled from 'styled-components'

const Wrapper = styled('div')`
  position: absolute;
  right: 0;
  color: white;
  transform: translateX(100%);
  padding-left: 20px;
`

const Scores = ({ scores, resetScores }) => (
  <Wrapper>
    { scores.map(({ name, time }, index) => (
      <p key={index}>{ `${name}: ${time}` }</p>
    )) }
    <button onClick={resetScores}>Reset scores</button>
  </Wrapper>
)

export default Scores
