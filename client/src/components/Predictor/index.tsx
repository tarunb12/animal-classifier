import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';

import { ANIMALS_WITH_BREED } from '../../constants';
import { Animal, Breed, Image, AnimalWithBreed } from '../../types';
import { ImagePreview } from '..';
import PredictorLabel from '../PredictorLabel';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    }
  },
  imageContainer: {
    flex: '0 1 50%',
    height: '100%',
    width: '50%',
    [theme.breakpoints.down('md')]: {
      flex: '0 0 100%',
      height: '50%',
      width: '100%',
    },
  },
  resultContainer: {
    flex: '0 1 50%',
    display: 'flex',
    height: '100%',
    width: '50%',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      height: `calc(50% - ${theme.spacing(1)}px)`,
      width: '100%',
      flexWrap: 'nowrap',
      alignItems: 'normal'
    }
  },
}));

const Predictor = (props: PredictorProps) => {
  const classes = useStyles();

  const isBreedType = props.prediction ? ANIMALS_WITH_BREED.includes(props.prediction as AnimalWithBreed) : false;
  // console.log(isBreedType, props.prediction, props.prediction ? NIMALS_WITH_BREED:'w', 'dog' in ANIMALS_WITH_BREED)


  return (
    <div className={classes.container}>
      <ImagePreview
        image={props.image}
        processing={props.processing}
        handleImageUpload={props.handleImageUpload}
      />
      <div className={classes.resultContainer}>
        <PredictorLabel isBreedType={isBreedType} isBreed={false} prediction={props.prediction} />
        {isBreedType &&
          <PredictorLabel isBreedType={isBreedType} isBreed={true} prediction={props.breedPrediction} />}
      </div>
    </div>
  );
}

interface PredictorProps {
  processing: boolean,
  prediction?: Animal,
  breedPrediction?: Breed,
  image?: Image,
  handleImageUpload: (file: FileList | File[] | null) => void,
}

export default Predictor;
