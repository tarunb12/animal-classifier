import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';

import { ANIMALS_WITH_BREED } from '../../constants';
import { Animal, AnimalWithBreed, Breed, Prediction, Image } from '../../types';
import { ImagePreview } from '..';
import PredictorLabel from '../PredictorLabel';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    marginBottom: theme.spacing(1),
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
    maxWidth: `calc(50% - ${theme.spacing(1)}px)`,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      height: `calc(50% - ${theme.spacing(1)}px)`,
      maxWidth: '100%',
      flexWrap: 'nowrap',
      alignItems: 'normal'
    }
  },
}));

const Predictor = (props: PredictorProps) => {
  const classes = useStyles();
  const { animalPrediction, breedPrediction } = props;

  const isBreedType = animalPrediction ? ANIMALS_WITH_BREED.includes(animalPrediction.value as AnimalWithBreed) : false;
  // console.log(isBreedType, props.prediction, props.prediction ? NIMALS_WITH_BREED:'w', 'dog' in ANIMALS_WITH_BREED)


  return (
    <div className={classes.container}>
      <ImagePreview
        image={props.image}
        processing={props.processing}
        handleImageUpload={props.handleImageUpload}
      />
      <div className={classes.resultContainer}>
        <PredictorLabel isBreedType={isBreedType} isBreed={false} prediction={animalPrediction} />
        {isBreedType &&
          <PredictorLabel isBreedType={isBreedType} isBreed={true} prediction={breedPrediction} />}
      </div>
    </div>
  );
}

interface PredictorProps {
  processing: boolean,
  animalPrediction?: Prediction<Animal>,
  breedPrediction?: Prediction<Breed>,
  image?: Image,
  handleImageUpload: (file: FileList | File[] | null) => void,
}

export default Predictor;
