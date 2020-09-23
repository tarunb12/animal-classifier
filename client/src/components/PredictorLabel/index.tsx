import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Fade,
  Paper,
  Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ANIMAL_TO_EMOJI } from '../../constants';
import { Animal, Breed } from '../../types';

const useStyles = (isBreed: boolean, isBreedType?: boolean) => makeStyles((theme: Theme) => ({
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isBreed ? theme.spacing(1) : undefined,
    marginBottom: isBreed ? undefined : theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: 0,
    flex: '0 0 100%',
    height: isBreedType ? `calc(50% - ${theme.spacing(1)}px)` : '100%',
    width: '100%',
    textTransform: 'capitalize',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(1),
      marginBottom: 0,
      marginLeft: isBreed ? theme.spacing(1) : 0,
      marginRight: isBreed ? 0 : theme.spacing(1),
      flex: isBreedType ? '0 1 50%' : '0 0 100%',
      height: `calc(100% - ${theme.spacing(1)}px)`,
    },
  },
}));

const PredictorLabel = (props: PredictorLabelProps) => {
  const classes = useStyles(props.isBreed, props.isBreedType)();
  const [checked, setChecked] = useState(false);
  const { prediction } = props;

  const loading = prediction === undefined;

  useEffect(() => {
    setChecked(prev => !prev);
  }, []);

  // console.log(props.isBreedType)

  useEffect(() => {
    clearInterval();
  }, [props.prediction]);

  return (
    <Fade in={checked} timeout={1000}>
      <Paper elevation={3} className={classes.labelContainer}>
        {loading
          ? <CircularProgress size={40} />
          : <Typography variant='h3'>
              {`${prediction}${` ${ANIMAL_TO_EMOJI[prediction as Animal] || ''}`}`}
            </Typography>}
      </Paper>
    </Fade>
  );
}

interface PredictorLabelProps {
  isBreed: boolean,
  isBreedType?: boolean,
  prediction?: Animal | Breed,
}

export default PredictorLabel;