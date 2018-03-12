import React from 'react';
import injectSheet from 'react-jss';
import FlagIcon from 'ionicons/dist/svg/ios-flag.svg';
import FlameIcon from 'ionicons/dist/svg/md-flame.svg';
import { COLORS } from './constants';

const styles = {
  cell: ({ cell }) => {
    const baseCell = {
      position: 'relative',
      width: '10%',
      height: '10%',
      border: '1px solid black',
      display: 'inline-block',
      verticalAlign: 'top',
      boxSizing: 'border-box',
      cursor: 'pointer',
    };

    if (cell.hidden)
      return baseCell;

    if (cell.type === 'mine')
      return { ...baseCell, backgroundColor: COLORS.cell };

    return { ...baseCell, backgroundColor: COLORS.cell, color: COLORS[`mines${cell.mines}`] };
  },
  flag: {
    width: '100%',
  },
  mine: {
    width: '100%',
  },
  number: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
};

const getCellContent = ({ type, position, mines, hidden, flag }, classes) => {
  if (hidden)
    return flag
      ? <img src={FlagIcon} className={classes.flag} alt="flag" />
      : '';

  return (type === 'mine')
    ? <img src={FlameIcon} className={classes.mine} alt="flame" />
    : <span className={classes.number}>{ mines }</span>;
}

const Cell = ({ classes, cell, onClick, children, onContextClick }) => (
  <div
    className={classes.cell}
    onClick={onClick}
    onContextMenu={onContextClick}
  >
    { getCellContent(cell, classes) }
  </div>
);

export default injectSheet(styles)(Cell);
