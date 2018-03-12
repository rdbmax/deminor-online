import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  scores: {
    position: 'absolute',
    right: 0,
    color: 'white',
    transform: 'translateX(100%)',
    paddingLeft: '20px',
  }
}

const Scores = ({ classes, scores, resetScores }) => (
  <div className={classes.scores}>
    { scores.map(({ name, time }, index) => (
      <p key={index}>{ `${name}: ${time}` }</p>
    )) }
    <button onClick={resetScores}>Reset scores</button>
  </div>
);

export default injectSheet(styles)(Scores);
