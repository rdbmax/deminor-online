import React, { Component } from 'react';
import styled from 'styled-components';
import Game from './Game';
import Tools from './Tools';
import Scores from './Scores';
import { GAME_STATUS, MINE_QUANTITY } from './constants';

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
    super();

    const oldScoreString = localStorage.getItem('scores') || '[]';
    let scores;

    try {
      scores = JSON.parse(oldScoreString);
    } catch (e) {
      scores = [];
    }

    localStorage.setItem('scores', JSON.stringify(scores));

    this.colors = {
      playing: 'black',
      won: 'green',
      lost: 'red',
    };

    this.state = {
      status: GAME_STATUS.PLAYING,
      time: 0,
      nbTry: 0,
      remainingMine: MINE_QUANTITY,
      scores,
    };
    this.startTimer();
  }

  componentWillUnMount() {
    this.stopTimer();
  }

  startTimer = () => {
    if (this.onSecondsChange)
      this.stopTimer();

    this.onSecondsChange = setInterval(() => {
      this.setState({ time: this.state.time + 1 });
    }, 1000);
  }

  stopTimer = () => {
    clearInterval(this.onSecondsChange);
  }

  restart = () => {
    this.setState({
      time: 0,
      status: GAME_STATUS.PLAYING,
      remainingMine: MINE_QUANTITY,
      nbTry: this.state.nbTry + 1,
    });
    this.startTimer();
  }

  resetScores = () => {
    this.setState({ scores: [] });
    localStorage.setItem('scores', '[]');
  }

  onWin = () => {
    this.stopTimer();
    this.setState({ status: GAME_STATUS.WON });

    const name = prompt('Please enter your name to save your score or cancel');
    if (name) {
      const { time } = this.state;
      const newScore = { name, time };
      const scoresString = localStorage.getItem('scores');
      const scores = scoresString ? [newScore, ...JSON.parse(scoresString)] : [newScore];
      this.setState({ scores });
      localStorage.setItem('scores', JSON.stringify(scores));
    }
  }

  onLose = () => {
    this.stopTimer();
    this.setState({ status: GAME_STATUS.LOST });
  }

  onPutFlag = flagAmount => {
    const remainingMine = MINE_QUANTITY - flagAmount;
    this.setState({ remainingMine });
  }

  render() {
    const { time, status, nbTry, scores, remainingMine } = this.state;

    return (
      <AppWrapper backgroundColor={this.colors[status]}>
        <Container>
          <Tools time={time} status={status} remainingMine={remainingMine} onRestart={this.restart} />
          <Scores scores={scores} resetScores={this.resetScores} />

          <Game
            status={status}
            nbTry={nbTry}
            cellQuantity={100}
            mineQuantity={MINE_QUANTITY}
            onLose={this.onLose}
            onWin={this.onWin}
            onPutFlag={this.onPutFlag}
          />
        </Container>
      </AppWrapper>
    );
  }
}

export default App;
