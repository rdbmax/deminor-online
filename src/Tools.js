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

const TOOL_STYLE = {
  marginRight: '10px',
};

const Tools = ({ time, status, remainingMine, onRestart }) => (
  <div style={TOOLS_STYLE}>
    <button style={TOOL_STYLE} onClick={onRestart}>restart</button>
    <span style={TOOL_STYLE}>{ `time : ${time}` }</span>
    <span style={TOOL_STYLE}>{ `remaining : ${remainingMine}` }</span>
  </div>
);

export default Tools;
