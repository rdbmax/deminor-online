import React from 'react';

const SCORES_STYLE = {
  position: 'absolute',
  right: 0,
  color: 'white',
  transform: 'translateX(100%)',
  paddingLeft: '20px',
};

const Scores = ({ scores }) => (
  <div style={SCORES_STYLE}>
    { scores.map(({ name, time }, index) => (
      <p key={index}>{ `${name}: ${time}` }</p>
    )) }
  </div>
);

export default Scores;
