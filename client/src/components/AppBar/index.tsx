import React, { Dispatch, Fragment, SetStateAction } from 'react';
import {
  AppBar,
  PaletteType,
  Theme,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

import {
  Info,
  Stop,
} from '..';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    backgroundColor: theme.palette.type === 'light'
      ? theme.palette.primary.main
      : grey[800],
  },
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
  const { processing, reset, setPaletteType } = props;
  const classes = useStyles();

  return (
    <Fragment>
      <AppBar position='fixed' className={classes.appBar}>
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
          <Info setPaletteType={setPaletteType} />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Fragment>
  );
}

interface NavigationBarProps {
  processing: boolean,
  setPaletteType: Dispatch<SetStateAction<PaletteType>>,
  reset: () => void,
}

export default NavigationBar;
