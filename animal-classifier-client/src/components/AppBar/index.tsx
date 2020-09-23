import React, { Fragment } from 'react';
import {
  AppBar,
  Theme,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';

import {
  Info,
  Stop,
} from '..';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    '&::selection': {
      background: 'none',
      color: 'none',
    },
    '&::-moz-selection': {
      background: 'none',
      color: 'none',
    },
  },
}));

const NavigationBar = (props: NavigationBarProps) => {
  const classes = useStyles();
  const { processing, reset } = props;

  return (
    <Fragment>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography className={classes.title} variant='h6'>
            Animal Classifier
          </Typography>
          {props.processing
            ? <Stop
                processing={processing}
                reset={reset}
              />
            : null}
          <Info />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Fragment>
  );
}

interface NavigationBarProps {
  processing: boolean,
  reset: () => void,
}

export default NavigationBar;
