import React, { Component } from 'react';
import Game from './Game';

const APP_STYLE = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
};

const GAME_STYLE = {
  width: '500px',
  height: '500px',
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
  state = { status: 'playing' }

  onWin = () => {
    this.setState({ status: 'won' });
  }

  onLose = () => {
    this.setState({ status: 'lost' });
  }

  getAppStyle = () => ({
    ...APP_STYLE,
    backgroundColor: GAME_COLORS[this.state.status],
  })

  render() {
    return (
      <div style={this.getAppStyle()}>
        <div className="container" style={GAME_STYLE}>
          <Game
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
