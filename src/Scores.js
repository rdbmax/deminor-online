import React from 'react';

const SCORES_STYLE = {
  position: 'absolute',
  right: 0,
  color: 'white',
  transform: 'translateX(100%)',
  paddingLeft: '20px',
};

const Scores = ({ scores, resetScores }) => (
  <div style={SCORES_STYLE}>
    { scores.map(({ name, time }, index) => (
      <p key={index}>{ `${name}: ${time}` }</p>
    )) }
    <button onClick={resetScores}>Reset scores</button>
  </div>
);

export default Scores;
