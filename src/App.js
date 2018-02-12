import React, { Component } from 'react';
import Game from './Game';
import Tools from './Tools';
import Scores from './Scores';
import { GAME_STATUS } from './constants';

const APP_STYLE = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
};

const GAME_STYLE = {
  width: '400px',
  height: '400px',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#949494',
};

const GAME_COLORS = {
  playing: 'black',
  won: 'green',
  lost: 'red',
};

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

    this.state = { status: GAME_STATUS.PLAYING, time: 0, nbTry: 0, scores };
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
    this.setState({ time: 0, status: GAME_STATUS.PLAYING, nbTry: this.state.nbTry + 1 });
    this.startTimer();
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

  getAppStyle = () => ({
    ...APP_STYLE,
    backgroundColor: GAME_COLORS[this.state.status],
  })

  render() {
    const { time, status, nbTry, scores } = this.state;

    return (
      <div style={this.getAppStyle()}>
        <div className="container" style={GAME_STYLE}>
          <Tools time={time} status={status} onRestart={this.restart} />
          <Scores scores={scores} />

          <Game
            status={status}
            nbTry={nbTry}
            cellQuantity={100}
            mineQuantity={15}
            onLose={this.onLose}
            onWin={this.onWin}
          />
        </div>
      </div>
    );
  }
}

export default App;
