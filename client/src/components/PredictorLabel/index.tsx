import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Fade,
  Paper,
  Theme,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ANIMAL_TO_EMOJI } from '../../constants';
import { Animal, Breed, Prediction } from '../../types';

const useStyles = (isBreed: boolean, isBreedType?: boolean) => makeStyles((theme: Theme) => ({
  predictionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
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
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  confidenceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
  },
  label: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  confidence: {
    fontSize: '1rem',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
}));

const PredictorLabel = (props: PredictorLabelProps) => {
  const classes = useStyles(props.isBreed, props.isBreedType)();
  const [open, setOpen] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const { prediction } = props;

  useEffect(() => {
    setChecked(prev => !prev);
  }, []);

  const loading = prediction === undefined;

  return (
    <Fade in={checked} timeout={1000}>
      <Paper elevation={3} className={classes.predictionContainer}>
        <div className={classes.labelContainer}>
          {loading
            ? <CircularProgress size={40} />
            : <Typography variant='h3' className={classes.label}>
                {`${prediction?.value}${` ${ANIMAL_TO_EMOJI[prediction?.value as Animal] || ''}`}`}
              </Typography>}
        </div>
        <div className={classes.confidenceContainer}>
          {prediction &&
            <Tooltip
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              title='Confidence'
              aria-label='confidence-tip'
            >
              <span className={classes.confidence} onClick={() => setOpen(open => !open)}>
                {prediction.confidence * 100}%
              </span>
            </Tooltip>}
        </div>
      </Paper>
    </Fade>
  );
}

interface PredictorLabelProps {
  isBreed: boolean,
  isBreedType?: boolean,
  prediction?: Prediction<Animal | Breed>,
}

export default PredictorLabel;