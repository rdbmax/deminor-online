import React, { Component } from 'react';
import Game from './Game';
import Tools from './Tools';

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
    this.state = { status: 'playing', time: 0, nbTry: 0 };
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
    this.setState({ time: 0, status: 'playing', nbTry: this.state.nbTry + 1 });
    this.startTimer();
  }

  onWin = () => {
    this.stopTimer();
    this.setState({ status: 'won' });
  }

  onLose = () => {
    this.stopTimer();
    this.setState({ status: 'lost' });
  }

  getAppStyle = () => ({
    ...APP_STYLE,
    backgroundColor: GAME_COLORS[this.state.status],
  })

  render() {
    const { time, status, nbTry } = this.state;

    return (
      <div style={this.getAppStyle()}>
        <div className="container" style={GAME_STYLE}>
          <Tools time={time} status={status} onRestart={this.restart} />

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
