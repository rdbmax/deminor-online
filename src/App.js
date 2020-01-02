import React, { Component } from 'react'
import styled from 'styled-components'
import Game from './Game'
import Tools from './Tools'
import Scores from './Scores'
import { GAME_STATUS, MINE_QUANTITY } from './constants'
import { DataContext } from './DataProvider';

const Container = styled('div')`
  width: 400px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #949494;
`

const AppWrapper = styled('div')`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: ${({ backgroundColor }) => backgroundColor};
`

class App extends Component {
  constructor() {
    super()

    const oldScoreString = localStorage.getItem('scores') || '[]'
    let scores

    try {
      scores = JSON.parse(oldScoreString)
    } catch (e) {
      scores = []
    }

    localStorage.setItem('scores', JSON.stringify(scores))

    this.colors = {
      playing: 'black',
      won: 'green',
      lost: 'red',
    }

    this.state = {
      remainingMine: MINE_QUANTITY,
      scores,
    }
  }

  restart = () => {
    this.props.dispatch({ type: 'RESTART' });
    this.setState({
      remainingMine: MINE_QUANTITY,
    })
  }

  resetScores = () => {
    this.setState({ scores: [] })
    localStorage.setItem('scores', '[]')
  }

  onWin = () => {
    this.props.dispatch({ type: 'CHANGE_GAME_STATUS', payload: GAME_STATUS.WON });

    const name = prompt('Please enter your name to save your score or cancel')
    if (name) {
      const { time } = this.props.state
      const newScore = { name, time }
      const scoresString = localStorage.getItem('scores')
      const scores = scoresString ? [newScore, ...JSON.parse(scoresString)] : [newScore]
      this.setState({ scores })
      localStorage.setItem('scores', JSON.stringify(scores))
    }
  }

  onLose = () => {
    this.props.dispatch({ type: 'CHANGE_GAME_STATUS', payload: GAME_STATUS.LOST });
  }

  onPutFlag = flagAmount => {
    const remainingMine = MINE_QUANTITY - flagAmount
    this.setState({ remainingMine })
  }

  render() {
    const { scores, remainingMine } = this.state

    return (
      <AppWrapper backgroundColor={this.colors[this.props.state.status]}>
        <Container>
          <Tools remainingMine={remainingMine} onRestart={this.restart} />
          <Scores scores={scores} resetScores={this.resetScores} />

          <DataContext.Consumer>
            { ([state, dispatch]) => (
              <Game
                dispatch={dispatch}
                cells={state.cells}
                status={state.status}
                cellQuantity={100}
                mineQuantity={MINE_QUANTITY}
                onLose={this.onLose}
                onWin={this.onWin}
                onPutFlag={this.onPutFlag}
              />
            ) }
          </DataContext.Consumer>
        </Container>
      </AppWrapper>
    )
  }
}

export default App
