import React from 'react';

const TOOLS_STYLE = {
  position: 'absolute',
  top: '-15px',
  left: 0,
  width: '100%',
  transform: 'translateY(-100%)',
  color: 'white',
  padding: '10px 0px',
};

const Tools = ({ time, status, onRestart }) => (
  <div style={TOOLS_STYLE}>
    <button onClick={onRestart}>restart</button>
    { time }
  </div>
);

export default Tools;
