import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  tools: {
    position: 'absolute',
    top: '-15px',
    left: 0,
    width: '100%',
    transform: 'translateY(-100%)',
    color: 'white',
    padding: '10px 0px',
  },
  tool: {
    marginRight: '10px',
  },
};

const Tools = ({ classes, time, status, remainingMine, onRestart }) => (
  <div className={classes.tools}>
    <button className={classes.tool} onClick={onRestart}>restart</button>
    <span className={classes.tool}>{ `time : ${time}` }</span>
    <span className={classes.tool}>{ `remaining : ${remainingMine}` }</span>
  </div>
);

export default injectSheet(styles)(Tools);
